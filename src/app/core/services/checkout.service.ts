import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CheckoutLine {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface CheckoutPayload {
  payment_method: 'paypal' | 'qr';
  guest_email?: string;
  customer_id?: number;
  source_channel?: string;
  total_discount?: number;
  delivery_type?: 'delivery' | 'pickup';
  contact_name?: string;
  contact_phone?: string;
  delivery_address?: string;
  lines: CheckoutLine[];
}

export interface CheckoutResult {
  order_id: number;
  status: string;
  total_amount: number;
  payment_method: string;
  paypal_approval_url?: string;
  qr_image_url?: string;
}

export interface PaymentSettings {
  id: number;
  paypal_email?: string;
  qr_image_url?: string;
}

export interface ConfirmManualResult {
  message: string;
  order_id: number;
  invoice_number: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  checkout(payload: CheckoutPayload): Observable<CheckoutResult> {
    return this.http.post<CheckoutResult>(`${this.api}/orders/checkout`, payload);
  }

  confirmPaypal(orderId: number, paypalOrderId: string): Observable<any> {
    return this.http.post(`${this.api}/orders/${orderId}/confirm-paypal`, { paypal_order_id: paypalOrderId });
  }

  confirmManual(orderId: number): Observable<ConfirmManualResult> {
    return this.http.post<ConfirmManualResult>(`${this.api}/orders/${orderId}/confirm-manual`, {});
  }

  getPaymentSettings(): Observable<PaymentSettings> {
    return this.http.get<PaymentSettings>(`${this.api}/admin/payment-settings`);
  }

  updatePaymentSettings(data: Partial<PaymentSettings>): Observable<PaymentSettings> {
    return this.http.put<PaymentSettings>(`${this.api}/admin/payment-settings`, data);
  }

  verifyPassword(password: string): Observable<{ valid: boolean; access_granted: boolean }> {
    return this.http.post<{ valid: boolean; access_granted: boolean }>(
      `${this.api}/admin/verify-password`, { password }
    );
  }
}
