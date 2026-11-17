# DarnJefe portfolio dashboard

Responsive React/Vite portfolio dashboard deployed via GitHub Actions and GitHub Pages.

The source lives in `src/main.jsx` and `src/style.css`. The dashboard requests **public-only** GitHub API data; featured project narratives are manually curated. No private GitHub repository content is displayed.

Deployment: on a push to `main`, the `.github/workflows/deploy.yml` workflow installs dependencies, builds the React project and publishes `dist/` to GitHub Pages. GitHub repository Settings → Pages → Source must be set to **GitHub Actions**.

Run `npm ci` and `npm run build` for a local candidate. The build verifies the
actual `dist/` that the workflow uploads: the index must load the built entry,
and the artifact must exclude JSX/TypeScript and source maps. A Pages setup
that deploys from the root branch instead serves the raw JSX. Check the
deployed root and its referenced JavaScript after any authorized release.

This repo is public.
