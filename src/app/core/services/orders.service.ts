import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SalesOrderLine {
  id?: number;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal?: number;
}

export interface SalesOrder {
  id?: number;
  customer_id?: number | null;
  user_id?: number;
  order_date?: string;
  status?: string;
  subtotal?: number;
  total_discount?: number;
  total_amount?: number;
  payment_terms?: string;
  source_channel?: string;
  payment_method?: string;
  paypal_order_id?: string;
  guest_email?: string;
  lines?: SalesOrderLine[];
}

export interface PurchaseOrderLine {
  id?: number;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal?: number;
}

export interface PurchaseOrder {
  id?: number;
  supplier_id: number;
  user_id?: number;
  issue_date?: string;
  estimated_arrival_date?: string;
  status?: string;
  total_amount?: number;
  lines?: PurchaseOrderLine[];
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // ── Sales Orders ────────────────────────────────────────────────────────────
  getSalesOrders(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(`${this.base}/sales-orders/`);
  }
  getSalesOrder(id: number): Observable<SalesOrder> {
    return this.http.get<SalesOrder>(`${this.base}/sales-orders/${id}`);
  }
  createSalesOrder(order: Partial<SalesOrder>): Observable<SalesOrder> {
    return this.http.post<SalesOrder>(`${this.base}/sales-orders/`, order);
  }
  confirmSalesOrder(id: number): Observable<SalesOrder> {
    return this.http.post<SalesOrder>(`${this.base}/sales-orders/${id}/confirm`, {});
  }
  markSalesOrderPaid(id: number): Observable<{ order: SalesOrder; invoice_number: string; status: string }> {
    return this.http.post<any>(`${this.base}/sales-orders/${id}/mark-paid`, {});
  }
  advanceSalesOrder(id: number): Observable<SalesOrder> {
    return this.http.post<SalesOrder>(`${this.base}/sales-orders/${id}/advance`, {});
  }
  cancelSalesOrder(id: number): Observable<SalesOrder> {
    return this.http.post<SalesOrder>(`${this.base}/sales-orders/${id}/cancel`, {});
  }

  // ── Purchase Orders ─────────────────────────────────────────────────────────
  getPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.base}/purchase-orders/`);
  }
  getPurchaseOrder(id: number): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.base}/purchase-orders/${id}`);
  }
  createPurchaseOrder(order: Partial<PurchaseOrder>): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.base}/purchase-orders/`, order);
  }
  confirmPurchaseOrder(id: number): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.base}/purchase-orders/${id}/confirm`, {});
  }
  receivePurchaseOrder(id: number): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.base}/purchase-orders/${id}/receive`, {});
  }
  cancelPurchaseOrder(id: number): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.base}/purchase-orders/${id}/cancel`, {});
  }
}
