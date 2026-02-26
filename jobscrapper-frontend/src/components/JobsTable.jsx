import { useMemo, useState } from "react";

const columns = [
  ["Platform", "platform"],
  ["Job Title", "title"],
  ["Company", "company"],
  ["Location", "location"],
  ["Source", "source"],
  ["Date Posted", "posted_at"],
  ["View Job", "url"]
];

const PAGE_SIZE = 10;

export default function JobsTable({ rows }) {
  const [sortBy, setSortBy] = useState("platform");
  const [direction, setDirection] = useState("asc");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const list = [...rows];
    list.sort((a, b) => {
      const av = String(a[sortBy] ?? "").toLowerCase();
      const bv = String(b[sortBy] ?? "").toLowerCase();
      if (av < bv) return direction === "asc" ? -1 : 1;
      if (av > bv) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [rows, sortBy, direction]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginated = sorted.slice(start, start + PAGE_SIZE);

  function onSort(key) {
    if (sortBy === key) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(key);
    setDirection("asc");
  }

  if (!rows.length) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center text-sm text-slate-500 shadow-soft dark:bg-slate-900 dark:text-slate-300">
        No jobs available yet. Run a search to load results.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr>
              {columns.map(([label, key]) => (
                <th key={key} className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">
                  <button
                    className="inline-flex items-center gap-1 hover:text-brand-600"
                    onClick={() => onSort(key)}
                  >
                    {label}
                    {sortBy === key ? (direction === "asc" ? "↑" : "↓") : ""}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((job, index) => (
              <tr key={`${job.url || index}-${index}`} className="rounded-xl bg-slate-50 dark:bg-slate-800/70">
                <td className="rounded-l-xl px-3 py-2">{job.platform || "-"}</td>
                <td className="px-3 py-2">{job.title || "-"}</td>
                <td className="px-3 py-2">{job.company || "-"}</td>
                <td className="px-3 py-2">{job.location || "-"}</td>
                <td className="px-3 py-2">{job.source || "-"}</td>
                <td className="px-3 py-2">{job.posted_at || "-"}</td>
                <td className="rounded-r-xl px-3 py-2">
                  {job.url ? (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-brand-600 hover:text-brand-700"
                    >
                      Open
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
        <p>
          Showing {start + 1}-{Math.min(start + PAGE_SIZE, sorted.length)} of {sorted.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-40 dark:border-slate-700"
          >
            Prev
          </button>
          <span>
            Page {safePage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-40 dark:border-slate-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
