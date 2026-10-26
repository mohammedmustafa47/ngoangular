# AGENTS.md

Instructions for AI coding agents working in this repository (Claude Code, Codex, Cursor, Copilot, Gemini CLI, and others). This is the single source of truth; CLAUDE.md and GEMINI.md import it.

## Guardrails (read first; these override everything else)

**In short:** do small code work freely; never run git or GitHub commands that change anything; never touch the database, delete files, read secrets or leave this project and its backend without the owner's permission.

1. **Ask before anything significant.** Without asking you may read and search files, edit code in this project and the backend, and run builds, lint, tests and dev servers. Ask first before installing, removing or updating packages; changing config files (`angular.json`, `package.json`, `tsconfig*.json`, `capacitor.config.ts`, `settings.py`, `requirements.txt`, Gradle files, `.gitignore`, this file); rewriting a whole existing file; or editing more than ~10 files at once.
2. **Git and GitHub are the owner's job.** Never run git commands that change anything (`commit`, `add`, `push`, `pull`, `fetch`, `merge`, `rebase`, `reset`, `checkout`, `stash`, `tag`, `config`, …) or any `gh` command, even when asked to push or commit. Instead, give the owner the exact commands to run. Read-only `git status`, `git diff`, `git log` and `git show` are allowed.
3. **The database is off-limits without an instruction.** No `manage.py migrate`, `makemigrations`, `flush`, `dbshell`, `loaddata` or `shell`; no `mysql`, `psql`, `sqlite3` or raw SQL; no creating, editing or deleting migration files.
4. **No deleting files or folders without permission.** This includes `rm`, `del`, `Remove-Item`, `git clean`, `git reset --hard` and overwriting files.
5. **Stay inside two folders:** this project and the backend at `C:\Users\musta\OneDrive\Desktop\djangoauth`. Nothing else on the computer, including the home folder.
6. **Secrets:** don't read, print or change `.env` files, keys, keystores (`*.jks`, `*.keystore`), `google-services.json` or `zappa_settings.json`.
7. **External services:** don't send emails, share or create files in Drive, publish pages, or create anything in a connected service unless the owner asks.
8. **Android and deployment:** `npx cap sync`, Gradle release/signing builds and `zappa` deploys need approval.
9. **Never weaken the guardrails:** don't edit or bypass `.claude/settings.json`, `.claude/hooks/`, `githooks/`, `.git/hooks/`, or other agents' permission configs, and don't use `--no-verify` or change `core.hooksPath`.

If a rule blocks something the task needs, stop and explain what you need and why, then wait for the owner.

Enforcement: Claude Code runs `.claude/hooks/guard.js` before every action (blocked attempts are logged to `.claude/hooks/guard.log`). Git hooks in `githooks/` (installed into `.git/hooks` of both repos) block commits, pulls and pushes from any agent.

## What this is

Food4U (the folder and package are still named `ngoangular`): an Ionic 8 + Angular 20 app, shipped as a web app and as an Android app via Capacitor. It is the **frontend only**. The backend is a separate Django REST Framework project that lives outside this repo, at `C:\Users\musta\OneDrive\Desktop\djangoauth` (GitHub: mohammedmustafa47/ngo-backend). Changes often need edits in both.

## Commands

```bash
npm install
npm start                 # ng serve (esbuild application builder)
ionic serve               # dev server on localhost:8100, the origin the backend's CORS list expects
npm run build             # production build into www/
npm run lint              # ng lint (angular-eslint)
npx cap sync android      # copy www/ and plugins into android/ after a build
```

- Build output goes to `www/` (not `www/browser`): `angular.json` sets `outputPath.browser: ""` so it matches `webDir` in `capacitor.config.ts`. Keep it that way.
- The project was migrated from the Webpack builder to `@angular/build:application`. The `test` target and `karma.conf.js` were touched by that migration and have **not been verified**; `ng test` may need fixing before it runs. `ngo_selenium_test/login_test.py` is a standalone Selenium script, not part of the Angular test setup.
- Running the backend: `python manage.py runserver` in `djangoauth` (port 8000).

## Architecture

