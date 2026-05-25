export function SkeletonDetail() {
  return (
    <div className="animate-pulse">
      <div className="h-5 w-28 bg-stone-200 dark:bg-stone-700 rounded-full mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80 lg:h-96 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded-full w-1/4" />
          <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded w-3/4" />
          <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded w-1/3" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded-full w-20" />
            <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded-full w-24" />
          </div>
          <div className="h-12 bg-stone-200 dark:bg-stone-700 rounded-xl w-full mt-4" />
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/3" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 bg-stone-200 dark:bg-stone-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden animate-pulse">
      <div className="h-48 bg-stone-200 dark:bg-stone-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded-full w-1/3" />
        <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded w-3/4" />
        <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded-full w-1/2" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded w-1/3" />
          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/5" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
