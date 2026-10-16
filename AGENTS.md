# SAFORA landing-page repository

This repository owns the public marketing site and its illustrative product preview.

- GitHub: https://github.com/Safora-dashboard/safora
- Local checkout: `D:/safora-landing` on this workstation. Use this checkout as the working directory for landing-page work.
- The application dashboard belongs to the separate `Safora-dashboard/safora-dashboard` repository. Do not edit it for landing-page tasks or import its files, packages, environment variables or database configuration.

## Architecture

`dist/` is the tracked, deployable static website. There is no build step, backend API, database, SQL Server dependency or dashboard login. The interactive product views use local, explicitly illustrative records from `dist/modules/preview-data.js`.

All JavaScript modules, SVG icons, styles, brand assets and tests required by the site are contained in this repository. Production has no runtime npm dependencies. Development dependencies are installed from this repository's lockfile.

## Commands

```sh
npm ci
npm run dev
npm run check
npm run format:check
npm test
npm run test:e2e
```

The local page is http://localhost:4175. Browser tests install Chromium with `npx playwright install chromium` and manage their own preview server when needed.

## Environment isolation

- `LANDING_PORT`: optional local server port, default `4175`.
- `LANDING_BASE_URL`: optional remote target for browser tests. Omit it to test the local server.
- Generic `PORT` and `BASE_URL` variables are intentionally ignored to prevent inherited dashboard settings from redirecting the landing server or tests.
- No `.env` file is required or loaded. Never copy the dashboard's `.env` or credentials here. Local `.env*` files are ignored by Git.
- `CI` is used only by the browser-test runner and reporting configuration.

## Editing and validation

Keep semantic page content in `dist/index.html`, interactions in the typed modules under `dist/modules/`, and section styles under `dist/styles/`. Icons share the 24px outline sprite in `dist/assets/icons.svg`; do not restore the old colorful dashboard illustrations.

Preserve the SAFORA logo, purple/navy identity, keyboard navigation, accessible finding dialog, reduced-motion support and clear demo-data labeling. Demo contact links use `support@safora.ai`; do not imply live integrations or collect visitor data without implementing the corresponding behavior.

Run checks appropriate to the change. Browser tests cover the three preview views, narrow layouts, finding dialogs and accessibility. Generated screenshots, research scripts and reports belong in ignored `artifacts/`, `test-results/` or `playwright-report/`, never in the static deployment.

## Publishing

GitHub Pages is configured by `.github/workflows/pages.yml`, which publishes `dist/` after checks. Use GitHub Actions as the Pages source. Keep asset references relative so the site works under the repository's project path as well as at a domain root. Never change repository visibility to enable Pages without the user's explicit authorization.

When publishing through Sites, reuse its project ID in `.openai/hosting.json` and keep its source synchronized to the matching published commit. Preserve the existing Site audience. Domain registration does not configure DNS or make a private Site public.
