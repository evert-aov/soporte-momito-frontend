import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { CompanyService, CompanyInfo } from '../../core/services/company.service';

@Component({
  selector: 'app-company-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon],
  template: `
    <div class="space-y-6 max-w-3xl">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Mi Empresa</h1>
          <p class="text-sm text-gray-500 mt-0.5">Información de la empresa para facturas y documentos</p>
        </div>
      </div>

      <!-- Toast -->
      <div *ngIf="toast" [class]="'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ' +
        (toastType === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700')">
        <ng-icon [name]="toastType === 'success' ? 'heroCheckCircle' : 'heroExclamationCircle'" size="18" />
        {{ toast }}
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <p class="text-gray-400 text-sm">Cargando...</p>
      </div>

      <!-- Form -->
      <div *ngIf="!loading" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <ng-icon name="heroBuildingOffice2" class="text-blue-600" size="20" />
          </div>
          <div>
            <p class="font-semibold text-gray-900 text-sm">Datos de la empresa</p>
            <p class="text-xs text-gray-400">Se usan en las facturas generadas automáticamente</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <!-- Nombre -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Nombre comercial
            </label>
            <input type="text" [(ngModel)]="form.name" placeholder="TUMOMITO S.A."
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/>
          </div>

          <!-- Razón social -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Razón social
            </label>
            <input type="text" [(ngModel)]="form.legal_name" placeholder="TUMOMITO Sociedad Anónima"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/>
          </div>

          <!-- NIT -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              NIT / RUC
            </label>
            <input type="text" [(ngModel)]="form.tax_id" placeholder="123456789"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/>
          </div>

          <!-- Teléfono -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Teléfono
            </label>
            <input type="tel" [(ngModel)]="form.phone" placeholder="+591 2 000 0000"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Correo electrónico
            </label>
            <input type="email" [(ngModel)]="form.email" placeholder="info@tumomito.com"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/>
          </div>

          <!-- Sitio web -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Sitio web
            </label>
            <input type="url" [(ngModel)]="form.website" placeholder="https://tumomito.com"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/>
          </div>

          <!-- Dirección -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Dirección
            </label>
            <input type="text" [(ngModel)]="form.address" placeholder="Av. Principal 123, Zona Centro"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/>
          </div>

          <!-- Ciudad -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Ciudad
            </label>
            <input type="text" [(ngModel)]="form.city" placeholder="Santa Cruz de la Sierra"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/>
          </div>

          <!-- País -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              País
            </label>
            <input type="text" [(ngModel)]="form.country" placeholder="Bolivia"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/>
          </div>

          <!-- Logo URL -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              URL del logo
            </label>
            <input type="url" [(ngModel)]="form.logo_url" placeholder="https://cdn.tumomito.com/logo.png"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/>
            <p class="text-xs text-gray-400 mt-1">URL pública de la imagen del logo para mostrar en facturas.</p>
          </div>

        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button (click)="save()"
            [disabled]="saving"
            class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
            <ng-icon *ngIf="!saving" name="heroCheckCircle" size="16" />
            <span *ngIf="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ saving ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>
      </div>

    </div>
  `
})
export class CompanySettingsComponent implements OnInit {
  form: CompanyInfo = {};
  loading = false;
  saving = false;
  toast = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private svc: CompanyService) {}

  ngOnInit() {
    this.loading = true;
    this.svc.get().subscribe({
      next: (data) => {
        this.form = { ...data };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showToast('Error al cargar la información de la empresa.', 'error');
      }
    });
  }

  save() {
    this.saving = true;
    this.toast = '';
    this.svc.update(this.form).subscribe({
      next: (data) => {
        this.form = { ...data };
        this.saving = false;
        this.showToast('Información guardada correctamente.', 'success');
      },
      error: (err: any) => {
        this.saving = false;
        this.showToast(err?.error?.detail || 'Error al guardar. Intenta de nuevo.', 'error');
      }
    });
  }

  private showToast(msg: string, type: 'success' | 'error') {
    this.toast = msg;
    this.toastType = type;
    setTimeout(() => { this.toast = ''; }, 4000);
  }
}
