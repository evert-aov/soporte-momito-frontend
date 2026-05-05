import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Supplier {
  id?: number;
  name: string;
  company_id?: number;
  country_of_origin?: string;
  email?: string;
}

export interface Category {
  id?: number;
  name: string;
  parent_id?: number;
}

@Injectable({ providedIn: 'root' })
export class SuppliersService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.api}/suppliers/`);
  }

  createSupplier(s: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(`${this.api}/suppliers/`, s);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/categories/`);
  }

  createCategory(c: Category): Observable<Category> {
    return this.http.post<Category>(`${this.api}/categories/`, c);
  }
}
