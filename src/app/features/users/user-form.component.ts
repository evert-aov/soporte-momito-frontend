import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { UsersService, User, Role } from '../../core/services/users.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgIcon],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <a routerLink="/users" class="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1">
          <ng-icon name="heroArrowRight" class="rotate-180" size="14"/> Volver
        </a>
        <div>
          <h1 class="text-xl font-bold text-gray-900">{{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ isEdit ? 'Modifica los datos del usuario' : 'Crea un nuevo acceso al sistema' }}</p>
        </div>
      </div>

      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
        <ng-icon name="heroExclamationTriangle" size="16"/> {{ error }}
      </div>

      <form (ngSubmit)="onSubmit()" class="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo *</label>
            <input type="text" name="full_name" [(ngModel)]="form.full_name" required
              placeholder="Ej: Juan Pérez"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
            <input type="email" name="email" [(ngModel)]="form.email" required [disabled]="isEdit"
              placeholder="usuario@tumomito.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Contraseña {{ isEdit ? '(dejar vacío para no cambiar)' : '*' }}
            </label>
            <input type="password" name="password" [(ngModel)]="form.password" [required]="!isEdit"
              placeholder="••••••••"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Rol</label>
            <select name="role_id" [(ngModel)]="form.role_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option [value]="null">Sin rol asignado</option>
              <option *ngFor="let r of roles" [value]="r.id">{{ r.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Estado</label>
            <select name="is_active" [(ngModel)]="form.is_active"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option [ngValue]="true">Activo</option>
              <option [ngValue]="false">Inactivo</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <a routerLink="/users" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">Cancelar</a>
          <button type="submit" [disabled]="saving"
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
            {{ saving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Usuario') }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class UserFormComponent implements OnInit {
  isEdit = false;
  saving = false;
  error = '';
  roles: Role[] = [];
  form: Partial<User> = { full_name: '', email: '', is_active: true, role_id: null };

  constructor(private svc: UsersService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.svc.getRoles().subscribe({ next: r => this.roles = r });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.svc.getById(+id).subscribe({
        next: u => this.form = { ...u, password: '' },
        error: () => this.error = 'No se pudo cargar el usuario'
      });
    }
  }

  onSubmit() {
    this.saving = true; this.error = '';
    const payload: any = { ...this.form };
    if (this.isEdit && !payload.password) delete payload.password;

    const obs = this.isEdit
      ? this.svc.update(this.form.id!, payload)
      : this.svc.create(payload as User);

    obs.subscribe({
      next: () => this.router.navigate(['/users']),
      error: err => { this.error = err.error?.detail || 'Error al guardar'; this.saving = false; }
    });
  }
}
