import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex">
      <!-- Left panel -->
      <div class="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-lg">T</span>
          </div>
          <span class="text-white font-bold text-xl">TUMOMITO S.A.</span>
        </div>
        <div>
          <h2 class="text-4xl font-bold text-white leading-snug mb-4">
            Portal B2B<br/>para Empresas
          </h2>
          <p class="text-slate-400 text-lg">
            Crea tu cuenta y accede a precios exclusivos, seguimiento de pedidos y facturación en línea.
          </p>
          <div class="mt-10 grid grid-cols-2 gap-4">
            <div class="bg-slate-800 rounded-xl p-4">
              <p class="text-blue-400 text-2xl font-bold">B2B</p>
              <p class="text-slate-400 text-sm mt-1">Precios mayoristas</p>
            </div>
            <div class="bg-slate-800 rounded-xl p-4">
              <p class="text-blue-400 text-2xl font-bold">24/7</p>
              <p class="text-slate-400 text-sm mt-1">Pedidos en línea</p>
            </div>
          </div>
        </div>
        <p class="text-slate-600 text-sm">© 2026 TUMOMITO S.A. Todos los derechos reservados.</p>
      </div>

      <!-- Right panel -->
      <div class="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div class="w-full max-w-md">
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Crear cuenta</h1>
            <p class="text-gray-500 mt-1 text-sm">Regístrate para acceder al portal de clientes</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo</label>
              <input type="text" name="full_name" [(ngModel)]="form.full_name" required
                placeholder="Empresa o nombre completo"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
              <input type="email" name="email" [(ngModel)]="form.email" required
                placeholder="empresa@ejemplo.com"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <input type="password" name="password" [(ngModel)]="form.password" required
                placeholder="Mínimo 6 caracteres"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Confirmar contraseña</label>
              <input type="password" name="confirm" [(ngModel)]="confirm" required
                placeholder="Repite tu contraseña"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"/>
            </div>

            <div *ngIf="errorMessage"
                 class="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <span>⚠️</span> {{ errorMessage }}
            </div>

            <button type="submit" [disabled]="isLoading"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors">
              {{ isLoading ? 'Creando cuenta...' : 'Crear cuenta' }}
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?
            <a routerLink="/login" class="text-blue-600 hover:text-blue-700 font-medium">Inicia sesión</a>
          </p>

          <div class="mt-3 text-center">
            <a routerLink="/store" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Volver a la tienda
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  form = { full_name: '', email: '', password: '' };
  confirm = '';
  isLoading = false;
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate([this.auth.isSellerOrAbove() ? '/dashboard' : '/invoices']);
    }
  }

  onSubmit() {
    this.errorMessage = '';
    if (!this.form.full_name || !this.form.email || !this.form.password) {
      this.errorMessage = 'Completa todos los campos';
      return;
    }
    if (this.form.password !== this.confirm) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }
    if (this.form.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }
    this.isLoading = true;
    this.auth.register(this.form).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/invoices']);
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail || 'Error al crear la cuenta';
      }
    });
  }
}
