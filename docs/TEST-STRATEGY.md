# Test strategy

Prioritize financial totals, stock limits and successful checkout. Validate persisted API state in UI scenarios. Prices use integer paise; tests verify shipping on both sides of its threshold. Negative API requests must preserve existing cart data and avoid creating orders.

Every test has a UUID workspace. Test-scoped request contexts work without browsers. UI tests explicitly share that workspace with the API helper. Teardown removes only the current test's session, permitting parallel execution without global resets.

Run typecheck, API regression and headed purchase smoke locally; then run Chromium regression in CI. Investigate screenshots/traces and first-attempt failures when a CI retry passes. Service-failure tests use route mocks and verify retained cart plus successful retry.

Limitations: in-memory demo, no real payments or auth, no full security/accessibility/load certification, no concurrent-order idempotency guarantee. Do not list it as commercial employer work.
