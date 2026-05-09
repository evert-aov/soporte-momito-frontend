import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Paginated } from '../../core/services/orders.service';

export interface Product {
  id: string;
  name: string;
  default_code?: string;
  type?: string;
  list_price?: number;
  standard_price?: number;
  active: boolean;
  image_url?: string;
  category_id?: number;
  uom_id?: number;
  uom_po_id?: number;
  purchase_ok?: boolean;
  sale_ok?: boolean;
  taxes_id?: number;
  supplier_taxes_id?: number;
}

export interface ProductPageParams {
  page?: number;
  pageSize?: number;
  search?: string;
  lowStock?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(p: ProductPageParams = {}): Observable<Paginated<Product>> {
    let params = new HttpParams()
      .set('page', p.page ?? 1)
      .set('page_size', p.pageSize ?? 20)
      .set('search', p.search ?? '');
    if (p.lowStock) params = params.set('low_stock', 'true');
    return this.http.get<Paginated<Product>>(this.apiUrl, { params });
  }

  getAllProducts(): Observable<Product[]> {
    return this.getProducts({ page: 1, pageSize: 500 }).pipe(map(r => r.items));
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
