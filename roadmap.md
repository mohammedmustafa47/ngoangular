# Frontend Roadmap — vs `ui.md` Backend Spec

Snapshot of what's built against the API surface described in [ui.md](ui.md), and what's left. Status legend: ✅ Done · 🟡 Partial · ❌ Missing.

---

## Implementation Phases

Ordered so each phase only depends on work already done in a prior phase. Sections referenced below are detailed further down.

### Phase 0 — Foundation (blocks everything) — ✅ Done
- Moved `Auth.baseUrl` and the hardcoded URL in `vpickup.page.ts` onto `environment.apiUrl` ([Cross-Cutting Cleanup](#cross-cutting-cleanup)).
- Fixed `Auth.refreshUrl` — was incorrectly nested under `/authapi/`, now correctly points at the root-mounted `/api/token/refresh/` per the Django `urlpatterns`.
- Removed the dead, commented-out routes in `app-routing.module.ts` — turned out those pages (vprofile, vpickup, admindashboard, etc.) are already reachable as child routes under `tab-admin`/`tab-donor`/`tab-volunteer`, and `login.page.ts` already navigates there by role. No pages were actually unreachable; the commented block was just leftover duplicate routing.
- **Exit criteria**: every existing page is reachable via routing and no request uses a hardcoded host. ✅ Met.

### Phase 1 — Auth & Onboarding Completeness (§1, §2) — ✅ Done
- Added `verify-otp` page: register now redirects here (with `?email=`) instead of straight to login; calls new `Auth.verifyEmail()` / `Auth.resendOtp()` methods (`auth_verify_email`, `auth_resend_otp`).
- Added the register form's missing **pincode** field — required by `auth_register` per ui.md §2, previously omitted entirely so real registrations would have 400'd.
- Built the forgot-password 3-screen flow: `forgot-password` page handles steps 1–2 (email → OTP) as an internal 2-step wizard, `reset-password` page handles step 3 (new password + confirm). New service methods: `requestPasswordReset()`, `verifyPasswordResetOtp()`, `confirmPasswordReset()`.
- Fixed the dead "Forgot Password?" link in `login.page.html` to `routerLink="/forgot-password"`.
- Token refresh interceptor (`token.interceptor.ts`) turned out to **already be implemented and registered** in `app.module.ts` — the earlier audit was wrong on this point. No new work needed once Phase 0's URL fix landed.
- Added `Auth.getProfile()` / `Auth.getDashboard()` typed methods for `auth_profile` / `auth_dashboard`, matching ui.md's shapes.
- **Scope note**: `donorprofile`/`vprofile` pages still render fully hardcoded mock content (fake name, fake stats, fake activity) — wiring them to `getProfile()` is left for a later pass since it overlaps with Phase 3 (analytics) and Phase 4 (donation history) rather than being pure auth work.
- **Exit criteria**: a brand-new user can register, verify by OTP, log in, recover a forgotten password, and stay logged in across token expiry — with no backend changes needed. ✅ Met (pending manual/live-backend verification).
- **Live-testing correction (post-Phase-6)**: ui.md §2 documents `POST /auth_login` as `{username, password}`, but the real backend actually expects `{email, password}`. Confirmed against the live server, not just the doc. `Auth.login()`, `login.page.ts`, and the login form field are now `email`-based. If other doc'd request shapes turn out to be similarly stale, trust the live backend over ui.md and update both the code and this note.

### Phase 2 — Role-Based Routing & Guards (§9) — ✅ Done
- Removed the dead `admin`/`donor`/`volunteer` stub pages and their `/admin`, `/donor`, `/volunteer` routes — these were orphaned placeholders left over from before the app switched to `tab-admin`/`tab-donor`/`tab-volunteer`; only `/admin` had a (misleading) guard, and nothing navigated to any of the three anymore.
- `RoleGuard` now accepts `expectedRole` as a string **or** an array of strings, so one route can allow multiple roles.
- Guarded the routes that are actually used: `/tab-admin` → `['admin', 'super_admin']` (per ui.md §1/§10, Super Admin can drill into an Area Admin's dashboard), `/tab-donor` → `donor`, `/tab-volunteer` → `volunteer`.
- Added a new `/super-admin-dashboard` route + placeholder page, guarded to `super_admin` only — gives that role somewhere to land; full Areas/Pending-Signups/analytics content is still Phase 6.
- `login.page.ts` now branches `super_admin` → `/super-admin-dashboard` before the existing `admin`/`donor`/`volunteer` branches.
- **Exit criteria**: each of the 4 roles lands on the correct area after login and cannot navigate into another role's routes. ✅ Met — verified via `ng build` (see below); live-backend click-through still recommended before shipping.

### Phase 3 — Analytics Wiring (§8) — ✅ Done
- Added `Auth.getDonorAnalytics()` / `getVolunteerAnalytics()` / `getAreaAdminAnalytics(areaId?)` / `getSuperAdminAnalytics()`.
- `donordashboard`: KPIs (Total Donations, Delivered, In Progress, Fulfillment Rate, Items Donated) and both charts (donations-over-time line, status doughnut) now come from `analytics/donor`. Dropped the "Active Volunteers" tile (no such field in this endpoint) and the fabricated "reduced waste by 12%" claim in the Impact Summary card.
- `vdashboard`: KPIs (Picked Up, Completed, Avg Delivery Time, Success Rate, Cancelled) and charts (deliveries-over-time line, completed-vs-cancelled doughnut, status-breakdown bar) now come from `analytics/volunteer`. Dropped the fabricated "Hours Logged" tile — no such metric exists server-side; `avg_delivery_hours` replaced it.
- `admindashboard` + `adminreport` (both Area Admin, both hitting `analytics/area-admin`): KPIs, donations-over-time chart, status doughnut, and a **Top Volunteers bar chart from the real leaderboard field** all wired up. Removed fabricated names ("Aisha Khan", "John Doe") and made-up percentages from the Performance/Insights cards, replaced with real `avg_delivery_hours` and `leaderboard[0]`.
- Built out `/super-admin-dashboard` for real (was a placeholder from Phase 2): KPIs, a stacked bar chart of `by_area`, a doughnut of `users_by_role`, a leaderboard list, and an areas list — all from `analytics/super-admin`.
- `avg_delivery_hours: null` handled everywhere it's displayed (renders `—` instead of `NaN`/`null`).
- **Known limitation carried forward**: `admindashboard`/`adminreport` call `getAreaAdminAnalytics()` with no `area_id` — correct for the `admin` role (ignored per ui.md), but if a `super_admin` navigates into `/tab-admin` directly (rather than via a proper drill-down control) this will 400, since ui.md requires `?area_id=` for that role on this endpoint. The drill-down UI to pass an explicit area id is deferred to Phase 6 alongside the rest of the Super Admin area-management screens.
- **Exit criteria**: every dashboard tile/chart reflects live backend data for its role. ✅ Met — verified via `ng build`; live-backend click-through still recommended before shipping.

### Phase 4 — Donations Gaps (§7) — ✅ Done
- **Critical bug found and fixed**: `Auth.getList()` returned the raw DRF response instead of unwrapping `.results` — since ui.md §0 specifies every list endpoint (`donations`, `users`, `areas`, etc.) is paginated as `{count, next, previous, results}`, every page consuming `getList()` (`vpickup`, `donatehistory`, `admindonation`, `adminsuser`) was calling `.filter()`/`.length`/`*ngFor` on a paginated **object**, not an array — these pages would have thrown or rendered nothing at all against the real backend. Fixed centrally in one place so all four pages (and future ones) get it for free. Known follow-up: this only surfaces page 1 (10 items) — proper "load more"/pagination UI is a separate, later task, not blocking this phase.
- Added `Auth.deleteRecord(type, id)`; wired a **Delete** button into `donatehistory` (donor, own pending donations only) and `admindonation` (Area Admin/Super Admin, any donation).
- Hooked up the previously-unused `loadDonation()`: `donateform` now reads `?id=` from the query string, loads the record, and switches into edit mode (title changes to "Edit Donation", save does a PATCH and navigates back to history instead of resetting the form). Added an **Edit** button in `donatehistory` linking here.
- `pick_donation`/`update_status` were already moved off raw `HttpClient` onto `Auth.postAction()` back in Phase 0.
- **Exit criteria**: full donation lifecycle (create → pick → deliver/cancel → edit/delete) works through one consistent service layer. ✅ Met — verified via `ng build`; the `getList()` fix in particular needs a live-backend smoke test since it was never actually exercised against real paginated data before.

### Phase 5 — User Management (§5) — ✅ Done
- View-single was already effectively covered — each user card in `adminsuser` already renders the full object (email, role, status, join date, etc.) returned by the list endpoint, so a separate detail page/call would just duplicate it.
- Added inline **Edit** (username/email only, per ui.md §6 — role/area are read-only through this endpoint and would be silently ignored if sent) via `Auth.saveRecord('users', ...)`, and **Delete** via the new `Auth.deleteRecord()`. Both use the action-button scaffolding that was already in the template behind `*ngIf="false"`.
- **Exit criteria**: Area/Super Admin can fully manage users within their scope from the UI. ✅ Met — verified via `ng build`; live-backend check still recommended, especially that role/area edits are indeed silently ignored as ui.md describes rather than erroring.

### Phase 6 — Super Admin Module: Areas + Pending Signups (§3, §4) — ✅ Done
- Added `Auth.getAreas()/getArea()/createArea()/updateArea()/deleteArea()` and `getPendingAreaUsers()/assignArea(userId, areaId)`.
- New `/super-admin-areas` page: create a new area (name + comma-separated pincodes), list all areas with active/inactive badge, inline edit (name/pincodes/active toggle), and delete.
- New `/super-admin-pending-signups` page: lists pending users, a per-row area picker, and an "Assign to Area" button calling `assign-area`; surfaces the backend's "second Area Admin in one area" 400 error directly.
- Both new routes are guarded to `super_admin` only, same as `/super-admin-dashboard` from Phase 2.
- Linked both from the Super Admin dashboard (replaced the Phase 3 placeholder "coming in a later phase" note on the Areas card).
- Also unwrapped `.results` for these two new paginated endpoints (`areas/`, `pending-area-users`) directly in the page code, consistent with the Phase 4 `getList()` fix — these two don't go through `getList()` since they're typed `Observable` calls, not the generic `Promise` helper.
- **Exit criteria**: a Super Admin can open a new town, manage its pincodes, and resolve every pending signup without touching the backend directly. ✅ Met — verified via `ng build`; live-backend check recommended, particularly the "second Area Admin" 400 case and the pincode-format validation.

### Phase 7 — Custom Roles (§6)
- Lowest priority; ui.md itself flags this as a secondary, legacy system. Only build if a concrete badge/tag use case shows up.

---

## 1. Auth & Onboarding

| Item | Status | Notes |
|---|---|---|
| Register | ✅ | [register.page.ts](src/app/register/register.page.ts) posts to `auth_register` with username/email/pincode/role/password, redirects to `/verify-otp?email=`. |
| Verify email OTP | ✅ | New [verify-otp.page.ts](src/app/verify-otp/verify-otp.page.ts) calls `Auth.verifyEmail()`. |
| Resend OTP | ✅ | Same page, `Auth.resendOtp()`. |
| Login | ✅ | [login.page.ts](src/app/login/login.page.ts) + [auth.service.ts](src/app/services/auth.service.ts). |
| Token refresh | ✅ | `Auth.refreshToken()` + [token.interceptor.ts](src/app/interceptors/token.interceptor.ts) (registered in `app.module.ts`) already handle 401 retry — this was already built, just pointed at the wrong URL before Phase 0's fix. |
| Profile (`auth_profile`) | 🟡 | `Auth.getProfile()` now exists and matches the spec's shape, but `donorprofile`/`vprofile` pages still render hardcoded mock content instead of calling it — deferred, see Phase 1 scope note above. |
| Dashboard (`auth_dashboard`) | 🟡 | `Auth.getDashboard()` now exists; role dashboards still use mock chart data — see §9 (Phase 3). |
| Logout | ✅ | `Auth.logout()` clears storage, redirects to login. |

---

## 2. Forgot Password (3-screen flow) — ✅ Done

[forgot-password.page.ts](src/app/forgot-password/forgot-password.page.ts) handles steps 1–2 (email → OTP) as an internal wizard; [reset-password.page.ts](src/app/reset-password/reset-password.page.ts) handles step 3 (new password + confirm). Login's "Forgot Password?" link now routes here. Backed by `Auth.requestPasswordReset()` / `verifyPasswordResetOtp()` / `confirmPasswordReset()`.

---

## 3. Area Management (Super Admin) — ✅ Done

[super-admin-areas.page.ts](src/app/super-admin-areas/super-admin-areas.page.ts) covers all of `GET/POST /areas/` and `PATCH/DELETE /areas/{id}/` — create, list (with active/inactive badge), inline edit, delete. Reachable from the Super Admin dashboard, guarded to `super_admin`.

---

## 4. Pending Signups & Assignment (Super Admin) — ✅ Done

[super-admin-pending-signups.page.ts](src/app/super-admin-pending-signups/super-admin-pending-signups.page.ts) lists `pending-area-users` as a queue, with a per-row area picker and "Assign to Area" button calling `assign-area`. Surfaces the backend's 400 ("second Area Admin in one area") directly to the user.

---

## 5. User Management — ✅ Done

[adminsuser.page.ts](src/app/adminsuser/adminsuser.page.ts) lists users via `Auth.getList('users')` (now correctly unwraps pagination, see Phase 4), with full detail shown per card, inline **Edit** (username/email via `PATCH /users/{id}/`), and **Delete** (`DELETE /users/{id}/`). Role/area changes intentionally aren't exposed here — per ui.md §6 those go through `/assign-area` (§4 below), still Phase 6 work.

---

## 6. Custom Roles (`add-role` / `user-role`)

❌ **Missing.** Not used anywhere — low priority per ui.md itself ("secondary system, use with care").

---

## 7. Donations — ✅ Done

| Action | Status | Notes |
|---|---|---|
| List | ✅ | `admindonation.page.ts`, `vpickup.page.ts`, `donatehistory.page.ts` via `getList('donations')` — now correctly unwraps DRF's paginated envelope (see Phase 4 write-up; this was silently broken before). |
| Create | ✅ | [donateform.page.ts](src/app/donateform/donateform.page.ts) via `Auth.saveRecord`. |
| Edit | ✅ | Same `saveRecord` (PATCH when id present); reachable now via an **Edit** button in `donatehistory` that passes `?id=`. |
| View single | ✅ | `loadDonation()` is now called from `donateform`'s `ngOnInit()` when a `?id=` query param is present. |
| Delete | ✅ | `Auth.deleteRecord()`; **Delete** button in `donatehistory` (donor, pending only) and `admindonation` (Area/Super Admin, any donation). |
| Pick donation | ✅ | `vpickup.page.ts` via `Auth.postAction()` (fixed in Phase 0). |
| Update delivery status | ✅ | Same, via `Auth.postAction()`. |

**Left for later**: `getList()` only returns page 1 (10 items per ui.md §0) — no "load more"/pagination UI yet on any list page. Not blocking, but worth a follow-up once a list regularly exceeds 10 items.

---

## 8. Analytics / Dashboards — ✅ Done

`admindashboard`, `donordashboard`, `vdashboard`, `adminreport`, and the new `super-admin-dashboard` all call their real `analytics/*` endpoint and render KPIs/charts from the live response — no more hardcoded arrays. See the Phase 3 write-up above for what changed on each page and the one known limitation (super-admin drill-down into a specific area still needs Phase 6's UI).

**Left for later**: downloadable-report buttons (PDF export) on `admindashboard`/`adminreport` are still inert placeholders — there's no backend endpoint for that in ui.md, so it's out of scope until one exists.

---

## 9. Role-Based Routing & `super_admin` — ✅ Done

- [role.guard.ts](src/app/guards/role.guard.ts) now accepts `expectedRole` as a string or string array. `/tab-admin` is guarded to `['admin', 'super_admin']`, `/tab-donor` to `donor`, `/tab-volunteer` to `volunteer`, `/super-admin-dashboard` to `super_admin`.
- The old dead `/admin`, `/donor`, `/volunteer` stub routes/pages (unused since the app moved to `tab-admin`/`tab-donor`/`tab-volunteer`) have been deleted entirely — one of them had a guard, misleadingly, on a route nothing linked to.
- All feature pages (vprofile, vhistory, vpickup, donorprofile, vdashboard, donatehistory, donateform, donordashboard, adminreport, adminsuser, admindonation, admindashboard) are reachable as children of the now-guarded `tab-admin`/`tab-donor`/`tab-volunteer` routes.
- `super_admin` now has a route (`/super-admin-dashboard`, placeholder page) and a login branch. Full super-admin screens (areas, pending signups, super-admin analytics) are still Phase 6.

---

## Cross-Cutting Cleanup — ✅ Done (Phases 0 & 4)

- ~~`Auth` service hardcodes `baseUrl`~~ — now reads `environment.apiUrl`; same fix applied to `vpickup.page.ts`, which now calls `Auth.postAction()` instead of raw `HttpClient` with a hardcoded URL. (Phase 0)
- `refreshUrl` was also found to be nested under `/authapi/` instead of Django's actual root-level `urlpatterns` mount (`/api/token/refresh/`) — fixed in Phase 0.
- `getList()` was returning DRF's raw paginated envelope (`{count, next, previous, results}`) instead of the `results` array ui.md §0 specifies — every consumer expected a plain array (`.filter()`, `.length`, `*ngFor`), so this would have broken against the real backend. Fixed centrally in Phase 4; benefits `donations` (Phase 4) and `users`/`adminsuser` (still Phase 5) alike.
- Generic `saveRecord`/`getData` helpers still make it hard to verify each call matches ui.md's exact path/shape — worth auditing endpoint-by-endpoint once real work resumes on a section (users in particular, Phase 5).

See [Implementation Phases](#implementation-phases) at the top of this document for the build order.
