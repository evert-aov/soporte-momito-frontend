import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService, InventoryRecord } from '../../core/services/inventory.service';
import { ProductService, Product } from '../products/product.service';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Inventario</h1>
          <p class="text-sm text-gray-500 mt-0.5">Stock actual por sucursal</p>
        </div>
      </div>

      <!-- Low stock alert -->
      <div *ngIf="lowStock.length > 0"
           class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <span class="text-xl">⚠️</span>
        <div>
          <p class="text-sm font-semibold text-yellow-800">Stock bajo en {{ lowStock.length }} productos</p>
          <p class="text-xs text-yellow-700 mt-0.5">{{ lowStockIds }}</p>
        </div>
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
                <p class="font-medium text-gray-900">{{ productName(item.product_id) }}</p>
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
      </div>
    </div>
  `
})
export class InventoryListComponent implements OnInit {
  inventory: InventoryRecord[] = [];
  products: Product[] = [];
  loading = false;
  editingId: number | null = null;
  editQty = 0;
  editMinStock = 0;

  get lowStock(): InventoryRecord[] {
    return this.inventory.filter(i => i.quantity <= i.min_stock);
  }

  get lowStockIds(): string {
    return this.lowStock.map(i => i.product_id).join(', ');
  }

  constructor(private invSvc: InventoryService, private prodSvc: ProductService) {}

  ngOnInit() {
    this.loading = true;
    this.prodSvc.getProducts().subscribe({ next: (p) => this.products = p });
    this.invSvc.getInventory().subscribe({
      next: (data) => { this.inventory = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  productName(id: string): string {
    return this.products.find(p => p.id === id)?.name || id;
  }

  startEdit(item: InventoryRecord) {
    this.editingId = item.id;
    this.editQty = item.quantity;
    this.editMinStock = item.min_stock;
  }

  saveEdit(item: InventoryRecord) {
    this.invSvc.updateInventory(item.id, { quantity: this.editQty, min_stock: this.editMinStock }).subscribe({
      next: (updated) => {
        item.quantity = updated.quantity;
        item.min_stock = updated.min_stock;
        item.last_updated = updated.last_updated;
        this.editingId = null;
      }
    });
  }
}
