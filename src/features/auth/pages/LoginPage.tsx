import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '../../../store/useAuthStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const from = (location.state as any)?.from?.pathname || '/'

  function validate() {
    const errs: typeof errors = {}
    if (!email) {
      errs.email = 'El correo electrónico es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'El correo electrónico no es válido'
    }
    if (!password) {
      errs.password = 'La contraseña es obligatoria'
    } else if (password.length < 6) {
      errs.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsPending(true)
    try {
      await login({ email, password })
      toast.success('¡Sesión iniciada con éxito!')
      navigate(from, { replace: true })
    } catch (err: any) {
      // Cubre tanto errores HTTP del backend (err.response.data.detail)
      // como errores de validaci\u00f3n de rol que lanza el store (err.message).
      const errMsg =
        err.response?.data?.detail ??
        err.message ??
        'Error al iniciar sesi\u00f3n. Verifique sus credenciales.'
      toast.error(errMsg)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 p-8 rounded-3xl shadow-xl dark:shadow-stone-950/60 transition-all duration-300">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 mb-2">
            <LogIn size={24} />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Iniciar Sesión</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Ingresá a tu cuenta de cliente para realizar pedidos
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-2">
          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 pointer-events-none">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                placeholder="ejemplo@correo.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : 'border-stone-200 dark:border-stone-700'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 pointer-events-none">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.password ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : 'border-stone-200 dark:border-stone-700'
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              <>
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">
          ¿Aún no tenés una cuenta?{' '}
          <Link
            to="/registro"
            state={{ from: location.state?.from }}
            className="font-semibold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline transition-colors"
          >
            Registrate acá
          </Link>
        </div>
      </div>
    </div>
  )
}
