import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { CheckoutService, PaymentSettings } from '../../core/services/checkout.service';

@Component({
  selector: 'app-payment-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Configuración de Pagos</h1>
        <p class="text-sm text-gray-500 mt-0.5">Gestiona las pasarelas de pago activas del sistema</p>
      </div>

      <!-- Modal contraseña -->
      <div *ngIf="!accessGranted" class="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div class="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ng-icon name="heroLockClosed" size="28" class="text-amber-600"/>
        </div>
        <h2 class="text-lg font-bold text-gray-900 mb-1">Zona Protegida</h2>
        <p class="text-sm text-gray-500 mb-6">
          Para acceder a la configuración de pagos debes verificar tu contraseña de SuperAdmin.
        </p>

        <div class="max-w-sm mx-auto space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5 text-left">Contraseña actual</label>
            <input [type]="showPwd ? 'text' : 'password'" [(ngModel)]="password"
              (keydown.enter)="verifyPassword()"
              placeholder="••••••••"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          <div *ngIf="authError" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
            <ng-icon name="heroExclamationTriangle" size="14"/> {{ authError }}
          </div>

          <div class="flex gap-3">
            <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" [(ngModel)]="showPwd" class="rounded"/> Mostrar contraseña
            </label>
          </div>

          <button (click)="verifyPassword()" [disabled]="verifying || !password"
            class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-colors">
            {{ verifying ? 'Verificando...' : 'Verificar y Acceder' }}
          </button>
        </div>
      </div>

      <!-- Configuración visible tras verificación -->
      <ng-container *ngIf="accessGranted">
        <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <ng-icon name="heroShieldCheck" size="16"/> Acceso verificado — sesión activa
        </div>

        <!-- PayPal -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span class="text-blue-700 font-black text-sm">PP</span>
            </div>
            <div>
              <p class="font-semibold text-gray-900">PayPal</p>
              <p class="text-xs text-gray-500">Configura el correo receptor de pagos PayPal</p>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Correo PayPal del negocio</label>
            <input type="email" [(ngModel)]="form.paypal_email"
              placeholder="pagos@tumomito.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>

        <!-- QR -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ng-icon name="heroQrCode" class="text-green-700" size="20"/>
            </div>
            <div>
              <p class="font-semibold text-gray-900">Código QR de Transferencia</p>
              <p class="text-xs text-gray-500">URL de la imagen del QR bancario</p>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">URL de imagen QR</label>
            <input type="url" [(ngModel)]="form.qr_image_url"
              placeholder="https://cdn.tumomito.com/qr/pago.png"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div *ngIf="form.qr_image_url" class="mt-2">
            <p class="text-xs text-gray-500 mb-2">Vista previa:</p>
            <img [src]="form.qr_image_url" alt="QR Preview"
              class="w-32 h-32 object-contain border border-gray-200 rounded-xl"
              (error)="qrPreviewError = true"
              (load)="qrPreviewError = false"/>
            <p *ngIf="qrPreviewError" class="text-xs text-red-500 mt-1">No se pudo cargar la imagen</p>
          </div>
        </div>

        <!-- Error/Success -->
        <div *ngIf="saveError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <ng-icon name="heroExclamationTriangle" size="16"/> {{ saveError }}
        </div>
        <div *ngIf="saveSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <ng-icon name="heroCheckCircle" size="16"/> Configuración guardada correctamente
        </div>

        <div class="flex justify-end">
          <button (click)="save()" [disabled]="saving"
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
            {{ saving ? 'Guardando...' : 'Guardar Configuración' }}
          </button>
        </div>
      </ng-container>
    </div>
  `
})
export class PaymentSettingsComponent implements OnInit {
  accessGranted = false;
  password = '';
  showPwd = false;
  verifying = false;
  authError = '';

  form: Partial<PaymentSettings> = { paypal_email: '', qr_image_url: '' };
  saving = false;
  saveError = '';
  saveSuccess = false;
  qrPreviewError = false;

  constructor(private svc: CheckoutService) {}

  ngOnInit() {
    this.svc.getPaymentSettings().subscribe({
      next: s => { this.form = { paypal_email: s.paypal_email || '', qr_image_url: s.qr_image_url || '' }; }
    });
  }

  verifyPassword() {
    if (!this.password) return;
    this.verifying = true; this.authError = '';
    this.svc.verifyPassword(this.password).subscribe({
      next: res => {
        this.verifying = false;
        if (res.access_granted) {
          this.accessGranted = true;
          this.password = '';
        } else {
          this.authError = 'Contraseña incorrecta o permisos insuficientes';
        }
      },
      error: () => { this.verifying = false; this.authError = 'Error al verificar contraseña'; }
    });
  }

  save() {
    this.saving = true; this.saveError = ''; this.saveSuccess = false;
    this.svc.updatePaymentSettings(this.form).subscribe({
      next: () => { this.saving = false; this.saveSuccess = true; setTimeout(() => this.saveSuccess = false, 4000); },
      error: err => { this.saving = false; this.saveError = err.error?.detail || 'Error al guardar'; }
    });
  }
}
