# SAFORA marketing site

A standalone landing page for the SAFORA Cyber Security Command Center, maintained in [Safora-dashboard/safora](https://github.com/Safora-dashboard/safora).

The design follows the dashboard's original logo, navy typography, purple accents and 12px cards. A shared outline icon set replaces the original colorful module illustrations. A navy-and-purple opening, responsive investigation diagram and interactive product explorer give the marketing page its own composition. The hero's "Inspect example" action opens evidence in the same accessible panel as the product explorer; without JavaScript, it links to the platform section.

Design research included [Wiz](https://www.wiz.io/), [Orca](https://orca.security/), [SentinelOne](https://www.sentinelone.com/) and [ArmorCode](https://www.armorcode.com/). The latest pass emphasizes a direct value proposition, early product presentation, readable product details and concrete information about workspace isolation, permissions and audit history. Competitor copy, customer claims, artwork and assets are not used.

## Run locally

Node.js 20 or later is required. The website and preview server have no runtime dependencies.

```sh
npm run dev
```

Open **http://localhost:4175**. Set `LANDING_PORT` to choose another port. The server binds to loopback, serves only `dist/`, supports GET/HEAD and provides correct MIME types for JavaScript modules and images.

This project is independent of the application dashboard. It needs no SQL Server, dashboard API, authentication configuration or dashboard `.env`. All commands run from this repository. Generic `PORT` and `BASE_URL` variables are ignored so inherited dashboard settings cannot redirect this site's server or browser tests. No `.env` file is loaded automatically. See [AGENTS.md](AGENTS.md) for the repository boundaries and workflow.

## Development

```sh
npm ci
npx playwright install chromium
npm run check
npm run format:check
npm test
npm run test:e2e
```

- `check`: TypeScript strict checking of the JavaScript source through JSDoc, plus validation of local imports, assets, anchors and presentation data.
- `format` / `format:check`: consistent Prettier formatting.
- `test`: Node's built-in test runner verifies HTTP behavior, MIME types and path isolation, including encoded traversal and malformed requests.
- `test:e2e`: Playwright checks three product views at seven widths (320–1920px), keyboard tabs, finding details, focus containment/restoration, mobile navigation, FAQ disclosures, contact links and essential content without JavaScript. Axe scans desktop and mobile with the finding panel closed and open.

GitHub Actions runs these checks on pushes to `main` and pull requests. Browser reports and failure traces are uploaded as workflow artifacts. Local results are ignored by Git. `LANDING_BASE_URL` can point browser tests at another deployment; omit it to use the automatically managed local preview server on `LANDING_PORT` (default `4175`).

## Source layout

```text
dist/
  index.html                 Semantic page content and initial product view
  app.js                     Small application entry point
  style.css                  Explicit stylesheet import order
  styles/
    base.css                 Tokens, typography, navigation and shared elements
    sections.css             Marketing sections, governance and responsive composition
    product.css              Product explorer and finding detail panel
    masthead.css             Opening, investigation diagram and platform scope strip
    icons.css                Shared icon sizes, stroke and contextual colors
  modules/
    dom.js                   Typed DOM creation and page-contract helpers
    icons.js                 Typed SVG icon factory and icon names
    navigation.js            Mobile disclosure navigation
    tabs.js                  Reusable keyboard-accessible tab controller
    preview-data.js          Typed illustrative product records
    product-preview.js       Safe DOM rendering for the product explorer
    finding-dialog.js        Evidence panel and focus behavior
  assets/                    Original SAFORA branding and shared icons.svg sprite
scripts/
  serve.mjs                  Preview server entry point
  static-server.mjs          Testable static HTTP server
  check-site.mjs             Static site contract validation
tests/                       HTTP tests and portable Playwright browser tests
.openai/hosting.json          Existing Sites identity and static directory
```

There is no build step: the tracked `dist/` directory is the deployable website. The JavaScript uses native ES modules, with no client framework or bundler. Product records are rendered through DOM APIs rather than HTML string interpolation. All essential marketing content, the initial metrics, native FAQs and contact links remain available without JavaScript. Native dialog semantics provide background inertness and Escape handling; explicit focus wrapping and restoration support keyboard use. Motion respects the visitor's reduced-motion preference.

## Content and contact

- Product capabilities are grounded in the current SAFORA dashboard. All explorer findings, assets and scores are explicitly illustrative, with no live resource connections or remediation actions.
- `dist/modules/preview-data.js` owns the three view definitions and evidence-panel content. Change page copy in `dist/index.html`.
- Demo links open an email draft to **support@safora.ai**. No form silently collects visitor data and no email is sent automatically.
- Fonts use the system stack; the site makes no third-party font, analytics or tracking requests.
- No customer endorsements, certification claims or measured performance claims are included.

## Deployment and domain

GitHub Pages deployment is defined in `.github/workflows/pages.yml`. It validates the site, runs browser tests and publishes only `dist/` through GitHub Actions on pushes to `main` or manual dispatch. Pages must be enabled with **GitHub Actions** as its source in the repository settings. Repository visibility and the account's GitHub plan determine Pages availability.

All asset references are relative, including the shared SVG sprite, so the same files work at a project URL such as `https://safora-dashboard.github.io/safora/`, at a custom-domain root, and locally.

The existing Sites deployment remains available. Reuse the `project_id` in `.openai/hosting.json` when explicitly publishing through Sites; keep its source synchronized to the matching published commit.

`safora.ai` has been registered as a custom hostname for this Sites project. Activation depends on the DNS and validation records returned by Sites being applied in Cloudflare. Registration alone does not change DNS or make a private Site public. Verify domain and HTTPS status before treating the custom hostname as active. No domain credentials are stored in this repository.

Any static host can also serve `dist/`. Ensure `.js` files are served as JavaScript so browser ES modules load correctly. A permanent canonical URL and sitemap can be added once the production domain is active.
