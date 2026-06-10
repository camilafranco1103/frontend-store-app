import { create } from 'zustand';

interface WsState {
  isConnected: boolean;
  setIsConnected: (status: boolean) => void;
}

/**
 * Almacena el estado global de la conexión WebSocket para los pedidos del cliente.
 */
export const useWsStore = create<WsState>((set) => ({
  isConnected: false,
  setIsConnected: (status) => set({ isConnected: status }),
}));
