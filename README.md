# Interface AI

**Any Source. Any Format. Any Destination.**

Interface AI is a B2B SaaS AI-native iPaaS integration engine and anti-EDI smart parser that translates unstructured enterprise data using OpenAPI specifications. The platform ingests data from any source system, intelligently maps and transforms schemas, validates outputs, and delivers structured pipelines directly to target destination platforms.

## Website

The public-facing website is a static, responsive site with no build step:

| File | Purpose |
| --- | --- |
| [index.html](index.html) | Home page with dynamic canvas network and controls |
| [contact.html](contact.html) | Contact & requirements inquiry form |
| [contact.php](contact.php) | Processes form submissions and emails `contact@interfaceai.io` (needs PHP 8.1+) |
| [privacy.html](privacy.html) | Privacy policy |
| [assets/styles.css](assets/styles.css) | Core styles and theme variables (light & dark mode) |
| [assets/network.js](assets/network.js) | HTML5 `<canvas>` dynamic particle network animation |
| [assets/controls.js](assets/controls.js) | Light/dark theme toggle and offline audio player |
| [assets/main.js](assets/main.js) | Footer year, copy-to-clipboard, and form validation |
| [assets/logo-light.svg](assets/logo-light.svg) | Dark teal brand logo for light mode |
| [assets/logo-dark.svg](assets/logo-dark.svg) | Luminous aqua brand logo for dark mode |
| [assets/audio/](assets/audio/) | Curated offline soft rock tracks |
| [favicon.svg](favicon.svg) | Modern vector browser tab icon |
| [.htaccess](.htaccess) | HTTPS redirect, security headers and caching (Apache/Hostinger) |

Open `index.html` locally in a browser or serve via any static HTTP server.

## Products

| Product | Focus | Status |
| --- | --- | --- |
| Interface Data Integration | Enterprise data translation, anti-EDI smart parsing, and canonical OpenAPI JSON pipelines | Active Engine |
| Interface Knowledge | Institutional knowledge portability across enterprise workflows | Planned |
| Interface Insurance Compare | Life insurance illustration, rider, and benefit comparisons | Planned |

The platform vision is industry-agnostic. Insurance is an initial use case, **not** the overall scope.

## How integration works

1. **Ingest** source datasets from legacy ERPs, EDI feeds, files, or API integrations.
2. **Map** unstructured fields and align them with destination OpenAPI specifications.
3. **Transform & validate** payloads with intelligent parsing rules and exception flagging.
4. **Deliver** validated, structured pipelines directly to target systems.

## Technical approach

The initial implementation demonstrates schema mapping, validation, and canonical OpenAPI JSON pipelines.

See [docs/PRODUCT_VISION.md](docs/PRODUCT_VISION.md) and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Hosting on Hostinger

The site deploys automatically from the `main` branch using Hostinger's Git integration and a GitHub webhook. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the one-time setup and the manual-upload fallback.

## Contact

The website uses `contact@interfaceai.io`.
