# SAFORA landing page

Independent, dependency-free startup marketing site for SAFORA, maintained in https://github.com/Safora-dashboard/safora. The visual design follows the SAFORA dashboard: white cards, navy typography, purple accents, 12px card radii and the original logo and module icons.

## Run

Requires Node.js 20 or later. No installation or database is needed.

```sh
npm run dev
```

Open http://localhost:4175. `npm run check` checks the JavaScript syntax.

## Edit and deploy

The deployable website is in `dist/`: `index.html`, `style.css`, `app.js`, `favicon.svg`, and `assets/`. The directory is tracked because the project is buildless. Any static host can serve it. `.openai/hosting.json` identifies the separate Sites project.

The interactive product preview has Overview, Cloud Security and Control Validation views. Tabs support mouse and keyboard interaction, adapting arrow-key directions to the layout. Mobile navigation supports Escape and closes after navigation; FAQs use native disclosure controls. All product counts are explicitly illustrative. Contact actions open an email draft addressed to support@safora.ai. Google Fonts are optional; system fonts are the fallback. Reduced-motion preferences are respected.

## Custom domain

The intended company domain is safora.ai. Deployment to Sites does not configure domain ownership or DNS. Connect the domain through a host that supports custom domains, using the exact DNS records supplied by that host. Avoid changing existing mail records. Serve `dist/` over HTTPS and redirect the alternate hostname to the chosen canonical hostname. Add the canonical URL and sitemap once the production domain is connected.

## Validation

`npm run check` verifies JavaScript syntax. `scripts/verify.mjs` is an optional workspace verification helper using the existing Playwright installation in `D:/safora-dashboard/e2e` (no website dependencies are needed). With the local server running, `node scripts/verify.mjs` checks all three views at six viewport widths, document overflow, broken images, runtime errors, keyboard tabs, mobile navigation, FAQ disclosure and contact targets. Screenshots and the report are written to ignored `artifacts/`.
