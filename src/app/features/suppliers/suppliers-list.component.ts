import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuppliersService, Supplier, Category } from '../../core/services/suppliers.service';

@Component({
  selector: 'app-suppliers-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Proveedores y Categorías</h1>
        <p class="text-sm text-gray-500 mt-0.5">Gestiona tus proveedores y categorías de productos</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Suppliers -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-semibold text-gray-800">Proveedores</h2>
            <button (click)="showSupForm = !showSupForm"
              class="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors">
              + Nuevo
            </button>
          </div>

          <!-- New supplier form -->
          <div *ngIf="showSupForm" class="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
            <h3 class="text-sm font-semibold text-blue-900">Nuevo Proveedor</h3>
            <input type="text" [(ngModel)]="newSup.name" placeholder="Nombre *"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <div class="grid grid-cols-2 gap-2">
              <input type="text" [(ngModel)]="newSup.country_of_origin" placeholder="País de origen"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <input type="email" [(ngModel)]="newSup.email" placeholder="Email"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div class="flex gap-2 justify-end">
              <button (click)="showSupForm = false" class="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5">Cancelar</button>
              <button (click)="createSupplier()"
                class="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded-lg">
                Guardar
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                  <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">País</th>
                  <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Email</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr *ngFor="let s of suppliers" class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium text-gray-900">{{ s.name }}</td>
                  <td class="px-4 py-3 text-gray-500 text-xs">{{ s.country_of_origin || '—' }}</td>
                  <td class="px-4 py-3 text-gray-500 text-xs">{{ s.email || '—' }}</td>
                </tr>
                <tr *ngIf="suppliers.length === 0">
                  <td colspan="3" class="px-4 py-8 text-center text-gray-400 text-sm">Sin proveedores</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Categories -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-semibold text-gray-800">Categorías</h2>
            <button (click)="showCatForm = !showCatForm"
              class="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors">
              + Nueva
            </button>
          </div>

          <!-- New category form -->
          <div *ngIf="showCatForm" class="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
            <h3 class="text-sm font-semibold text-blue-900">Nueva Categoría</h3>
            <input type="text" [(ngModel)]="newCat.name" placeholder="Nombre *"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <select [(ngModel)]="newCat.parent_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option [value]="null">Sin categoría padre</option>
              <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
            </select>
            <div class="flex gap-2 justify-end">
              <button (click)="showCatForm = false" class="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5">Cancelar</button>
              <button (click)="createCategory()"
                class="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded-lg">
                Guardar
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                  <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Categoría padre</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr *ngFor="let c of categories" class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium text-gray-900">{{ c.name }}</td>
                  <td class="px-4 py-3 text-gray-500 text-sm">
                    {{ c.parent_id ? catName(c.parent_id) : '—' }}
                  </td>
                </tr>
                <tr *ngIf="categories.length === 0">
                  <td colspan="2" class="px-4 py-8 text-center text-gray-400 text-sm">Sin categorías</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `
})
export class SuppliersListComponent implements OnInit {
  suppliers: Supplier[] = [];
  categories: Category[] = [];
  showSupForm = false;
  showCatForm = false;
  newSup: Supplier = { name: '' };
  newCat: Category = { name: '' };

  constructor(private svc: SuppliersService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.getSuppliers().subscribe({ next: (d) => this.suppliers = d });
    this.svc.getCategories().subscribe({ next: (d) => this.categories = d });
  }

  createSupplier() {
    if (!this.newSup.name) return;
    this.svc.createSupplier(this.newSup).subscribe({
      next: (s) => { this.suppliers.push(s); this.newSup = { name: '' }; this.showSupForm = false; }
    });
  }

  createCategory() {
    if (!this.newCat.name) return;
    this.svc.createCategory(this.newCat).subscribe({
      next: (c) => { this.categories.push(c); this.newCat = { name: '' }; this.showCatForm = false; }
    });
  }

  catName(id: number): string {
    return this.categories.find(c => c.id === id)?.name || String(id);
  }
}
