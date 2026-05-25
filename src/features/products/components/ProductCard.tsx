import { Link } from 'react-router-dom'
import type { CategoriaMap, Producto } from '../types'

interface ProductCardProps {
  producto: Producto
  categoriaMap: CategoriaMap
}

function formatPrice(price: number): string {
  return price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })
}

export default function ProductCard({ producto, categoriaMap }: ProductCardProps) {
  const principalCat = producto.categorias.find((c) => c.es_principal) ?? producto.categorias[0]
  const categoria = principalCat ? categoriaMap.get(principalCat.categoria_id) : undefined

  return (
    <Link
      to={`/productos/${producto.id}`}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Imagen placeholder */}
      <div className="h-48 bg-gradient-to-br from-emerald-50 via-slate-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
        <span className="text-6xl opacity-30 group-hover:scale-110 transition-transform duration-300">
          🍽️
        </span>
        {!producto.disponible && (
          <span className="absolute top-2 right-2 bg-slate-700/80 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            Sin stock
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        {categoria && (
          <span className="self-start px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
            {categoria.nombre}
          </span>
        )}

        <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors leading-snug line-clamp-2">
          {producto.name}
        </h3>

        <p className="text-xs text-slate-400 mt-auto">
          Stock: {producto.stock_cantidad} un.
        </p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-lg font-bold text-slate-900">{formatPrice(producto.price)}</span>
          <span className="text-xs font-medium text-emerald-600 group-hover:underline">
            Ver detalle →
          </span>
        </div>
      </div>
    </Link>
  )
}
