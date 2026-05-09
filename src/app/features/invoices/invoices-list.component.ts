import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { InvoicesService, Invoice } from '../../core/services/invoices.service';


@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon, RouterLink],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Facturas</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ total }} facturas registradas</p>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="relative">
          <ng-icon name="heroMagnifyingGlass" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size="16"/>
          <input type="text" [(ngModel)]="search" (ngModelChange)="onSearchChange()"
            placeholder="Buscar por número de factura..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
      </div>

      <div *ngIf="loading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p class="text-gray-400 text-sm">Cargando facturas...</p>
      </div>

      <div *ngIf="!loading" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">N° Factura</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Orden de Venta</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estado Pago</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let inv of invoices" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ng-icon name="heroDocumentText" class="text-green-600" size="14"/>
                  </div>
                  <span class="font-mono font-medium text-gray-900 text-xs">{{ inv.invoice_number }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-500 text-xs">#{{ inv.sales_order_id }}</td>
              <td class="px-4 py-3 text-gray-500 text-xs">
                {{ inv.issue_date ? (inv.issue_date | date:'dd/MM/yyyy') : '—' }}
              </td>
              <td class="px-4 py-3 text-right font-medium text-gray-800">
                {{ inv.total_amount != null ? 'Bs. ' + (inv.total_amount | number:'1.2-2') : '—' }}
              </td>
              <td class="px-4 py-3 text-center">
                <span [class]="statusClass(inv.payment_status)">
                  {{ inv.payment_status || '—' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <a [routerLink]="['/invoices', inv.id]"
                  class="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                  Ver detalle →
                </a>
              </td>
            </tr>
            <tr *ngIf="invoices.length === 0">
              <td colspan="6" class="px-4 py-12 text-center">
                <ng-icon name="heroDocumentText" class="text-gray-300 mx-auto mb-2" size="32"/>
                <p class="text-gray-400 text-sm">No se encontraron facturas</p>
              </td>
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
export class InvoicesListComponent implements OnInit {
  invoices: Invoice[] = [];
  loading = false;
  search = '';
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

  constructor(private svc: InvoicesService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getAll(this.page, this.pageSize, this.search).subscribe({
      next: r => {
        this.invoices = r.items;
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

  private searchTimer?: ReturnType<typeof setTimeout>;
  onSearchChange() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.page = 1; this.load(); }, 400);
  }

  statusClass(status?: string) {
    const base = 'px-2.5 py-0.5 rounded-full text-xs font-medium ';
    switch (status?.toLowerCase()) {
      case 'paid':    return base + 'bg-green-100 text-green-700';
      case 'pending': return base + 'bg-amber-100 text-amber-700';
      case 'overdue': return base + 'bg-red-100 text-red-700';
      default:        return base + 'bg-gray-100 text-gray-500';
    }
  }
}
