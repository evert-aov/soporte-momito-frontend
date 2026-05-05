import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
            ERP & Portal<br/>B2B Empresarial
          </h2>
          <p class="text-slate-400 text-lg">
            Gestión de inventario, pedidos y clientes en un solo lugar.
          </p>
          <div class="mt-10 grid grid-cols-2 gap-4">
            <div class="bg-slate-800 rounded-xl p-4">
              <p class="text-blue-400 text-2xl font-bold">+500</p>
              <p class="text-slate-400 text-sm mt-1">Productos gestionados</p>
            </div>
            <div class="bg-slate-800 rounded-xl p-4">
              <p class="text-blue-400 text-2xl font-bold">B2B</p>
              <p class="text-slate-400 text-sm mt-1">Portal de clientes</p>
            </div>
          </div>
        </div>
        <p class="text-slate-600 text-sm">© 2026 TUMOMITO S.A. Todos los derechos reservados.</p>
      </div>

      <!-- Right panel -->
      <div class="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div class="w-full max-w-md">
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
            <p class="text-gray-500 mt-1 text-sm">Ingresa tus credenciales para continuar</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                [(ngModel)]="credentials.email"
                placeholder="admin@tumomito.com"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                [(ngModel)]="credentials.password"
                placeholder="••••••••"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>

            <div *ngIf="errorMessage"
                 class="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <span>⚠️</span> {{ errorMessage }}
            </div>

            <button
              type="submit"
              [disabled]="isLoading"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors">
              {{ isLoading ? 'Verificando...' : 'Ingresar al sistema' }}
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-500">
            ¿No tienes cuenta?
            <a routerLink="/register" class="text-blue-600 hover:text-blue-700 font-medium">Regístrate</a>
          </p>

          <div class="mt-3 text-center">
            <a routerLink="/store" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Ir a la tienda
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  credentials = { email: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.authService.isSellerOrAbove() ? '/dashboard' : '/invoices']);
    }
  }

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate([this.authService.isSellerOrAbove() ? '/dashboard' : '/invoices']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail || 'Credenciales incorrectas';
      }
    });
  }
}
