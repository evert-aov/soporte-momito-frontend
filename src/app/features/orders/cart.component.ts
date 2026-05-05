import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex items-center gap-3 mb-8">
        <a routerLink="/store" class="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1">
          ← Seguir comprando
        </a>
        <h1 class="text-2xl font-bold text-gray-900">Carrito de compras</h1>
      </div>

      <ng-container *ngIf="(items$ | async) as items">

        <!-- Carrito vacío -->
        <div *ngIf="items.length === 0" class="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <svg class="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <p class="text-gray-500 font-medium mb-4">Tu carrito está vacío</p>
          <a routerLink="/store"
            class="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
            Ver productos
          </a>
        </div>

        <!-- Carrito con productos -->
        <div *ngIf="items.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Lista de items -->
          <div class="lg:col-span-2 space-y-3">
            <div *ngFor="let item of items"
              class="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:border-gray-200 transition-colors">

              <!-- Imagen -->
              <div class="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img *ngIf="item.image_url" [src]="item.image_url" [alt]="item.name"
                  class="w-full h-full object-cover" (error)="item.image_url = undefined"/>
                <svg *ngIf="!item.image_url" class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 text-sm truncate">{{ item.name }}</p>
                <p class="text-xs text-gray-400">Bs. {{ item.unit_price | number:'1.2-2' }} / unidad</p>
              </div>

              <!-- Cantidad -->
              <div class="flex items-center gap-2 flex-shrink-0">
                <button (click)="dec(item)"
                  class="w-8 h-8 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold flex items-center justify-center transition-colors text-lg">
                  −
                </button>
                <span class="w-8 text-center font-semibold text-gray-900 text-sm">{{ item.quantity }}</span>
                <button (click)="inc(item)"
                  class="w-8 h-8 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold flex items-center justify-center transition-colors text-lg">
                  +
                </button>
              </div>

              <!-- Subtotal -->
              <p class="font-bold text-gray-900 text-sm w-24 text-right flex-shrink-0">
                Bs. {{ (item.unit_price * item.quantity) | number:'1.2-2' }}
              </p>

              <!-- Eliminar -->
              <button (click)="remove(item.product_id)"
                class="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 ml-1">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Limpiar carrito -->
            <div class="text-right">
              <button (click)="clear()" class="text-xs text-gray-400 hover:text-red-500 transition-colors">
                Vaciar carrito
              </button>
            </div>
          </div>

          <!-- Resumen y checkout -->
          <div class="space-y-4">
            <div class="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 class="font-bold text-gray-900 mb-4">Resumen del pedido</h2>

              <div class="space-y-2 text-sm mb-4">
                <div class="flex justify-between text-gray-600">
                  <span>{{ items.length }} producto{{ items.length !== 1 ? 's' : '' }}</span>
                  <span>Bs. {{ subtotal(items) | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-gray-400 text-xs">
                  <span>Envío</span>
                  <span>A coordinar</span>
                </div>
                <div class="border-t pt-3 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span class="text-blue-600">Bs. {{ subtotal(items) | number:'1.2-2' }}</span>
                </div>
              </div>

              <a routerLink="/checkout"
                class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                Proceder al pago →
              </a>

              <div class="mt-3 flex items-center justify-center gap-4 text-xs text-gray-400">
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  Pago seguro
                </span>
                <span>PayPal / QR</span>
              </div>
            </div>

            <a routerLink="/store"
              class="block text-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
              ← Seguir comprando
            </a>
          </div>
        </div>

      </ng-container>
    </div>
  `
})
export class CartComponent implements OnInit {
  items$!: Observable<CartItem[]>;

  constructor(private cart: CartService) {}

  ngOnInit() {
    this.items$ = this.cart.items$;
  }

  subtotal(items: CartItem[]): number {
    return items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  }

  inc(item: CartItem) { this.cart.setQty(item.product_id, item.quantity + 1); }
  dec(item: CartItem) { this.cart.setQty(item.product_id, item.quantity - 1); }
  remove(id: string) { this.cart.remove(id); }
  clear() { this.cart.clear(); }
}
