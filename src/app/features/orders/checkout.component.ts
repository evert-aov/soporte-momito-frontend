import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService, CartItem } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AsyncPipe],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-8">

      <!-- Pantalla de éxito -->
      <div *ngIf="confirmed" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-lg mx-auto mt-8">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-1">¡Pedido registrado!</h2>
        <p class="text-gray-500 text-sm mb-1">Orden <span class="font-semibold text-gray-700">#{{ result!.order_id }}</span></p>

        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium mb-4"
          [class]="deliveryType === 'delivery'
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'">
          {{ deliveryType === 'delivery' ? '🚚 Envío a domicilio' : '🏬 Recojo en sucursal' }}
        </div>

        <p class="text-2xl font-bold text-blue-600 mb-6">Bs. {{ result!.total_amount | number:'1.2-2' }}</p>

        <ng-container *ngIf="result!.payment_method === 'paypal'">
          <p class="text-sm text-gray-600 mb-4">Haz clic para completar tu pago de forma segura en PayPal:</p>
          <a *ngIf="result!.paypal_approval_url" [href]="result!.paypal_approval_url"
            class="inline-flex items-center gap-3 bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold px-8 py-4 rounded-2xl transition-colors text-base shadow-lg">
            Pagar con PayPal
          </a>
          <p class="text-xs text-gray-400 mt-3">Serás redirigido a PayPal. Es 100% seguro.</p>
        </ng-container>

        <ng-container *ngIf="result!.payment_method === 'qr'">
          <p class="text-sm text-gray-700 font-medium mb-3">Realiza la transferencia escaneando el QR:</p>
          <img *ngIf="result!.qr_image_url" [src]="result!.qr_image_url" alt="QR Pago"
            class="mx-auto w-52 h-52 object-contain border-2 border-gray-200 rounded-2xl shadow p-2 mb-3"/>
          <div *ngIf="!result!.qr_image_url"
            class="w-52 h-52 mx-auto border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mb-3">
            <p class="text-xs text-gray-400 text-center px-4">QR no configurado.<br>Contacta al administrador.</p>
          </div>
          <div class="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-4 py-3 rounded-xl mt-2">
            Una vez realizada la transferencia, el administrador confirmará tu pago.
          </div>
        </ng-container>

        <div class="mt-6">
          <a routerLink="/store" class="text-sm text-blue-600 hover:underline">← Volver a la tienda</a>
        </div>
      </div>

      <!-- Formulario -->
      <ng-container *ngIf="!confirmed">
        <div class="flex items-center gap-3 mb-6">
          <a routerLink="/cart" class="text-gray-400 hover:text-gray-600 text-sm">← Volver al carrito</a>
          <h1 class="text-2xl font-bold text-gray-900">Finalizar compra</h1>
        </div>

        <ng-container *ngIf="(items$ | async) as items">

          <div *ngIf="items.length === 0" class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p class="text-gray-500 mb-4">Tu carrito está vacío</p>
            <a routerLink="/store" class="text-blue-600 hover:underline text-sm">Ver productos →</a>
          </div>

          <div *ngIf="items.length > 0" class="grid grid-cols-1 lg:grid-cols-5 gap-6">

            <!-- Columna izquierda -->
            <div class="lg:col-span-3 space-y-5">

              <!-- Paso 1: Datos personales -->
              <div class="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span class="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                  Datos personales
                </h2>

                <div *ngIf="loggedIn" class="mb-4 flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs px-3 py-2.5 rounded-lg">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  Sesión iniciada — datos precargados. Completa el teléfono para continuar.
                </div>

                <div class="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
                    <input type="text" [(ngModel)]="firstName" placeholder="Ej: Juan"
                      [class]="inputClass(firstName)"
                      class="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Apellido *</label>
                    <input type="text" [(ngModel)]="lastName" placeholder="Ej: Pérez"
                      [class]="inputClass(lastName)"
                      class="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico *</label>
                  <input type="email" [(ngModel)]="email" placeholder="tu@email.com"
                    [readOnly]="loggedIn"
                    [class]="(loggedIn ? 'bg-gray-50 text-gray-500 cursor-not-allowed ' : '') + inputClass(email)"
                    class="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Teléfono *</label>
                  <input type="tel" [(ngModel)]="phone" placeholder="Ej: +591 70000000"
                    [class]="inputClass(phone)"
                    class="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
              </div>

              <!-- Paso 2: Tipo de entrega + dirección -->
              <div class="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span class="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
                  Tipo de entrega
                </h2>

                <div class="grid grid-cols-2 gap-3 mb-4">

                  <!-- Envío -->
                  <label [class]="'flex flex-col items-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all text-center ' +
                    (deliveryType === 'delivery' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200')">
                    <input type="radio" name="delivery" value="delivery" [(ngModel)]="deliveryType" class="sr-only"/>
                    <div [class]="'w-12 h-12 rounded-xl flex items-center justify-center transition-colors ' +
                      (deliveryType === 'delivery' ? 'bg-blue-600' : 'bg-gray-100')">
                      <svg class="w-6 h-6" [class]="deliveryType === 'delivery' ? 'text-white' : 'text-gray-400'"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 text-sm">Envío a domicilio</p>
                      <p class="text-xs text-gray-400 mt-0.5">Recibe en tu dirección</p>
                    </div>
                  </label>

                  <!-- Recojo -->
                  <label [class]="'flex flex-col items-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all text-center ' +
                    (deliveryType === 'pickup' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-gray-200')">
                    <input type="radio" name="delivery" value="pickup" [(ngModel)]="deliveryType" class="sr-only"/>
                    <div [class]="'w-12 h-12 rounded-xl flex items-center justify-center transition-colors ' +
                      (deliveryType === 'pickup' ? 'bg-emerald-600' : 'bg-gray-100')">
                      <svg class="w-6 h-6" [class]="deliveryType === 'pickup' ? 'text-white' : 'text-gray-400'"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 text-sm">Recojo en sucursal</p>
                      <p class="text-xs text-gray-400 mt-0.5">Retira en nuestra tienda</p>
                    </div>
                  </label>

                </div>

                <!-- Dirección: requerida si envío, opcional si recojo -->
                <div *ngIf="deliveryType">
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Dirección de {{ deliveryType === 'delivery' ? 'envío' : 'referencia' }}
                    <span *ngIf="deliveryType === 'delivery'" class="text-red-500"> *</span>
                    <span *ngIf="deliveryType === 'pickup'" class="text-gray-400 font-normal text-xs ml-1">(opcional)</span>
                  </label>
                  <textarea [(ngModel)]="deliveryAddress" rows="2"
                    [placeholder]="deliveryType === 'delivery' ? 'Calle, número, zona, ciudad...' : 'Zona de referencia (opcional)'"
                    [class]="deliveryType === 'delivery' ? inputClass(deliveryAddress) : 'border-gray-200'"
                    class="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>

                  <div *ngIf="deliveryType === 'delivery'"
                    class="mt-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs px-3 py-2.5 rounded-lg">
                    El administrador coordinará el horario de entrega.
                  </div>
                  <div *ngIf="deliveryType === 'pickup'"
                    class="mt-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs px-3 py-2.5 rounded-lg">
                    Te avisaremos cuando tu pedido esté listo para recoger.
                  </div>
                </div>
              </div>

              <!-- Error -->
              <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                {{ error }}
              </div>
            </div>

            <!-- Columna derecha: resumen -->
            <div class="lg:col-span-2">
              <div class="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
                <h2 class="font-bold text-gray-900 mb-4">Tu pedido</h2>

                <div class="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                  <div *ngFor="let item of items" class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img *ngIf="item.image_url" [src]="item.image_url" [alt]="item.name" class="w-full h-full object-cover"/>
                      <svg *ngIf="!item.image_url" class="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-medium text-gray-900 truncate">{{ item.name }}</p>
                      <p class="text-xs text-gray-400">x{{ item.quantity }}</p>
                    </div>
                    <p class="text-xs font-semibold text-gray-900 flex-shrink-0">
                      Bs. {{ (item.unit_price * item.quantity) | number:'1.2-2' }}
                    </p>
                  </div>
                </div>

                <!-- Resumen selecciones -->
                <div class="border-t pt-3 space-y-1.5 text-xs text-gray-500 mb-3">
                  <div *ngIf="deliveryType" class="flex items-center gap-1.5"
                    [class]="deliveryType === 'delivery' ? 'text-blue-600' : 'text-emerald-600'">
                    <span>{{ deliveryType === 'delivery' ? '🚚' : '🏬' }}</span>
                    <span>{{ deliveryType === 'delivery' ? 'Envío a domicilio' : 'Recojo en sucursal' }}</span>
                  </div>
                  <div class="flex items-center gap-1.5 text-blue-600">
                    <span>💳</span>
                    <span>PayPal</span>
                  </div>
                </div>

                <div class="border-t pt-3 space-y-1 text-sm">
                  <div class="flex justify-between text-gray-500">
                    <span>Subtotal</span><span>Bs. {{ subtotal(items) | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between font-bold text-gray-900 text-base pt-1">
                    <span>Total</span>
                    <span class="text-blue-600">Bs. {{ subtotal(items) | number:'1.2-2' }}</span>
                  </div>
                </div>

                <button (click)="placeOrder(items)"
                  [disabled]="!canSubmit() || placing"
                  [class]="'w-full mt-4 py-3.5 rounded-xl font-bold text-sm transition-colors bg-[#0070ba] hover:bg-[#005ea6] text-white' +
                    (!canSubmit() || placing ? ' opacity-60 cursor-not-allowed' : '')">
                  <span *ngIf="!placing">{{ submitLabel() }}</span>
                  <span *ngIf="placing">Procesando...</span>
                </button>

                <p class="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  Pago 100% seguro
                </p>
              </div>
            </div>

          </div>
        </ng-container>
      </ng-container>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  items$!: Observable<CartItem[]>;

  // Datos personales
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  deliveryAddress = '';

  // Opciones
  deliveryType: 'delivery' | 'pickup' | '' = '';
  payMethod: 'paypal' = 'paypal';

  // Estado
  loggedIn = false;
  placing = false;
  error = '';
  confirmed = false;
  result: any = null;
  submitted = false;

  constructor(
    private cart: CartService,
    private svc: CheckoutService,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    this.items$ = this.cart.items$;
    this.loggedIn = this.auth.isLoggedIn();
    if (this.loggedIn) {
      this.auth.getMe().subscribe({
        next: user => {
          this.email = user.email;
          // Pre-fill name: split full_name on first space
          const parts = (user.full_name || '').trim().split(' ');
          this.firstName = parts[0] || '';
          this.lastName = parts.slice(1).join(' ') || '';
        },
        error: () => {}
      });
    }
  }

  inputClass(value: string): string {
    if (!this.submitted) return 'border-gray-200';
    return value.trim() ? 'border-gray-200' : 'border-red-400 bg-red-50';
  }

  canSubmit(): boolean {
    if (!this.firstName.trim() || !this.lastName.trim() || !this.email.trim() || !this.phone.trim()) return false;
    if (!this.deliveryType) return false;
    if (this.deliveryType === 'delivery' && !this.deliveryAddress.trim()) return false;
    return true;
  }

  submitLabel(): string {
    if (!this.firstName.trim() || !this.lastName.trim() || !this.email.trim() || !this.phone.trim())
      return 'Completa tus datos';
    if (!this.deliveryType) return 'Elige tipo de entrega';
    if (this.deliveryType === 'delivery' && !this.deliveryAddress.trim()) return 'Ingresa la dirección';
    return 'Pagar con PayPal';
  }

  subtotal(items: CartItem[]): number {
    return items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  }

  placeOrder(items: CartItem[]) {
    this.submitted = true;
    if (!this.canSubmit() || items.length === 0) return;
    this.placing = true;
    this.error = '';

    this.svc.checkout({
      payment_method: this.payMethod,
      guest_email: this.email,
      source_channel: 'ecommerce',
      delivery_type: this.deliveryType as 'delivery' | 'pickup',
      contact_name: `${this.firstName.trim()} ${this.lastName.trim()}`,
      contact_phone: this.phone,
      delivery_address: this.deliveryAddress || undefined,
      lines: items.map(i => ({ product_id: i.product_id, quantity: i.quantity, unit_price: i.unit_price })),
    }).subscribe({
      next: res => {
        this.placing = false;
        this.confirmed = true;
        this.result = res;
        this.cart.clear();
      },
      error: err => {
        this.placing = false;
        this.error = err.error?.detail || 'Error al procesar el pedido. Intenta de nuevo.';
      }
    });
  }
}
