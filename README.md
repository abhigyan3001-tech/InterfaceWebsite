# Interface AI

**Any Source. Any Format. Any Destination.**

Interface AI is an early-stage initiative building domain-independent data migration and transformation technology. The goal is to ingest data from one system, map and transform it, validate the results, and deliver it in the format required by another system.

## Website

The public-facing website is a static, responsive site with no build step:

| File | Purpose |
| --- | --- |
| [index.html](index.html) | Home page |
| [contact.html](contact.html) | Contact form (name, email, description) |
| [contact.php](contact.php) | Emails contact form submissions to `contact@interfaceai.io` (needs PHP 8.1+) |
| [privacy.html](privacy.html) | Privacy policy |
| [assets/styles.css](assets/styles.css) | Shared styles |
| [assets/main.js](assets/main.js) | Footer year, "copy email" button and contact form submission |
| [favicon.svg](favicon.svg) | Browser tab icon / logo |
| [.htaccess](.htaccess) | HTTPS redirect, security headers and caching (Apache/Hostinger) |

Open `index.html` locally in a browser to preview.

## Our initial products

| Product | Focus | Status |
| --- | --- | --- |
| Interface Data | System-to-system structured data migration, starting with life insurance policies | Early CSV-to-JSON prototype |
| Interface Knowledge | Employee and team knowledge portability across work tools | Planned |
| Interface Illustrate | Life insurance illustration, rider and benefit comparisons | Planned |

The platform vision is industry-agnostic. Insurance is an initial use case, **not** the overall scope.

## How migration works

1. **Ingest** source datasets from exports, files or integrations.
2. **Map** source fields to the destination data model.
3. **Transform and validate** records; flag exceptions for review.
4. **Deliver** the required target format or integrate with the destination.

## Technical approach

The initial life-insurance proof of concept uses FastAPI, CSV ingestion, deterministic mapping rules, validation, and canonical JSON output. It is not production-ready; it does not yet include live source/destination connectors, enterprise authentication, or real AI-driven mapping.

See [docs/PRODUCT_VISION.md](docs/PRODUCT_VISION.md) and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Hosting on Hostinger

The site deploys automatically from the `main` branch using Hostinger's Git integration and a GitHub webhook. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the one-time setup and the manual-upload fallback.

## Contact

The website uses `contact@interfaceai.io`. Send a test email to it and confirm it is received before publishing.

## Disclaimer

Product names and brand assets are working concepts. Trademark clearance and production readiness have not been established.
