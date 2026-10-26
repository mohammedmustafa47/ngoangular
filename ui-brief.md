# UI Brief — NGO Food Donation App

A complete description of the current app, screen by screen, so the UI can be redesigned and rebuilt without reading the code. It covers who uses the app, what each screen shows and does, which data feeds it, how it looks today, and what's broken or missing.

- **Frontend:** Ionic 8 + Angular 20 (`ngoangular`), shipped as a web app and as an Android app via Capacitor.
- **Backend:** Django REST Framework (`djangoauth`), JWT auth, mounted at `/authapi/`.
- **Full API reference** (request/response shapes, errors): see [ui.md](ui.md). This brief only names the endpoint behind each screen.

---

## 1. The product in one paragraph

Donors post surplus food (what it is, how much, where to pick it up). Volunteers in the same town see those donations, claim one, pick it up and mark it delivered. Each town ("Area") is run by one **Area Admin** who monitors donations and users there. A **Super Admin** oversees every area: opens new towns, appoints Area Admins, assigns users whose pincode didn't match a town, and watches donations that have nobody looking after them.

---

## 2. Roles

| Role | Internal value | Signs up how | Lands on after login | Navigation style |
|---|---|---|---|---|
| Donor | `donor` | Self-register | Donor Dashboard | Bottom tabs (4) + side menu |
| Volunteer | `volunteer` | Self-register | Volunteer Dashboard | Bottom tabs (4) + side menu |
| Area Admin | `admin` (show as "Area Admin") | Created by Super Admin, no sign-up | Admin Dashboard | Bottom tabs (4) + side menu |
| Super Admin | `super_admin` | Created on the server | Super Admin Dashboard | Hub page with buttons + back navigation, side menu |

**Area rules**
- Donors, volunteers and Area Admins belong to exactly one Area; Super Admins belong to none.
- At sign-up the pincode is matched against each Area's pincode list. **No match ⇒ the account still works, but its area is `"pending"`** until a Super Admin assigns one. The UI must have a "pending area" state (see §6.13).
- A pending volunteer sees no local pickups. A pending donor can still donate.
- An Area can have only one Area Admin.

**What each role can see**
- Donor: only their own donations.
- Volunteer: pending donations in their own area, plus any donation assigned to them.
- Area Admin: all donations and users in their area.
- Super Admin: everything.

---

## 3. Core concept — the donation lifecycle

```
pending ──(volunteer taps "Pick Up")──▶ picked ──(volunteer)──▶ delivered
                                              └──(volunteer)──▶ cancelled
```

- Only the **donor** can edit or delete a donation, and only while it is `pending`. Area Admin and Super Admin can delete any donation in their scope.
- Only the **assigned volunteer** can move `picked` → `delivered` / `cancelled`.
- ⚠ "Cancel Pickup" today sets the donation to **`cancelled` permanently**; it does **not** return it to the pool. The wording suggests "release it back", so the redesign should either relabel it ("Cancel donation") or the backend should gain a real "release" action. This is a product decision to make.

### Status system (use one consistent mapping everywhere)

| Status value | Display label | Meaning for donor | Meaning for volunteer | Icon (Ionicons) | Color today |
|---|---|---|---|---|---|
| `pending` | Pending / Awaiting Pickup | Waiting for a volunteer | Available to claim | `time-outline` | Amber `#f59e0b` (Ionic `warning`) |
| `picked` | Picked Up / In Transit | A volunteer has it | You're delivering it | `bicycle-outline` | Ionic `primary` blue on badges, but **purple `#8b5cf6` in charts**, so unify |
| `delivered` | Delivered | Done | Done | `checkmark-circle-outline` | Green `#10b981` (Ionic `success`) |
| `cancelled` | Cancelled | Didn't happen | Didn't happen | `close-circle-outline` | Red `#ef4444` (Ionic `danger`); volunteer chart uses orange `#f97316`, so unify |

---

## 4. Navigation map

```
/login ─┬─ /register ─▶ /verify-otp ─▶ /login
        └─ /forgot-password (2 steps) ─▶ /reset-password ─▶ /login

After login, by role:

Donor      /tab-donor      [Dashboard | Donate | History | Profile]
Volunteer  /tab-volunteer  [Dashboard | Pickups | History | Profile]
Area Admin /tab-admin      [Dashboard | Donations | Users | Reports]   (Profile via side menu → /adminprofile)
Super Admin /super-admin-dashboard  (hub)
              ├─ /super-admin-areas
              ├─ /super-admin-area-detail/:areaId   (from the Areas list on the dashboard)
              ├─ /super-admin-pending-signups
              ├─ /super-admin-unattended-donations
              ├─ /super-admin-create-admin
              ├─ /super-admin-all-users
              └─ /adminprofile  (via side menu)
```

