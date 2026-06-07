import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { DireccionEntregaCreate } from '../../services/addresses.service'

interface AddressFormErrors {
  alias?: string
  linea1?: string
  linea2?: string
  ciudad?: string
  provincia?: string
  codigo_postal?: string
}

interface NewAddressFormProps {
  onCancel: () => void
  onSave: (addressData: DireccionEntregaCreate) => void
  isSaving: boolean
  isFirstAddress: boolean
}

export default function NewAddressForm({
  onCancel,
  onSave,
  isSaving,
  isFirstAddress,
}: NewAddressFormProps) {
  const [addressAlias, setAddressAlias] = useState('')
  const [addressCalle, setAddressCalle] = useState('')
  const [addressAltura, setAddressAltura] = useState('')
  const [addressPisoDepto, setAddressPisoDepto] = useState('')
  const [addressProvincia, setAddressProvincia] = useState('Buenos Aires')
  const [addressCp, setAddressCp] = useState('')
  const [addressErrors, setAddressErrors] = useState<AddressFormErrors>({})

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: AddressFormErrors = {}

    if (!addressCalle.trim()) {
      errs.ciudad = 'La calle es obligatoria'
    }

    if (!addressAltura.trim()) {
      errs.linea1 = 'La altura/número es obligatoria'
    }

    let pisoDeptoVal: string | null = null
    if (addressPisoDepto.trim()) {
      pisoDeptoVal = addressPisoDepto.trim()
    }

    if (!addressProvincia.trim()) {
      errs.provincia = 'La provincia es obligatoria'
    }

    if (!addressCp.trim()) {
      errs.codigo_postal = 'El código postal es obligatorio'
    }

    setAddressErrors(errs)

    if (Object.keys(errs).length > 0) {
      toast.error('Revisá los campos de la dirección')
      return
    }

    onSave({
      alias: addressAlias.trim() || null,
      linea1: addressAltura.trim(),
      linea2: pisoDeptoVal,
      ciudad: addressCalle.trim(),
      provincia: addressProvincia.trim(),
      codigo_postal: addressCp.trim(),
      es_principal: isFirstAddress,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-stone-100 dark:border-stone-800 p-4 rounded-xl mt-4">
      <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200">Nueva dirección de envío</h3>
      
      {/* Alias */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-stone-500 dark:text-stone-400">
          Nombre / Alias (ej: Casa, Trabajo)
        </label>
        <input
          type="text"
          value={addressAlias}
          onChange={(e) => setAddressAlias(e.target.value)}
          placeholder="Mi casa"
          className="w-full px-3 py-2 rounded-xl text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Calle (ciudad) */}
        <div className="col-span-2 space-y-1">
          <label className="block text-xs font-medium text-stone-500 dark:text-stone-400">
            Calle <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={addressCalle}
            onChange={(e) => setAddressCalle(e.target.value)}
            placeholder="Av. Corrientes"
            className={`w-full px-3 py-2 rounded-xl text-sm border bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 ${
              addressErrors.ciudad ? 'border-red-400 dark:border-red-500' : 'border-stone-200 dark:border-stone-700'
            }`}
          />
          {addressErrors.ciudad && <p className="text-[10px] text-red-500">{addressErrors.ciudad}</p>}
        </div>

        {/* Altura (linea1) */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-stone-500 dark:text-stone-400">
            Altura <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={addressAltura}
            onChange={(e) => setAddressAltura(e.target.value)}
            placeholder="1234"
            className={`w-full px-3 py-2 rounded-xl text-sm border bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 ${
              addressErrors.linea1 ? 'border-red-400 dark:border-red-500' : 'border-stone-200 dark:border-stone-700'
            }`}
          />
          {addressErrors.linea1 && <p className="text-[10px] text-red-500">{addressErrors.linea1}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Piso/Dpto (linea2) */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-stone-500 dark:text-stone-400">
            Piso/Depto <span className="text-stone-400 font-normal">(Nro)</span>
          </label>
          <input
            type="text"
            value={addressPisoDepto}
            onChange={(e) => setAddressPisoDepto(e.target.value)}
            placeholder="4"
            className={`w-full px-3 py-2 rounded-xl text-sm border bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 ${
              addressErrors.linea2 ? 'border-red-400 dark:border-red-500' : 'border-stone-200 dark:border-stone-700'
            }`}
          />
          {addressErrors.linea2 && <p className="text-[10px] text-red-500">{addressErrors.linea2}</p>}
        </div>

        {/* CP */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-stone-500 dark:text-stone-400">
            Cód. Postal <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={addressCp}
            onChange={(e) => setAddressCp(e.target.value)}
            placeholder="1425"
            className={`w-full px-3 py-2 rounded-xl text-sm border bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 ${
              addressErrors.codigo_postal ? 'border-red-400 dark:border-red-500' : 'border-stone-200 dark:border-stone-700'
            }`}
          />
          {addressErrors.codigo_postal && <p className="text-[10px] text-red-500">{addressErrors.codigo_postal}</p>}
        </div>

        {/* Provincia */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-stone-500 dark:text-stone-400">
            Provincia <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={addressProvincia}
            onChange={(e) => setAddressProvincia(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-sm border bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 ${
              addressErrors.provincia ? 'border-red-400 dark:border-red-500' : 'border-stone-200 dark:border-stone-700'
            }`}
          />
          {addressErrors.provincia && <p className="text-[10px] text-red-500">{addressErrors.provincia}</p>}
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex items-center gap-3 pt-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-semibold transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold transition disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Dirección'
          )}
        </button>
      </div>
    </form>
  )
}
