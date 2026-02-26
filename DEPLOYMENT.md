# Deployment Guide

## 1) Push to GitHub

If this local folder is not initialized:

```bash
git init
git add .
git commit -m "Prepare deploy"
git branch -M main
git remote add origin https://github.com/Aakashralhan/JobScraper.git
git push -u origin main
```

If already initialized:

```bash
git add .
git commit -m "Prepare deploy"
git remote add origin https://github.com/Aakashralhan/JobScraper.git  # only if remote missing
git branch -M main
git push -u origin main
```

## 2) Deploy on Render (recommended for this stack)

1. Open https://dashboard.render.com
2. Click **New +** -> **Blueprint**
3. Select repo `Aakashralhan/JobScraper`
4. Render will read `render.yaml` and create:
   - `jobscrapper-backend` (Docker web service)
   - `jobscrapper-frontend` (static site)
5. After deploy, open frontend URL and test search.

## 3) Share URL

Share the frontend URL from Render, for example:

`https://jobscrapper-frontend.onrender.com`

## Notes

- Backend runs Selenium + Chromium inside Docker (`jobscrapper-backend/Dockerfile`).
- Frontend API base URL is set via `VITE_API_BASE_URL` in `render.yaml`.
- First backend run can be slow due browser startup.
