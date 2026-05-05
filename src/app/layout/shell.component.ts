import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '../core/services/auth.service';

interface NavItem { label: string; icon: string; route: string; exact?: boolean; }

const ALL_NAV: (NavItem & { minRole: 'customer' | 'seller' | 'admin' })[] = [
  { label: 'Dashboard',          icon: 'heroChartBar',              route: '/dashboard',       exact: true, minRole: 'seller'   },
  { label: 'Productos',          icon: 'heroCube',                  route: '/products',                    minRole: 'seller'   },
  { label: 'Inventario',         icon: 'heroArchiveBox',            route: '/inventory',                   minRole: 'seller'   },
  { label: 'Proveedores',        icon: 'heroBuildingStorefront',    route: '/suppliers',                   minRole: 'seller'   },
  { label: 'Órdenes de Compra',  icon: 'heroShoppingCart',          route: '/purchase-orders',             minRole: 'seller'   },
  { label: 'Órdenes de Venta',   icon: 'heroClipboardDocumentList', route: '/sales-orders',                minRole: 'seller'   },
  { label: 'Categorías',         icon: 'heroTag',                   route: '/categories',                  minRole: 'seller'   },
  { label: 'Facturas',           icon: 'heroDocumentText',          route: '/invoices',                    minRole: 'customer' },
  { label: 'Envíos',             icon: 'heroTruck',                 route: '/shipments',                   minRole: 'seller'   },
  { label: 'Clientes B2B',       icon: 'heroUserGroup',             route: '/customers',                   minRole: 'admin'    },
  { label: 'Usuarios',           icon: 'heroUsers',                 route: '/users',                       minRole: 'admin'    },
  { label: 'Roles',              icon: 'heroShieldCheck',           route: '/roles',                       minRole: 'admin'    },
  { label: 'Config. Pagos',      icon: 'heroCreditCard',            route: '/payment-settings',            minRole: 'admin'    },
  { label: 'Mi Empresa',         icon: 'heroBuildingOffice2',       route: '/company',                     minRole: 'admin'    },
];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, NgIcon],
  template: `
    <div class="flex h-screen bg-gray-50 overflow-hidden">

      <!-- Sidebar -->
      <aside class="w-64 bg-slate-900 flex flex-col flex-shrink-0 shadow-xl">
        <!-- Brand -->
        <div class="flex items-center gap-3 px-5 py-4 border-b border-slate-700/60">
          <div class="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <span class="text-white font-black text-base tracking-tight">T</span>
          </div>
          <div>
            <p class="text-white font-bold text-sm leading-none">TUMOMITO</p>
            <p class="text-slate-400 text-xs mt-0.5">ERP & Portal B2B</p>
          </div>
        </div>

        <!-- Nav -->
        <nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p class="px-3 pt-1 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Navegación
          </p>
          <a *ngFor="let item of navItems"
             [routerLink]="item.route"
             routerLinkActive="bg-blue-600 text-white shadow-sm"
             [routerLinkActiveOptions]="{exact: !!item.exact}"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-150 text-sm font-medium group">
            <ng-icon [name]="item.icon" class="w-5 h-5 flex-shrink-0 opacity-80 group-hover:opacity-100" size="18" />
            {{ item.label }}
          </a>
        </nav>

        <!-- Ir a la tienda -->
        <div class="px-3 pb-2">
          <a routerLink="/store"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm font-medium group border border-slate-700/50">
            <ng-icon name="heroShoppingBag" size="18" class="flex-shrink-0 opacity-80 group-hover:opacity-100"/>
            Ir a la Tienda
          </a>
        </div>

        <!-- User footer -->
        <div class="px-3 py-3 border-t border-slate-700/60">
          <div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/60 mb-2">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {{ userInitials }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white text-xs font-semibold truncate">{{ userName }}</p>
              <p class="text-slate-400 text-[11px] truncate">{{ userRoleLabel }}</p>
            </div>
          </div>
          <button (click)="logout()"
            class="w-full flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg text-sm transition-colors">
            <ng-icon name="heroArrowRightOnRectangle" size="16" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <!-- Main -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Topbar -->
        <header class="h-14 bg-white border-b border-gray-200 flex items-center px-6 flex-shrink-0 shadow-sm">
          <div class="flex items-center gap-2 text-gray-500">
            <ng-icon name="heroHome" size="15" class="text-gray-400" />
            <span class="text-gray-300 text-sm">/</span>
            <span class="text-gray-700 text-sm font-medium">{{ currentTitle }}</span>
          </div>
          <div class="ml-auto flex items-center gap-3">
            <span class="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
              TUMOMITO ERP v1.0
            </span>
          </div>
        </header>

        <main class="flex-1 overflow-y-auto p-6 bg-gray-50">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class ShellComponent {
  get navItems(): NavItem[] {
    if (this.auth.isAdmin()) return ALL_NAV;
    if (this.auth.isSellerOrAbove()) return ALL_NAV.filter(n => n.minRole !== 'admin');
    return ALL_NAV.filter(n => n.minRole === 'customer');
  }

  get userInitials(): string {
    const name = this.auth.getUserInfo()?.full_name ?? '';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
  }

  get userName(): string {
    return this.auth.getUserInfo()?.full_name ?? 'Usuario';
  }

  get userRoleLabel(): string {
    const role = this.auth.getRole();
    const map: Record<string, string> = {
      super_admin: 'Super Admin',
      vendedor: 'Vendedor',
      cliente: 'Cliente',
    };
    return map[role] ?? role ?? 'Usuario';
  }

  get currentTitle(): string {
    const map: Record<string, string> = {
      dashboard: 'Dashboard', products: 'Productos', inventory: 'Inventario',
      suppliers: 'Proveedores', 'purchase-orders': 'Órdenes de Compra',
      'sales-orders': 'Órdenes de Venta', categories: 'Categorías',
      customers: 'Clientes B2B', invoices: 'Facturas', shipments: 'Envíos',
      users: 'Usuarios', roles: 'Roles', 'payment-settings': 'Configuración de Pagos',
      company: 'Mi Empresa',
    };
    return map[location.pathname.split('/')[1]] || 'ERP';
  }

  constructor(private auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
