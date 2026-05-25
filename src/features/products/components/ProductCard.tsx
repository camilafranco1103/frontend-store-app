import { Link } from 'react-router-dom'
import type { Categoria, Producto } from '../types'

interface ProductCardProps {
  producto: Producto
  categoriaMap: Map<number, Categoria>
}

export default function ProductCard({ producto, categoriaMap }: ProductCardProps) {
  const categoria = producto.categorias[0]
    ? categoriaMap.get(producto.categorias[0].categoria_id)
    : null

  const precioFormateado = producto.price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })

  return (
    <Link
      to={`/productos/${producto.id}`}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Imagen placeholder */}
      <div className="h-48 bg-gradient-to-br from-emerald-50 to-slate-100 flex items-center justify-center">
        <span className="text-6xl opacity-40">🍽️</span>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Categoría */}
        {categoria && (
          <span className="inline-block self-start px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
            {categoria.nombre}
          </span>
        )}

        {/* Nombre */}
        <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
          {producto.name}
        </h3>

        {/* Stock */}
        <p className="text-xs text-slate-400 mt-auto">
          Stock: {producto.stock_cantidad} unidades
        </p>

        {/* Precio */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-lg font-bold text-slate-900">{precioFormateado}</span>
          <span className="text-xs font-medium text-emerald-600 group-hover:underline">
            Ver detalle →
          </span>
        </div>
      </div>
    </Link>
  )
}