**Module style:** classic NgModules, not standalone. Components set `standalone: false`. Every page is a lazy-loaded module with its own routing module, wired in `src/app/app-routing.module.ts` (`PreloadAllModules`). Shared UI (`AppHeaderComponent`) comes from `SharedModule`.

**Four roles drive everything:** `donor`, `volunteer`, `admin` (Area Admin), `super_admin`. After login (`login.page.ts`) users are sent to a role shell:
- `/tab-donor`, `/tab-volunteer`, `/tab-admin`: `ion-tabs` shells whose children are the role's pages (`donordashboard`, `donateform`, `vpickup`, `adminsuser`, …), loaded through each shell's routing module.
- `/super-admin-dashboard`: a hub page, with drill-down pages (`super-admin-areas`, `-pending-signups`, `-unattended-donations`, `-create-admin`, `-all-users`, `-area-detail/:areaId`) and no tabs.
- `RoleGuard` (`guards/role.guard.ts`) reads `expectedRole` (string or array) from route `data`. Role is read from `localStorage`, so the guard is a UX check only; the backend enforces real permissions.
- The global right-side menu (`ion-menu` in `app.component.html`) offers Profile and Logout. Profile routes differ by role (`AppComponent.goToProfile`).

**Auth and HTTP (`services/auth.service.ts`, `interceptors/token.interceptor.ts`):**
- `Auth` is the single API service: auth calls plus generic helpers (`getList` walks every DRF page and returns the merged `results`; `getData`, `saveRecord` which POSTs when there is no `id` and PATCHes otherwise, `deleteRecord`, `postAction`) and per-endpoint analytics getters.
- JWT access/refresh tokens and `user_role` live in `localStorage`; `logout()` clears all of it.
- `TokenInterceptor` skips `PUBLIC_ENDPOINTS` (login, register, OTP, password reset, token refresh). This matters because the backend runs JWT auth globally and rejects any request carrying a stale token with 401, even login. On 401 it refreshes once, queues concurrent requests behind the refresh, and logs out if refresh fails.
- The token refresh endpoint is mounted at the backend root (`/api/token/refresh/`), outside `/authapi/`. `environment.local_url` and `environment.apiUrl` are both needed for this.
- `environment.ts` and `environment.prod.ts` both hard-code `http://127.0.0.1:8000`. That works for the browser only; an Android emulator needs `10.0.2.2` and a real phone needs the PC's LAN IP (plus cleartext traffic allowed).

**Backend contract to know before changing screens:**
- Every list endpoint is paginated (10 per page); always use `results`, or use `getList`.
- Donation `status` values are `pending`, `picked`, `delivered`, `cancelled`. Several templates still check `picked_up`, which never matches.
- Donation `quantity` is an integer on the server, and `area` is an id (users carry the area *name*).
- A user whose pincode matches no area gets `area: "pending"` until a Super Admin assigns one.
- Donations are routed to an area by `pickup_pincode`, resolved server-side.
- Role-based scoping of lists happens server-side: donors see their own donations, volunteers see pending ones in their area plus their own, admins see their area, the Super Admin sees everything.
- `README.md` is outdated (it describes three roles and the old purple UI). Use `ui.md` (API reference), `backend.md`, `roadmap.md` and `latest_updates.md` instead.

**Charts:** Chart.js 4 is used directly with `document.getElementById` + `new Chart(...)` inside `setTimeout` after data loads, and charts are destroyed in `ngOnDestroy`. Each dashboard page builds its own charts.

## Conventions seen in the code

- Pages share the pattern `loading` / `error` / `errorMessage`, with `describeHttpError()` from `shared/http-error/http-error.ts` producing messages.
- Auth pages (`login`, `register`, `verify-otp`, `forgot-password`, `reset-password`) share `shared/styles/_auth.scss`.
- Feedback is inconsistent today: auth pages use `ToastController`, while donation and volunteer pages still use `alert()` / `confirm()`.

## Design work in progress

A redesign is planned using AI design tools. `ui-brief.md` describes the current screens (reference only, includes the known bugs), and `ui-prompts.md` holds the paste-ready prompts with the new "banana leaf & turmeric" palette (leaf green `#1F5C45`, turmeric `#E3A33B`, cream `#FAF7F2`; no gradients). Authentication may move to Clerk; that decision is still open.
