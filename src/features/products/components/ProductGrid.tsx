import type { CategoriaMap, Producto } from '../types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  productos: Producto[]
  categoriaMap: CategoriaMap
}

export default function ProductGrid({ productos, categoriaMap }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {productos.map((p) => (
        <ProductCard key={p.id} producto={p} categoriaMap={categoriaMap} />
      ))}
    </div>
  )
}
