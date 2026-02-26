import { useMemo, useState } from "react";
import { FaHeart } from "react-icons/fa6";


const PLATFORM_OPTIONS = ["LinkedIn", "Indeed", "Naukri", "Foundit", "Glassdoor"];
const TIME_OPTIONS = ["Last 24 Hours", "Last 3 Days", "Last 5 Days"];

export const defaultFilters = {
  role: "",
  location: "",
  platforms: ["LinkedIn"],
  timeFilter: "Last 5 Days"
};

export default function Sidebar({ filters, setFilters, onSearch, onClear, loading, darkMode, setDarkMode }) {
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const platformText = useMemo(
    () => (filters.platforms.length ? filters.platforms.join(", ") : "Select platforms"),
    [filters.platforms]
  );

  function togglePlatform(platform) {
    const has = filters.platforms.includes(platform);
    const platforms = has
      ? filters.platforms.filter((p) => p !== platform)
      : [...filters.platforms, platform];
    setFilters((prev) => ({ ...prev, platforms }));
  }

  return (
    <aside className="sticky top-0 h-screen w-full max-w-xs border-r border-slate-200/80 bg-white/80 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mb-8">
        <p className="flex items-center gap-2 text-[1rem] font-semibold uppercase tracking-wider text-brand-600">
           <span className="inline-block text-red-500 animate-bounce"> <FaHeart size={18}/> </span>
          Aakash Web Developer
          <span className="inline-block text-red-500 animate-bounce"> <FaHeart size={18}/> </span>
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Smart Search</h1>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Role Name</span>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            placeholder="e.g. HR Manager"
            value={filters.role}
            onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Location</span>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            placeholder="e.g. Delhi, India"
            value={filters.location}
            onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
          />
        </label>

        <div className="relative">
          <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Platforms</span>
          <button
            type="button"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-left text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            onClick={() => setIsPlatformOpen((v) => !v)}
          >
            {platformText}
          </button>
          {isPlatformOpen && (
            <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              {PLATFORM_OPTIONS.map((platform) => (
                <label key={platform} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={filters.platforms.includes(platform)}
                    onChange={() => togglePlatform(platform)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  {platform}
                </label>
              ))}
            </div>
          )}
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Time Filter</span>
          <select
            value={filters.timeFilter}
            onChange={(e) => setFilters((prev) => ({ ...prev, timeFilter: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {TIME_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onSearch}
          disabled={loading}
          className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search"}
        </button>

        <button
          type="button"
          onClick={onClear}
          disabled={loading}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Clear Filters
        </button>

        <button
          type="button"
          onClick={() => setDarkMode((v) => !v)}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
}
