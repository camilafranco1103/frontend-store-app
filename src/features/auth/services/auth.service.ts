import api from '../../../lib/axios'

export interface User {
  id: number
  email: string
  name: string
  lastname: string
  phone_number: number | null
  roles: string[]
}

export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  email: string
  password: string
  name: string
  lastname: string
  phone_number?: number | null
}

export async function login(params: LoginParams): Promise<User> {
  const { data } = await api.post<User>('/auth/login', params)
  return data
}

export async function register(params: RegisterParams): Promise<User> {
  const { data } = await api.post<User>('/auth/register', params)
  return data
}

export async function logout(): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/logout')
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/auth/me')
  return data
}
