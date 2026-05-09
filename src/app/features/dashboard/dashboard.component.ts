import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  Chart,
  DoughnutController, ArcElement,
  BarController, BarElement,
  LineController, LineElement, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler,
  ChartConfiguration,
} from 'chart.js';
import {
  DashboardService,
  DashboardSummary,
  SalesChartPoint,
  PredictionPoint,
} from '../../core/services/dashboard.service';

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

      <!-- Sales history + predictions chart (full width) -->
      <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <ng-icon name="heroChartBar" class="text-indigo-500" size="18" />
            <h2 class="text-sm font-semibold text-gray-800">Historial de Ventas y Predicción</h2>
          </div>
          <div *ngIf="predictionInfo" class="text-[11px] text-gray-400 italic">{{ predictionInfo }}</div>
        </div>
        <div class="h-56">
          <canvas #lineChart></canvas>
        </div>
        <div class="flex items-center gap-6 mt-3">
          <div class="flex items-center gap-1.5 text-xs text-gray-500">
            <span class="w-6 h-0.5 bg-indigo-500 inline-block rounded"></span>Histórico
          </div>
          <div class="flex items-center gap-1.5 text-xs text-gray-500">
            <span class="w-6 h-0.5 bg-amber-400 inline-block rounded border-dashed border border-amber-400"></span>Predicción (próx. 3 meses)
          </div>
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
            <div *ngIf="!salesStatusLegend.length"
                 class="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
              Sin datos
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <div *ngFor="let item of salesStatusLegend"
                 class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-sm flex-shrink-0" [style.background]="item.color"></span>
                <span class="text-gray-600">{{ item.status }}</span>
              </div>
              <span class="font-semibold text-gray-800">{{ item.count }}</span>
            </div>
          </div>
        </div>

        <!-- Recent purchase orders — Bar chart -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm lg:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <ng-icon name="heroChartBar" class="text-violet-500" size="18" />
              <h2 class="text-sm font-semibold text-gray-800">Órdenes de Compra — Monto por orden</h2>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-3 text-[10px] text-gray-500">
                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-sm bg-slate-300 inline-block"></span>Borrador</span>
                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-sm bg-indigo-400 inline-block"></span>Confirmada</span>
                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block"></span>Recibida</span>
              </div>
              <a routerLink="/purchase-orders" class="text-xs text-blue-600 hover:underline font-medium">
                Ver todas →
              </a>
            </div>
          </div>
          <div class="relative h-44">
            <canvas #barChart></canvas>
            <div *ngIf="summary && !summary.recent_purchases?.length"
                 class="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
              Sin órdenes de compra registradas
            </div>
          </div>
        </div>
      </div>

      <!-- Top products -->
      <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <ng-icon name="heroStar" class="text-amber-500" size="18" />
          <h2 class="text-sm font-semibold text-gray-800">Top 5 Productos más Vendidos</h2>
        </div>
        <div *ngIf="!summary?.top_products?.length"
             class="py-6 text-center text-sm text-gray-400">Sin datos de ventas</div>
        <div *ngIf="summary?.top_products?.length" class="divide-y divide-gray-50">
          <div *ngFor="let p of summary!.top_products; let i = index"
               class="flex items-center gap-4 py-2.5">
            <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
              {{ i + 1 }}
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-gray-800 truncate">{{ p.product_name }}</p>
              <p class="text-[11px] text-gray-400">{{ p.units_sold }} unidades</p>
            </div>
            <span class="text-xs font-bold text-gray-700">Bs. {{ p.revenue | number:'1.0-0' }}</span>
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
          <div *ngIf="!summary?.low_stock_items?.length"
               class="flex flex-col items-center justify-center py-8 text-center">
            <ng-icon name="heroCheckCircle" class="text-green-400 mb-2" size="32" />
            <p class="text-sm text-gray-500">Stock en niveles óptimos</p>
          </div>
          <div *ngIf="summary?.low_stock_items?.length" class="space-y-2">
            <div *ngFor="let item of summary!.low_stock_items"
                 class="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
              <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ng-icon name="heroArchiveBox" class="text-red-500" size="16" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-800 truncate">{{ item.product_name }}</p>
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
          <div *ngIf="!summary?.recent_sales?.length"
               class="py-8 text-center text-sm text-gray-400">Sin ventas registradas</div>
          <div *ngIf="summary?.recent_sales?.length" class="space-y-2">
            <div *ngFor="let o of summary!.recent_sales"
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
                  <p class="text-[11px] text-gray-400">
                    {{ o.order_date ? (o.order_date | date:'dd/MM/yy') : 'Sin fecha' }}
                  </p>
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
  @ViewChild('barChart')      barRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart')     lineRef!: ElementRef<HTMLCanvasElement>;

  summary: DashboardSummary | null = null;
  kpis: KPI[] = [];
  salesStatusLegend: { status: string; color: string; count: number }[] = [];
  predictionInfo = '';

  private history: SalesChartPoint[] = [];
  private predictions: PredictionPoint[] = [];

  private dataLoaded = false;
  private viewReady = false;

  constructor(private dashboardSvc: DashboardService) {}

  ngAfterViewInit() {
    this.viewReady = true;
    if (this.dataLoaded) this.buildCharts();
  }

  ngOnInit() {
    forkJoin({
      summary:     this.dashboardSvc.getSummary().pipe(catchError(() => of(null))),
      history:     this.dashboardSvc.getSalesHistory().pipe(catchError(() => of({ data: [] }))),
      predictions: this.dashboardSvc.getPredictions().pipe(catchError(() => of({ predictions: [], model_info: '', history_months: 0 }))),
    }).subscribe(r => {
      if (r.summary) {
        this.summary = r.summary;
        this.buildKpis(r.summary);
        this.salesStatusLegend = this.buildStatusLegend(r.summary);
      }

      this.history     = r.history?.data ?? [];
      this.predictions = r.predictions?.predictions ?? [];
      this.predictionInfo = r.predictions?.model_info ?? '';

      this.dataLoaded = true;
      if (this.viewReady) this.buildCharts();
    });
  }

  private buildKpis(s: DashboardSummary): void {
    this.kpis = [
      {
        label: 'Ingresos del Mes', value: `Bs. ${s.monthly_revenue.toFixed(0)}`,
        sub: `${s.monthly_orders_count} órdenes pagadas`,
        icon: 'heroBanknotes', trend: 12, color: 'text-green-600', bg: 'bg-green-100',
      },
      {
        label: 'Órdenes Pendientes', value: String(s.pending_orders_count),
        sub: 'en espera de pago',
        icon: 'heroClockSolid', trend: s.pending_orders_count > 0 ? -3 : 0,
        color: 'text-blue-600', bg: 'bg-blue-100',
      },
      {
        label: 'Productos Activos', value: String(s.active_products_count),
        sub: `${s.low_stock_count} alertas de stock`,
        icon: 'heroCube', trend: 8, color: 'text-violet-600', bg: 'bg-violet-100',
      },
      {
        label: 'Clientes B2B', value: String(s.customers_count),
        sub: `${s.low_stock_count} alertas stock`,
        icon: 'heroUsers', trend: s.customers_count > 0 ? 4 : 0,
        color: 'text-amber-600', bg: 'bg-amber-100',
      },
    ];
  }

  private buildStatusLegend(s: DashboardSummary) {
    const colors = ['#6366f1','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#64748b'];
    return s.sales_by_status.map((row, i) => ({
      status: row.status,
      count: row.count,
      color: colors[i % colors.length],
    }));
  }

  private buildCharts() {
    this.buildLine();
    this.buildDoughnut();
    this.buildBar();
  }

  private buildLine() {
    if (!this.lineRef?.nativeElement) return;

    const histLabels  = this.history.map(p => p.month);
    const histValues  = this.history.map(p => p.revenue);
    const predLabels  = this.predictions.map(p => p.month);
    const predValues  = this.predictions.map(p => p.predicted_revenue);
    const upperValues = this.predictions.map(p => p.upper_bound);
    const lowerValues = this.predictions.map(p => p.lower_bound);

    // Pad historical dataset with nulls for prediction months
    const predNulls  = new Array(predLabels.length).fill(null);
    // Pad predicted dataset with nulls for historical months (minus 1 overlap point)
    const histNulls  = new Array(Math.max(0, histLabels.length - 1)).fill(null);
    const lastHist   = histValues.length ? histValues[histValues.length - 1] : null;

    const allLabels = [...histLabels, ...predLabels];

    new Chart(this.lineRef.nativeElement, {
      type: 'line',
      data: {
        labels: allLabels,
        datasets: [
          {
            label: 'Histórico',
            data: [...histValues, ...predNulls],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.08)',
            borderWidth: 2,
            pointRadius: 3,
            tension: 0.3,
            fill: true,
          },
          {
            label: 'Predicción',
            data: [...histNulls, lastHist, ...predValues],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.08)',
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 4,
            pointBackgroundColor: '#f59e0b',
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Límite superior',
            data: [...new Array(histLabels.length).fill(null), ...upperValues],
            borderColor: 'rgba(245,158,11,0.25)',
            backgroundColor: 'rgba(245,158,11,0.08)',
            borderWidth: 1,
            borderDash: [3, 3],
            pointRadius: 0,
            fill: '+1',
            tension: 0.3,
          },
          {
            label: 'Límite inferior',
            data: [...new Array(histLabels.length).fill(null), ...lowerValues],
            borderColor: 'rgba(245,158,11,0.25)',
            backgroundColor: 'rgba(245,158,11,0.08)',
            borderWidth: 1,
            borderDash: [3, 3],
            pointRadius: 0,
            fill: false,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: Bs. ${Number(ctx.raw ?? 0).toFixed(0)}`
            }
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 45 } },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: { font: { size: 11 }, callback: (v) => `Bs. ${v}` },
          },
        },
      },
    } as ChartConfiguration<'line'>);
  }

  private buildDoughnut() {
    if (!this.doughnutRef?.nativeElement || !this.salesStatusLegend.length) return;
    new Chart(this.doughnutRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.salesStatusLegend.map(s => s.status),
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
          },
        },
      },
    } as ChartConfiguration<'doughnut'>);
  }

  private buildBar() {
    const orders = this.summary?.recent_purchases ?? [];
    if (!this.barRef?.nativeElement || !orders.length) return;
    const STATUS_COLOR: Record<string, string> = {
      received:  '#34d399',
      confirmed: '#818cf8',
      draft:     '#cbd5e1',
      cancelled: '#fca5a5',
    };
    const STATUS_LABEL: Record<string, string> = {
      received:  'Recibida',
      confirmed: 'Confirmada',
      draft:     'Borrador',
      cancelled: 'Cancelada',
    };
    new Chart(this.barRef.nativeElement, {
      type: 'bar',
      data: {
        labels: orders.map(o => `#${o.id}`),
        datasets: [{
          label: 'Monto',
          data: orders.map(o => Number(o.total_amount) || 0),
          backgroundColor: orders.map(o => STATUS_COLOR[o.status] ?? '#94a3b8'),
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
              title: (items) => {
                const idx = items[0].dataIndex;
                const o = orders[idx];
                return `Orden #${o.id} — ${STATUS_LABEL[o.status] ?? o.status}`;
              },
              label: (ctx) => {
                const val = Number(ctx.raw ?? 0);
                return ` Bs. ${val.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              },
            }
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: {
              font: { size: 11 },
              callback: (v) => `Bs. ${Number(v).toLocaleString('es-BO', { maximumFractionDigits: 0 })}`,
            },
          },
        },
      },
    } as ChartConfiguration<'bar'>);
  }

  salesStatusClass(status: string): string {
    const m: Record<string, string> = {
      pending_payment: 'text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium',
      paid:            'text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium',
      confirmed:       'text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium',
      picking:         'text-[10px] px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium',
      dispatched:      'text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium',
      delivered:       'text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium',
      cancelled:       'text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-medium',
    };
    return m[status] ?? 'text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium';
  }
}
