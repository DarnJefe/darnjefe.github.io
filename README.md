# DarnJefe portfolio dashboard

Responsive React/Vite portfolio dashboard deployed via GitHub Actions and GitHub Pages.

The source lives in `src/main.jsx` and `src/style.css`. The dashboard requests **public-only** GitHub API data; featured project narratives are manually curated. No private GitHub repository content is displayed.

Deployment: on a push to `main`, the `.github/workflows/deploy.yml` workflow installs dependencies, builds the React project and publishes `dist/` to GitHub Pages. GitHub repository Settings → Pages → Source must be set to **GitHub Actions**.

No local setup is required to publish. This repo is public.
