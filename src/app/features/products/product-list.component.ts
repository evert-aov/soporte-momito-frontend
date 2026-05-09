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
          <p class="text-sm text-gray-500 mt-0.5">{{ total }} productos en el catálogo</p>
        </div>
        <a routerLink="/products/new"
           class="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <ng-icon name="heroPlus" size="16" /> Nuevo Producto
        </a>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <div class="relative flex-1 min-w-48">
          <ng-icon name="heroMagnifyingGlass" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size="16" />
          <input
            type="text"
            [(ngModel)]="search"
            (ngModelChange)="onSearchChange()"
            placeholder="Buscar por nombre o código..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button (click)="toggleLowStock()"
          [class]="lowStock
            ? 'inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-amber-100 text-amber-700 border border-amber-300'
            : 'inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'">
          <ng-icon name="heroExclamationTriangle" size="14" />
          Stock bajo
        </button>
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
            <tr *ngFor="let p of products" class="hover:bg-gray-50 transition-colors">
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
            <tr *ngIf="products.length === 0">
              <td colspan="7" class="px-4 py-12 text-center">
                <ng-icon name="heroCube" class="text-gray-300 mx-auto mb-2" size="32" />
                <p class="text-gray-400 text-sm">No se encontraron productos</p>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <span>Filas:</span>
            <select [(ngModel)]="pageSize" (ngModelChange)="onPageSizeChange()"
              class="border border-gray-200 rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option [ngValue]="10">10</option>
              <option [ngValue]="20">20</option>
              <option [ngValue]="50">50</option>
            </select>
            <span>de {{ total }}</span>
          </div>
          <div class="flex items-center gap-1">
            <button (click)="goToPage(1)" [disabled]="page === 1"
              class="px-2 py-1 rounded text-sm disabled:opacity-40 hover:bg-gray-200">«</button>
            <button (click)="goToPage(page - 1)" [disabled]="page === 1"
              class="px-2 py-1 rounded text-sm disabled:opacity-40 hover:bg-gray-200">‹</button>
            <button *ngFor="let n of pageNums" (click)="goToPage(n)"
              [class]="n === page
                ? 'px-3 py-1 rounded text-sm bg-blue-600 text-white font-semibold'
                : 'px-3 py-1 rounded text-sm hover:bg-gray-200 text-gray-700'">
              {{ n }}
            </button>
            <button (click)="goToPage(page + 1)" [disabled]="page === totalPages"
              class="px-2 py-1 rounded text-sm disabled:opacity-40 hover:bg-gray-200">›</button>
            <button (click)="goToPage(totalPages)" [disabled]="page === totalPages"
              class="px-2 py-1 rounded text-sm disabled:opacity-40 hover:bg-gray-200">»</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';
  search = '';
  lowStock = false;
  page = 1;
  pageSize = 20;
  total = 0;
  totalPages = 1;

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  get pageNums(): number[] {
    const nums: number[] = [];
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.totalPages, this.page + 2);
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }

  constructor(private svc: ProductService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getProducts({ page: this.page, pageSize: this.pageSize, search: this.search, lowStock: this.lowStock }).subscribe({
      next: (data) => {
        this.products = data.items;
        this.total = data.total;
        this.totalPages = data.total_pages;
        this.loading = false;
      },
      error: () => { this.error = 'Error al cargar productos'; this.loading = false; }
    });
  }

  onSearchChange() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.page = 1; this.load(); }, 400);
  }

  toggleLowStock() {
    this.lowStock = !this.lowStock;
    this.page = 1;
    this.load();
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages || p === this.page) return;
    this.page = p;
    this.load();
  }

  onPageSizeChange() { this.page = 1; this.load(); }

  delete(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    this.svc.deleteProduct(id).subscribe({ next: () => this.load() });
  }
}
