import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from './product.service';
import { SuppliersService, Category } from '../../core/services/suppliers.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <a routerLink="/products" class="text-gray-400 hover:text-gray-600">
          ← Volver
        </a>
        <div>
          <h1 class="text-xl font-bold text-gray-900">{{ isEdit ? 'Editar Producto' : 'Nuevo Producto' }}</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ isEdit ? 'Modifica los datos del producto' : 'Completa el formulario para agregar un producto' }}</p>
        </div>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <!-- Form -->
      <form (ngSubmit)="onSubmit()" class="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">ID del Producto *</label>
            <input type="text" name="id" [(ngModel)]="form.id" [disabled]="isEdit" required
              placeholder="PROD001"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Código SKU</label>
            <input type="text" name="default_code" [(ngModel)]="form.default_code"
              placeholder="SKU-001"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
          <input type="text" name="name" [(ngModel)]="form.name" required
            placeholder="Nombre del producto"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Tipo</label>
            <select name="type" [(ngModel)]="form.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar tipo</option>
              <option value="Storable">Almacenable</option>
              <option value="Consumable">Consumible</option>
              <option value="Service">Servicio</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Categoría</label>
            <select name="category_id" [(ngModel)]="form.category_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option [value]="null">Sin categoría</option>
              <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Precio de Lista (Bs.)</label>
            <input type="number" name="list_price" [(ngModel)]="form.list_price" min="0" step="0.01"
              placeholder="0.00"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Precio Costo (Bs.)</label>
            <input type="number" name="standard_price" [(ngModel)]="form.standard_price" min="0" step="0.01"
              placeholder="0.00"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">URL de Imagen</label>
          <input type="url" name="image_url" [(ngModel)]="form.image_url"
            placeholder="https://..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        <div class="flex items-center gap-6 pt-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="sale_ok" [(ngModel)]="form.sale_ok"
              class="w-4 h-4 text-blue-600 rounded"/>
            <span class="text-sm text-gray-700">Se puede vender</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="purchase_ok" [(ngModel)]="form.purchase_ok"
              class="w-4 h-4 text-blue-600 rounded"/>
            <span class="text-sm text-gray-700">Se puede comprar</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="active" [(ngModel)]="form.active"
              class="w-4 h-4 text-blue-600 rounded"/>
            <span class="text-sm text-gray-700">Activo</span>
          </label>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <a routerLink="/products"
             class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">
            Cancelar
          </a>
          <button type="submit" [disabled]="saving"
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
            {{ saving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Producto') }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  isEdit = false;
  saving = false;
  error = '';
  categories: Category[] = [];

  form: Partial<Product> = {
    id: '', default_code: '', name: '', type: '',
    list_price: 0, standard_price: 0, image_url: '',
    active: true, sale_ok: true, purchase_ok: true,
    category_id: undefined
  };

  constructor(
    private svc: ProductService,
    private suppSvc: SuppliersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.suppSvc.getCategories().subscribe({ next: (c) => this.categories = c });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.svc.getProduct(id).subscribe({
        next: (p) => this.form = { ...p },
        error: () => this.error = 'No se pudo cargar el producto'
      });
    }
  }

  onSubmit() {
    this.saving = true;
    this.error = '';

    const obs = this.isEdit
      ? this.svc.updateProduct(this.form.id!, this.form)
      : this.svc.createProduct(this.form as Product);

    obs.subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => {
        this.error = err.error?.detail || 'Error al guardar el producto';
        this.saving = false;
      }
    });
  }
}
