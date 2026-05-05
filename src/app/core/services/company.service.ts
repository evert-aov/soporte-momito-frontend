import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CompanyInfo {
  id?: number;
  name?: string;
  legal_name?: string;
  tax_id?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  get(): Observable<CompanyInfo> {
    return this.http.get<CompanyInfo>(`${this.api}/admin/company-info`);
  }

  update(data: Partial<CompanyInfo>): Observable<CompanyInfo> {
    return this.http.put<CompanyInfo>(`${this.api}/admin/company-info`, data);
  }
}
