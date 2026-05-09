import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { ShipmentsService, Shipment } from '../../core/services/invoices.service';

@Component({
  selector: 'app-shipments-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Envíos</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ total }} envíos registrados</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <div class="relative flex-1 min-w-48">
          <ng-icon name="heroMagnifyingGlass" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size="16"/>
          <input type="text" [(ngModel)]="search" (ngModelChange)="onSearchChange()"
            placeholder="Buscar por número de seguimiento..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <select [(ngModel)]="filterStatus" (ngModelChange)="onFilterChange()"
          class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="in_transit">En tránsito</option>
          <option value="delivered">Entregado</option>
        </select>
      </div>

      <div *ngIf="loading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p class="text-gray-400 text-sm">Cargando envíos...</p>
      </div>

      <div *ngIf="!loading" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Seguimiento</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Orden de Venta</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Transportista</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Despacho</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Entrega Est.</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let s of shipments" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ng-icon name="heroTruck" class="text-sky-600" size="14"/>
                  </div>
                  <span class="font-mono text-xs text-gray-900">{{ s.tracking_number || '—' }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-500 text-xs">#{{ s.sales_order_id }}</td>
              <td class="px-4 py-3 text-gray-600 text-xs">{{ s.carrier || '—' }}</td>
              <td class="px-4 py-3 text-gray-500 text-xs">
                {{ s.dispatch_date ? (s.dispatch_date | date:'dd/MM/yyyy') : '—' }}
              </td>
              <td class="px-4 py-3 text-gray-500 text-xs">
                {{ s.estimated_delivery_date ? (s.estimated_delivery_date | date:'dd/MM/yyyy') : '—' }}
              </td>
              <td class="px-4 py-3 text-center">
                <span [class]="statusClass(s.delivery_status)">
                  {{ s.delivery_status || '—' }}
                </span>
              </td>
            </tr>
            <tr *ngIf="shipments.length === 0">
              <td colspan="6" class="px-4 py-12 text-center">
                <ng-icon name="heroTruck" class="text-gray-300 mx-auto mb-2" size="32"/>
                <p class="text-gray-400 text-sm">No se encontraron envíos</p>
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
export class ShipmentsListComponent implements OnInit {
  shipments: Shipment[] = [];
  loading = false;
  search = '';
  filterStatus = '';
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

  statusClass(status?: string) {
    const base = 'px-2.5 py-0.5 rounded-full text-xs font-medium ';
    switch (status?.toLowerCase()) {
      case 'delivered': return base + 'bg-green-100 text-green-700';
      case 'in_transit': return base + 'bg-blue-100 text-blue-700';
      case 'pending': return base + 'bg-amber-100 text-amber-700';
      default: return base + 'bg-gray-100 text-gray-500';
    }
  }

  constructor(private svc: ShipmentsService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getAll(this.page, this.pageSize, this.search, this.filterStatus).subscribe({
      next: (data) => {
        this.shipments = data.items;
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

  onFilterChange() { this.page = 1; this.load(); }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages || p === this.page) return;
    this.page = p;
    this.load();
  }

  onPageSizeChange() { this.page = 1; this.load(); }
}
