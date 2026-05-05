import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-cancel',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-lg mx-auto px-4 py-16 text-center">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
        <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h1 class="text-xl font-bold text-gray-900 mb-2">Pago cancelado</h1>
        <p class="text-gray-500 text-sm mb-6">
          Cancelaste el pago en PayPal. Tu pedido no fue confirmado.<br>
          Puedes intentarlo de nuevo cuando quieras.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a routerLink="/cart" class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
            Volver al carrito
          </a>
          <a routerLink="/store" class="inline-flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors text-sm">
            Ver productos
          </a>
        </div>
      </div>
    </div>
  `
})
export class CheckoutCancelComponent {}
