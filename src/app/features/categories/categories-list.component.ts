import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { CategoriesService, Category } from '../../core/services/categories.service';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgIcon],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Categorías</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ categories.length }} categorías registradas</p>
        </div>
        <a routerLink="/categories/new"
           class="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <ng-icon name="heroPlus" size="16"/> Nueva Categoría
        </a>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="relative">
          <ng-icon name="heroMagnifyingGlass" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size="16"/>
          <input type="text" [(ngModel)]="search" placeholder="Buscar por nombre..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
      </div>

      <div *ngIf="loading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p class="text-gray-400 text-sm">Cargando categorías...</p>
      </div>

      <div *ngIf="!loading" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Descripción</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let c of filtered" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ng-icon name="heroTag" class="text-orange-600" size="14"/>
                  </div>
                  <span class="font-medium text-gray-900">{{ c.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-500 text-xs">{{ c.description || '—' }}</td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <a [routerLink]="['/categories/edit', c.id]"
                     class="inline-flex items-center gap-1 text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors font-medium">
                    <ng-icon name="heroPencil" size="12"/> Editar
                  </a>
                  <button (click)="remove(c)"
                    class="inline-flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition-colors font-medium">
                    <ng-icon name="heroTrash" size="12"/> Eliminar
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filtered.length === 0">
              <td colspan="3" class="px-4 py-12 text-center">
                <ng-icon name="heroTag" class="text-gray-300 mx-auto mb-2" size="32"/>
                <p class="text-gray-400 text-sm">No se encontraron categorías</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  search = '';

  get filtered() {
    const q = this.search.toLowerCase();
    return q ? this.categories.filter(c => c.name.toLowerCase().includes(q)) : this.categories;
  }

  constructor(private svc: CategoriesService) {}

  ngOnInit() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: d => { this.categories = d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  remove(c: Category) {
    if (!confirm(`¿Eliminar la categoría "${c.name}"?`)) return;
    this.svc.remove(c.id!).subscribe({
      next: () => this.categories = this.categories.filter(x => x.id !== c.id)
    });
  }
}
