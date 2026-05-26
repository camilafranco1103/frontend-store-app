import { Link } from 'react-router-dom'
import { MapPinOff } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-stone-100 dark:bg-stone-800">
        <MapPinOff size={36} className="text-stone-400 dark:text-stone-500" />
      </div>
      <div className="space-y-2">
        <p className="text-indigo-500 dark:text-indigo-400 text-sm font-semibold tracking-widest uppercase">
          Error 404
        </p>
        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Página no encontrada</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-sm">
          La ruta que buscás no existe o fue movida.
        </p>
      </div>
      <Link
        to="/"
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-medium transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
