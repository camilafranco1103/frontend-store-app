import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 text-center max-w-sm">
        <span className="text-8xl select-none">🔍</span>
        <div className="space-y-2">
          <p className="text-slate-400 text-sm font-semibold tracking-widest uppercase">
            Error 404
          </p>
          <h1 className="text-3xl font-bold text-slate-800">Página no encontrada</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            La ruta que buscás no existe o fue movida.
          </p>
        </div>
        <Link
          to="/"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl font-medium transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
