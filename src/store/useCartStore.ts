import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  imageSrc: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (incoming) => {
        const existing = get().items.find((i) => i.id === incoming.id)
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.id === incoming.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          }))
        } else {
          set((s) => ({ items: [...s.items, { ...incoming, quantity: 1 }] }))
        }
      },

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }))
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: 'app-cart' },
  ),
)

export const cartTotalItems = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.quantity, 0)

export const cartTotalPrice = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0)
