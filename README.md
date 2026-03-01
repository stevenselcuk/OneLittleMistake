<div align="center">
<img src="https://i.imgur.com/xmti3Mo.png" />
</div>

# One Little Mistake

[![CI/CD](https://github.com/stevenselcuk/onelittlemistake/actions/workflows/ci.yml/badge.svg)](https://github.com/stevenselcuk/onelittlemistake/actions/workflows/ci.yml)

## Development Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint checks
- `npm run format`: Format code with Prettier
- `npm run test`: Run Vitest unit tests
- `npm run test:e2e`: Run Playwright E2E tests
- `npm run preview`: Preview the production build locally

## CI/CD Pipeline

The project uses GitHub Actions for CI/CD. On Every push to `main` and pull requests:

1. Lints the code.
2. Runs unit tests.
3. Runs E2E tests using Playwright.
4. Deploys the application to GitHub Pages (on push to `main` only).

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`
