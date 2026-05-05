import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrdersService, SalesOrder } from '../../core/services/orders.service';

interface Toast { msg: string; type: 'success' | 'error'; }

@Component({
  selector: 'app-sales-orders-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-4">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Órdenes de Venta</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ orders.length }} órdenes registradas</p>
        </div>
        <a routerLink="/sales-orders/new"
           class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
          + Nueva Orden Presencial
        </a>
      </div>

      <!-- Toast -->
      <div *ngIf="toast" [class]="'px-4 py-3 rounded-lg text-sm flex items-center gap-2 ' +
        (toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700')">
        {{ toast.msg }}
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3">
        <div class="relative flex-1 min-w-48">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" [(ngModel)]="search" placeholder="Buscar por # o email..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <select [(ngModel)]="filterStatus"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Todos los estados</option>
          <option value="draft">Borrador</option>
          <option value="pending_payment">Pendiente de Pago</option>
          <option value="paid">Pagado</option>
          <option value="confirmed">Confirmado</option>
          <option value="picking">Preparando</option>
          <option value="dispatched">Despachado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <select [(ngModel)]="filterChannel"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Todos los canales</option>
          <option value="presencial">Presencial</option>
          <option value="ecommerce">E-commerce</option>
        </select>
      </div>

      <div *ngIf="loading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p class="text-gray-400 text-sm">Cargando órdenes...</p>
      </div>

      <div *ngIf="!loading" class="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Canal</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Pago</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase min-w-56">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <ng-container *ngFor="let o of filtered">
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 font-mono font-medium text-gray-900 text-xs">#{{ o.id }}</td>

              <!-- Canal -->
              <td class="px-4 py-3">
                <span [class]="o.source_channel === 'ecommerce'
                  ? 'px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium'
                  : 'px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 font-medium'">
                  {{ o.source_channel === 'ecommerce' ? 'Online' : 'Presencial' }}
                </span>
              </td>

              <!-- Cliente -->
              <td class="px-4 py-3">
                <p class="text-gray-700 text-xs">{{ o.customer_id ? 'Cliente #' + o.customer_id : 'Invitado' }}</p>
                <p *ngIf="o.guest_email" class="text-gray-400 text-xs">{{ o.guest_email }}</p>
              </td>

              <!-- Método pago -->
              <td class="px-4 py-3">
                <span *ngIf="o.payment_method === 'paypal'" class="px-2 py-0.5 text-xs rounded font-semibold bg-blue-50 text-blue-700">PayPal</span>
                <span *ngIf="o.payment_method === 'qr'" class="px-2 py-0.5 text-xs rounded font-semibold bg-green-50 text-green-700">QR</span>
                <span *ngIf="!o.payment_method" class="text-gray-400 text-xs">Efectivo/Cta</span>
              </td>

              <!-- Fecha -->
              <td class="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                {{ o.order_date ? (o.order_date | date:'dd/MM/yy HH:mm') : '—' }}
              </td>

              <!-- Estado -->
              <td class="px-4 py-3 text-center">
                <span [class]="statusClass(o.status || '')">{{ statusLabel(o.status || '') }}</span>
              </td>

              <!-- Total -->
              <td class="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                Bs. {{ o.total_amount | number:'1.2-2' }}
              </td>

              <!-- Acciones -->
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1 flex-wrap">

                  <!-- Ver detalle -->
                  <button (click)="toggleDetail(o.id!)"
                    class="inline-flex items-center gap-1 text-xs text-blue-600 hover:bg-blue-50 font-medium px-2.5 py-1.5 rounded-md border border-blue-200 transition-colors whitespace-nowrap">
                    {{ expandedId === o.id ? '▲ Ocultar' : '▼ Ver' }}
                  </button>

                  <!-- Marcar Pagado: draft/pending_payment sin método online, o QR pendiente -->
                  <button *ngIf="canMarkPaid(o)"
                    (click)="action('markPaid', o)"
                    [disabled]="busy === o.id"
                    class="inline-flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap">
                    ✓ Marcar Pagado
                  </button>

                  <!-- Avanzar flujo: paid → confirmed → picking → dispatched → delivered -->
                  <button *ngIf="canAdvance(o)"
                    (click)="action('advance', o)"
                    [disabled]="busy === o.id"
                    class="inline-flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap">
                    {{ nextLabel(o.status || '') }} →
                  </button>

                  <!-- Cancelar -->
                  <button *ngIf="canCancel(o)"
                    (click)="action('cancel', o)"
                    [disabled]="busy === o.id"
                    class="inline-flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50 font-medium px-2.5 py-1.5 rounded-md border border-red-200 transition-colors">
                    ✕ Cancelar
                  </button>

                  <span *ngIf="isFinal(o.status || '')" class="text-xs text-gray-400 ml-1">—</span>
                </div>
              </td>
            </tr>

            <!-- Fila de detalle expandida -->
            <tr *ngIf="expandedId === o.id" class="bg-blue-50">
              <td colspan="8" class="px-6 py-3">
                <p class="text-xs font-semibold text-gray-600 mb-2">Productos de la orden #{{ o.id }}</p>
                <div *ngIf="!o.lines || o.lines.length === 0" class="text-xs text-gray-400">Sin líneas registradas</div>
                <table *ngIf="o.lines && o.lines.length > 0" class="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                  <thead class="bg-white">
                    <tr>
                      <th class="text-left px-3 py-2 font-semibold text-gray-500">Producto</th>
                      <th class="text-right px-3 py-2 font-semibold text-gray-500">Cantidad</th>
                      <th class="text-right px-3 py-2 font-semibold text-gray-500">Precio Unit.</th>
                      <th class="text-right px-3 py-2 font-semibold text-gray-500">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr *ngFor="let l of o.lines" class="bg-white">
                      <td class="px-3 py-2 font-mono text-gray-700">{{ l.product_id }}</td>
                      <td class="px-3 py-2 text-right text-gray-700">{{ l.quantity }}</td>
                      <td class="px-3 py-2 text-right text-gray-700">Bs. {{ l.unit_price | number:'1.2-2' }}</td>
                      <td class="px-3 py-2 text-right font-semibold text-gray-900">Bs. {{ l.subtotal | number:'1.2-2' }}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            </ng-container>

            <tr *ngIf="filtered.length === 0">
              <td colspan="8" class="px-4 py-12 text-center text-gray-400 text-sm">
                No se encontraron órdenes de venta
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SalesOrdersListComponent implements OnInit {
  orders: SalesOrder[] = [];
  loading = false;
  busy: number | null = null;
  expandedId: number | null = null;
  search = '';
  filterStatus = '';
  filterChannel = '';
  toast: Toast | null = null;

  private readonly FLOW = ['draft', 'pending_payment', 'paid', 'confirmed', 'picking', 'dispatched', 'delivered'];
  private readonly FINAL = new Set(['delivered', 'cancelled']);

  get filtered(): SalesOrder[] {
    let list = this.orders;
    if (this.search) {
      const q = this.search.toLowerCase();
      list = list.filter(o =>
        String(o.id).includes(q) ||
        (o.guest_email || '').toLowerCase().includes(q)
      );
    }
    if (this.filterStatus) list = list.filter(o => o.status === this.filterStatus);
    if (this.filterChannel) list = list.filter(o =>
      this.filterChannel === 'ecommerce'
        ? o.source_channel === 'ecommerce'
        : o.source_channel !== 'ecommerce'
    );
    return list;
  }

  constructor(private svc: OrdersService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.svc.getSalesOrders().subscribe({
      next: d => { this.orders = d; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  toggleDetail(id: number) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  /** Puede marcar pagado:
   *  - presencial en draft/pending_payment (cualquier método de pago, incluido sin método)
   *  - online con QR en pending_payment */
  canMarkPaid(o: SalesOrder): boolean {
    const s = o.status || '';
    if (this.FINAL.has(s) || s === 'paid') return false;
    if (!['draft', 'pending_payment'].includes(s)) return false;
    // presencial: siempre puede marcar pagado
    if (o.source_channel !== 'ecommerce') return true;
    // online: solo QR pendiente
    return o.payment_method === 'qr' && s === 'pending_payment';
  }

  /** Puede avanzar al siguiente estado (a partir de "paid") */
  canAdvance(o: SalesOrder): boolean {
    const s = o.status || '';
    if (this.FINAL.has(s) || s === 'cancelled') return false;
    const idx = this.FLOW.indexOf(s);
    return idx >= 2 && idx < this.FLOW.length - 1; // desde "paid" en adelante
  }

  canCancel(o: SalesOrder): boolean {
    return !this.FINAL.has(o.status || '') && o.status !== 'cancelled';
  }

  isFinal(s: string): boolean {
    return this.FINAL.has(s) || s === 'cancelled';
  }

  nextLabel(s: string): string {
    const next: Record<string, string> = {
      paid: 'Confirmar',
      confirmed: 'En Preparación',
      picking: 'Despachar',
      dispatched: 'Entregar',
    };
    return next[s] || 'Avanzar';
  }

  action(type: 'markPaid' | 'advance' | 'cancel', o: SalesOrder) {
    if (!o.id) return;
    if (type === 'cancel' && !confirm(`¿Cancelar la orden #${o.id}?`)) return;
    this.busy = o.id;

    if (type === 'markPaid') {
      this.svc.markSalesOrderPaid(o.id).subscribe({
        next: res => {
          this.busy = null;
          o.status = res.order.status;
          this.showToast(`Pagado. Factura: ${res.invoice_number}`, 'success');
        },
        error: (err: any) => {
          this.busy = null;
          this.showToast(err.error?.detail || 'Error al actualizar', 'error');
        },
      });
      return;
    }

    const obs = type === 'advance' ? this.svc.advanceSalesOrder(o.id) : this.svc.cancelSalesOrder(o.id);
    obs.subscribe({
      next: (updated: SalesOrder) => {
        this.busy = null;
        o.status = updated.status;
        const msg = type === 'advance'
          ? `Estado actualizado a: ${this.statusLabel(o.status || '')}`
          : 'Orden cancelada';
        this.showToast(msg, 'success');
      },
      error: (err: any) => {
        this.busy = null;
        this.showToast(err.error?.detail || 'Error al actualizar', 'error');
      },
    });
  }

  private showToast(msg: string, type: 'success' | 'error') {
    this.toast = { msg, type };
    setTimeout(() => this.toast = null, 5000);
  }

  statusLabel(s: string): string {
    const m: Record<string, string> = {
      draft: 'Borrador', pending_payment: 'Pend. Pago', paid: 'Pagado',
      confirmed: 'Confirmado', picking: 'Preparando',
      dispatched: 'Despachado', delivered: 'Entregado', cancelled: 'Cancelado',
    };
    return m[s] || s;
  }

  statusClass(s: string): string {
    const m: Record<string, string> = {
      draft:           'px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600',
      pending_payment: 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700',
      paid:            'px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700',
      confirmed:       'px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700',
      picking:         'px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700',
      dispatched:      'px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700',
      delivered:       'px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700',
      cancelled:       'px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600',
    };
    return m[s] || 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500';
  }
}
