import { create } from 'zustand'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (producto: { id: number; name: string; price: number }) => void
  removeItem: (productoId: number) => void
  updateQuantity: (productoId: number, cantidad: number) => void
  clearCart: () => void
  total: number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (producto) => {
    const existing = get().items.find((i) => i.id === producto.id)
    if (existing) {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === producto.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }))
    } else {
      set((state) => ({
        items: [...state.items, { ...producto, quantity: 1 }],
      }))
    }
  },

  removeItem: (productoId) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== productoId),
    }))
  },

  updateQuantity: (productoId, cantidad) => {
    if (cantidad <= 0) {
      get().removeItem(productoId)
      return
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.id === productoId ? { ...i, quantity: cantidad } : i
      ),
    }))
  },

  clearCart: () => set({ items: [] }),

  get total() {
    return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  },
}))
