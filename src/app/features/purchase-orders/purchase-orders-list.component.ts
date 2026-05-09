import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrdersService, PurchaseOrder } from '../../core/services/orders.service';

interface Toast { msg: string; type: 'success' | 'error'; }

@Component({
  selector: 'app-purchase-orders-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Órdenes de Compra</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ total }} órdenes registradas</p>
        </div>
        <a routerLink="/purchase-orders/new"
           class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
          + Nueva Orden de Compra
        </a>
      </div>

      <div *ngIf="toast" [class]="'px-4 py-3 rounded-lg text-sm ' +
        (toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700')">
        {{ toast.msg }}
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 flex gap-3">
        <div class="relative flex-1">
          <input type="text" [(ngModel)]="search" (ngModelChange)="onSearchChange()"
            placeholder="Buscar por #..."
            class="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <select [(ngModel)]="filterStatus" (ngModelChange)="onFilterChange()"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Todos los estados</option>
          <option value="draft">Borrador</option>
          <option value="confirmed">Confirmado</option>
          <option value="received">Recibido</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <div *ngIf="loading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p class="text-gray-400 text-sm">Cargando órdenes...</p>
      </div>

      <div *ngIf="!loading" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Proveedor</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Emisión</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Entrega Est.</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <ng-container *ngFor="let o of orders">
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 font-mono font-medium text-gray-900 text-xs">#{{ o.id }}</td>
                <td class="px-4 py-3 text-gray-700">Proveedor #{{ o.supplier_id }}</td>
                <td class="px-4 py-3 text-gray-500 text-xs">{{ o.issue_date ? (o.issue_date | date:'dd/MM/yyyy') : '—' }}</td>
                <td class="px-4 py-3 text-gray-500 text-xs">{{ o.estimated_arrival_date ? (o.estimated_arrival_date | date:'dd/MM/yyyy') : '—' }}</td>
                <td class="px-4 py-3 text-center">
                  <span [class]="statusClass(o.status || '')">{{ statusLabel(o.status || '') }}</span>
                </td>
                <td class="px-4 py-3 text-right font-semibold text-gray-900">Bs. {{ o.total_amount | number:'1.2-2' }}</td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button (click)="toggleDetail(o.id!)"
                      class="text-xs text-blue-600 hover:bg-blue-50 font-medium px-2.5 py-1.5 rounded-md border border-blue-200 transition-colors">
                      {{ expandedId === o.id ? '▲ Ocultar' : '▼ Ver' }}
                    </button>
                    <button *ngIf="o.status === 'draft'" (click)="doAction('confirm', o)" [disabled]="busy === o.id"
                      class="text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-2.5 py-1.5 rounded-md transition-colors">
                      ✓ Confirmar
                    </button>
                    <button *ngIf="o.status === 'confirmed'" (click)="doAction('receive', o)" [disabled]="busy === o.id"
                      class="text-xs bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium px-2.5 py-1.5 rounded-md transition-colors">
                      ✓ Recibido
                    </button>
                    <button *ngIf="o.status !== 'received' && o.status !== 'cancelled'" (click)="doAction('cancel', o)" [disabled]="busy === o.id"
                      class="text-xs text-red-500 hover:bg-red-50 disabled:opacity-50 font-medium px-2.5 py-1.5 rounded-md border border-red-200 transition-colors">
                      ✕ Cancelar
                    </button>
                    <span *ngIf="o.status === 'received' || o.status === 'cancelled'" class="text-xs text-gray-400">—</span>
                  </div>
                </td>
              </tr>

              <!-- Fila de detalle expandida -->
              <tr *ngIf="expandedId === o.id" class="bg-blue-50">
                <td colspan="7" class="px-6 py-3">
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

            <tr *ngIf="orders.length === 0">
              <td colspan="7" class="px-4 py-12 text-center text-gray-400 text-sm">No se encontraron órdenes de compra</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <span class="text-xs text-gray-500">{{ total }} resultados · página {{ page }} de {{ totalPages }}</span>
          <div class="flex items-center gap-1">
            <button (click)="goToPage(1)" [disabled]="page === 1"
              class="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">«</button>
            <button (click)="goToPage(page - 1)" [disabled]="page === 1"
              class="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
            <button *ngFor="let n of pageNums" (click)="goToPage(n)"
              [class]="n === page
                ? 'w-7 h-7 flex items-center justify-center rounded-md bg-blue-600 text-white text-xs font-semibold'
                : 'w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-xs hover:bg-gray-50'">
              {{ n }}
            </button>
            <button (click)="goToPage(page + 1)" [disabled]="page === totalPages"
              class="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">›</button>
            <button (click)="goToPage(totalPages)" [disabled]="page === totalPages"
              class="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">»</button>
          </div>
          <select [(ngModel)]="pageSize" (ngModelChange)="onPageSizeChange()"
            class="px-2 py-1 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option [value]="10">10 / pág.</option>
            <option [value]="20">20 / pág.</option>
            <option [value]="50">50 / pág.</option>
          </select>
        </div>
      </div>
    </div>
  `
})
export class PurchaseOrdersListComponent implements OnInit {
  orders: PurchaseOrder[] = [];
  loading = false;
  busy: number | null = null;
  expandedId: number | null = null;
  toast: Toast | null = null;

  search = '';
  filterStatus = '';
  page = 1;
  pageSize = 20;
  total = 0;
  totalPages = 1;

  get pageNums(): number[] {
    const nums: number[] = [];
    for (let i = Math.max(1, this.page - 2); i <= Math.min(this.totalPages, this.page + 2); i++) {
      nums.push(i);
    }
    return nums;
  }

  constructor(private svc: OrdersService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getPurchaseOrders({ page: this.page, pageSize: this.pageSize, search: this.search, status: this.filterStatus }).subscribe({
      next: r => {
        this.orders = r.items;
        this.total = r.total;
        this.totalPages = r.total_pages;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages || p === this.page) return;
    this.page = p;
    this.load();
  }

  onPageSizeChange() { this.page = 1; this.load(); }
  onFilterChange()   { this.page = 1; this.load(); }

  private searchTimer?: ReturnType<typeof setTimeout>;
  onSearchChange() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.page = 1; this.load(); }, 400);
  }

  toggleDetail(id: number) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  doAction(type: 'confirm' | 'receive' | 'cancel', o: PurchaseOrder) {
    if (!o.id) return;
    if (type === 'cancel' && !confirm('¿Cancelar la orden de compra #' + o.id + '?')) return;
    this.busy = o.id;
    const obs =
      type === 'confirm' ? this.svc.confirmPurchaseOrder(o.id) :
      type === 'receive'  ? this.svc.receivePurchaseOrder(o.id) :
                            this.svc.cancelPurchaseOrder(o.id);
    obs.subscribe({
      next: updated => {
        o.status = updated.status;
        this.busy = null;
        const msg = type === 'confirm' ? 'Orden confirmada' : type === 'receive' ? 'Mercancía recibida — inventario actualizado' : 'Orden cancelada';
        this.showToast(msg, 'success');
      },
      error: (err: any) => { this.busy = null; this.showToast(err.error?.detail || 'Error', 'error'); },
    });
  }

  private showToast(msg: string, type: 'success' | 'error') {
    this.toast = { msg, type };
    setTimeout(() => this.toast = null, 4000);
  }

  statusLabel(s: string): string {
    const m: Record<string, string> = { draft: 'Borrador', confirmed: 'Confirmado', received: 'Recibido', cancelled: 'Cancelado' };
    return m[s] || s;
  }

  statusClass(s: string): string {
    const m: Record<string, string> = {
      draft:     'px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600',
      confirmed: 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700',
      received:  'px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700',
      cancelled: 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600',
    };
    return m[s] || 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500';
  }
}
