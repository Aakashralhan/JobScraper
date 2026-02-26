export default function StatusCard({ loading, error, success, count }) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-slate-900">
        <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
          Running scraper. This can take a few minutes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
        {error}
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
        Scrape complete. {count} jobs loaded.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-soft dark:bg-slate-900 dark:text-slate-300">
      Configure filters in the sidebar and click Search.
    </div>
  );
}
