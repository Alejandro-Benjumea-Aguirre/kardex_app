# Kardex CO — Frontend

Sistema de gestión de inventario y finanzas para pequeñas y medianas empresas. Permite registrar ventas, compras y productos, visualizar reportes financieros y controlar el inventario con soporte para múltiples roles de usuario.

---

## Tabla de contenido

- [Stack tecnológico](#stack-tecnológico)
- [Dependencias de producción](#dependencias-de-producción)
- [Dependencias de desarrollo](#dependencias-de-desarrollo)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Módulos y funcionamiento](#módulos-y-funcionamiento)
  - [Punto de entrada](#punto-de-entrada)
  - [Enrutamiento](#enrutamiento)
  - [Providers globales](#providers-globales)
  - [Módulo Auth](#módulo-auth)
  - [Módulo Dashboard](#módulo-dashboard)
  - [Módulo Productos](#módulo-productos)
  - [Módulo Ventas](#módulo-ventas)
  - [Módulo Compras](#módulo-compras)
  - [Módulo Reportes](#módulo-reportes)
  - [Módulo Landing](#módulo-landing)
  - [Componentes compartidos](#componentes-compartidos)
  - [Tipos globales](#tipos-globales)
  - [Utilidades](#utilidades)
- [Integración con el backend](#integración-con-el-backend)
- [Flujo de autenticación](#flujo-de-autenticación)
- [Modo Mock (desarrollo)](#modo-mock-desarrollo)

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Lenguaje | TypeScript | ^5.5.4 |
| UI Library | React | ^18.3.1 |
| Bundler | Vite | ^5.2.0 |
| Estilos | Tailwind CSS | 3.4.17 |
| Routing | React Router DOM | ^7.13.0 |
| HTTP Client | Axios | ^1.13.6 |
| Animaciones | Framer Motion | ^12.34.0 |

---

## Dependencias de producción

Estas librerías se incluyen en el bundle final que se sirve al usuario.

| Paquete | Versión | Uso en el proyecto |
|---|---|---|
| `react` | ^18.3.1 | Librería base de UI |
| `react-dom` | ^18.3.1 | Renderizado al DOM |
| `react-router-dom` | ^7.13.0 | Enrutamiento SPA con protección de rutas |
| `axios` | ^1.13.6 | Cliente HTTP para consumir la API REST del backend (Laravel) |
| `framer-motion` | ^12.34.0 | Animaciones de entrada/salida en listas, formularios y páginas |
| `lucide-react` | 0.522.0 | Biblioteca de iconos SVG (>1 000 iconos) |
| `recharts` | ^2.12.7 | Gráfico de barras en el Dashboard (ingresos vs. gastos) |
| `chart.js` | ^4.5.1 | Gráficos en el módulo de Reportes (barras, líneas, pastel) |
| `react-select` | ^5.10.2 | Selector estilizado con soporte dark mode en el formulario de registro |
| `xlsx` | ^0.18.5 | Exportación de reportes a Excel (.xlsx) — carga dinámica |
| `jspdf` | ^4.2.0 | Generación de PDFs con cabecera personalizada — carga dinámica |
| `jspdf-autotable` | ^5.0.7 | Plugin de tablas para jsPDF |
| `@emotion/react` | ^11.13.3 | Declarado pero actualmente sin uso directo en el código |

> `xlsx`, `jspdf` y `jspdf-autotable` se cargan con **dynamic import()** para no aumentar el bundle principal. Solo se descargan cuando el usuario pulsa "Exportar".

---

## Dependencias de desarrollo

Solo se usan durante el proceso de compilación o en el entorno local. No se incluyen en el bundle de producción.

| Paquete | Versión | Uso en el proyecto |
|---|---|---|
| `typescript` | ^5.5.4 | Compilador y verificación estática de tipos |
| `vite` | ^5.2.0 | Bundler y servidor de desarrollo con HMR |
| `@vitejs/plugin-react` | ^4.2.1 | Plugin de Vite para soporte JSX/TSX con Babel |
| `tailwindcss` | 3.4.17 | Framework de utilidades CSS (genera solo las clases usadas) |
| `postcss` | latest | Procesador CSS requerido por Tailwind |
| `autoprefixer` | latest | Agrega prefijos de vendor a las reglas CSS automáticamente |
| `eslint` | ^8.50.0 | Linter para detectar errores y malas prácticas |
| `@typescript-eslint/parser` | ^5.54.0 | Parser de TypeScript para ESLint |
| `@typescript-eslint/eslint-plugin` | ^5.54.0 | Reglas ESLint específicas de TypeScript |
| `eslint-plugin-react-hooks` | ^4.6.0 | Reglas para el uso correcto de hooks de React |
| `eslint-plugin-react-refresh` | ^0.4.1 | Reglas para compatibilidad con HMR de Vite |
| `@types/react` | ^18.3.1 | Tipos TypeScript para React |
| `@types/react-dom` | ^18.3.1 | Tipos TypeScript para ReactDOM |
| `@types/node` | ^20.19.33 | Tipos TypeScript para Node.js (usado en vite.config.ts) |

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (junto a `package.json`) con las siguientes variables:

```env
# URL base del backend Laravel (sin barra final)
VITE_API_URL=http://localhost:8000

# Activa el modo mock para desarrollo sin backend
# En producción debe ser "false" o eliminarse
VITE_MOCK_AUTH=true
```

> Todas las variables expuestas al cliente deben comenzar con el prefijo `VITE_`. Vite reemplaza estas referencias en tiempo de compilación.

---

## Scripts disponibles

```bash
# Inicia el servidor de desarrollo con Hot Module Replacement (HMR)
npm run dev          # → http://localhost:5173

# Compila el proyecto para producción en la carpeta /dist
npm run build

# Previsualiza el build de producción localmente
npm run preview

# Ejecuta ESLint sobre todos los archivos .ts/.tsx
npm run lint
```

---

## Estructura del proyecto

```
coffeeapp/
├── public/                        # Archivos estáticos (favicon, etc.)
├── src/
│   ├── index.tsx                  # Punto de entrada — monta <Providers><App />
│   ├── index.css                  # Reset global + directivas Tailwind
│   ├── vite-env.d.ts              # Tipos para import.meta.env
│   │
│   ├── app/
│   │   ├── App.tsx                # Componente raíz — renderiza <AppRouter>
│   │   ├── router.tsx             # Definición de todas las rutas
│   │   └── providers.tsx          # Stack de contextos: BrowserRouter > Theme > Auth
│   │
│   ├── lib/
│   │   └── axios.ts               # Instancia Axios configurada con interceptors
│   │
│   ├── types/
│   │   ├── api.ts                 # ApiSuccessResponse, ApiErrorResponse, ApiResponse
│   │   └── domain.ts              # Modelos de dominio: User, Product, Sale, Purchase…
│   │
│   ├── hooks/
│   │   └── useTheme.tsx           # ThemeProvider + hook useTheme (dark/light)
│   │
│   ├── utils/
│   │   └── exportUtils.ts         # exportToExcel() y exportToPDF() con dynamic import
│   │
│   ├── components/                # Componentes UI compartidos (no acoplados a features)
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx  # Layout principal: navbar sticky + <Outlet>
│   │   └── ui/
│   │       ├── ThemeToggle.tsx    # Botón para alternar dark/light mode
│   │       └── ImageUpload.tsx    # Zona drag-and-drop para subir imágenes
│   │
│   └── features/                  # Módulos de negocio (feature-based architecture)
│       ├── auth/
│       │   ├── pages/             # LoginPage, RegisterPage
│       │   ├── components/        # ProtectedRoute, CompanyForm, UserForm, RegisterBrand
│       │   ├── hooks/             # useAuth, useRegisterForm, useDarkMode
│       │   ├── services/          # auth.service.ts — login, logout, me, refresh
│       │   ├── types/             # register.types.ts — CompanyData, UserData, FormErrors
│       │   └── styles/            # LoginPage.css, RegisterPage.css, RegisterSelect.styles.ts
│       │
│       ├── dashboard/
│       │   ├── pages/             # DashboardPage
│       │   └── components/        # SummaryCards, ActionButtons, MonthlyChart, AlertsSection
│       │
│       ├── products/
│       │   ├── pages/             # CreateProductPage
│       │   └── hooks/             # useProductForm — estado del formulario + cálculo de margen
│       │
│       ├── sales/
│       │   ├── pages/             # RegisterSalePage
│       │   └── components/        # SaleLineItem, SaleSummary
│       │
│       ├── purchases/
│       │   ├── pages/             # RegisterPurchasePage
│       │   └── components/        # PurchaseLineItem, PurchaseSummary
│       │
│       ├── reports/
│       │   ├── pages/             # ReportsPage — interfaz de pestañas
│       │   ├── components/        # InventoryReport, SalesReport, PurchasesReport, ClientsReport
│       │   └── styles/            # reports.css — variables CSS para dark mode
│       │
│       └── landing/
│           ├── pages/             # LandingPage — página de marketing
│           └── styles/            # LandingPage.css
│
├── .env                           # Variables de entorno locales (no subir a git)
├── vite.config.ts                 # Configuración de Vite
├── tsconfig.json                  # Configuración TypeScript (strict mode)
├── tailwind.config.js             # Configuración de Tailwind CSS
└── package.json                   # Dependencias y scripts
```

---

## Módulos y funcionamiento

### Punto de entrada

**`src/index.tsx`**

Monta la aplicación en el elemento `#root` del `index.html`. Envuelve todo en `<React.StrictMode>` y en `<Providers>` antes de renderizar `<App>`.

```
index.tsx
  └── <Providers>          ← BrowserRouter + ThemeProvider + AuthProvider
        └── <App>
              └── <AppRouter>   ← todas las rutas
```

---

### Enrutamiento

**`src/app/router.tsx`** — usa `react-router-dom` v7.

| Ruta | Componente | Protegida |
|---|---|---|
| `/` | `LandingPage` | No |
| `/login` | `LoginPage` | No |
| `/register` | `RegisterPage` | No |
| `/dashboard` | `DashboardPage` | Sí |
| `/products/new` | `CreateProductPage` | Sí |
| `/sales/new` | `RegisterSalePage` | Sí |
| `/payments/new` | `RegisterPurchasePage` | Sí |
| `/reports` | `ReportsPage` | Sí |
| `*` | Redirige a `/` | — |

Las rutas protegidas están agrupadas bajo un `<Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>`. El layout renderiza el navbar y luego `<Outlet>` para el contenido de cada página.

---

### Providers globales

**`src/app/providers.tsx`**

Define el orden exacto del stack de contextos:

1. **`BrowserRouter`** — necesario para que `AuthProvider` pueda usar `useNavigate`.
2. **`ThemeProvider`** (`src/hooks/useTheme.tsx`) — lee la preferencia del sistema y de `localStorage`. Agrega/quita la clase `dark` en `<html>`. Expone `{ isDark, toggle }` a través del hook `useTheme()`.
3. **`AuthProvider`** (`src/features/auth/hooks/useAuth.tsx`) — verifica la sesión al montar, expone `{ user, isAuthenticated, isLoading, login, logout, clearError }`.

---

### Módulo Auth

**Ubicación:** `src/features/auth/`

#### Páginas

- **`LoginPage`** — Formulario email + contraseña con validación en tiempo real (blur) y al submit. Si `VITE_MOCK_AUTH=true` muestra un botón de acceso rápido para desarrollo. Al autenticarse redirige al dashboard (o a la ruta originalmente solicitada).

- **`RegisterPage`** — Registro en 2 pasos con barra de progreso:
  - **Paso 1 — Empresa:** nombre, NIT, sector, teléfono, dirección, ciudad, país, sitio web (opcional).
  - **Paso 2 — Usuario:** nombre, apellido, email, contraseña (con reglas de seguridad) y rol.
  - El componente lateral `RegisterBrand` muestra el paso activo con indicadores visuales.

#### Componentes

- **`ProtectedRoute`** — Wrapper que verifica `isAuthenticated`. Si la sesión está cargando muestra un spinner. Si el usuario no tiene el rol requerido (prop `allowedRoles`) redirige al dashboard. Si no está autenticado redirige a `/login` guardando la ruta original.

- **`CompanyForm`** / **`UserForm`** — Formularios controlados con `react-select` para los campos de tipo selector (sector, rol). Los estilos del select se adaptan al modo oscuro a través de `RegisterSelect.styles.ts`.

#### Hook `useRegisterForm`

Centraliza todo el estado del flujo de registro:
- Estados: `company`, `user`, `errors` (tipado con `FormErrors`), `isLoading`, `showSuccess`, `currentStep`.
- Valida cada paso de forma independiente antes de avanzar.
- En el submit construye el payload anidado `{ company: {...}, user: {...} }` y lo envía a `POST /api/v1/auth/register`.
- Si el servidor responde con errores de validación (422), los mapea a los campos del formulario y retrocede al paso 1 si el error corresponde a datos de empresa.

#### Servicio `AuthService`

**`src/features/auth/services/auth.service.ts`**

| Método | Descripción |
|---|---|
| `login(credentials)` | `POST /auth/login` → guarda token y usuario en `localStorage` |
| `logout()` | `POST /auth/logout` → limpia sesión local siempre (aunque falle el servidor) |
| `me()` | `GET /auth/me` → refresca los datos del usuario desde el servidor |
| `refreshToken()` | `POST /auth/refresh` → obtiene un nuevo access token |
| `isAuthenticated()` | Comprueba token en `localStorage` y su fecha de expiración |
| `getUser()` | Lee el usuario cacheado desde `localStorage` |
| `clearSession()` | Elimina token, expiración y usuario del `localStorage` |
| `parseValidationErrors(error)` | Extrae los errores del cuerpo de respuesta de Axios |

Tokens almacenados en `localStorage`:
- `kardex_token` — JWT de acceso
- `kardex_token_expires` — timestamp de expiración en ms
- `kardex_user` — objeto usuario serializado como JSON

---

### Módulo Dashboard

**Ubicación:** `src/features/dashboard/`

Página principal del sistema. Compuesta por cuatro componentes independientes:

| Componente | Descripción |
|---|---|
| `ActionButtons` | Cuatro botones de acceso rápido: registrar venta, compra, producto y ver reportes |
| `SummaryCards` | Cuatro tarjetas KPI con datos financieros simulados: balance, ventas, gastos y ahorro |
| `MonthlyChart` | Gráfico de barras (Recharts) con ingresos vs. gastos de los últimos 6 meses. Se adapta a dark mode observando cambios de clase en `<html>` con `MutationObserver` |
| `AlertsSection` | Lista de alertas simuladas (stock bajo, facturas vencidas) |

La sección de "Actividad reciente" en la columna lateral muestra los últimos movimientos con indicador de positivo/negativo.

---

### Módulo Productos

**Ubicación:** `src/features/products/`

#### `CreateProductPage`

Formulario de creación de producto dividido en cuatro secciones con animaciones de entrada escalonadas (`framer-motion` con `staggerChildren`):

1. **Información básica** — nombre (requerido), categoría (requerido), SKU (opcional), descripción.
2. **Precios** — precio de compra, precio de venta, IVA (0 % / 8 % / 16 %). El margen de ganancia se calcula automáticamente y se muestra en color según el rango: rojo (negativo), ámbar (<20 %), verde (≥20 %).
3. **Inventario** — stock inicial, stock mínimo para alertas, unidad de medida.
4. **Configuración** — toggles para "Producto activo" y "Rastrear inventario".
5. **Imagen** — componente `ImageUpload` con soporte drag-and-drop y previsualización.

La barra de acciones está fija en la parte inferior en móvil y al final del formulario en desktop.

#### Hook `useProductForm`

Maneja el estado de todos los campos del formulario. Recalcula el margen cada vez que cambian `purchasePrice` o `salePrice` a través de un `useEffect`.

---

### Módulo Ventas

**Ubicación:** `src/features/sales/`

#### `RegisterSalePage`

Formulario de registro de venta con tres secciones:

1. **Información general** — fecha, cliente (selector), tipo de venta (Contado / Crédito). Si se selecciona "Crédito", aparece con animación un campo de fecha de vencimiento.
2. **Productos vendidos** — lista dinámica de `SaleLineItem`. Cada línea permite seleccionar producto, ver el stock disponible, ingresar cantidad (con validación visual si supera el stock) y precio unitario. El subtotal se calcula en tiempo real.
3. **Forma de pago** — cuatro opciones: Efectivo, Transferencia, Tarjeta, Crédito.

`SaleLineItem` detecta cuando la cantidad excede el stock y colorea la fila en rojo con un mensaje de advertencia.

`SaleSummary` (columna lateral en desktop, sticky) muestra subtotal, IVA, total de ítems y total a pagar. Se actualiza en tiempo real.

---

### Módulo Compras

**Ubicación:** `src/features/purchases/`

#### `RegisterPurchasePage`

Formulario de registro de compra o gasto con estructura similar a ventas:

1. **Información general** — fecha, proveedor (texto libre), tipo (Producto para inventario / Gasto).
2. **Productos** — lista dinámica de `PurchaseLineItem` con nombre, cantidad y precio unitario.
3. **Forma de pago** — tres opciones: Efectivo, Transferencia, Crédito (genera cuenta por pagar).

`PurchaseSummary` muestra el total de unidades, número de ítems, subtotal y total con IVA si aplica.

---

### Módulo Reportes

**Ubicación:** `src/features/reports/`

#### `ReportsPage`

Interfaz de pestañas que agrupa cuatro tipos de reporte. Cada pestaña carga su componente correspondiente:

| Pestaña | Componente | Librería de gráficos |
|---|---|---|
| Inventario | `InventoryReport` | Chart.js (barra) |
| Ventas | `SalesReport` | Chart.js (línea + pastel) |
| Compras | `PurchasesReport` | Chart.js (barra horizontal) |
| Clientes | `ClientsReport` | Chart.js (barra agrupada) |

Cada reporte incluye:
- **KPI cards** con métricas clave del período.
- **Gráfico** interactivo con tooltips personalizados.
- **Tabla de datos** con filtro de búsqueda.
- **Botones de exportación** a Excel (SheetJS) y PDF (jsPDF + autoTable).

Los estilos de los reportes se definen en `reports.css` usando variables CSS (`--accent`, `--danger`, etc.) que cambian automáticamente según el modo oscuro activo.

> Los datos son actualmente estáticos (mocks). La integración con la API del backend está pendiente de implementación.

---

### Módulo Landing

**Ubicación:** `src/features/landing/`

Página de marketing pública accesible en `/`. Presenta el producto con secciones de características, beneficios y llamada a la acción. Tiene su propio archivo de estilos CSS.

---

### Componentes compartidos

**Ubicación:** `src/components/`

#### `DashboardLayout`

Layout base para todas las rutas protegidas. Contiene:

- **Navbar sticky** con logo (cambia según el tema), enlaces de navegación desktop y menú hamburguesa mobile.
- **Avatar del usuario** con iniciales generadas desde el nombre.
- **Botón de logout** que llama a `AuthService.logout()` y redirige a `/login`.
- **`<Outlet>`** donde React Router inyecta el componente de la ruta activa.

#### `ThemeToggle`

Botón que llama a `toggle()` del `ThemeContext`. Muestra un ícono de sol o luna según el tema activo.

#### `ImageUpload`

Zona de carga de imagen con:
- Clic para abrir el selector de archivos.
- Drag-and-drop con feedback visual.
- Previsualización de la imagen seleccionada con botón para eliminar.
- Validación de tipo MIME (`image/*`).

---

### Tipos globales

**`src/types/api.ts`** — Tipos para las respuestas del backend:

```typescript
ApiSuccessResponse<T>  // { success: true; data: T }
ApiErrorResponse       // { success: false; error: { code: string; message: string } }
ApiResponse<T>         // union de los anteriores
```

**`src/types/domain.ts`** — Modelos de dominio:

```typescript
Company     // { id, name, slug? }
Role        // { id, name, display_name }
User        // { id, first_name, last_name, email, company?, roles?, status? }
Product     // { id, name, category, sku?, purchase_price, sale_price, stock, ... }
SaleLine    // { id, name, stock, quantity, unit_price }
Sale        // { id, date, customer, sale_type, payment_method, lines[] }
PurchaseLine // { id, name, quantity, unit_price }
Purchase    // { id, date, supplier, purchase_type, payment_method, lines[] }
```

---

### Utilidades

**`src/utils/exportUtils.ts`**

Dos funciones de exportación con carga diferida para no impactar el bundle inicial:

```typescript
exportToExcel(data: Record<string, unknown>[], filename: string): void
// Genera un archivo .xlsx y lo descarga en el navegador

exportToPDF(title: string, rows: (string | number)[][], columns: string[]): Promise<void>
// Genera un PDF en modo landscape con cabecera de marca y tabla de datos
```

---

## Integración con el backend

El cliente HTTP está configurado en **`src/lib/axios.ts`**:

- `baseURL`: `${VITE_API_URL}/api/v1`
- `timeout`: 15 segundos
- Headers por defecto: `Content-Type: application/json`, `Accept: application/json`

**Interceptor de request** — Adjunta automáticamente el token JWT en el header `Authorization: Bearer <token>` si existe en `localStorage`.

**Interceptor de response** — Maneja respuestas de error:
- `401 Unauthorized` → Limpia la sesión local y redirige a `/login` (solo si no está ya en esa ruta).
- `403 Forbidden` → Log de advertencia en consola.
- `500 Internal Server Error` → Log de error en consola.

### Endpoints utilizados

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Inicio de sesión |
| `POST` | `/api/v1/auth/register` | Registro de empresa + usuario |
| `GET` | `/api/v1/auth/me` | Datos del usuario autenticado |
| `POST` | `/api/v1/auth/logout` | Cierre de sesión |
| `POST` | `/api/v1/auth/refresh` | Renovación de token (cookie HttpOnly) |

### Estructura de respuestas del backend

```json
// Login exitoso
{
  "success": true,
  "data": {
    "user": { ... },
    "access_token": "eyJ...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}

// GET /auth/me exitoso
{ "success": true, "data": { /* UserResource */ } }

// Error de negocio
{ "success": false, "error": { "code": "INVALID_CREDENTIALS", "message": "..." } }

// Error de validación (HTTP 422)
{ "success": false, "message": "...", "errors": { "campo": ["mensaje"] } }
```

---

## Flujo de autenticación

```
Usuario abre la app
      │
      ▼
AuthProvider.useEffect → AuthService.isAuthenticated()
      │
      ├─ Token válido → AuthService.me() → actualiza estado → app lista
      │
      └─ Sin token o expirado → estado "no autenticado"
                │
                ▼
        ProtectedRoute → redirige a /login
                │
                ▼
        LoginPage → login(credentials)
                │
                ▼
        AuthService.login() → POST /auth/login
                │
                ├─ Éxito → guarda token + user en localStorage → redirige al dashboard
                │
                └─ Error → muestra mensaje en formulario
```

---

## Modo Mock (desarrollo)

Cuando `VITE_MOCK_AUTH=true`, el servicio de autenticación no realiza peticiones al backend. En su lugar:

1. Almacena un token ficticio `mock-token-dev` en `localStorage`.
2. Retorna un usuario de prueba pre-definido:

```json
{
  "id": 1,
  "first_name": "Dev",
  "last_name": "Local",
  "email": "dev@kardex.co",
  "company": { "id": 1, "name": "Empresa Demo", "slug": "empresa-demo" },
  "roles": [{ "id": 1, "name": "admin", "display_name": "Administrador" }],
  "status": { "is_active": true, "is_email_verified": true }
}
```

3. En `LoginPage` aparece un botón "⚡ Dev: entrar sin credenciales" que ejecuta el login mock directamente.

> Para conectar al backend real: cambia `VITE_MOCK_AUTH=false` en el archivo `.env` y asegúrate de que el servidor Laravel esté corriendo en `http://localhost:8000`.
