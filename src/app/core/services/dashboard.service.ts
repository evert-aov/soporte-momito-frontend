import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderStatusCount {
  status: string;
  count: number;
}

export interface TopProduct {
  product_id: string;
  product_name: string;
  units_sold: number;
  revenue: number;
}

export interface SalesOrderBrief {
  id: number;
  customer_id: number | null;
  total_amount: number;
  status: string;
  order_date: string | null;
}

export interface PurchaseOrderBrief {
  id: number;
  supplier_id: number | null;
  total_amount: number;
  status: string;
  issue_date: string | null;
}

export interface LowStockItem {
  product_id: string;
  product_name: string;
  quantity: number;
  min_stock: number;
}

export interface DashboardSummary {
  monthly_revenue: number;
  monthly_orders_count: number;
  pending_orders_count: number;
  active_products_count: number;
  customers_count: number;
  low_stock_count: number;
  sales_by_status: OrderStatusCount[];
  top_products: TopProduct[];
  recent_sales: SalesOrderBrief[];
  recent_purchases: PurchaseOrderBrief[];
  low_stock_items: LowStockItem[];
}

export interface SalesChartPoint {
  month: string;
  revenue: number;
  order_count: number;
}

export interface SalesHistoryResponse {
  data: SalesChartPoint[];
}

export interface PredictionPoint {
  month: string;
  predicted_revenue: number;
  lower_bound: number;
  upper_bound: number;
}

export interface PredictionsResponse {
  predictions: PredictionPoint[];
  model_info: string;
  history_months: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private base = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.base}/summary`);
  }

  getSalesHistory(): Observable<SalesHistoryResponse> {
    return this.http.get<SalesHistoryResponse>(`${this.base}/sales-history`);
  }

  getPredictions(): Observable<PredictionsResponse> {
    return this.http.get<PredictionsResponse>(`${this.base}/predictions`);
  }
}
