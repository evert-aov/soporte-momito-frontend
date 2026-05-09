import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService, InventoryWithName } from '../../core/services/inventory.service';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Inventario</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ total }} registros · Stock actual por sucursal</p>
        </div>
      </div>

      <!-- Low stock alert -->
      <div *ngIf="lowStockNames.length > 0"
           class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <span class="text-xl">⚠️</span>
        <div>
          <p class="text-sm font-semibold text-yellow-800">Stock bajo en {{ lowStockNames.length }} productos</p>
          <p class="text-xs text-yellow-700 mt-0.5">{{ lowStockNames.join(', ') }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <div class="relative flex-1 min-w-48">
          <input type="text" [(ngModel)]="search" (ngModelChange)="onSearchChange()"
            placeholder="Buscar por nombre de producto..."
            class="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <button (click)="toggleLowStock()"
          [class]="filterLowStock
            ? 'inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-amber-100 text-amber-700 border border-amber-300'
            : 'inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'">
          ⚠️ Solo stock bajo
        </button>
      </div>

      <div *ngIf="loading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p class="text-gray-400 text-sm">Cargando inventario...</p>
      </div>

      <div *ngIf="!loading" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Producto</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sucursal</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stock Mínimo</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actualizado</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let item of inventory" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <p class="font-medium text-gray-900">{{ item.product_name }}</p>
                <p class="text-xs text-gray-400 font-mono">{{ item.product_id }}</p>
              </td>
              <td class="px-4 py-3 text-gray-600">Sucursal {{ item.branch_id }}</td>
              <td class="px-4 py-3 text-right">
                <span *ngIf="editingId !== item.id" class="font-bold text-gray-900 text-base">
                  {{ item.quantity }}
                </span>
                <input *ngIf="editingId === item.id"
                  type="number" [(ngModel)]="editQty" min="0"
                  class="w-20 text-right px-2 py-1 border border-blue-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </td>
              <td class="px-4 py-3 text-right text-gray-500">
                <span *ngIf="editingId !== item.id">{{ item.min_stock }}</span>
                <input *ngIf="editingId === item.id"
                  type="number" [(ngModel)]="editMinStock" min="0"
                  class="w-20 text-right px-2 py-1 border border-orange-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"/>
              </td>
              <td class="px-4 py-3 text-center">
                <span [class]="item.quantity <= item.min_stock
                  ? 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700'
                  : 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700'">
                  {{ item.quantity <= item.min_stock ? 'Stock Bajo' : 'OK' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right text-xs text-gray-400">
                {{ item.last_updated ? (item.last_updated | date:'dd/MM HH:mm') : '—' }}
              </td>
              <td class="px-4 py-3 text-right">
                <div *ngIf="editingId !== item.id" class="flex items-center justify-end gap-2">
                  <button (click)="startEdit(item)"
                    class="text-xs text-blue-600 hover:text-blue-800 font-medium">Ajustar</button>
                </div>
                <div *ngIf="editingId === item.id" class="flex items-center justify-end gap-2">
                  <button (click)="saveEdit(item)"
                    class="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">✓</button>
                  <button (click)="editingId = null"
                    class="text-xs text-gray-500 hover:text-gray-700">✕</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="inventory.length === 0">
              <td colspan="7" class="px-4 py-12 text-center text-gray-400 text-sm">
                No hay registros de inventario
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
export class InventoryListComponent implements OnInit {
  inventory: InventoryWithName[] = [];
  lowStockNames: string[] = [];
  loading = false;
  search = '';
  filterLowStock = false;
  page = 1;
  pageSize = 20;
  total = 0;
  totalPages = 1;
  editingId: number | null = null;
  editQty = 0;
  editMinStock = 0;

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  get pageNums(): number[] {
    const nums: number[] = [];
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.totalPages, this.page + 2);
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }

  constructor(private invSvc: InventoryService) {}

  ngOnInit() {
    this.loadLowStockAlert();
    this.load();
  }

  loadLowStockAlert() {
    this.invSvc.getInventory({ page: 1, pageSize: 100, lowStock: true }).subscribe({
      next: (data) => { this.lowStockNames = data.items.map(i => i.product_name); }
    });
  }

  load() {
    this.loading = true;
    this.invSvc.getInventory({ page: this.page, pageSize: this.pageSize, search: this.search, lowStock: this.filterLowStock }).subscribe({
      next: (data) => {
        this.inventory = data.items;
        this.total = data.total;
        this.totalPages = data.total_pages;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearchChange() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.page = 1; this.load(); }, 400);
  }

  toggleLowStock() {
    this.filterLowStock = !this.filterLowStock;
    this.page = 1;
    this.load();
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages || p === this.page) return;
    this.page = p;
    this.load();
  }

  onPageSizeChange() { this.page = 1; this.load(); }

  startEdit(item: InventoryWithName) {
    this.editingId = item.id;
    this.editQty = item.quantity;
    this.editMinStock = item.min_stock;
  }

  saveEdit(item: InventoryWithName) {
    this.invSvc.updateInventory(item.id, { quantity: this.editQty, min_stock: this.editMinStock }).subscribe({
      next: (updated) => {
        item.quantity = updated.quantity;
        item.min_stock = updated.min_stock;
        item.last_updated = updated.last_updated;
        this.editingId = null;
        this.loadLowStockAlert();
      }
    });
  }
}
