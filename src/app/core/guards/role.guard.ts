import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const sellerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);
  if (auth.isSellerOrAbove()) return true;
  return router.createUrlTree(['/invoices']);
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);
  if (auth.isAdmin()) return true;
  return auth.isSellerOrAbove()
    ? router.createUrlTree(['/dashboard'])
    : router.createUrlTree(['/invoices']);
};
