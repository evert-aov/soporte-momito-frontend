import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideIcons } from '@ng-icons/core';
import {
  heroHome, heroChartBar, heroCube, heroArchiveBox, heroUsers,
  heroTruck, heroShoppingCart, heroClipboardDocumentList,
  heroArrowRightOnRectangle, heroBars3, heroPlus, heroPencil,
  heroTrash, heroXMark, heroCheck, heroArrowTrendingUp,
  heroArrowTrendingDown, heroBanknotes, heroChartPie,
  heroExclamationTriangle, heroBuildingStorefront, heroTag,
  heroBell, heroMagnifyingGlass, heroEye, heroCog6Tooth,
  heroCheckCircle, heroUserGroup, heroDocumentText, heroShieldCheck,
  heroArrowRight, heroCreditCard, heroLockClosed, heroQrCode,
  heroEnvelope, heroArrowTopRightOnSquare,
} from '@ng-icons/heroicons/outline';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideIcons({
      heroHome, heroChartBar, heroCube, heroArchiveBox, heroUsers,
      heroTruck, heroShoppingCart, heroClipboardDocumentList,
      heroArrowRightOnRectangle, heroBars3, heroPlus, heroPencil,
      heroTrash, heroXMark, heroCheck, heroArrowTrendingUp,
      heroArrowTrendingDown, heroBanknotes, heroChartPie,
      heroExclamationTriangle, heroBuildingStorefront, heroTag,
      heroBell, heroMagnifyingGlass, heroEye, heroCog6Tooth,
      heroCheckCircle, heroUserGroup, heroDocumentText, heroShieldCheck,
      heroArrowRight, heroCreditCard, heroLockClosed, heroQrCode,
      heroEnvelope, heroArrowTopRightOnSquare,
    }),
  ]
};
