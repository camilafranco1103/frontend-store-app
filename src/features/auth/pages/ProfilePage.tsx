import { useState, useEffect } from 'react'
import { User as UserIcon, Mail, Phone, Lock, Save, Loader2, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '../../../store/useAuthStore'
import AddressManager from '../components/AddressManager'

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore()
  
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile')

  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setLastname(user.lastname || '')
      setEmail(user.email || '')
      setPhoneNumber(user.phone_number ? String(user.phone_number) : '')
    }
  }, [user])

  function validate() {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'El nombre es obligatorio'
    if (!lastname.trim()) errs.lastname = 'El apellido es obligatorio'
    if (!email.trim()) {
      errs.email = 'El correo es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'El correo no es válido'
    }
    if (password && password.length < 6) {
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
      await updateProfile({
        name: name.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        phone_number: phoneNumber.trim() ? Number(phoneNumber.replace(/\D/g, '')) : null,
        password: password ? password : undefined
      })
      toast.success('¡Perfil actualizado con éxito!')
      setPassword('') // limpiar contraseña
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Error al actualizar el perfil'
      toast.error(msg)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar / Tabs */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
              activeTab === 'profile' 
                ? 'bg-indigo-500 text-white shadow-md' 
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <UserIcon size={18} />
            Datos Personales
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
              activeTab === 'addresses' 
                ? 'bg-indigo-500 text-white shadow-md' 
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <MapPin size={18} />
            Mis Direcciones
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 p-6 md:p-8 shadow-xl dark:shadow-stone-950/60 transition-all">
          
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-stone-100 dark:border-stone-800">
                <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <UserIcon size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Mi Perfil</h1>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    Actualizá tu información personal y de contacto
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Nombre */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Nombre</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 pointer-events-none">
                        <UserIcon size={16} />
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:outline-none focus:ring-indigo-500 transition ${
                          errors.name ? 'border-red-400 focus:ring-red-400' : 'border-stone-200 dark:border-stone-700'
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                  </div>

                  {/* Apellido */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Apellido</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 pointer-events-none">
                        <UserIcon size={16} />
                      </span>
                      <input
                        type="text"
                        value={lastname}
                        onChange={e => setLastname(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:outline-none focus:ring-indigo-500 transition ${
                          errors.lastname ? 'border-red-400 focus:ring-red-400' : 'border-stone-200 dark:border-stone-700'
                        }`}
                      />
                    </div>
                    {errors.lastname && <p className="text-xs text-red-500">{errors.lastname}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Correo Electrónico</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 pointer-events-none">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:outline-none focus:ring-indigo-500 transition ${
                          errors.email ? 'border-red-400 focus:ring-red-400' : 'border-stone-200 dark:border-stone-700'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Teléfono <span className="text-xs text-stone-400 font-normal">(opcional)</span></label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 pointer-events-none">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        placeholder="1145678901"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:outline-none focus:ring-indigo-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Password (opcional) */}
                <div className="space-y-1.5 pt-4 mt-2 border-t border-stone-100 dark:border-stone-800">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Nueva Contraseña <span className="text-xs text-stone-400 font-normal">(solo si querés cambiarla)</span>
                  </label>
                  <div className="relative max-w-md">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 pointer-events-none">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Dejar en blanco para no cambiar"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:outline-none focus:ring-indigo-500 transition ${
                        errors.password ? 'border-red-400 focus:ring-red-400' : 'border-stone-200 dark:border-stone-700'
                      }`}
                    />
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <AddressManager />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
