import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id?: number;
  full_name: string;
  email: string;
  role_id?: number | null;
  branch_id?: number | null;
  customer_id?: number | null;
  is_active: boolean;
  last_login?: string;
  password?: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]>           { return this.http.get<User[]>(`${this.api}/users/`); }
  getById(id: number): Observable<User>  { return this.http.get<User>(`${this.api}/users/${id}`); }
  create(u: User): Observable<User>      { return this.http.post<User>(`${this.api}/users/`, u); }
  update(id: number, u: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.api}/users/${id}`, u);
  }
  remove(id: number): Observable<any>    { return this.http.delete(`${this.api}/users/${id}`); }
  getRoles(): Observable<Role[]>         { return this.http.get<Role[]>(`${this.api}/roles/`); }
}
