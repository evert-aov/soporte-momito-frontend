import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { CustomersService, Customer } from '../../core/services/customers.service';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgIcon],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Clientes B2B</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ total }} clientes registrados</p>
        </div>
        <a routerLink="/customers/new"
           class="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <ng-icon name="heroPlus" size="16"/> Nuevo Cliente
        </a>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="relative">
          <ng-icon name="heroMagnifyingGlass" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size="16"/>
          <input type="text" [(ngModel)]="search" (ngModelChange)="onSearchChange()"
            placeholder="Buscar por nombre comercial, razón social o NIT..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
      </div>

      <div *ngIf="loading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p class="text-gray-400 text-sm">Cargando clientes...</p>
      </div>

      <div *ngIf="!loading" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nombre Comercial</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Razón Social</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">NIT/RUT</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Segmento</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Crédito</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Teléfono</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let c of customers" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ng-icon name="heroBuildingStorefront" class="text-amber-600" size="14"/>
                  </div>
                  <span class="font-medium text-gray-900">{{ c.commercial_name || '—' }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-600 text-xs">{{ c.legal_name || '—' }}</td>
              <td class="px-4 py-3 font-mono text-xs text-gray-500">{{ c.tax_id || '—' }}</td>
              <td class="px-4 py-3">
                <span *ngIf="c.segment" class="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                  {{ c.segment }}
                </span>
                <span *ngIf="!c.segment" class="text-gray-400 text-xs">—</span>
              </td>
              <td class="px-4 py-3 text-right font-medium text-gray-800">
                {{ c.credit_limit ? 'Bs. ' + (c.credit_limit | number:'1.2-2') : '—' }}
              </td>
              <td class="px-4 py-3 text-gray-500 text-xs">{{ c.phone || '—' }}</td>
              <td class="px-4 py-3 text-right">
                <a [routerLink]="['/customers/edit', c.id]"
                   class="inline-flex items-center gap-1 text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors font-medium">
                  <ng-icon name="heroPencil" size="12"/> Editar
                </a>
              </td>
            </tr>
            <tr *ngIf="customers.length === 0">
              <td colspan="7" class="px-4 py-12 text-center">
                <ng-icon name="heroUserGroup" class="text-gray-300 mx-auto mb-2" size="32"/>
                <p class="text-gray-400 text-sm">No se encontraron clientes</p>
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
export class CustomersListComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;
  search = '';
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

  constructor(private svc: CustomersService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getAll(this.page, this.pageSize, this.search).subscribe({
      next: (data) => {
        this.customers = data.items;
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

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages || p === this.page) return;
    this.page = p;
    this.load();
  }

  onPageSizeChange() { this.page = 1; this.load(); }
}