**Global side menu** (opens from the right, via a ☰ button at the end of the top bar on every logged-in shell): `My Profile`, `Logout`.

**Route guard:** every logged-in route checks the stored role and kicks to `/login` if it doesn't match.

---

## 5. Visual language today

The app has two distinct visual styles, which should be unified in the redesign.

### 5.1 Auth screens (login, register, OTP, forgot/reset)
- Full-screen **diagonal purple gradient** `#667eea → #764ba2` (135°), with two large translucent white circles drifting slowly in opposite corners.
- Centered column: **white circular logo badge** (90px, soft shadow, gentle 2s pulse) holding a purple icon, then a **white H1** (32px, weight 800) and a white 90%-opacity subtitle.
- **White card**, max-width ~450–480px, 20px radius, 32px padding, deep shadow.
- **Inputs:** light-grey filled (`#f8f9fa`), 12px radius, leading icon in primary color, floating label. On focus they turn white with a 2px primary border and soft purple glow.
- **Primary button:** full width, same purple gradient, 12px radius, bold 16px, lifts 2px on hover.
- **Secondary button:** outline, 2px primary border.
- **Divider:** a horizontal rule with centered grey text ("Don't have an account?").
- Footer: small white text "© 2025 NGO Food Donation. Making a difference together."

### 5.2 Logged-in screens
- **Top bar:** plain Ionic toolbar with the role title ("Donor", "Volunteer", "Admin", "Super Admin") and a ☰ menu button on the right.
- **Dashboards** (donor, volunteer, area admin) share one layout, max-width 1400px:
  - Page title (28px) + muted subtitle.
  - **KPI row:** 5 white tiles in an auto-fit grid (min 140px), 12px radius, soft shadow. Each has a 48px rounded-square **gradient icon badge** plus a bold value and a small grey label.
  - **Two-column body:** left is flexible, right is a 340px sidebar. It collapses to one column under 900px, and the KPI grid goes 2-up under 900px and 1-up under 600px.
  - **Panels:** white, 12px radius, with a header row (title + muted note), a light divider and a body.
