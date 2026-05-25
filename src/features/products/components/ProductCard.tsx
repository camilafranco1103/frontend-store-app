import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
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
      className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-lg dark:hover:shadow-stone-950/50 hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
    >
      <div className="h-48 relative overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={imageSrc}
          alt={producto.name ?? 'Producto'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE }}
        />
        {!producto.disponible && (
          <span className="absolute top-2 right-2 bg-stone-900/75 dark:bg-stone-950/80 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
            Sin stock
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        {categoria && (
          <span className="self-start px-2.5 py-0.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full border border-orange-100 dark:border-orange-500/20">
            {categoria.nombre}
          </span>
        )}

        <h3 className="font-semibold text-stone-800 dark:text-stone-100 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors leading-snug line-clamp-2">
          {producto.name}
        </h3>

        <p className="text-xs text-stone-400 dark:text-stone-500 mt-auto">
          Stock: {producto.stock_cantidad} un.
        </p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-lg font-bold text-stone-900 dark:text-stone-100">
            {formatPrice(producto.price)}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-orange-500 dark:text-orange-400 group-hover:gap-2 transition-all">
            Ver detalle <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  )
}
