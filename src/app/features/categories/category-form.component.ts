import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { CategoriesService, Category } from '../../core/services/categories.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgIcon],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <a routerLink="/categories" class="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1">
          <ng-icon name="heroArrowRight" class="rotate-180" size="14"/> Volver
        </a>
        <div>
          <h1 class="text-xl font-bold text-gray-900">{{ isEdit ? 'Editar Categoría' : 'Nueva Categoría' }}</h1>
          <p class="text-sm text-gray-500 mt-0.5">Agrupa productos del catálogo</p>
        </div>
      </div>

      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
        <ng-icon name="heroExclamationTriangle" size="16"/> {{ error }}
      </div>

      <form (ngSubmit)="onSubmit()" class="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
            <input type="text" name="name" [(ngModel)]="form.name" required
              placeholder="Ej: Lácteos"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
            <textarea name="description" [(ngModel)]="form.description" rows="3"
              placeholder="Descripción opcional de la categoría..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <a routerLink="/categories" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">Cancelar</a>
          <button type="submit" [disabled]="saving"
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
            {{ saving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Categoría') }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class CategoryFormComponent implements OnInit {
  isEdit = false;
  saving = false;
  error = '';
  form: Partial<Category> = { name: '', description: '' };

  constructor(private svc: CategoriesService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.svc.getById(+id).subscribe({
        next: c => this.form = { ...c },
        error: () => this.error = 'No se pudo cargar la categoría'
      });
    }
  }

  onSubmit() {
    this.saving = true; this.error = '';
    const obs = this.isEdit
      ? this.svc.update(this.form.id!, this.form)
      : this.svc.create(this.form as Category);
    obs.subscribe({
      next: () => this.router.navigate(['/categories']),
      error: err => { this.error = err.error?.detail || 'Error al guardar'; this.saving = false; }
    });
  }
}
