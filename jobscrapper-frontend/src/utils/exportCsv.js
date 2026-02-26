export function exportJobsAsCsv(jobs, fileName = "jobs.csv") {
  if (!jobs?.length) return;

  const columns = [
    ["Platform", "platform"],
    ["Job Title", "title"],
    ["Company", "company"],
    ["Location", "location"],
    ["Source", "source"],
    ["Date Posted", "posted_at"],
    ["View Job", "url"]
  ];

  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = columns.map(([label]) => esc(label)).join(",");
  const rows = jobs.map((job) => columns.map(([, key]) => esc(job[key])).join(","));
  const csv = [header, ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
