import { Link, useParams } from 'react-router-dom'
import { useProductById } from '../hooks/useProductById'
import { useCategories } from '../hooks/useCategories'
import { useIngredientes } from '../hooks/useIngredientes'
import { useCartStore } from '../../../store/useCartStore'
import Spinner from '../../../shared/components/Spinner'
import ErrorMessage from '../../../shared/components/ErrorMessage'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const numericId = Number(id)

  const { data: product, isLoading, isError, error } = useProductById(numericId)
  const { data: categories = [] } = useCategories()
  const { data: ingredientes = [] } = useIngredientes()

  const addItem = useCartStore((s) => s.addItem)
  const cartItems = useCartStore((s) => s.items)

  const categoriaMap = new Map(categories.map((c) => [c.id, c]))
  const ingredienteMap = new Map(ingredientes.map((i) => [i.id, i]))

  const inCart = cartItems.find((i) => i.id === numericId)
  const is404 = isError && (error as { response?: { status: number } })?.response?.status === 404

  const precioFormateado = product?.price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })

  if (isLoading) return <Spinner message="Cargando producto..." />

  if (is404) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <span className="text-6xl">🔍</span>
        <h2 className="text-2xl font-bold text-slate-800">Producto no encontrado</h2>
        <p className="text-slate-500">El producto que buscás no existe o fue eliminado.</p>
        <Link
          to="/"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Volver al catálogo
        </Link>
      </div>
    )
  }

  if (isError) {
    return <ErrorMessage message="No pudimos cargar el producto." />
  }

  if (!product) return null

  const categorias = product.categorias.map((pc) => categoriaMap.get(pc.categoria_id)).filter(Boolean)
  const ings = product.ingredientes.map((pi) => ingredienteMap.get(pi.ingrediente_id)).filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 flex items-center gap-1.5">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Productos</Link>
        <span>›</span>
        <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Imagen */}
        <div className="bg-gradient-to-br from-emerald-50 to-slate-100 rounded-2xl h-80 flex items-center justify-center">
          <span className="text-8xl opacity-30">🍽️</span>
        </div>

        {/* Info */}
        <div className="space-y-5">
          {/* Categorías */}
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => cat && (
              <span
                key={cat.id}
                className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full"
              >
                {cat.nombre}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>

          <p className="text-4xl font-bold text-emerald-600">{precioFormateado}</p>

          {/* Info adicional */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 font-medium">Stock disponible</p>
              <p className="text-lg font-semibold text-slate-800">{product.stock_cantidad} un.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 font-medium">Estado</p>
              <p className={`text-lg font-semibold ${product.disponible ? 'text-emerald-600' : 'text-red-500'}`}>
                {product.disponible ? 'Disponible' : 'No disponible'}
              </p>
            </div>
          </div>

          {/* Ingredientes */}
          {ings.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Ingredientes</h3>
              <div className="flex flex-wrap gap-2">
                {ings.map((ing) => ing && (
                  <span
                    key={ing.id}
                    className={`px-3 py-1 text-xs rounded-full border font-medium ${
                      ing.esAlergeno
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {ing.name}
                    {ing.esAlergeno && ' ⚠️'}
                  </span>
                ))}
              </div>
              {ings.some((i) => i?.esAlergeno) && (
                <p className="text-xs text-amber-600 mt-2">⚠️ Contiene alérgenos</p>
              )}
            </div>
          )}

          {/* Botón carrito */}
          <div className="pt-2">
            {inCart ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-center">
                  <p className="text-emerald-700 font-semibold text-sm">
                    ✓ En el carrito ({inCart.quantity} {inCart.quantity === 1 ? 'unidad' : 'unidades'})
                  </p>
                </div>
                <button
                  onClick={() => addItem({ id: product.id, name: product.name, price: product.price })}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                >
                  + Agregar más
                </button>
              </div>
            ) : (
              <button
                onClick={() => addItem({ id: product.id, name: product.name, price: product.price })}
                disabled={!product.disponible}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-lg transition-colors"
              >
                🛒 Agregar al carrito
              </button>
            )}
          </div>

          <Link
            to="/"
            className="inline-block text-sm text-slate-500 hover:text-emerald-600 transition-colors"
          >
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}