- **List screens** (history, pickups, donations, users): a page heading with emoji ("📜 Your Donations", "🚴 Active Pickups"…), a **row of colored stat cards**, then a vertical stack of **rich cards** (see §7.4).
- **Super Admin screens:** plainer stock Ionic look (ion-cards, ion-lists, ion-grid KPI cards).
- **Profile screens:** a two-column grid. Left has an avatar card (circle with the user's initial) plus an optional pending-area banner; right has an "Account Details" card of icon + label + value rows.

### 5.3 Tokens worth keeping or formalizing
| Token | Value |
|---|---|
| Brand gradient | `#667eea → #764ba2` |
| KPI badge gradients | blue `#06b6d4→#3b82f6`, green `#10b981→#06b6d4`, purple `#7c3aed→#6d28d9`, indigo `#6366f1→#7c3aed`, amber `#f59e0b→#f97316` |
| Chart line | stroke `#06b6d4`, faint blue area fill, smooth curve, no points, no y-axis |
| Card radius / shadow | 12px / `0 8–10px 24–30px rgba(2,6,23,0.06)` |
| Input radius | 12px |
| Muted text | `#6b7280` / Ionic `medium` |
| Icons | Ionicons, outline style |
| Theme | Ionic default palette (`src/theme/variables.scss` is empty); no dark mode |

> Note: `index.html` also loads Bootstrap 5.3 and Bootstrap Icons from a CDN, but the screens use Ionic components and Ionicons. Decide on one system.

---

## 6. Screens

Each entry lists its **purpose**, **layout & content**, **actions**, **states** and **data** (endpoint under `/authapi/`).

### AUTH

#### 6.1 Login — `/login`
- **Purpose:** sign in, then route by role.
- **Layout:** auth style (§5.1). Logo icon `heart-circle`, H1 "Welcome Back", subtitle "Sign in to continue making a difference". The card header has a `log-in-outline` icon and "Sign In".
- **Fields:** Email; Password (with an eye show/hide toggle).
- **Row:** "Remember me" checkbox (left, **not wired up**); "Forgot Password?" link (right) → `/forgot-password`.
- **Primary:** "Sign In", disabled until both fields are filled.
- **Divider** "Don't have an account?" → outline button "Create Account" → `/register`.
- **Decorative role chips** under the card: Donor (green, heart), Volunteer (blue, bicycle), Admin (red, shield). They're not interactive.
- **Errors (red toast, top, 3s):** 403 → "Email not verified…"; 401 → "Invalid email or password."; otherwise the server's `detail` or "Login failed. Please try again."
- **Data:** `POST auth_login {email, password}` returns `access`, `refresh`, and `user{id, username, email, role, area}`.
- **Redirect:** super_admin → `/super-admin-dashboard`, admin → `/tab-admin`, donor → `/tab-donor`, volunteer → `/tab-volunteer`.
- **Missing:** a way to reach OTP verification for someone who registered but never verified, other than the error toast.

#### 6.2 Register — `/register`
- **Layout:** auth style. H1 "Join Us Today", subtitle "Create an account to start making a difference". Card header "Create Account".
- **Fields** (all required):
  - Username
  - Email: ⚠ **must be a `@gmail.com` address** (server rule); the UI doesn't say so, so add helper text.
  - Pincode: placeholder "e.g. 581342".
  - Role: action-sheet select, **Donor** or **Volunteer** only.
  - Password: show/hide toggle. Server rules: at least 8 characters, not too common, not all numbers, not too similar to username/email. Show these up front.
- **Role info box:** appears once a role is picked, with icon + title + one-liner.
  - Donor (green heart): "Donor Account — Donate surplus food to help those in need".
  - Volunteer (blue bicycle): "Volunteer Account — Pick up and deliver food donations".
- **Terms checkbox:** "I agree to the Terms & Conditions and Privacy Policy". The links are dead.
- **Primary:** "Create Account", disabled until every field is filled and terms are ticked.
- **Divider** "Already have an account?" → "Sign In".
- **Success:** green toast "Registration successful! A verification code has been sent to your email." → `/verify-otp?email=…`.
- **Errors:** red toast showing the first server field error (role / pincode / email / detail).
- **Data:** `POST auth_register {username, email, password, pincode, role}`.

#### 6.3 Verify Email — `/verify-otp`
- **Layout:** auth style. Icon `mail-open-outline`, H1 "Verify Your Email", subtitle "Enter the code we sent to {email}".
- **Fields:** Email (prefilled from the URL); Verification Code (**4 digits**, valid **10 minutes**).
- **Primary:** "Verify Email". Success → login.
- **Text button:** "Resend Code", with a **30s countdown** shown as "Resend Code (23s)". The server also caps resends at 3 per minute.
- **Data:** `POST auth_verify_email {email, otp}`; `POST auth_resend_otp {email}`.
- **Suggestion:** a 4-box OTP input instead of a plain text field.

#### 6.4 Forgot Password — `/forgot-password` (one screen, two steps)
- **Layout:** auth style. Icon `key-outline`, H1 "Forgot Password".
- **Step 1:** subtitle "Enter your email to receive a reset code". Field: Email. Button "Send Reset Code", which shows "Wait 30s" during cooldown.
- **Step 2:** subtitle "Enter the code we sent to {email}". Field: Verification Code. Buttons:
  - "Verify Code" (primary)
  - "Resend Code (30s countdown)" (text)
  - "Use a different email" (text, back to step 1)
- **Footer:** divider "Remembered your password?" → "Back to Sign In".
- **Data:** `POST auth_password_reset/request {email}`; `POST auth_password_reset/verify-otp {email, otp}`. Success → `/reset-password` with email + otp.

#### 6.5 Reset Password — `/reset-password`
- **Layout:** auth style. Icon `lock-open-outline`, H1 "Set New Password", subtitle "Choose a new password for {email}".
- **Fields:** New Password (show/hide); Confirm Password.
- **Primary:** "Reset Password". Success → login.
- **Errors:** "Passwords do not match", password-strength errors.
- **Data:** `POST auth_password_reset/confirm {email, otp, new_password, confirm_password}`.

---

### DONOR (`/tab-donor`, tabs: Dashboard 🏠 · Donate ♥ · History 🕘 · Profile 👤)

#### 6.6 Donor Dashboard — tab `donordashboard`
- **Header:** "Donor Dashboard" / "Overview of your donations and recent activity".
- **KPI tiles:**

  | Tile | Badge / icon | Value |
  |---|---|---|
  | Total Donations | purple, gift | sum of all four statuses |
  | Delivered | green, double-check | `delivered` count |
  | In Progress | blue, bicycle | `picked` count |
  | Fulfillment Rate | indigo, trending-up | delivered ÷ total, as % |
  | Items Donated | amber, cash | sum of quantities |

- **Left column:**
  - "Donations Over Time": line chart (subtitle says "Last 6 months", but the data is whatever the server returns).
  - Two small panels side by side: "By Status" (doughnut chart in the four status colors, legend at the bottom) and "Recent Donations" (⚠ **hard-coded fake rows**).
- **Right sidebar:**
  - "My Reports": "Download Donation Summary (PDF)", "Tax Receipt". ⚠ The buttons do nothing.
  - "Quick Actions": "Create New Donation", "View My Donations". ⚠ The buttons do nothing.
  - "Impact Summary": "You've donated **N items** across **M donations** so far. **D** have been delivered, at a **R%** fulfillment rate."
- **States:** spinner; error text.
- **Data:** `GET analytics/donor` returns `totals{pending, picked, delivered, cancelled}`, `timeseries[{date, count}]` and `total_items_donated`.

#### 6.7 Donate Food (create / edit) — tab `donateform`, `?id=` for edit
- **Top bar:** primary-colored toolbar with a back button. Title "Donate Food", or "Edit Donation" when editing.
- **Hero:** big `heart-circle` icon, "Make a Donation", "Help feed those in need by donating surplus food".
- **Form card** "Donation Details", with a leading icon on every field:

  | Field | Icon | Required | Notes |
  |---|---|---|---|
  | Food Name | `fast-food-outline` | yes | "e.g., Rice, Vegetables, Cooked Meals" |
  | Quantity | `scale-outline` | yes | ⚠ placeholder says "5 kg, 10 boxes", but the server only accepts a **whole number**. Make it a number input + optional unit, or change the backend |
  | Pickup Pincode | `pin-outline` | yes | numeric; **prefilled from the donor's profile pincode**. Inline red error under the field if the server says "We don't operate in this pincode yet." (this pincode decides which area's volunteers see it) |
  | Pickup Address | `location-outline` | yes | "Flat / street / landmark" |
  | Contact Number | `call-outline` | yes | tel input |
  | Description | `document-text-outline` | no | 4-row textarea |

- **Info strip:** "Fields marked with * are required…"
- **Buttons:** "Submit Donation" / "Update Donation" (primary); "Clear Form" (outline grey).
- **"How it works" card** with four green-check steps:
  1. Fill in the donation details.
  2. Our volunteers will be notified.
  3. Food will be picked up at your location.
  4. Track your donation status in history.
- **Behaviour:**
  - Create: success alert, then the form clears.
  - Edit: loads the donation. If it's no longer `pending`, it shows "This donation can no longer be edited — it has already been picked up." and goes back to History. On save it returns to History.
- **Data:** `POST donations/`; `GET/PATCH donations/{id}/`; `GET auth_profile` (pincode prefill).

#### 6.8 Donation History — tab `donatehistory`
- **Top bar:** primary toolbar, back button, "Donation History", refresh icon.
- **Header:** "📜 Your Donations" / "Track all your food donations and their current status".
- **Stat cards:** Total · Pending · Picked Up · Delivered.
- **Empty state:** large food icon, "No Donations Yet", "Your donation history will appear here once you start donating food.", button "Make Your First Donation".
- **Donation card** (one per donation, newest first):
  - **Header:** food icon, item name, date ("MMM dd, yyyy - hh:mm a"), and a status badge (color + icon + label, see §3).
  - **"Donation Details" grid:** Quantity · Donor (name or "You") · Contact · Pickup Address – pincode; Description in full width if present.
  - **"Volunteer Information":** "Assigned to: **{volunteer}**", shown only when assigned.
  - **"Status Timeline"** (hidden while pending): Donation Created → Picked Up by Volunteer → Delivered to Recipients, with completed dots filled.
  - "Last updated: {date}".
  - **Edit / Delete buttons** (outline, small; Delete is red), **only while pending**. Delete asks "Delete this donation? This cannot be undone."
- **Data:** `GET donations/` (all pages); `DELETE donations/{id}/`.

#### 6.9 Donor Profile — tab `donorprofile`
- **Layout:** see §6.13 (shared profile layout). Role line reads "Donor · Joined {date}".
- **Pending-area banner text:** "…A Super Admin will assign you to one soon — this doesn't affect your ability to create donations."

---

### VOLUNTEER (`/tab-volunteer`, tabs: Dashboard · Pickups · History · Profile)

#### 6.10 Volunteer Dashboard — tab `vdashboard`
- **Header:** "Volunteer Dashboard" / "Your upcoming pickups, hours and performance".
- **KPI tiles:**

  | Tile | Value |
  |---|---|
  | Currently Picked Up | `picked` count |
  | Completed | `delivered` count |
  | Avg Delivery Time | "6.4 hrs", or "—" when null |
  | Success Rate | delivered ÷ (delivered + cancelled), as % |
  | Cancelled | `cancelled` count |

- **Left column:**
  - "Deliveries Over Time": line chart.
  - "Completion Rate": doughnut, Completed (green) vs Cancelled (orange).
  - "Status Breakdown": bar chart of Picked / Delivered / Cancelled, purple bars.
- **Right sidebar:**
  - "Upcoming Pickups": ⚠ **hard-coded fake items** (#A123…).
  - "Quick Actions": "View Assigned Pickups", "Log Hours", "Report Issue". ⚠ The buttons do nothing.
  - "Tips & Notes": three static tips (confirm completion in the app, keep perishables cool, call the donor if the time changes).
- **Data:** `GET analytics/volunteer` returns `totals`, `timeseries` (delivered only) and `avg_delivery_hours`.

#### 6.11 Available Pickups — tab `vpickup`
- **Top bar:** primary toolbar, back button, "Available Pickups", refresh icon.
- **Header:** "🚴 Active Pickups" / "Pick up and deliver food donations to those in need".
- **Stat cards:** Active Tasks · Awaiting Pickup (pending) · In Transit (picked).
- **List:** only `pending` donations (claimable, in your area) and `picked` ones assigned to you.
- **Empty state:** "No Active Pickups" / "Great work! All donations have been completed." → "View History".
- **Pickup card:**
  - **Header:** tinted differently for pending vs in-transit. Icon (food or bicycle), item name, date, badge "Pending" (amber) / "In Transit" (blue).
  - **Details grid:** Quantity · Donor Name · Contact Number (**tappable `tel:` link**) · Pickup Address – pincode (full width) · Description.
  - **Instruction box:**
    - Pending (💡): "Next Step: Click 'Pick Up' when you arrive at the pickup location and collect the donation."
    - In transit (🧭): "In Transit: Deliver the donation to recipients and mark as delivered when complete."
  - **Actions (large full-width buttons):**
    - Pending: **"Pick Up This Donation"** (green).
    - Picked: **"Mark as Delivered"** (blue) + **"Cancel Pickup"** (red outline). Each asks for confirmation first; see the warning in §3.
- **Feedback:** browser alert with the server message; the list then refreshes.
- **Data:** `GET donations/`; `POST donations/{id}/pick_donation/`; `POST donations/{id}/update_status/ {status: delivered|cancelled}`.
- **Possible additions:** map/directions link for the address; a filter split into "Available near you" and "My active pickups".

#### 6.12 Task History — tab `vhistory`
- **Top bar:** primary toolbar, back, "My Task History", refresh.
- **Header:** "📊 Task History" / "Review your completed volunteer pickups and deliveries".
- **Stat cards:** Total Completed · Delivered · Cancelled.
- **Empty state:** "No Completed Tasks" → "View Active Pickups".
- **History card:**
  - **Header:** tinted green (delivered) or red (cancelled), with a big check or x icon, item name, date, and badge.
  - **Details grid:** Quantity · Donor Name · Contact · Volunteer · Pickup Address · Description.
  - **Completion message box:**
    - Delivered: "✅ Successfully Delivered — This donation was successfully delivered to recipients in need. Great work!"
    - Cancelled: "❌ Task Cancelled — This pickup task was cancelled and was not completed."
  - **Timestamps:** "Created: …" and "Completed: …" (the latter is `updated_at`).
- **Data:** `GET donations/`, filtered client-side to delivered + cancelled.

#### 6.13 Profile (shared layout: Donor, Volunteer, Admin, Super Admin)
- **Left card:**
  - Large circular avatar with the username's first letter.
  - Username (H2).
  - Muted line "{Role} · Joined {mediumDate}".
  - Red text button "Logout".
- **Pending-area banner** (amber, clock icon), only if `area === "pending"`: "**Area not assigned yet** — Your pincode didn't match an existing area. A Super Admin will assign you to one soon." The second sentence changes per role.
- **Right card, "Account Details"** (icon + label + value rows):
  - Email
  - Role (admin version only)
  - Area ("Pending assignment" if pending; hidden for Super Admin)
  - Pincode
  - Email Verified (Yes/No, with a check or alert icon)
  - Last Login
- **States:** spinner; "Could not load your profile. Please try again later."
- **Admin/Super Admin version** (`/adminprofile`) has its own toolbar: back button + "My Profile".
- **Data:** `GET auth_profile`.
- **Missing:** no edit-profile or change-password actions exist anywhere in the app.

---

### AREA ADMIN (`/tab-admin`, tabs: Dashboard 🏠 · Donations ♥ · Users · Reports)
> ⚠ The tab icons are mismatched today: Users uses a clock, Reports uses a person. Use people / bar-chart icons instead.

#### 6.14 Admin Dashboard — tab `admindashboard`
- **Header:** "Admin Dashboard" / "Overview of donations, volunteers and key performance".
- **KPI tiles:** Total Donations · Total Donors · Total Volunteers · Delivered Donations · Delivery Success Rate (%).
- **Left column:** "Donations Over Time" (line); "By Status" (doughnut); "Top Volunteers" (bar chart of deliveries per volunteer).
- **Right sidebar:**
  - **"My Area":** Name · Pincodes (comma list) · Status (Active/Inactive) · Opened (date).
  - **"Downloadable Reports":** Monthly Donation / Volunteer Activity / Food Waste Reduction (PDF). ⚠ The buttons do nothing.
  - **"Performance Indicators":** Avg Delivery Time; Top Volunteer ("name (N delivered)").
  - **"Insights Summary":** two generated sentences ("X donations this period, Y delivered (Z% success rate).", "A donors and B volunteers active in this area.").
- **Data:** `GET analytics/area-admin` returns `area`, `totals`, `timeseries`, `leaderboard[{username, delivered}]`, `users_by_role` and `avg_delivery_hours`; plus `GET areas/{id}/`.

#### 6.15 Donation Management — tab `admindonation`
- **Top bar:** primary toolbar, back, "All Donations".
- **Header:** "📦 Donation Management" / "Monitor and manage all food donations".
- **Stat cards:** Total · Pending · Picked Up · Delivered.
- **Empty state:** "No Donations Found".
- **Donation card:**
  - **Header:** food icon, title, "ID: #12", status badge.
  - **"Donor Information":** Donor Name · Contact.
  - **"Donation Details":** Quantity · Pickup Address – pincode · Description.
  - **"Volunteer Information":** Volunteer Name or "Not Assigned".
  - **Timestamps:** Created / Updated.
  - **Delete** (red outline).
- **Data:** `GET donations/` (scoped to the admin's area); `DELETE donations/{id}/`.
- **Worth adding:** filter chips by status (the server already supports `?status=`) and search.

#### 6.16 User Management — tab `adminsuser`
- **Top bar:** primary toolbar, back, "All Users".
- **Header:** "👥 User Management" / "View and manage all registered users".
- **Stat cards:** Total Users · Donors · Volunteers · Admins.
- **User card:**
  - **Header:** round avatar with a role icon, username, "User ID: #5", and a role badge in the role's color.
  - **"Contact Information":** Email.
  - **"Account Details":** Username · Role.
  - Joined date.
  - **Buttons:** "Edit User" / "Delete User" (red).
  - **Edit mode** (inline in the same card): Username + Email inputs, then "Save" / "Cancel". **Only username and email are editable**; role and area are not.
- **Data:** `GET users/` (own area only); `PATCH users/{id}/ {username, email}`; `DELETE users/{id}/`.
- **Simplify:** the template references fields the API never returns (phone, is_active, last_login, donations_count, pickups_count, date_joined), so those blocks never show. Either add them to the API or drop them from the design.

#### 6.17 Reports & Analytics — tab `adminreport`
- **Header:** "Reports & Analytics" / "Overview and downloadable reports".
- **"Overview":** 4 metric cards (2-up on mobile, 4-up on desktop): Total Donations · Total Donors · Total Volunteers · Delivery Success %.
- **"Downloadable Reports":** two compact rows with a download icon button. ⚠ The buttons do nothing.
  - "Monthly Donation Report — A summary of all donations in the last month."
  - "Volunteer Activity Report — Overview of user donations and volunteer hours."
- **"Donation Trend":** line chart "Donations Over Time — Recent activity in your area".
- **Two stat cards:** Avg Delivery Time; Top Volunteer (+ "N delivered").
- **"Insights Summary":** bullet list (same sentences as the dashboard).
- **Data:** same as 6.14.
- **Note:** this overlaps heavily with the dashboard. Consider merging them, or making Reports purely about exports.

---

### SUPER ADMIN (no tabs; hub + drill-down pages, each with a back button to the hub)

#### 6.18 Super Admin Dashboard — `/super-admin-dashboard`
- **Top bar:** "Super Admin" + ☰.
- **Navigation buttons** (stacked, outline, full width):
  - Manage Areas 🗺
  - Pending Signups ⏳
  - Unattended Donations ⚠
  - Create Area Admin 👤+
  - All Users 👥

  This could become a grid of tiles with count badges (e.g. "Pending Signups (3)").
- **KPI cards (4):** Total Donations · Delivered · Delivery Success Rate · Avg Delivery Time.
- **Charts row:** "Donations by Area" (bar, one bar per area, 7/12 width) · "Users by Role" (doughnut, 5/12 width).
- **"Top Volunteers":** list of "username — N delivered", or "No delivery activity yet."
- **"Areas":** list, one row per area: name, "T total · D delivered", and a chart icon button → that area's dashboard (6.20). Subtitle: "Tap 'Manage Areas' above to create, edit, or delete areas." Empty: "No areas yet."
- **Data:** `GET analytics/super-admin` returns `totals`, `timeseries`, `leaderboard`, `by_area[{area, pending, picked, delivered, cancelled, total}]`, `users_by_role{donor, volunteer, admin, …}` and `avg_delivery_hours`; plus `GET areas/` (to map an area name to its id for drill-down).

#### 6.19 Manage Areas — `/super-admin-areas`
- **"Open a New Town" card:** Area Name ("e.g. Murudeshwar"), Pincodes (comma-separated, "e.g. 581342, 581343"), "Create Area" button.
- **Area cards:**
  - View mode: name (H2), "Pincodes: …" (or "None"), Active/Inactive badge (green/grey), "Edit" and "Delete" (red) buttons.
  - Edit mode (inline): Name, Pincodes, Active toggle, "Save" / "Cancel".
- **Empty:** "No areas yet — create one above."
- **Data:** `GET/POST areas/`; `PATCH/DELETE areas/{id}/`. Area object: `{id, name, pincodes[], is_active, created_at}`.
- **Better UX:** pincodes as chips, with add/remove per chip.

#### 6.20 Area Dashboard (drill-down) — `/super-admin-area-detail/:areaId`
- **Top bar:** back, "{Area name} Dashboard".
- **Content:** 4 KPI cards (as 6.18); "Donations Over Time" line + "By Status" doughnut; "Top Volunteers" list.
- **Data:** `GET analytics/area-admin?area_id={id}`.

#### 6.21 Pending Signups — `/super-admin-pending-signups`
- **Top bar:** back, "Pending Signups", refresh.
- **One card per user:** username, email, role badge (grey). On the right: an "Select area" popover dropdown of all areas + an "Assign to Area" button (disabled while saving).
- **Empty:** "No pending signups — every user has an area."
- **Data:** `GET pending-area-users`; `GET areas/`; `POST assign-area {user_id, area_id}`.

#### 6.22 Unattended Donations — `/super-admin-unattended-donations`
- **Definition:** pending donations in an area that has **no active Area Admin**.
- **Top bar:** back, "Unattended Donations", refresh.
- **Card per donation:** "{item} ({qty})", "{address} · {pincode}", "Donor: {name} · {phone}", amber badge "No active Area Admin". These cards have no actions; consider linking to "Create Area Admin" for that area.
- **Empty:** "Nothing here - every pending donation has an active Area Admin."
- **Data:** `GET unattended-donations`.

#### 6.23 Create Area Admin — `/super-admin-create-admin`
- **Form card "New Area Admin"**, subtitle "Account is created active and verified immediately — no OTP step."
- **Fields:**
  - Username ("e.g. admin_murudeshwar")
  - Email (`@gmail.com` only)
  - Password (shown as plain text on purpose, so it can be handed over)
  - Area (popover select)
- If no areas exist: "No areas exist yet — create one first" (link to Manage Areas).
- **Button:** "Create Area Admin".
- **Success card**, which replaces the form: green check "Area Admin Created", subtitle "Share these credentials with them directly — there's no invite-link email for this." It shows Username / Email / **Password** / Area rows and a "Create Another" button.
- **Errors:** "This area already has an Area Admin.", duplicate email/username, weak password.
- **Data:** `GET areas/`; `POST create-area-admin {username, email, password, area_id}`.
- **Suggestion:** a "Copy credentials" button.

#### 6.24 All Users — `/super-admin-all-users`
- **Top bar:** back, "All Users", refresh.
- **"Super Admins" card:** list of user rows.
- **Accordion, one section per Area:**
  - Header: "{Area}" + "Admin: {name or Unassigned} · N volunteers · M donors".
  - Body: three sub-sections: "Area Admin" (or "No Area Admin assigned yet."), "Volunteers (N)", "Donors (M)".
- **"Unassigned" accordion section** for users without an area: "N volunteers · M donors awaiting an area".
- **User row:** username + email, role badge, ✏ edit and 🗑 delete icon buttons. Edit turns the row inline into Username / Email inputs + Save / Cancel.
- **Empty:** "No users yet."
- **Data:** `GET users/` (all pages); `PATCH/DELETE users/{id}/`.
- **Worth adding:** search box; "Assign area" right from the Unassigned section.

---

## 7. Shared components to design once

1. **App top bar:** title + optional page actions + ☰ menu button (right). Variant with a back button for drill-down pages.
2. **Side menu (right drawer):** My Profile, Logout. Room to add Settings later.
3. **Bottom tab bar:** 4 tabs, icon + label.
4. **Donation card:** header (icon, title, date, status badge), details grid (icon + label + value cells, 2 columns, collapsing to 1), optional sections (volunteer, timeline, instruction box, completion message), timestamps footer, action row. Used on donor history, volunteer pickups and history, and admin donations; the variants differ only by which sections and actions appear.
5. **Status badge:** color + icon + label per §3.
6. **KPI tile:** gradient icon badge + value + label.
7. **Stat strip:** row of 3–4 colored mini cards (icon + number + label) above lists.
8. **Chart panel:** title + muted caption + chart. Chart types: line (trend), doughnut (status split / users by role), bar (top volunteers / by area / status breakdown).
9. **User row / user card:** avatar or role icon, name, email, role badge, edit/delete.
10. **Inline edit pattern:** a view row turns into inputs + Save/Cancel in place (areas, users).
11. **Empty state:** big icon, title, one-line explanation, optional CTA button.
12. **Loading:** centered spinner. **Error:** centered message (from a shared helper: "Couldn't {action}…").
13. **Pending-area banner:** amber card with a clock icon.
14. **Profile card + account-details card.**
15. **Feedback:** standardize on **toasts** for results and **in-app confirm dialogs** for destructive actions. Today auth screens use toasts while donation and volunteer screens use browser `alert()` / `confirm()`.

---

## 8. Data objects the UI displays

| Object | Fields shown |
|---|---|
| **User** (lists) | `id, username, email, role, area` (area = name or `null`) |
| **Profile** (me) | `id, username, email, first_name, last_name, role, area` (name / `"pending"` / `null`), `pincode, is_email_verified, date_joined, last_login` |
| **Donation** | `id, donor, donor_name, item_name, quantity` (integer), `description, pickup_address, pickup_pincode, contact_number, status, volunteer, volunteer_name, area` (id), `created_at, updated_at` |
| **Area** | `id, name, pincodes[], is_active, created_at` |
| **Analytics** | `totals{pending, picked, delivered, cancelled}, timeseries[{date, count}], leaderboard[{username, delivered}], by_area[…], users_by_role{…}, avg_delivery_hours` (may be `null`), `total_items_donated` (donor) |

All list endpoints are paginated 10 per page (`{count, next, previous, results}`). The app currently fetches every page and shows one long list, so **pagination or infinite scroll** would be a design improvement.

---

## 9. Known problems in the current UI (fix in the rebuild)

**Broken behaviour**
- **Editing a donation from History doesn't work:** it navigates to `/donateform`, which isn't a route (the real one is `/tab-donor/donateform`).
- **Empty-state links don't work:** `/donateform`, `/vhistory` and `/vpickup` have the same problem.
- **Back buttons fall back to routes that don't exist:** `/donor-dashboard`, `/volunteer-dashboard`, `/admin-dashboard`.
- **"Picked Up" counts are always 0** on Donor History and Admin Donations, and the donor timeline never marks "Picked Up". The code checks for `picked_up`, but the real status is `picked`.
- **Admin Donations card title always says "Food Donation"**, because it reads `food_name` instead of `item_name`.
- **Quantity type mismatch:** the field invites text ("5 kg") but the server needs an integer, so the submit fails with a generic error.
- **Donate form validation is incomplete:** it only checks name, quantity and pincode client-side. The server also requires address and contact number.

**Layout and consistency**
- **Double headers:** the tab shell shows the app top bar, and several tab pages (Donate, History, Pickups, Task History, Admin Donations, Admin Users) add their own blue toolbar with a back button underneath it.
- **Admin dashboard and reports push content down with stray `<br><br>`.**
- **Mixed visual styles:** gradient dashboards for donor/volunteer/admin, plain Ionic for Super Admin, emoji in some headings and not others.
- **Mixed colors:** the `picked` status is blue on badges but purple in charts; `cancelled` is red in one place and orange in another.
- **Wrong tab icons** in the Area Admin tab bar.

**Placeholders and dead controls**
- Fake content: "Recent Donations" on the donor dashboard and "Upcoming Pickups" on the volunteer dashboard are hard-coded.
- Dead buttons: every "Download report", "Quick Actions" button, "Log Hours", "Report Issue", "Tax Receipt", the Terms/Privacy links, and "Remember me".

**Copy and guidance**
- Missing guidance: the gmail-only email rule and the password rules aren't shown before submit.

---

## 10. Things the backend supports with no UI yet
- Status filter on donations (`?status=pending`).
- Area Admin / Super Admin **editing** a donation (only delete is exposed).
- Token refresh (`/api/token/refresh/`). The interceptor handles it silently, so there's nothing to design, but session-expired messaging would help.
- Custom role badges (`add-role`, `user-role`). Legacy; probably leave out of the redesign.

## 11. Open decisions before redesigning
1. **Authentication provider:** if the app moves to Clerk (or similar), screens 6.1–6.5 are replaced or restyled by that provider's components, and "Create Area Admin" becomes an invite flow instead of setting a password.
2. **Gmail-only sign-up:** keep it or drop it.
3. **Quantity:** an integer, or a number + unit (kg / plates / boxes).
4. **Volunteer "Cancel":** cancel the donation, or release it back to the pool.
5. **Reports:** real PDF/CSV exports, or remove the section.
6. **Desktop vs mobile:** dashboards are built for wide screens, lists for phones. Pick a primary target per role (e.g. admins on desktop, volunteers on phone).
7. **Dark mode:** not supported today.
