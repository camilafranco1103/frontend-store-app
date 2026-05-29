import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '../../store/useThemeStore'

export default function ThemeToggle() {
  const { isDark, toggle } = useThemeStore()

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      className={`
        relative inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full
        border-2 border-transparent transition-colors duration-300 focus:outline-none
        focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
        ${isDark ? 'bg-indigo-500' : 'bg-stone-300 dark:bg-stone-600'}
      `}
      style={{ width: '3.25rem' }}
    >
      <span
        className={`
          pointer-events-none flex h-5 w-5 items-center justify-center rounded-full
          bg-white shadow-md ring-0 transition-transform duration-300
          ${isDark ? 'translate-x-6' : 'translate-x-0.5'}
        `}
      >
        {isDark
          ? <Moon size={11} className="text-indigo-500" />
          : <Sun size={11} className="text-stone-400" />
        }
      </span>
    </button>
  )
}
