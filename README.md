video: https://drive.google.com/drive/folders/1VX5V1lqaQgTj-3K96T0uXAvy79Q_gjZd

# frontend-store

Tienda pública para el cliente final. Permite explorar productos, ver detalles y armar un carrito de compras.

## Stack

- **Vite + React + TypeScript** — base del proyecto
- **React Router DOM v6** — navegación entre las 3 páginas
- **TanStack Query v5** — fetch y caché de productos
- **Axios** — cliente HTTP con baseURL desde `.env`
- **Zustand v4** — estado global del carrito
- **Tailwind CSS v3** — todos los estilos

## Requisitos

- Node.js 18+
- pnpm 8+
- Backend corriendo en `http://localhost:8000`

## Instalación

```bash
pnpm install
```

## Configuración

Copiá el archivo de ejemplo y ajustá la URL del backend si es necesario:

```bash
cp .env.example .env
```

El `.env` debe tener:

```
VITE_API_URL=http://localhost:8000
```

## Correr en desarrollo

```bash
pnpm dev
```

La app estará disponible en `http://localhost:5173`.

## Estructura de carpetas

```
src/
├── features/
│   ├── products/
│   │   ├── components/     # ProductCard, ProductGrid, SearchBar, CategoryFilter
│   │   ├── hooks/          # useProducts, useProductById, useCategories, useIngredientes
│   │   ├── pages/          # ProductsPage, ProductDetailPage
│   │   ├── services/       # products.service.ts
│   │   └── types.ts        # Producto, Categoria, Ingrediente
│   └── cart/
│       ├── components/     # CartItem, CartSummary
│       ├── pages/          # CartPage
│       ├── services/       # orders.service.ts
│       └── types.ts        # CartItem, OrderPayload
├── shared/
│   └── components/         # Spinner, EmptyState, ErrorMessage
├── store/
│   └── useCartStore.ts     # Zustand: items, addItem, removeItem, updateQuantity, clearCart, total
├── router/
│   └── index.tsx           # Rutas: /, /productos/:id, /carrito
├── lib/
│   └── axios.ts            # Instancia de axios con baseURL desde .env
├── App.tsx                 # Layout principal con Navbar
└── main.tsx                # QueryClientProvider + RouterProvider
```

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Listado de productos con búsqueda y filtro por categoría |
| `/productos/:id` | Detalle del producto con botón "Agregar al carrito" |
| `/carrito` | Carrito con controles de cantidad y confirmación de pedido |

## Notas

- El carrito **no persiste al recargar** — Zustand en memoria (suficiente para esta entrega).
- Al confirmar el pedido se usa `usuario_id = 2` (usuario "cliente" del seed).
- Las imágenes de productos son placeholders (el modelo del backend no tiene campo imagen).
