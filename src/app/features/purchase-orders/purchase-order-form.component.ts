import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OrdersService, PurchaseOrder, PurchaseOrderLine } from '../../core/services/orders.service';
import { SuppliersService, Supplier } from '../../core/services/suppliers.service';
import { ProductService, Product } from '../products/product.service';

@Component({
  selector: 'app-purchase-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <a routerLink="/purchase-orders" class="text-gray-400 hover:text-gray-600 text-sm">← Volver</a>
        <div>
          <h1 class="text-xl font-bold text-gray-900">Nueva Orden de Compra</h1>
          <p class="text-sm text-gray-500 mt-0.5">Registra una orden a un proveedor</p>
        </div>
      </div>

      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <form (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Header info -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 class="text-sm font-semibold text-gray-700">Información General</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Proveedor *</label>
              <select name="supplier_id" [(ngModel)]="form.supplier_id" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar proveedor</option>
                <option *ngFor="let s of suppliers" [value]="s.id">{{ s.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Fecha de entrega estimada</label>
              <input type="date" name="eta" [(ngModel)]="eta"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
        </div>

        <!-- Lines -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-gray-700">Líneas de Orden</h2>
            <button type="button" (click)="addLine()"
              class="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Agregar línea</button>
          </div>

          <div *ngFor="let line of lines; let i = index"
               class="grid grid-cols-12 gap-2 items-end border-b border-gray-100 pb-3">
            <div class="col-span-5">
              <label class="block text-xs font-medium text-gray-500 mb-1">Producto</label>
              <select [(ngModel)]="line.product_id" [name]="'product_' + i"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar...</option>
                <option *ngFor="let p of products" [value]="p.id">{{ p.name }}</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-xs font-medium text-gray-500 mb-1">Cantidad</label>
              <input type="number" [(ngModel)]="line.quantity" [name]="'qty_' + i" min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div class="col-span-3">
              <label class="block text-xs font-medium text-gray-500 mb-1">Precio Unitario (Bs.)</label>
              <input type="number" [(ngModel)]="line.unit_price" [name]="'price_' + i" min="0" step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div class="col-span-1 text-right pb-0.5">
              <p class="text-xs text-gray-500">Subtotal</p>
              <p class="text-sm font-semibold text-gray-800">{{ (line.quantity * line.unit_price) | number:'1.2-2' }}</p>
            </div>
            <div class="col-span-1 text-center pb-1">
              <button type="button" (click)="removeLine(i)"
                class="text-red-400 hover:text-red-600 text-sm">✕</button>
            </div>
          </div>

          <div *ngIf="lines.length === 0" class="text-center py-4 text-gray-400 text-sm">
            Agrega al menos una línea de producto
          </div>

          <div class="flex items-center justify-end pt-2 border-t border-gray-100">
            <div class="text-right">
              <p class="text-xs text-gray-500">Total estimado</p>
              <p class="text-xl font-bold text-gray-900">Bs. {{ total | number:'1.2-2' }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3">
          <a routerLink="/purchase-orders"
             class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">Cancelar</a>
          <button type="submit" [disabled]="saving || lines.length === 0"
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
            {{ saving ? 'Creando...' : 'Crear Orden de Compra' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class PurchaseOrderFormComponent implements OnInit {
  suppliers: Supplier[] = [];
  products: Product[] = [];
  lines: PurchaseOrderLine[] = [];
  form: Partial<PurchaseOrder> = { supplier_id: 0 };
  eta = '';
  saving = false;
  error = '';

  get total(): number {
    return this.lines.reduce((acc, l) => acc + (l.quantity * l.unit_price), 0);
  }

  constructor(
    private orderSvc: OrdersService,
    private supSvc: SuppliersService,
    private prodSvc: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.supSvc.getSuppliers().subscribe({ next: (s) => this.suppliers = s });
    this.prodSvc.getProducts().subscribe({ next: (p) => this.products = p });
    this.addLine();
  }

  addLine() {
    this.lines.push({ product_id: '', quantity: 1, unit_price: 0 });
  }

  removeLine(i: number) {
    this.lines.splice(i, 1);
  }

  onSubmit() {
    if (!this.form.supplier_id || this.lines.length === 0) return;
    this.saving = true;
    this.error = '';

    const payload: PurchaseOrder = {
      supplier_id: Number(this.form.supplier_id),
      estimated_arrival_date: this.eta || undefined,
      lines: this.lines
    };

    this.orderSvc.createPurchaseOrder(payload).subscribe({
      next: () => this.router.navigate(['/purchase-orders']),
      error: (err) => {
        this.error = err.error?.detail || 'Error al crear la orden';
        this.saving = false;
      }
    });
  }
}
