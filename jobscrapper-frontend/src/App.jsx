import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar, { defaultFilters } from "./components/Sidebar";
import JobsTable from "./components/JobsTable";
import LoginPage from "./components/LoginPage";
import StatusCard from "./components/StatusCard";
import Toast from "./components/Toast";
import { getDownloadUrl, runScraper } from "./services/api";
import { exportJobsAsCsv } from "./utils/exportCsv";

const AUTH_USERS = {
  aakashWebDev: {
    title: "Welcome Job scrapper by Aakash Ralhan",
    subtitle: "Build faster. Hire smarter."
  },
  "aakashWebDev   hardcore": {
    title: "Welcome Job scrapper by Aakash Ralhan",
    subtitle: "Build faster. Hire smarter."
  },
  "arpita(": {
    title: "Welcome dear arpita mohanty",
    subtitle: "Job scraper for you."
  }
};

const AUTH_PASS = "P2yss75k)Z|T";
const AUTH_KEY = "jobs_dashboard_auth";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeContent, setWelcomeContent] = useState({ title: "", subtitle: "" });
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [downloadPath, setDownloadPath] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const welcomeTimerRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    return () => {
      if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
    };
  }, []);

  const canSearch = useMemo(
    () => filters.platforms.length > 0 && !loading,
    [filters.platforms.length, loading]
  );

  async function handleSearch() {
    if (!canSearch) return;
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const data = await runScraper(filters);
      setJobs(data.jobs || []);
      setDownloadPath(data.downloadUrl || "");
      setSuccess(true);
      setToast({ type: "success", message: "Job scrape completed successfully." });
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to run scraper.";
      setError(msg);
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setFilters(defaultFilters);
    setJobs([]);
    setDownloadPath("");
    setError("");
    setSuccess(false);
  }

  function handleLogin(username, password) {
    const normalizedUser = String(username || "").trim();
    const profile = AUTH_USERS[normalizedUser];
    if (!profile || password !== AUTH_PASS) return false;

    sessionStorage.setItem(AUTH_KEY, "1");
    setIsAuthenticated(true);
    setWelcomeContent(profile);
    setShowWelcome(true);

    if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
    welcomeTimerRef.current = setTimeout(() => setShowWelcome(false), 1000);
    return true;
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setFilters(defaultFilters);
    setJobs([]);
    setDownloadPath("");
    setError("");
    setSuccess(false);
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-bg min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {showWelcome ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-white/35 bg-gradient-to-br from-rose-100 via-white to-sky-100 px-6 py-8 text-center shadow-2xl dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            <p className="text-2xl font-bold tracking-tight">{welcomeContent.title}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{welcomeContent.subtitle}</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="text-3xl text-rose-500 animate-bounce">?</span>
              <span className="text-2xl text-rose-400 animate-pulse">?</span>
              <span className="text-3xl text-rose-500 animate-bounce">?</span>
            </div>
          </div>
        </div>
      ) : null}
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
        <Sidebar
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onClear={clearFilters}
          loading={loading}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className="flex-1 p-4 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Scraped Jobs</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Search and view jobs from your Python scraper output.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700"
              >
                Logout
              </button>
              <button
                onClick={() => exportJobsAsCsv(jobs, "jobs_export.csv")}
                disabled={!jobs.length}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40 dark:border-slate-700"
              >
                Export CSV
              </button>
              <a
                href={downloadPath ? getDownloadUrl(downloadPath) : "#"}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                  downloadPath ? "bg-brand-600 hover:bg-brand-700" : "pointer-events-none bg-slate-400"
                }`}
              >
                Download Excel
              </a>
            </div>
          </div>

          <div className="mb-4">
            <StatusCard loading={loading} error={error} success={success} count={jobs.length} />
          </div>

          <JobsTable rows={jobs} />
        </main>
      </div>
    </div>
  );
}
