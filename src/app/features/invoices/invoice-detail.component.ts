import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InvoicesService, Invoice } from '../../core/services/invoices.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-4 max-w-3xl">

      <!-- Header -->
      <div class="flex items-center gap-3">
        <a routerLink="/invoices" class="text-gray-400 hover:text-gray-600 text-sm">← Facturas</a>
        <span class="text-gray-300">/</span>
        <h1 class="text-xl font-bold text-gray-900">{{ invoice?.invoice_number || 'Cargando...' }}</h1>
      </div>

      <div *ngIf="loading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p class="text-gray-400 text-sm">Cargando factura...</p>
      </div>

      <div *ngIf="!loading && !invoice" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p class="text-gray-400 text-sm">Factura no encontrada.</p>
      </div>

      <ng-container *ngIf="!loading && invoice">

        <!-- Tarjeta principal -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-start justify-between mb-6">
            <div>
              <div class="flex items-center gap-3 mb-1">
                <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-mono font-bold text-gray-900 text-lg">{{ invoice.invoice_number }}</p>
                  <p class="text-xs text-gray-400">ID interno: #{{ invoice.id }}</p>
                </div>
              </div>
            </div>
            <span [class]="statusClass(invoice.payment_status)">
              {{ invoice.payment_status || '—' }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="space-y-3">
              <div>
                <p class="text-xs text-gray-400 uppercase font-semibold mb-0.5">Orden de Venta</p>
                <p class="text-gray-800 font-medium">#{{ invoice.sales_order_id }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase font-semibold mb-0.5">Fecha de Emisión</p>
                <p class="text-gray-800">{{ invoice.issue_date ? (invoice.issue_date | date:'dd/MM/yyyy HH:mm') : '—' }}</p>
              </div>
            </div>
            <div class="space-y-3">
              <div>
                <p class="text-xs text-gray-400 uppercase font-semibold mb-0.5">Total</p>
                <p class="text-2xl font-bold text-gray-900">
                  Bs. {{ invoice.total_amount != null ? (invoice.total_amount | number:'1.2-2') : '—' }}
                </p>
              </div>
            </div>
          </div>

          <!-- HTML Invoice primary action -->
          <div class="mt-5 pt-4 border-t border-gray-100 flex items-center gap-3">
            <button *ngIf="invoice.html_file_path" (click)="openHtmlInvoice()"
              class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              Ver Factura
            </button>
            <span *ngIf="!invoice.html_file_path" class="text-xs text-gray-400 italic">
              Factura HTML no disponible para esta orden.
            </span>
          </div>
        </div>

        <!-- XML Viewer -->
        <div *ngIf="invoice.xml_file_url" class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
              Contenido XML
            </h2>
            <button (click)="downloadXml()" class="inline-flex items-center gap-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-1.5 rounded-lg transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Descargar XML
            </button>
          </div>
          <pre class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">{{ xmlContent }}</pre>
        </div>

      </ng-container>
    </div>
  `
})
export class InvoiceDetailComponent implements OnInit {
  invoice: Invoice | null = null;
  loading = false;
  xmlContent = '';

  private apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private svc: InvoicesService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.loading = true;
    this.svc.getById(id).subscribe({
      next: inv => {
        this.invoice = inv;
        this.loading = false;
        if (inv.xml_file_url) {
          this.http.get(`${this.apiUrl}/invoices/${inv.id}/xml`, { responseType: 'text' }).subscribe({
            next: xml => { this.xmlContent = xml; },
            error: () => { this.xmlContent = ''; }
          });
        }
      },
      error: () => { this.loading = false; }
    });
  }

  openHtmlInvoice() {
    if (!this.invoice?.id) return;
    this.http.get(`${this.apiUrl}/invoices/${this.invoice.id}/html`, { responseType: 'blob' }).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const win = window.open(url, '_blank');
        // revoke after tab loads to free memory
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        if (!win) URL.revokeObjectURL(url);
      }
    });
  }

  downloadXml() {
    if (!this.invoice) return;
    this.http.get(`${this.apiUrl}/invoices/${this.invoice.id}/xml`, { responseType: 'blob' }).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.invoice!.invoice_number}.xml`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }

  statusClass(status?: string): string {
    const base = 'px-2.5 py-0.5 rounded-full text-xs font-medium ';
    switch (status?.toLowerCase()) {
      case 'paid': return base + 'bg-green-100 text-green-700';
      case 'pending': return base + 'bg-amber-100 text-amber-700';
      default: return base + 'bg-gray-100 text-gray-500';
    }
  }
}
