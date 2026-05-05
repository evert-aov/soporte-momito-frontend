import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { ProductService, Product } from './product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgIcon],
  template: `
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Productos</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ products.length }} productos en el catálogo</p>
        </div>
        <a routerLink="/products/new"
           class="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <ng-icon name="heroPlus" size="16" /> Nuevo Producto
        </a>
      </div>

      <!-- Search -->
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="relative">
          <ng-icon name="heroMagnifyingGlass" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size="16" />
          <input
            type="text"
            [(ngModel)]="search"
            placeholder="Buscar por nombre o código..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p class="text-gray-400 text-sm">Cargando productos...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <!-- Table -->
      <div *ngIf="!loading" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">SKU</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Precio Lista</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Precio Costo</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let p of filtered" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 text-gray-500 font-mono text-xs">{{ p.default_code || p.id }}</td>
              <td class="px-4 py-3">
                <p class="font-medium text-gray-900">{{ p.name }}</p>
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">{{ p.type || '—' }}</span>
              </td>
              <td class="px-4 py-3 text-right font-medium text-gray-800">
                Bs. {{ p.list_price | number:'1.2-2' }}
              </td>
              <td class="px-4 py-3 text-right text-gray-500">
                Bs. {{ p.standard_price | number:'1.2-2' }}
              </td>
              <td class="px-4 py-3 text-center">
                <span [class]="p.active
                  ? 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700'
                  : 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700'">
                  {{ p.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <a [routerLink]="['/products/edit', p.id]"
                     class="inline-flex items-center gap-1 text-xs text-blue-600 hover:bg-blue-50 font-medium px-2 py-1 rounded-md transition-colors">
                    <ng-icon name="heroPencil" size="12" /> Editar
                  </a>
                  <button (click)="delete(p.id)"
                     class="inline-flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 font-medium px-2 py-1 rounded-md transition-colors">
                    <ng-icon name="heroTrash" size="12" /> Eliminar
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filtered.length === 0">
              <td colspan="7" class="px-4 py-12 text-center">
                <ng-icon name="heroCube" class="text-gray-300 mx-auto mb-2" size="32" />
                <p class="text-gray-400 text-sm">No se encontraron productos</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';
  search = '';

  get filtered(): Product[] {
    const q = this.search.toLowerCase();
    if (!q) return this.products;
    return this.products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.default_code || '').toLowerCase().includes(q)
    );
  }

  constructor(private svc: ProductService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getProducts().subscribe({
      next: (data) => { this.products = data; this.loading = false; },
      error: () => { this.error = 'Error al cargar productos'; this.loading = false; }
    });
  }

  delete(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    this.svc.deleteProduct(id).subscribe({ next: () => this.load() });
  }
}
