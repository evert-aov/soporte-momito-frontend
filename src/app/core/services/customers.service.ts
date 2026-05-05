import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Customer {
  id?: number;
  segment?: string;
  commercial_name?: string;
  legal_name?: string;
  tax_id?: string;
  credit_limit?: number;
  pricing_profile?: number;
  phone?: string;
  delivery_address?: string;
  registration_date?: string;
}

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Customer[]>               { return this.http.get<Customer[]>(`${this.api}/customers/`); }
  getById(id: number): Observable<Customer>      { return this.http.get<Customer>(`${this.api}/customers/${id}`); }
  create(c: Customer): Observable<Customer>      { return this.http.post<Customer>(`${this.api}/customers/`, c); }
  update(id: number, c: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.api}/customers/${id}`, c);
  }
}
