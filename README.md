# ShopCart — E-Commerce Playwright + TypeScript Portfolio

Personal portfolio by Durgaprasad Regonda. Includes an e-commerce demo website at **http://127.0.0.1:4183** and a TypeScript automation framework. Products, cart, checkout and order confirmation are functional demo workflows. Orders are simulated; no payment, real shipment or external service is involved.

## Run visibly on Windows
Extract the ZIP and open the folder containing package.json in VS Code. Run commands separately:
```powershell
npm ci
npm run typecheck
npm run test:headed
```
The headed command uses installed Google Chrome and one worker so you can watch one browser at a time. For installed Microsoft Edge:
```powershell
npm run test:edge:headed
```
For a step-by-step purchase walkthrough:
```powershell
npx playwright test --project=chrome --grep "complete product purchase" --debug
```
The website starts automatically. Stop any manually started ShopCart server before testing because the test runner requires port 4183. Node.js 22+ is required. Internet is needed to install dependencies; the demo itself runs locally.

## Bundled Chromium and API-only execution
```powershell
$env:PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT="120000"
npx playwright install chromium --only-shell
npm test
```
`npm test` runs API tests once plus headless Chromium UI checks. `npm run test:api` runs without any installed browser. `npm run report` opens the latest HTML report. Firefox, WebKit and mobile emulation projects are configured; install their browser binaries before selecting them. `npm run test:all` requires all configured browsers including installed Chrome and Edge.

## Browse the website yourself
```powershell
npm start
```
Open http://127.0.0.1:4183 . Press Ctrl+C to stop. Data survives page reloads but resets when the server restarts. This is an in-memory personal demo, not a live production store.

## Coverage
- Catalog search, category filtering and sold-out products
- Cart creation, quantity update, removal, persistence and UI/API consistency
- Money calculations in integer paise; shipping ₹99 below ₹5,000 subtotal and free above/equal to ₹5,000
- Checkout customer validation, simulated order confirmation and cart clearing
- API negative/boundary checks, stock limits, duplicate checkout and isolated data
- Mocked checkout outage followed by successful retry

18 API tests and 12 UI tests. See docs/VALIDATION.md for actual validation results. Configured browser projects do not imply successful execution.

## Framework
`pages/`: page object; `fixtures/`: UUID workspaces and cleanup; `support/`: typed API client; `tests/`: independent UI/API suites; `app/`: website and Node REST API; `.github/workflows/`: CI with uploaded HTML/JUnit results. Role/label locators and stable test IDs are used. No fixed sleeps. Screenshots and traces are retained on failure; video is omitted to avoid an extra encoder dependency on installed Chrome/Edge runs.

## GitHub publication
Create an empty public repository named shopcart-playwright in your account, then run from this folder:
```bash
git init
git add .
git commit -m "Add e-commerce Playwright TypeScript portfolio"
git branch -M main
git remote add origin https://github.com/prasadregonda1/shopcart-playwright.git
git push -u origin main
```
That URL is a proposed destination, not a published repository. GitHub authentication is needed. After publishing, add the actual link to Naukri and review the CI results.

## Scope
Personal demo work, not employer/client work. No authentication, production database, payment gateway or shared live stock. Workspace IDs isolate tests and are not an authorization mechanism. Stock is fixed per catalog and is validated per cart; orders do not reduce a shared inventory. The duplicate-order check verifies a sequential second attempt; no concurrent/idempotent payment guarantees are claimed. API tests are independent of browser execution. Mobile emulation is not physical-device testing.

Official configuration references: https://playwright.dev/docs/test-webserver and https://playwright.dev/docs/browsers .
