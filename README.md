# SAFORA landing page

Independent, dependency-free startup marketing site for SAFORA. The visual direction is a security signal room: dark graphite, SAFORA violet, lime signal accents, and a custom SVG attack-path illustration.

## Run

Requires Node.js 20 or later. No installation or database is needed.

```sh
npm run dev
```

Open http://localhost:4175. `npm run check` checks the JavaScript syntax.

## Edit and deploy

The deployable website is in `dist/`: `index.html`, `style.css`, `app.js`, and `favicon.svg`. The directory is tracked because the project is buildless. Any static host can serve it. `.openai/hosting.json` identifies the separate Sites project.

The three platform tabs support mouse and keyboard interaction. All product counts are explicitly illustrative; no customer logos, certifications, testimonials or performance claims are invented. The contact action opens an email draft addressed to support@safora.ai; it does not send an email automatically. Google Fonts are optional; system fonts are the fallback. Reduced-motion preferences are respected.

## Custom domain

The intended company domain is safora.ai. Deployment to Sites does not configure domain ownership or DNS. Connect the domain through a host that supports custom domains, using the exact DNS records supplied by that host. Avoid changing existing mail records. Serve `dist/` over HTTPS and redirect the alternate hostname to the chosen canonical hostname. Add the canonical URL and sitemap once the production domain is connected.

## Validation

JavaScript syntax and local HTTP asset checks are available without browser tooling. Visual and keyboard verification should cover desktop, tablet and mobile before public launch.
