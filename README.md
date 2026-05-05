# TUMOMITO — Frontend

Panel de administración ERP + tienda e-commerce pública. Construido con **Angular 19**, **Tailwind CSS v3** y **Chart.js**.

---

## Requisitos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 20 LTS |
| npm | 10 |
| Angular CLI | 19 |

Instalar Angular CLI globalmente (si no lo tenés):

```bash
npm install -g @angular/cli@19
```

---

## Instalación

```bash
# Clonar el repositorio y entrar al frontend
cd frontend

# Instalar dependencias
npm install
```

---

## Configuración

El archivo `src/environments/environment.ts` define la URL base de la API:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

Asegurate de que el backend FastAPI esté corriendo en `http://localhost:8000` antes de levantar el frontend. Ver instrucciones del backend en `../backend/`.

---

## Ejecución

```bash
# Servidor de desarrollo → http://localhost:4200
npm start

# Build de producción (salida en dist/)
npm run build

# Verificar tipos sin compilar
npx tsc --noEmit

# Ejecutar tests unitarios
npm test
```

---

## Dependencias principales

| Paquete | Uso |
|---|---|
| `@angular/core` v19 | Framework principal (standalone components) |
| `@angular/router` | Navegación SPA |
| `@angular/forms` | Formularios reactivos y template-driven |
| `@ng-icons/heroicons` | Iconografía (variante outline) |
| `chart.js` + `ng2-charts` | Gráficos en el dashboard |
| `rxjs` | Programación reactiva / BehaviorSubject |
| `tailwindcss` v3 | Estilos utilitarios |
| `@tailwindcss/forms` | Reset de estilos para inputs |

---

## Estructura de carpetas relevante

```
src/app/
  core/
    services/     # AuthService, CartService, OrdersService, etc.
    guards/       # authGuard
    interceptors/ # authInterceptor (adjunta JWT a cada request)
  features/
    admin/        # Panel ERP (rutas bajo ShellComponent + authGuard)
    store/        # Tienda pública (rutas bajo PublicShellComponent)
  shell/          # ShellComponent (admin) y PublicShellComponent (tienda)
  app.routes.ts   # Definición de todas las rutas
src/environments/
  environment.ts  # URL de la API
```

---

## Usuarios de prueba

Crear usuarios desde el backend con `python seed.py` (ver `../backend/`). El login se hace en `/login` con credenciales JWT.
