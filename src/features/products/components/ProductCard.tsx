import { Link } from 'react-router-dom'
import type { CategoriaMap, Producto } from '../types'

interface ProductCardProps {
  producto: Producto
  categoriaMap: CategoriaMap
}

function formatPrice(price: number | null | undefined): string {
  if (price == null) return 'Sin precio'
  return price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })
}

const DEFAULT_IMAGE = 'https://i.ibb.co/233KrcLV/pizza.webp'

export default function ProductCard({ producto, categoriaMap }: ProductCardProps) {
  const categorias = producto.categorias ?? []
  const principalCat = categorias.find((c) => c.es_principal) ?? categorias[0]
  const categoria = principalCat ? categoriaMap.get(principalCat.categoria_id) : undefined
  const imageSrc = categoria?.imagen_url ?? DEFAULT_IMAGE

  return (
    <Link
      to={`/productos/${producto.id}`}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
    >
      <div className="h-48 relative overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={producto.name ?? 'Producto'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE }}
        />
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
