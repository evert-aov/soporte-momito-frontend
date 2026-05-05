import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { UsersService, User, Role } from '../../core/services/users.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgIcon],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Usuarios del Sistema</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ users.length }} usuarios registrados</p>
        </div>
        <a routerLink="/users/new"
           class="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <ng-icon name="heroPlus" size="16"/> Nuevo Usuario
        </a>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="relative">
          <ng-icon name="heroMagnifyingGlass" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size="16"/>
          <input type="text" [(ngModel)]="search" placeholder="Buscar por nombre o email..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
      </div>

      <div *ngIf="loading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p class="text-gray-400 text-sm">Cargando usuarios...</p>
      </div>

      <div *ngIf="!loading" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Usuario</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rol</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Último acceso</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let u of filtered" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-blue-600 text-xs font-bold">{{ u.full_name[0] | uppercase }}</span>
                  </div>
                  <span class="font-medium text-gray-900">{{ u.full_name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-500">{{ u.email }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded text-xs bg-violet-100 text-violet-700 font-medium">
                  {{ roleName(u.role_id) }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <span [class]="u.is_active
                  ? 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700'
                  : 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700'">
                  {{ u.is_active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-400">
                {{ u.last_login ? (u.last_login | date:'dd/MM/yyyy HH:mm') : 'Nunca' }}
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <a [routerLink]="['/users/edit', u.id]"
                     class="inline-flex items-center gap-1 text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors font-medium">
                    <ng-icon name="heroPencil" size="12"/> Editar
                  </a>
                  <button (click)="toggle(u)"
                    [class]="'inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors font-medium ' +
                      (u.is_active ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50')">
                    <ng-icon [name]="u.is_active ? 'heroXMark' : 'heroCheck'" size="12"/>
                    {{ u.is_active ? 'Desactivar' : 'Activar' }}
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filtered.length === 0">
              <td colspan="6" class="px-4 py-12 text-center">
                <ng-icon name="heroUsers" class="text-gray-300 mx-auto mb-2" size="32"/>
                <p class="text-gray-400 text-sm">No se encontraron usuarios</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  loading = false;
  search = '';

  get filtered() {
    const q = this.search.toLowerCase();
    return q ? this.users.filter(u =>
      u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    ) : this.users;
  }

  constructor(private svc: UsersService) {}

  ngOnInit() {
    this.loading = true;
    this.svc.getRoles().subscribe({ next: r => this.roles = r });
    this.svc.getAll().subscribe({
      next: d => { this.users = d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  roleName(id?: number | null) {
    return this.roles.find(r => r.id === id)?.name || '—';
  }

  toggle(u: User) {
    this.svc.update(u.id!, { is_active: !u.is_active }).subscribe({
      next: updated => { u.is_active = updated.is_active; }
    });
  }
}
