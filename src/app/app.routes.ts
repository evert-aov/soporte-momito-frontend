import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { sellerGuard, adminGuard } from './core/guards/role.guard';
import { ShellComponent } from './layout/shell.component';
import { PublicShellComponent } from './layout/public-shell.component';

export const routes: Routes = [
  { path: '', redirectTo: '/store', pathMatch: 'full' },

  { path: 'login',    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },

  // ── Rutas públicas (e-commerce) ────────────────────────────────────────────
  {
    path: '',
    component: PublicShellComponent,
    children: [
      { path: 'store',             loadComponent: () => import('./features/orders/store.component').then(m => m.StoreComponent) },
      { path: 'cart',              loadComponent: () => import('./features/orders/cart.component').then(m => m.CartComponent) },
      { path: 'checkout',          loadComponent: () => import('./features/orders/checkout.component').then(m => m.CheckoutComponent) },
      { path: 'checkout/success',  loadComponent: () => import('./features/orders/checkout-success.component').then(m => m.CheckoutSuccessComponent) },
      { path: 'checkout/cancel',   loadComponent: () => import('./features/orders/checkout-cancel.component').then(m => m.CheckoutCancelComponent) },
    ]
  },

  // ── Rutas protegidas (admin/ERP) ───────────────────────────────────────────
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      // Acceso: vendedor o superior
      { path: 'dashboard',            canActivate: [sellerGuard], loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'products',             canActivate: [sellerGuard], loadComponent: () => import('./features/products/product-list.component').then(m => m.ProductListComponent) },
      { path: 'products/new',         canActivate: [sellerGuard], loadComponent: () => import('./features/products/product-form.component').then(m => m.ProductFormComponent) },
      { path: 'products/edit/:id',    canActivate: [sellerGuard], loadComponent: () => import('./features/products/product-form.component').then(m => m.ProductFormComponent) },
      { path: 'inventory',            canActivate: [sellerGuard], loadComponent: () => import('./features/inventory/inventory-list.component').then(m => m.InventoryListComponent) },
      { path: 'suppliers',            canActivate: [sellerGuard], loadComponent: () => import('./features/suppliers/suppliers-list.component').then(m => m.SuppliersListComponent) },
      { path: 'purchase-orders',      canActivate: [sellerGuard], loadComponent: () => import('./features/purchase-orders/purchase-orders-list.component').then(m => m.PurchaseOrdersListComponent) },
      { path: 'purchase-orders/new',  canActivate: [sellerGuard], loadComponent: () => import('./features/purchase-orders/purchase-order-form.component').then(m => m.PurchaseOrderFormComponent) },
      { path: 'sales-orders',         canActivate: [sellerGuard], loadComponent: () => import('./features/sales-orders/sales-orders-list.component').then(m => m.SalesOrdersListComponent) },
      { path: 'sales-orders/new',     canActivate: [sellerGuard], loadComponent: () => import('./features/sales-orders/sales-order-form.component').then(m => m.SalesOrderFormComponent) },
      { path: 'categories',           canActivate: [sellerGuard], loadComponent: () => import('./features/categories/categories-list.component').then(m => m.CategoriesListComponent) },
      { path: 'categories/new',       canActivate: [sellerGuard], loadComponent: () => import('./features/categories/category-form.component').then(m => m.CategoryFormComponent) },
      { path: 'categories/edit/:id',  canActivate: [sellerGuard], loadComponent: () => import('./features/categories/category-form.component').then(m => m.CategoryFormComponent) },
      { path: 'shipments',            canActivate: [sellerGuard], loadComponent: () => import('./features/shipments/shipments-list.component').then(m => m.ShipmentsListComponent) },
      { path: 'payment-settings',     canActivate: [sellerGuard], loadComponent: () => import('./features/orders/payment-settings.component').then(m => m.PaymentSettingsComponent) },
      { path: 'company',              canActivate: [sellerGuard], loadComponent: () => import('./features/company/company-settings.component').then(m => m.CompanySettingsComponent) },

      // Acceso: cualquier usuario autenticado (clientes ven solo sus facturas)
      { path: 'invoices',             loadComponent: () => import('./features/invoices/invoices-list.component').then(m => m.InvoicesListComponent) },
      { path: 'invoices/:id',         loadComponent: () => import('./features/invoices/invoice-detail.component').then(m => m.InvoiceDetailComponent) },

      // Acceso: solo admin
      { path: 'customers',            canActivate: [adminGuard], loadComponent: () => import('./features/customers/customers-list.component').then(m => m.CustomersListComponent) },
      { path: 'customers/new',        canActivate: [adminGuard], loadComponent: () => import('./features/customers/customer-form.component').then(m => m.CustomerFormComponent) },
      { path: 'customers/edit/:id',   canActivate: [adminGuard], loadComponent: () => import('./features/customers/customer-form.component').then(m => m.CustomerFormComponent) },
      { path: 'users',                canActivate: [adminGuard], loadComponent: () => import('./features/users/users-list.component').then(m => m.UsersListComponent) },
      { path: 'users/new',            canActivate: [adminGuard], loadComponent: () => import('./features/users/user-form.component').then(m => m.UserFormComponent) },
      { path: 'users/edit/:id',       canActivate: [adminGuard], loadComponent: () => import('./features/users/user-form.component').then(m => m.UserFormComponent) },
      { path: 'roles',                canActivate: [adminGuard], loadComponent: () => import('./features/roles/roles-list.component').then(m => m.RolesListComponent) },
      { path: 'roles/new',            canActivate: [adminGuard], loadComponent: () => import('./features/roles/role-form.component').then(m => m.RoleFormComponent) },
      { path: 'roles/edit/:id',       canActivate: [adminGuard], loadComponent: () => import('./features/roles/role-form.component').then(m => m.RoleFormComponent) },
    ]
  },

  { path: '**', redirectTo: '/store' }
];
