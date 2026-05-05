import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Category {
  id?: number;
  name: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]>                { return this.http.get<Category[]>(`${this.api}/categories/`); }
  getById(id: number): Observable<Category>       { return this.http.get<Category>(`${this.api}/categories/${id}`); }
  create(c: Category): Observable<Category>       { return this.http.post<Category>(`${this.api}/categories/`, c); }
  update(id: number, c: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.api}/categories/${id}`, c);
  }
  remove(id: number): Observable<any>             { return this.http.delete(`${this.api}/categories/${id}`); }
}
