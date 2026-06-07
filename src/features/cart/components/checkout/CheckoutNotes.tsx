interface CheckoutNotesProps {
  notas: string
  onChange: (notas: string) => void
}

export default function CheckoutNotes({ notas, onChange }: CheckoutNotesProps) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 space-y-3">
      <label className="block font-semibold text-stone-800 dark:text-stone-100">
        Notas adicionales <span className="text-xs text-stone-400 font-normal">(opcional)</span>
      </label>
      <textarea
        value={notas}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        maxLength={250}
        placeholder="Instrucciones especiales para la entrega, alergias alimentarias, etc."
        className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
      />
      <div className="text-right text-xs text-stone-400">
        {notas.length}/250
      </div>
    </div>
  )
}
