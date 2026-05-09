import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Paginated } from './orders.service';

export interface Invoice {
  id?: number;
  sales_order_id: number;
  invoice_number: string;
  issue_date?: string;
  total_amount?: number;
  payment_status?: string;
  xml_file_url?: string;
  html_file_path?: string;
}

export interface Shipment {
  id?: number;
  sales_order_id: number;
  carrier?: string;
  tracking_number?: string;
  dispatch_date?: string;
  estimated_delivery_date?: string;
  delivery_status?: string;
}

@Injectable({ providedIn: 'root' })
export class InvoicesService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAll(page = 1, pageSize = 20, search = ''): Observable<Paginated<Invoice>> {
    const params = new HttpParams().set('page', page).set('page_size', pageSize).set('search', search);
    return this.http.get<Paginated<Invoice>>(`${this.api}/invoices/`, { params });
  }
  getById(id: number): Observable<Invoice>      { return this.http.get<Invoice>(`${this.api}/invoices/${id}`); }
  create(i: Partial<Invoice>): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.api}/invoices/`, i);
  }
}

@Injectable({ providedIn: 'root' })
export class ShipmentsService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAll(page = 1, pageSize = 20, search = '', status = ''): Observable<Paginated<Shipment>> {
    const params = new HttpParams().set('page', page).set('page_size', pageSize).set('search', search).set('status', status);
    return this.http.get<Paginated<Shipment>>(`${this.api}/shipments/`, { params });
  }
  getById(id: number): Observable<Shipment>      { return this.http.get<Shipment>(`${this.api}/shipments/${id}`); }
  create(s: Partial<Shipment>): Observable<Shipment> {
    return this.http.post<Shipment>(`${this.api}/shipments/`, s);
  }
}
