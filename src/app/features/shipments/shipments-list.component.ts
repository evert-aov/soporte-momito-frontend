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
          <p class="text-sm text-gray-500 mt-0.5">{{ shipments.length }} envíos registrados</p>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="relative">
          <ng-icon name="heroMagnifyingGlass" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size="16"/>
          <input type="text" [(ngModel)]="search" placeholder="Buscar por número de seguimiento..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
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
            <tr *ngFor="let s of filtered" class="hover:bg-gray-50 transition-colors">
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
            <tr *ngIf="filtered.length === 0">
              <td colspan="6" class="px-4 py-12 text-center">
                <ng-icon name="heroTruck" class="text-gray-300 mx-auto mb-2" size="32"/>
                <p class="text-gray-400 text-sm">No se encontraron envíos</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ShipmentsListComponent implements OnInit {
  shipments: Shipment[] = [];
  loading = false;
  search = '';

  get filtered() {
    const q = this.search.toLowerCase();
    return q ? this.shipments.filter(s => (s.tracking_number || '').toLowerCase().includes(q)) : this.shipments;
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

  ngOnInit() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: d => { this.shipments = d; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
