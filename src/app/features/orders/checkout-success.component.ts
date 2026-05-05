import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CheckoutService } from '../../core/services/checkout.service';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-lg mx-auto px-4 py-16 text-center">

      <!-- Cargando -->
      <div *ngIf="state === 'loading'" class="space-y-4">
        <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <p class="text-gray-500 text-sm">Confirmando tu pago con PayPal...</p>
      </div>

      <!-- Éxito -->
      <div *ngIf="state === 'success'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">¡Pago confirmado!</h1>
        <p class="text-gray-500 text-sm mb-1">Orden <span class="font-semibold text-gray-700">#{{ orderId }}</span></p>
        <p *ngIf="invoiceNumber" class="text-gray-500 text-sm mb-6">
          Factura: <span class="font-mono font-semibold text-green-700">{{ invoiceNumber }}</span>
        </p>
        <p class="text-xs text-gray-400 mb-6">Tu pago fue procesado exitosamente. Recibirás tu pedido pronto.</p>
        <a routerLink="/store" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
          ← Volver a la tienda
        </a>
      </div>

      <!-- Error -->
      <div *ngIf="state === 'error'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <h1 class="text-xl font-bold text-gray-900 mb-2">Error al confirmar el pago</h1>
        <p class="text-gray-500 text-sm mb-6">{{ errorMsg }}</p>
        <a routerLink="/store" class="text-sm text-blue-600 hover:underline">← Volver a la tienda</a>
      </div>

    </div>
  `
})
export class CheckoutSuccessComponent implements OnInit {
  state: 'loading' | 'success' | 'error' = 'loading';
  orderId: number | null = null;
  invoiceNumber: string | null = null;
  errorMsg = 'No se pudo confirmar el pago. Contacta al administrador.';

  constructor(private route: ActivatedRoute, private svc: CheckoutService) {}

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    // PayPal returns: ?token=PAYPAL_ORDER_ID&PayerID=XXX&order_id=OUR_ORDER_ID
    const orderId = Number(params['order_id']);
    const paypalToken = params['token']; // PayPal order ID

    if (!orderId || !paypalToken) {
      this.state = 'error';
      this.errorMsg = 'Parámetros de pago inválidos.';
      return;
    }

    this.orderId = orderId;
    this.svc.confirmPaypal(orderId, paypalToken).subscribe({
      next: (res: any) => {
        this.invoiceNumber = res.invoice_number || null;
        this.state = 'success';
      },
      error: (err: any) => {
        this.errorMsg = err.error?.detail || 'No se pudo confirmar el pago.';
        this.state = 'error';
      }
    });
  }
}
