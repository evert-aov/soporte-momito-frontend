import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../products/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-8">

      <!-- Hero -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white">
        <h1 class="text-3xl font-bold mb-2">Catálogo TUMOMITO</h1>
        <p class="text-blue-100 text-sm">Distribución B2B — Pago 100% en línea</p>
      </div>

      <!-- Buscador -->
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" [(ngModel)]="search" placeholder="Buscar productos..."
            class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"/>
        </div>
        <select [(ngModel)]="selectedCategory"
          class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-36">
          <option value="">Todas las categorías</option>
          <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
        </select>
      </div>

      <!-- Estado carga -->
      <div *ngIf="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div *ngFor="let _ of [1,2,3,4,5,6,7,8]"
          class="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse h-64"></div>
      </div>

      <!-- Grid de productos -->
      <div *ngIf="!loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div *ngFor="let p of filtered"
          class="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">

          <!-- Imagen / placeholder -->
          <div class="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
            <img *ngIf="p.image_url && !imgErrors[p.id]" [src]="p.image_url" [alt]="p.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              (error)="imgErrors[p.id] = true"/>
            <div *ngIf="!p.image_url || imgErrors[p.id]" class="text-center">
              <svg class="w-12 h-12 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              <p class="text-xs text-gray-400 mt-1">{{ p.default_code || 'SKU' }}</p>
            </div>
            <span *ngIf="!p.sale_ok" class="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">No disponible</span>
          </div>

          <div class="p-3 flex flex-col flex-1">
            <p class="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">{{ p.default_code }}</p>
            <h3 class="font-semibold text-gray-900 text-sm leading-snug flex-1 line-clamp-2">{{ p.name }}</h3>

            <div class="mt-3 flex items-center justify-between">
              <div>
                <p class="text-lg font-bold text-blue-600">Bs. {{ (p.list_price ?? 0) | number:'1.2-2' }}</p>
              </div>
              <button (click)="addToCart(p)" [disabled]="!p.sale_ok || !p.active"
                [class]="(addedMap[p.id] ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700') +
                  ' disabled:opacity-40 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors'">
                {{ addedMap[p.id] ? '✓ Agregado' : '+ Carrito' }}
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="filtered.length === 0" class="col-span-4 text-center py-16 text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p class="text-sm">No se encontraron productos</p>
        </div>
      </div>

      <!-- Float cart bar cuando hay items -->
      <div *ngIf="cartCount > 0"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 z-40">
        <span class="text-sm font-medium">{{ cartCount }} producto{{ cartCount !== 1 ? 's' : '' }} en el carrito</span>
        <a routerLink="/cart"
          class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold px-4 py-1.5 rounded-xl transition-colors">
          Ver carrito →
        </a>
      </div>
    </div>
  `
})
export class StoreComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  search = '';
  selectedCategory = '';
  addedMap: Record<string, boolean> = {};
  imgErrors: Record<string, boolean> = {};
  cartCount = 0;

  get categories(): string[] {
    const cats = this.products
      .map(p => (p as any).category_name)
      .filter(Boolean);
    return [...new Set(cats)];
  }

  get filtered(): Product[] {
    let list = this.products.filter(p => p.active && p.sale_ok !== false);
    if (this.search) {
      const q = this.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.default_code || '').toLowerCase().includes(q)
      );
    }
    if (this.selectedCategory) {
      list = list.filter(p => (p as any).category_name === this.selectedCategory);
    }
    return list;
  }

  constructor(private productSvc: ProductService, private cart: CartService) {}

  ngOnInit() {
    this.loading = true;
    this.productSvc.getProducts().subscribe({
      next: p => { this.products = p; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.cart.items$.subscribe(items => {
      this.cartCount = items.reduce((s, i) => s + i.quantity, 0);
    });
  }

  addToCart(p: Product) {
    this.cart.add({
      product_id: p.id,
      name: p.name,
      unit_price: Number(p.list_price ?? 0),
      image_url: p.image_url,
    });
    this.addedMap[p.id] = true;
    setTimeout(() => { this.addedMap[p.id] = false; }, 1500);
  }
}
