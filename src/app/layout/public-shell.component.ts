import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';
import { CartService } from '../core/services/cart.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-public-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, AsyncPipe],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Navbar -->
      <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a routerLink="/store" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-black text-sm">T</span>
            </div>
            <span class="font-bold text-gray-900 text-lg">TUMOMITO</span>
            <span class="text-xs text-gray-400 hidden sm:inline ml-1">Tienda B2B</span>
          </a>

          <nav class="flex items-center gap-5">
            <a routerLink="/store" routerLinkActive="text-blue-600 font-semibold"
               class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Productos
            </a>

            <a routerLink="/cart" class="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              Carrito
              <span *ngIf="(cartCount$ | async)! > 0"
                class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {{ cartCount$ | async }}
              </span>
            </a>

            <!-- Si está logueado: ir al dashboard; si no: ir al login -->
            <a *ngIf="isLoggedIn()" routerLink="/dashboard"
               class="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Dashboard ↗
            </a>
            <a *ngIf="!isLoggedIn()" routerLink="/login"
               class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Admin ↗
            </a>
          </nav>
        </div>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="border-t border-gray-200 bg-white py-6 mt-12">
        <p class="text-center text-xs text-gray-400">© 2025 TUMOMITO S.A. — Todos los derechos reservados</p>
      </footer>
    </div>
  `
})
export class PublicShellComponent {
  cartCount$: Observable<number>;

  constructor(private cart: CartService, private auth: AuthService) {
    this.cartCount$ = cart.items$.pipe(
      map(items => items.reduce((s, i) => s + i.quantity, 0))
    );
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
}
