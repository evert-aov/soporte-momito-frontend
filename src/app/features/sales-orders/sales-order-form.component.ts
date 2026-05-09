import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OrdersService, SalesOrder, SalesOrderLine } from '../../core/services/orders.service';
import { ProductService, Product } from '../products/product.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Customer { id: number; commercial_name: string; legal_name: string; }

@Component({
  selector: 'app-sales-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <a routerLink="/sales-orders" class="text-gray-400 hover:text-gray-600 text-sm">← Volver</a>
        <div>
          <h1 class="text-xl font-bold text-gray-900">Nueva Orden de Venta</h1>
          <p class="text-sm text-gray-500 mt-0.5">Registra una venta a cliente</p>
        </div>
      </div>

      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <form (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Header info -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 class="text-sm font-semibold text-gray-700">Información de la Venta</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Cliente *</label>
              <select name="customer_id" [(ngModel)]="form.customer_id" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar cliente</option>
                <option *ngFor="let c of customers" [value]="c.id">
                  {{ c.commercial_name || c.legal_name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Canal de origen</label>
              <select name="source_channel" [(ngModel)]="form.source_channel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Direct Sale">Venta Directa</option>
                <option value="B2B Portal">Portal B2B</option>
                <option value="Mobile App">App Móvil</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Condiciones de pago</label>
              <input type="text" name="payment_terms" [(ngModel)]="form.payment_terms"
                placeholder="Ej: 30 días"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Descuento total (Bs.)</label>
              <input type="number" name="total_discount" [(ngModel)]="form.total_discount" min="0" step="0.01"
                placeholder="0.00"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
        </div>

        <!-- Lines -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-gray-700">Líneas de Venta</h2>
            <button type="button" (click)="addLine()"
              class="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Agregar línea</button>
          </div>

          <div *ngFor="let line of lines; let i = index"
               class="grid grid-cols-12 gap-2 items-end border-b border-gray-100 pb-3">
            <div class="col-span-5">
              <label class="block text-xs font-medium text-gray-500 mb-1">Producto</label>
              <select [(ngModel)]="line.product_id" [name]="'product_' + i"
                (ngModelChange)="onProductSelect(line)"
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
              <label class="block text-xs font-medium text-gray-500 mb-1">Precio (Bs.)</label>
              <input type="number" [(ngModel)]="line.unit_price" [name]="'price_' + i" min="0" step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div class="col-span-1 text-right pb-0.5">
              <p class="text-xs text-gray-500">Sub.</p>
              <p class="text-sm font-semibold text-gray-800">{{ (line.quantity * line.unit_price) | number:'1.2-2' }}</p>
            </div>
            <div class="col-span-1 text-center pb-1">
              <button type="button" (click)="removeLine(i)"
                class="text-red-400 hover:text-red-600 text-sm">✕</button>
            </div>
          </div>

          <div *ngIf="lines.length === 0" class="text-center py-4 text-gray-400 text-sm">
            Agrega productos a la orden
          </div>

          <div class="flex items-end justify-end gap-6 pt-2 border-t border-gray-100">
            <div class="text-right">
              <p class="text-xs text-gray-500">Subtotal</p>
              <p class="text-base font-semibold text-gray-700">Bs. {{ subtotal | number:'1.2-2' }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500">Descuento</p>
              <p class="text-base font-semibold text-red-600">- Bs. {{ (form.total_discount || 0) | number:'1.2-2' }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500">Total</p>
              <p class="text-xl font-bold text-gray-900">Bs. {{ total | number:'1.2-2' }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3">
          <a routerLink="/sales-orders" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">Cancelar</a>
          <button type="submit" [disabled]="saving || lines.length === 0"
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
            {{ saving ? 'Creando...' : 'Crear Orden de Venta' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class SalesOrderFormComponent implements OnInit {
  customers: Customer[] = [];
  products: Product[] = [];
  lines: SalesOrderLine[] = [];
  form: Partial<SalesOrder> = { source_channel: 'Direct Sale', total_discount: 0 };
  saving = false;
  error = '';

  get subtotal(): number {
    return this.lines.reduce((acc, l) => acc + (l.quantity * l.unit_price), 0);
  }
  get total(): number {
    return Math.max(0, this.subtotal - (this.form.total_discount || 0));
  }

  constructor(
    private orderSvc: OrdersService,
    private prodSvc: ProductService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.prodSvc.getAllProducts().subscribe({ next: (p) => this.products = p });
    this.http.get<Customer[]>(`${environment.apiUrl}/customers/`).subscribe({
      next: (c) => this.customers = c,
      error: () => {}
    });
    this.addLine();
  }

  addLine() {
    this.lines.push({ product_id: '', quantity: 1, unit_price: 0 });
  }

  removeLine(i: number) {
    this.lines.splice(i, 1);
  }

  onProductSelect(line: SalesOrderLine) {
    const p = this.products.find(x => x.id === line.product_id);
    if (p?.list_price) line.unit_price = Number(p.list_price);
  }

  onSubmit() {
    if (!this.form.customer_id || this.lines.length === 0) return;
    this.saving = true;
    this.error = '';

    const payload: SalesOrder = {
      customer_id: Number(this.form.customer_id),
      source_channel: this.form.source_channel,
      payment_terms: this.form.payment_terms,
      total_discount: this.form.total_discount || 0,
      lines: this.lines
    };

    this.orderSvc.createSalesOrder(payload).subscribe({
      next: () => this.router.navigate(['/sales-orders']),
      error: (err) => {
        this.error = err.error?.detail || 'Error al crear la orden';
        this.saving = false;
      }
    });
  }
}
