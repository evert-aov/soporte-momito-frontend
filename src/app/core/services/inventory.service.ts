import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Paginated } from './orders.service';

export interface InventoryRecord {
  id: number;
  product_id: string;
  branch_id: number;
  quantity: number;
  min_stock: number;
  last_updated?: string;
}

export interface InventoryWithName extends InventoryRecord {
  product_name: string;
}

export interface InventoryPageParams {
  page?: number;
  pageSize?: number;
  search?: string;
  lowStock?: boolean;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) {}

  getInventory(p: InventoryPageParams = {}): Observable<Paginated<InventoryWithName>> {
    let params = new HttpParams()
      .set('page', p.page ?? 1)
      .set('page_size', p.pageSize ?? 20)
      .set('search', p.search ?? '');
    if (p.lowStock) params = params.set('low_stock', 'true');
    return this.http.get<Paginated<InventoryWithName>>(this.apiUrl, { params });
  }

  getInventoryById(id: number): Observable<InventoryRecord> {
    return this.http.get<InventoryRecord>(`${this.apiUrl}/${id}`);
  }

  createInventory(record: Partial<InventoryRecord>): Observable<InventoryRecord> {
    return this.http.post<InventoryRecord>(this.apiUrl, record);
  }

  updateInventory(id: number, record: Partial<InventoryRecord>): Observable<InventoryRecord> {
    return this.http.put<InventoryRecord>(`${this.apiUrl}/${id}`, record);
  }

  deleteInventory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
