import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface InventoryRecord {
  id: number;
  product_id: string;
  branch_id: number;
  quantity: number;
  min_stock: number;
  last_updated?: string;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) {}

  getInventory(): Observable<InventoryRecord[]> {
    return this.http.get<InventoryRecord[]>(this.apiUrl);
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
