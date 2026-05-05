import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { CustomersService, Customer } from '../../core/services/customers.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgIcon],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <a routerLink="/customers" class="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1">
          <ng-icon name="heroArrowRight" class="rotate-180" size="14"/> Volver
        </a>
        <div>
          <h1 class="text-xl font-bold text-gray-900">{{ isEdit ? 'Editar Cliente' : 'Nuevo Cliente B2B' }}</h1>
          <p class="text-sm text-gray-500 mt-0.5">Información comercial y crediticia del cliente</p>
        </div>
      </div>

      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
        <ng-icon name="heroExclamationTriangle" size="16"/> {{ error }}
      </div>

      <form (ngSubmit)="onSubmit()" class="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Información Legal</p>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre Comercial</label>
            <input type="text" name="commercial_name" [(ngModel)]="form.commercial_name"
              placeholder="Ej: Distribuidora El Sol"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Razón Social</label>
            <input type="text" name="legal_name" [(ngModel)]="form.legal_name"
              placeholder="Ej: Distribuidora El Sol S.R.L."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">NIT / RUT</label>
            <input type="text" name="tax_id" [(ngModel)]="form.tax_id"
              placeholder="Ej: 123456789"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Segmento</label>
            <select name="segment" [(ngModel)]="form.segment"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar segmento</option>
              <option value="Supermarket">Supermercado</option>
              <option value="Mini Market">Mini Market</option>
              <option value="Kiosk">Kiosk</option>
              <option value="Distributor">Distribuidor</option>
            </select>
          </div>
        </div>

        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Condiciones Comerciales</p>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Límite de Crédito (Bs.)</label>
            <input type="number" name="credit_limit" [(ngModel)]="form.credit_limit" min="0" step="0.01"
              placeholder="0.00"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Perfil de Precios</label>
            <select name="pricing_profile" [(ngModel)]="form.pricing_profile"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option [value]="null">Sin perfil</option>
              <option [value]="1">Nivel 1 — Precio público</option>
              <option [value]="2">Nivel 2 — Mayorista</option>
              <option [value]="3">Nivel 3 — Distribuidor</option>
            </select>
          </div>
        </div>

        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Contacto y Entrega</p>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
            <input type="text" name="phone" [(ngModel)]="form.phone"
              placeholder="+591 7xxxxxxx"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Dirección de Entrega</label>
            <input type="text" name="delivery_address" [(ngModel)]="form.delivery_address"
              placeholder="Av. Principal #123, Santa Cruz"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <a routerLink="/customers" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">Cancelar</a>
          <button type="submit" [disabled]="saving"
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
            {{ saving ? 'Guardando...' : (isEdit ? 'Actualizar Cliente' : 'Crear Cliente') }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class CustomerFormComponent implements OnInit {
  isEdit = false;
  saving = false;
  error = '';
  form: Partial<Customer> = {};

  constructor(private svc: CustomersService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.svc.getById(+id).subscribe({
        next: c => this.form = { ...c },
        error: () => this.error = 'No se pudo cargar el cliente'
      });
    }
  }

  onSubmit() {
    this.saving = true; this.error = '';
    const obs = this.isEdit ? this.svc.update(this.form.id!, this.form) : this.svc.create(this.form as Customer);
    obs.subscribe({
      next: () => this.router.navigate(['/customers']),
      error: err => { this.error = err.error?.detail || 'Error al guardar'; this.saving = false; }
    });
  }
}
