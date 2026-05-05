import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgIcon } from '@ng-icons/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Chart,
  DoughnutController, ArcElement,
  BarController, BarElement,
  LineController, LineElement, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler,
  ChartConfiguration,
} from 'chart.js';

Chart.register(
  DoughnutController, ArcElement,
  BarController, BarElement,
  LineController, LineElement, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler,
);

interface KPI { label: string; value: string; sub: string; icon: string; trend: number; color: string; bg: string; }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIcon],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-sm text-gray-500 mt-0.5">Resumen operacional — TUMOMITO S.A.</p>
        </div>
        <span class="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          Sistema activo
        </span>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div *ngFor="let kpi of kpis"
             class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div [class]="'w-10 h-10 rounded-xl flex items-center justify-center ' + kpi.bg">
              <ng-icon [name]="kpi.icon" [class]="'w-5 h-5 ' + kpi.color" size="20" />
            </div>
            <div [class]="'flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ' +
              (kpi.trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600')">
              <ng-icon [name]="kpi.trend >= 0 ? 'heroArrowTrendingUp' : 'heroArrowTrendingDown'" size="12" />
              {{ kpi.trend >= 0 ? '+' : '' }}{{ kpi.trend }}%
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 leading-none">{{ kpi.value }}</p>
          <p class="text-xs text-gray-500 mt-1.5 font-medium">{{ kpi.label }}</p>
          <p class="text-[11px] text-gray-400 mt-0.5">{{ kpi.sub }}</p>
        </div>
      </div>

      <!-- Charts row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- Sales orders by status — Doughnut -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <ng-icon name="heroChartPie" class="text-blue-500" size="18" />
            <h2 class="text-sm font-semibold text-gray-800">Estado de Ventas</h2>
          </div>
          <div class="relative h-44 flex items-center justify-center">
            <canvas #doughnutChart></canvas>
            <div *ngIf="!salesOrders.length"
                 class="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
              Sin datos
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <div *ngFor="let item of salesStatusLegend"
                 class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-sm flex-shrink-0" [style.background]="item.color"></span>
                <span class="text-gray-600">{{ item.label }}</span>
              </div>
              <span class="font-semibold text-gray-800">{{ item.count }}</span>
            </div>
          </div>
        </div>

        <!-- Purchase orders total — Bar chart -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm lg:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <ng-icon name="heroChartBar" class="text-violet-500" size="18" />
              <h2 class="text-sm font-semibold text-gray-800">Órdenes de Compra — Monto por orden</h2>
            </div>
            <a routerLink="/purchase-orders" class="text-xs text-blue-600 hover:underline font-medium">
              Ver todas →
            </a>
          </div>
          <div class="h-44">
            <canvas #barChart></canvas>
          </div>
        </div>
      </div>

      <!-- Bottom row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- Inventory alert table -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <ng-icon name="heroExclamationTriangle" class="text-amber-500" size="18" />
              <h2 class="text-sm font-semibold text-gray-800">Alertas de Inventario</h2>
            </div>
            <a routerLink="/inventory" class="text-xs text-blue-600 hover:underline">Ver →</a>
          </div>
          <div *ngIf="lowStockItems.length === 0"
               class="flex flex-col items-center justify-center py-8 text-center">
            <ng-icon name="heroCheckCircle" class="text-green-400 mb-2" size="32" />
            <p class="text-sm text-gray-500">Stock en niveles óptimos</p>
          </div>
          <div *ngIf="lowStockItems.length > 0" class="space-y-2">
            <div *ngFor="let item of lowStockItems"
                 class="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
              <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ng-icon name="heroArchiveBox" class="text-red-500" size="16" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-800 truncate">{{ item.product_id }}</p>
                <p class="text-[11px] text-gray-500">
                  Stock: <span class="text-red-600 font-bold">{{ item.quantity }}</span>
                  / Mín: {{ item.min_stock }}
                </p>
              </div>
              <span class="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                BAJO
              </span>
            </div>
          </div>
        </div>

        <!-- Recent sales orders -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <ng-icon name="heroClipboardDocumentList" class="text-indigo-500" size="18" />
              <h2 class="text-sm font-semibold text-gray-800">Últimas Ventas</h2>
            </div>
            <a routerLink="/sales-orders" class="text-xs text-blue-600 hover:underline">Ver →</a>
          </div>
          <div *ngIf="salesOrders.length === 0"
               class="py-8 text-center text-sm text-gray-400">Sin ventas registradas</div>
          <div *ngIf="salesOrders.length > 0" class="space-y-2">
            <div *ngFor="let o of salesOrders.slice(0, 5)"
                 class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ng-icon name="heroClipboardDocumentList" class="text-indigo-500" size="14" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-semibold text-gray-800">Orden #{{ o.id }}</p>
                  <p class="text-xs font-bold text-gray-900">Bs. {{ o.total_amount | number:'1.2-2' }}</p>
                </div>
                <div class="flex items-center justify-between mt-0.5">
                  <p class="text-[11px] text-gray-400">Cliente #{{ o.customer_id }}</p>
                  <span [class]="salesStatusClass(o.status)">{{ o.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('doughnutChart') doughnutRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChart') barRef!: ElementRef<HTMLCanvasElement>;

  kpis: KPI[] = [];
  salesOrders: any[] = [];
  purchaseOrders: any[] = [];
  inventory: any[] = [];
  lowStockItems: any[] = [];
  salesStatusLegend: { label: string; color: string; count: number }[] = [];

  private dataLoaded = false;
  private viewReady = false;

  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.viewReady = true;
    if (this.dataLoaded) this.buildCharts();
  }

  ngOnInit() {
    forkJoin({
      products:  this.http.get<any[]>(`${this.api}/products/`).pipe(catchError(() => of([]))),
      suppliers: this.http.get<any[]>(`${this.api}/suppliers/`).pipe(catchError(() => of([]))),
      inventory: this.http.get<any[]>(`${this.api}/inventory/`).pipe(catchError(() => of([]))),
      sales:     this.http.get<any[]>(`${this.api}/sales-orders/`).pipe(catchError(() => of([]))),
      purchase:  this.http.get<any[]>(`${this.api}/purchase-orders/`).pipe(catchError(() => of([]))),
      customers: this.http.get<any[]>(`${this.api}/customers/`).pipe(catchError(() => of([]))),
    }).subscribe(r => {
      this.salesOrders = r.sales;
      this.purchaseOrders = r.purchase;
      this.inventory = r.inventory;
      this.lowStockItems = r.inventory.filter((i: any) => i.quantity <= i.min_stock);

      const PAID_STATUSES = new Set(['paid','confirmed','picking','dispatched','delivered']);
      const totalRevenue = r.sales
        .filter((o: any) => PAID_STATUSES.has(o.status))
        .reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0);
      const totalCost = r.purchase
        .filter((o: any) => o.status === 'received')
        .reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0);

      this.kpis = [
        {
          label: 'Ingresos Ventas', value: `Bs. ${totalRevenue.toFixed(0)}`,
          sub: `${r.sales.filter((o:any)=>PAID_STATUSES.has(o.status)).length} órdenes pagadas`, icon: 'heroBanknotes',
          trend: r.sales.length > 0 ? 12 : 0, color: 'text-green-600', bg: 'bg-green-100',
        },
        {
          label: 'Costo Compras', value: `Bs. ${totalCost.toFixed(0)}`,
          sub: `${r.purchase.filter((o:any)=>o.status==='received').length} órdenes recibidas`, icon: 'heroShoppingCart',
          trend: r.purchase.length > 0 ? -5 : 0, color: 'text-blue-600', bg: 'bg-blue-100',
        },
        {
          label: 'Productos Activos', value: String(r.products.length),
          sub: `${r.suppliers.length} proveedores`, icon: 'heroCube',
          trend: 8, color: 'text-violet-600', bg: 'bg-violet-100',
        },
        {
          label: 'Clientes B2B', value: String(r.customers.length),
          sub: `${this.lowStockItems.length} alertas stock`, icon: 'heroUsers',
          trend: r.customers.length > 0 ? 4 : 0, color: 'text-amber-600', bg: 'bg-amber-100',
        },
      ];

      // Sales status breakdown
      const statusMap: Record<string, number> = {};
      r.sales.forEach((o: any) => { statusMap[o.status] = (statusMap[o.status] || 0) + 1; });
      const colors = ['#6366f1','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];
      this.salesStatusLegend = Object.entries(statusMap).map(([label, count], i) => ({
        label, count: count as number, color: colors[i % colors.length]
      }));

      this.dataLoaded = true;
      if (this.viewReady) this.buildCharts();
    });
  }

  private buildCharts() {
    this.buildDoughnut();
    this.buildBar();
  }

  private buildDoughnut() {
    if (!this.doughnutRef?.nativeElement || !this.salesStatusLegend.length) return;
    new Chart(this.doughnutRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.salesStatusLegend.map(s => s.label),
        datasets: [{
          data: this.salesStatusLegend.map(s => s.count),
          backgroundColor: this.salesStatusLegend.map(s => s.color),
          borderWidth: 0,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw} órdenes`
            }
          }
        },
      },
    } as ChartConfiguration<'doughnut'>);
  }

  private buildBar() {
    if (!this.barRef?.nativeElement || !this.purchaseOrders.length) return;
    const orders = this.purchaseOrders.slice(-10);
    new Chart(this.barRef.nativeElement, {
      type: 'bar',
      data: {
        labels: orders.map((o: any) => `#${o.id}`),
        datasets: [{
          label: 'Total (Bs.)',
          data: orders.map((o: any) => Number(o.total_amount || 0)),
          backgroundColor: orders.map((o: any) =>
            o.status === 'Received' ? '#22c55e' :
            o.status === 'Confirmed' ? '#6366f1' :
            o.status === 'In Transit' ? '#f59e0b' : '#cbd5e1'
          ),
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Bs. ${Number(ctx.raw).toFixed(2)}`
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: { font: { size: 11 }, callback: (v) => `Bs. ${v}` }
          },
        },
      },
    } as ChartConfiguration<'bar'>);
  }

  salesStatusClass(status: string): string {
    const m: Record<string, string> = {
      Pending:   'text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium',
      Approved:  'text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium',
      Delivered: 'text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium',
    };
    return m[status] || 'text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium';
  }
}
