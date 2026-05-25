import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : 'Error desconocido en el componente.'
    return { hasError: true, message }
  }

  componentDidCatch(error: unknown, info: { componentStack: string }) {
    console.error('[ErrorBoundary] Error capturado en render:', error)
    console.error('[ErrorBoundary] Árbol de componentes:', info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30">
            <AlertTriangle size={28} className="text-red-500 dark:text-red-400" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-stone-700 dark:text-stone-200">Algo falló al renderizar esta sección</p>
            <p className="text-stone-400 dark:text-stone-500 text-sm font-mono max-w-md break-words">
              {this.state.message}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-medium transition-colors"
          >
            Reintentar
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
