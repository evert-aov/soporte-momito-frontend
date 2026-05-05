import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { UsersService, Role } from '../../core/services/users.service';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgIcon],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Roles del Sistema</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ roles.length }} roles configurados</p>
        </div>
        <a routerLink="/roles/new"
           class="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <ng-icon name="heroPlus" size="16"/> Nuevo Rol
        </a>
      </div>

      <div *ngIf="loading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p class="text-gray-400 text-sm">Cargando roles...</p>
      </div>

      <div *ngIf="!loading" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rol</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Descripción</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let r of roles" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ng-icon name="heroShieldCheck" class="text-violet-600" size="14"/>
                  </div>
                  <span class="font-medium text-gray-900">{{ r.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-500 text-xs">{{ r.description || '—' }}</td>
              <td class="px-4 py-3 text-right">
                <a [routerLink]="['/roles/edit', r.id]"
                   class="inline-flex items-center gap-1 text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors font-medium">
                  <ng-icon name="heroPencil" size="12"/> Editar
                </a>
              </td>
            </tr>
            <tr *ngIf="roles.length === 0">
              <td colspan="3" class="px-4 py-12 text-center">
                <ng-icon name="heroShieldCheck" class="text-gray-300 mx-auto mb-2" size="32"/>
                <p class="text-gray-400 text-sm">No hay roles configurados</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class RolesListComponent implements OnInit {
  roles: Role[] = [];
  loading = false;

  constructor(private svc: UsersService) {}

  ngOnInit() {
    this.loading = true;
    this.svc.getRoles().subscribe({
      next: d => { this.roles = d; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
