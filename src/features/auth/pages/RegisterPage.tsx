import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, User as UserIcon, Phone, UserPlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '../../../store/useAuthStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const register = useAuthStore((s) => s.register)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    name?: string
    lastname?: string
    phone_number?: string
  }>({})

  const from = (location.state as any)?.from?.pathname || '/'

  function validate() {
    const errs: typeof errors = {}
    if (!name.trim()) errs.name = 'El nombre es obligatorio'
    if (!lastname.trim()) errs.lastname = 'El apellido es obligatorio'
    
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

    if (phoneNumber.trim() !== '') {
      const cleanPhone = phoneNumber.replace(/\D/g, '')
      if (cleanPhone.length < 8) {
        errs.phone_number = 'El número de teléfono debe tener al menos 8 dígitos'
      }
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsPending(true)
    try {
      const phoneVal = phoneNumber.trim() ? Number(phoneNumber.replace(/\D/g, '')) : null
      await register({
        email,
        password,
        name: name.trim(),
        lastname: lastname.trim(),
        phone_number: phoneVal,
      })
      toast.success('¡Usuario registrado con éxito!')
      navigate(from, { replace: true })
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || 'Error al registrar usuario. Intente con otro correo.'
      toast.error(errMsg)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 p-8 rounded-3xl shadow-xl dark:shadow-stone-950/60 transition-all duration-300">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 mb-2">
            <UserPlus size={24} />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Crear Cuenta</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Registrate gratis como cliente para hacer tus pedidos
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-2">
          
          {/* Nombre y Apellido en una fila */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Nombre
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400 pointer-events-none">
                  <UserIcon size={14} />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                  }}
                  placeholder="María"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm border transition bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.name ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : 'border-stone-200 dark:border-stone-700'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[10px] text-red-500 dark:text-red-400 mt-0.5">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Apellido
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400 pointer-events-none">
                  <UserIcon size={14} />
                </span>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => {
                    setLastname(e.target.value)
                    if (errors.lastname) setErrors((prev) => ({ ...prev, lastname: undefined }))
                  }}
                  placeholder="González"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm border transition bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.lastname ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : 'border-stone-200 dark:border-stone-700'
                  }`}
                />
              </div>
              {errors.lastname && (
                <p className="text-[10px] text-red-500 dark:text-red-400 mt-0.5">{errors.lastname}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 pointer-events-none">
                <Mail size={15} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                placeholder="ejemplo@correo.com"
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border transition bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : 'border-stone-200 dark:border-stone-700'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              Teléfono <span className="text-xs text-stone-400 font-normal">(opcional)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 pointer-events-none">
                <Phone size={15} />
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value)
                  if (errors.phone_number) setErrors((prev) => ({ ...prev, phone_number: undefined }))
                }}
                placeholder="1145678901"
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border transition bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.phone_number ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : 'border-stone-200 dark:border-stone-700'
                }`}
              />
            </div>
            {errors.phone_number && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.phone_number}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 pointer-events-none">
                <Lock size={15} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                }}
                placeholder="Mínimo 6 caracteres"
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border transition bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
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
                Registrando cuenta...
              </>
            ) : (
              <>
                Registrar Cuenta
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">
          ¿Ya tenés una cuenta?{' '}
          <Link
            to="/login"
            state={{ from: location.state?.from }}
            className="font-semibold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline transition-colors"
          >
            Iniciá sesión acá
          </Link>
        </div>
      </div>
    </div>
  )
}
