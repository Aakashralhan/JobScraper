import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import xlsx from "xlsx";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const DOWNLOADS_DIR = path.resolve(__dirname, "downloads");
const WRAPPER_PATH = path.resolve(__dirname, "scripts", "run_scraper_wrapper.py");
const PYTHON_BIN = process.env.PYTHON_BIN || "python";
const PORT = Number(process.env.PORT || 4000);

fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/downloads", express.static(DOWNLOADS_DIR));

app.get("/api/health", (_, res) => {
  res.json({ ok: true });
});

app.post("/api/run-scraper", async (req, res) => {
  try {
    const { role = "", location = "", platforms = [], timeFilter = "Last 5 Days" } = req.body || {};

    if (!Array.isArray(platforms) || !platforms.length) {
      return res.status(400).json({ message: "At least one platform is required." });
    }

    const safeRole = String(role || "jobs")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "jobs";

    const outputName = `${safeRole}_${Date.now()}.xlsx`;
    const outputPath = path.resolve(DOWNLOADS_DIR, outputName);

    const args = [
      WRAPPER_PATH,
      "--role",
      String(role || ""),
      "--location",
      String(location || ""),
      "--platforms",
      platforms.join(","),
      "--time-filter",
      String(timeFilter || "Last 5 Days"),
      "--output-file",
      outputPath
    ];

    const { stdout, stderr } = await runProcess(PYTHON_BIN, args, PROJECT_ROOT);

    if (!fs.existsSync(outputPath)) {
      return res.status(500).json({
        message: "Scraper finished but output file was not generated.",
        stderr,
        stdout
      });
    }

    const jobs = parseExcel(outputPath);
    return res.json({
      message: "Scraper completed successfully.",
      jobs,
      downloadUrl: `/downloads/${outputName}`,
      stdout
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to run scraper.",
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening at http://localhost:${PORT}`);
});

function runProcess(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { cwd, shell: false });
    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    proc.on("error", (err) => reject(err));
    proc.on("close", (code) => {
      if (code === 0) return resolve({ stdout, stderr });
      reject(new Error(`Scraper exited with code ${code}. ${stderr || stdout}`));
    });
  });
}

function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const firstSheet = workbook.SheetNames[0];
  if (!firstSheet) return [];
  return xlsx.utils.sheet_to_json(workbook.Sheets[firstSheet], { defval: "" });
}
