import api from '../../../lib/axios'

export interface DireccionEntrega {
  id: number
  usuario_id: number | null
  alias: string | null
  linea1: string
  linea2: string | null
  ciudad: string
  provincia: string
  codigo_postal: string
  latitud: number | null
  longitud: number | null
  es_principal: boolean
}

export interface DireccionEntregaCreate {
  alias?: string | null
  linea1: string // Representa la altura/número
  linea2?: string | null // Representa piso/depto (número o letra)
  ciudad: string // Representa la calle o calle y ciudad
  provincia: string
  codigo_postal: string
  latitud?: number | null
  longitud?: number | null
  es_principal?: boolean
}

export async function getAddresses(): Promise<DireccionEntrega[]> {
  const { data } = await api.get<DireccionEntrega[]>('/direccionEntrega/')
  return data
}

export async function createAddress(address: DireccionEntregaCreate): Promise<DireccionEntrega> {
  const { data } = await api.post<DireccionEntrega>('/direccionEntrega/', address)
  return data
}

export async function updateAddress(id: number, address: Partial<DireccionEntregaCreate>): Promise<DireccionEntrega> {
  const { data } = await api.patch<DireccionEntrega>(`/direccionEntrega/${id}`, address)
  return data
}

export async function deleteAddress(id: number): Promise<void> {
  await api.delete(`/direccionEntrega/${id}`)
}
