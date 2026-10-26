# Food4U — Design Prompts

Copy-paste prompts for generating the Food4U UI with an AI design tool (Stitch, v0, Figma Make, Lovable, Uizard…). They are derived from [ui-brief.md](ui-brief.md), with the current app's bugs, fake data and dead buttons removed.

## How to use

1. Start a fresh project in your design tool and paste **Phase 0 (Master prompt)**. It produces a style-guide board only. Check the colors and components before going further.
2. Paste the phases **in order**, one per message: 1 Auth → 2 Donor → 3 Volunteer → 4 Area Admin → 5 Super Admin.
3. If the tool has a prompt-length limit, send a phase **one screen at a time**. Each "SCREEN" block works on its own after the phase's first paragraph.
4. If a new chat or project loses context, paste Phase 0 again before continuing.
5. Finish with **Phase 6 (Consistency check)**.
6. If the tool starts inventing things, send the **Drift fix** prompt at the bottom.

## Design decisions built into these prompts

These differ from the current app. Change the prompts if you disagree.

| Topic | Current app | In these prompts |
|---|---|---|
| Area Admin 4th tab | "Reports" (duplicate of dashboard, dead download buttons) | **Profile** (same 4-tab pattern as donor/volunteer) |
| Dead buttons (PDF reports, Tax Receipt, Log Hours, Report Issue, Remember me) | Shown, do nothing | **Removed** |
| Fake "Recent Donations" / "Upcoming Pickups" | Hard-coded | **Real data** from the donations list |
| Quantity | Free text ("5 kg") that the server rejects | **Number stepper** (whole numbers) |
| Volunteer "Cancel Pickup" | Permanently cancels, but the label suggests releasing it | Labelled **"Mark as Cancelled"** with a clear warning |
| Role choice at sign-up | Dropdown + info box | **Two selectable cards** |
| OTP entry | Plain text field | **4 separate digit boxes** |
| Volunteer pickups | One mixed list | Two sections: **"My active pickups"** and **"Available in your area"** |
| Feedback | Browser alert() / confirm() | **Toasts** and **in-app confirm dialogs** |
| Picked status color | Blue on badges, purple in charts | **Blue everywhere** |
| Brand look | Purple gradient (#667eea → #764ba2), floating blobs, soft glowing shadows | **Banana-leaf green + turmeric on warm cream**, flat surfaces, thin borders, no gradients |
| KPI tiles | Gradient icon squares | **Plain bordered tiles**: small colored icon + label + number |
| Login role chips (decorative) | Shown | **Removed** |
| Auth provider | Custom email + OTP | Custom (current). **If you switch to Clerk, skip Phase 1** and design only a post-sign-up "choose role + pincode" step. |

---

## Phase 0 — Master prompt

```text
You are designing "Food4U", a mobile app that connects food donors with volunteers who pick up surplus food and deliver it to people in need. Each town ("Area") is managed by one Area Admin, and a Super Admin oversees all areas.

I will send the design in phases, one role at a time. THIS message only sets the rules. Create ONE board called "Food4U Style Guide" showing the colors, typography and components below. Do not design any app screens yet.

PLATFORM
- Mobile first. Frame size 390 x 844. Light mode only.
- Native-app feel (Ionic / Material-like): top app bar, bottom tab bar, cards, lists, bottom sheets.
- Icons: outline line icons only (Ionicons outline style), 20–24px.

BRAND
- Name: "Food4U", always written exactly like that.
- Logo: a small solid Turmeric heart inside a Leaf-green rounded square (like a leaf-wrapped food parcel), next to the wordmark "Food4U" in Fraunces semibold, Leaf green.
- Tone: warm, grounded, human. Short sentences. It should feel like a local community kitchen, not a tech startup.

COLORS: "Banana leaf & turmeric" (use only these; no other colors)
- Leaf (primary): #1F5C45. Used for primary buttons, links, active tab, focused inputs, line and bar charts, and the wordmark. "Primary" in this brief always means Leaf.
- Leaf dark: #174634 (pressed state). Leaf tint: #E6F0EA (selected states, active-tab pill).
- Turmeric (accent): #E3A33B. Use sparingly: the logo heart, progress bars, at most one highlight per screen. Never for text.
- Cream (app background): #FAF7F2. Card surface: #FFFFFF. Border / divider: #E8E2D9.
- Ink (text): #1C1917. Muted text: #6B645C.
- Status colors:
  - Amber (pending / warning): solid #C98A1B, tint #FBF0D9, dark text #7A5200
  - River blue (picked up / info): solid #2F6FB2, tint #E3EDF8, dark text #1D4A7A
  - Delivered green (success): solid #2E8B57, tint #E1F2E7, dark text #1E5E3A
  - Chilli red (danger / cancelled): solid #C0392B, tint #F9E3E0, dark text #8E2A20
- Role colors (chips, avatars, role charts):
  - Donor = Leaf (#1F5C45, tint #E6F0EA)
  - Volunteer = River blue (#2F6FB2, tint #E3EDF8)
  - Area Admin = Slate (#3D5A6C, tint #E4EBEF)
  - Super Admin = Ink (#1C1917, tint #ECE8E3)
  When a later phase says "green", "blue", "slate" or "ink" for a role chip, pill, card or avatar, it means that role's color above.
- NO gradients anywhere. No purple, neon, glow or glassmorphism.

TYPOGRAPHY
- H1, H2 and the wordmark: Fraunces semibold. Everything else, including H3, numbers, labels and buttons: Inter.
- H1 26px, H2 20px, H3 16px semibold, body 15px, caption 13px, KPI number 26px Inter semibold with tabular figures.

SPACING & SHAPE
- 8px grid. Screen side padding 16px. 12px gap between cards.
- Cards: white, 12px radius, 1px #E8E2D9 border, no shadow. Only dialogs and bottom sheets get a faint shadow.
- Inputs and buttons: 12px radius, 48px tall.
- Badges and chips: fully rounded pills.

STATUS SYSTEM (a donation is always in exactly one of these; same label, color and icon everywhere)
- "Pending": Amber tint background, Amber dark text, clock icon. Waiting for a volunteer.
- "Picked Up": River blue tint background, River blue dark text, bicycle icon. A volunteer has collected it.
- "Delivered": Delivered-green tint background, Delivered-green dark text, check-circle icon.
- "Cancelled": Chilli tint background, Chilli dark text, x-circle icon.
In charts, use the solid colors: Pending #C98A1B, Picked Up #2F6FB2, Delivered #2E8B57, Cancelled #C0392B.

COMPONENTS (show each on the style guide; reuse them identically on every screen)
1. App bar: Cream background with a 1px bottom border, title on the left, menu icon (three lines) on the right that opens the side drawer. Drill-down pages use a back arrow on the left instead. Exactly ONE app bar per screen; never stack two.
2. Side drawer (slides in from the right): avatar circle with the user's first initial, username, role chip in the role color, then exactly two items: "My Profile" and "Logout" (Logout in danger red). Nothing else.
3. Bottom tab bar: 4 tabs, icon + label, active tab in Primary with a small tint pill behind the icon.
4. Buttons: Primary (solid Leaf #1F5C45, white text); Secondary (white with 1.5px primary border, primary text); Danger (white with red border and red text); Text button (primary text, no border).
5. Text input: label above, warm light fill #F3EFE8, leading icon, helper text below in muted 13px, error text below in danger red. Focused = white fill + 2px primary border.
6. KPI tile: white bordered card. Top row: a small 18px icon in the color named on the screen, plus a muted label. Below: the big number. No colored icon squares or badges.
7. Status badge: the pill from the status system (icon + label).
8. Donation card: header row (food icon, item name, date + status badge on the right); a 2-column details grid of icon + small muted label + value; optional sections; action buttons at the bottom.
9. List row: avatar circle with initial, title + subtitle, optional pill on the right, optional icon buttons.
10. Chart card: title (H3) + muted caption + chart. Line charts in Leaf with a very light Leaf-tint fill, no data points, thin #E8E2D9 gridlines. Bar charts in Leaf. Doughnuts use status (or role) colors with the legend below.
11. Empty state: large muted outline icon, H3 title, one-line muted text, optional primary button.
12. Confirm dialog: centered card with title, message, "Cancel" text button and a confirm button (Danger style for destructive actions).
13. Toast: top of screen, rounded, Ink background, white text, with a colored icon on the left (Delivered-green check for success, Chilli x for errors).
14. Pending-area banner: Amber-tint card with a clock icon, bold title and one line of text.
15. Bottom sheet: rounded top corners, drag handle, title, content, buttons at the bottom.
16. Stat strip: a row of 2–4 small white tiles above a list, each with a small colored icon, a number and a short label.
17. Note box: tinted rounded box with an icon on the left and one or two lines of text (used for hints and messages inside cards).
18. Standard controls (dropdown, toggle, checkbox, number stepper, chip input, accordion, progress bar, 4-digit code boxes) use the same radius, colors and fonts as above.

SAMPLE DATA. Use ONLY this data on every screen. Never invent other names, places, numbers or fields.
Areas:
- Murudeshwar: pincodes 581342, 581343; Active; opened 12 Jan 2026; Area Admin admin_murudeshwar
- Bhatkal: pincode 581320; Active; opened 3 Mar 2026; Area Admin admin_bhatkal
- Honnavar: pincode 581334; Active; opened 2 Sep 2026; NO Area Admin
- Gokarna: pincode 581326; Inactive; opened 1 Aug 2026; no users
Users:
- anita_rao: Super Admin, anita.rao@gmail.com, joined 1 Jan 2026
- admin_murudeshwar: Area Admin (Murudeshwar), admin.murudeshwar@gmail.com, pincode 581342, joined 12 Jan 2026
- admin_bhatkal: Area Admin (Bhatkal), admin.bhatkal@gmail.com
- priya_s: Donor (Murudeshwar), priya.shetty@gmail.com, pincode 581342, joined 5 Sep 2026, last login 24 Oct 2026, 1:10 PM
- hotel_sagar: Donor (Murudeshwar), hotel.sagar@gmail.com
- deepa_r: Donor (Murudeshwar), deepa.r@gmail.com
- suresh_h: Donor (Honnavar), suresh.h@gmail.com
- rahul_n: Volunteer (Murudeshwar), rahul.naik@gmail.com, pincode 581342, joined 10 Sep 2026
- meera_k: Volunteer (Murudeshwar), meera.k@gmail.com
- vikram_p: Volunteer (Murudeshwar), vikram.p@gmail.com
- imran_b: Volunteer (Bhatkal), imran.b@gmail.com
- arjun_m: Volunteer, NO area yet (pending), arjun.m@gmail.com, pincode 560001
- kavya_d: Donor, NO area yet (pending), kavya.d@gmail.com, pincode 575001
Donations (ID · item · quantity · donor · status · volunteer · address · pincode · phone · created):
- #101 · Veg Biryani · 25 · priya_s · Pending · none · 12 Beach Road, near Murudeshwar Temple · 581342 · 98450 12345 · 24 Oct 2026, 1:15 PM · description "Packed in foil trays, cooked today at 12 PM"
- #102 · Idli & Sambar · 30 · hotel_sagar · Pending · none · Hotel Sagar, Main Road · 581343 · 94481 22334 · 24 Oct 2026, 7:30 AM
- #99 · Chapati & Dal · 40 · priya_s · Picked Up · rahul_n · House 4, Temple Street · 581342 · 98450 12345 · 23 Oct 2026, 7:40 PM
- #95 · Rice bags (5 kg) · 10 · priya_s · Delivered · rahul_n · 12 Beach Road, near Murudeshwar Temple · 581342 · 98450 12345 · 20 Oct 2026, 10:05 AM · delivered 20 Oct 2026, 4:30 PM
- #90 · Fresh Fruits · 12 · priya_s · Cancelled · meera_k · 12 Beach Road, near Murudeshwar Temple · 581342 · 98450 12345 · 15 Oct 2026, 9:00 AM
- #88 · Vegetable Pulao · 18 · hotel_sagar · Delivered · rahul_n · Hotel Sagar, Main Road · 581343 · 94481 22334 · 12 Oct 2026, 12:30 PM
- #85 · Curd Rice · 20 · deepa_r · Cancelled · rahul_n · 7 Market Lane · 581342 · 99860 45678 · 8 Oct 2026, 6:15 PM
- #97 · Lemon Rice · 20 · suresh_h · Pending · none · Bus Stand Road, Honnavar · 581334 · 99001 23456 · 22 Oct 2026, 11:00 AM
- #96 · Bread Loaves · 15 · suresh_h · Pending · none · Bus Stand Road, Honnavar · 581334 · 99001 23456 · 21 Oct 2026, 8:45 AM
Numbers:
- priya_s (donor): 12 donations total = 1 Pending, 1 Picked Up, 9 Delivered, 1 Cancelled; 214 items donated; 75% fulfillment rate.
- rahul_n (volunteer): 1 Picked Up now, 21 Delivered, 2 Cancelled; 91% success rate; average delivery time 6.4 hrs.
- Murudeshwar area: 64 donations = 3 Pending, 1 Picked Up, 58 Delivered, 2 Cancelled; 91% success rate; avg delivery 5.8 hrs; 40 donors, 12 volunteers; top volunteers rahul_n 21, meera_k 17, vikram_p 9.
- Bhatkal area: 31 donations = 4 Pending, 2 Picked Up, 23 Delivered, 2 Cancelled; 30 donors, 7 volunteers.
- Honnavar area: 2 donations = 2 Pending; 1 donor; 0 volunteers.
- Gokarna area: 0 donations.
- All areas: 97 donations, 81 Delivered, 84% success rate, avg delivery 6.1 hrs; users: 72 Donors, 20 Volunteers, 2 Area Admins, 1 Super Admin; top volunteers rahul_n 21, meera_k 17, imran_b 14.
- Trend charts: a gently rising line over the last 6 months (May–Oct 2026).

RULES FOR EVERY PHASE
- Design ONLY the screens I list in that phase, using ONLY the components above.
- Use the exact text I put in quotes. Do not rewrite labels, titles or button text.
- Do NOT add anything I didn't list: no search bars, filters, notification bells, maps, chat, ratings, payments, PDF or export buttons, settings, dark-mode toggles, onboarding carousels, or extra tabs or menu items.
- Every value on screen must come from the sample data. If a value isn't in the sample data, leave it out.
- One app bar per screen. Bottom tab bar only on the screens where I say so.
- Keep every screen consistent with the style guide.
- Visual style: flat and crafted. No gradients, glows, glassmorphism, decorative blobs, 3D illustrations or emoji. Prefer thin borders over shadows.
```

---

## Phase 1 — Authentication (shared by all roles)

```text
Food4U — Phase 1: Authentication. Follow the master prompt exactly (colors, components, sample data, rules).

Design ONLY these 7 frames. No app bar and no tab bar on any of them.
Shared auth layout for all 7: Cream background, with no gradient and no decorative shapes. A solid Leaf-green panel covers the top 30% of the screen. It holds the Food4U logo at the top-left (Turmeric heart, cream wordmark), then a 56px cream circle with the screen's icon in Leaf, then the H1 in cream (Fraunces) and the subtitle in cream at 85% opacity. The white form card (16px radius, 1px border, 20px padding) starts on the panel, overlaps its bottom edge and continues onto the cream background. Small muted footer text at the bottom: "© 2026 Food4U".

SCREEN 1.1 — Sign In
- Circle icon: heart. H1 "Welcome back". Subtitle "Sign in to continue making a difference".
- Card title row: sign-in icon + "Sign In".
- Input "Email" (mail icon), value priya.shetty@gmail.com.
- Input "Password" (lock icon), masked, with an eye icon at the right end to show/hide.
- Right-aligned text link "Forgot password?".
- Primary button full width "Sign In".
- Divider line with centered muted text "New to Food4U?".
- Secondary button full width "Create Account".

SCREEN 1.2 — Sign In, error state
- Same as 1.1 with a danger toast at the top: "Invalid email or password."

SCREEN 1.3 — Create Account
- Circle icon: person-add. H1 "Join Food4U". Subtitle "Create an account to start making a difference".
- Card title row: person-add icon + "Create Account".
- Input "Username" (person icon), value priya_s.
- Input "Email" (mail icon), value priya.shetty@gmail.com, helper "Use your Gmail address (example@gmail.com)".
- Input "Pincode" (location icon), value 581342, helper "We use this to connect you with your local area".
- Label "I want to" followed by two side-by-side selectable cards:
  - "Donor": heart icon in green, text "Donate surplus food to help those in need". SELECTED (green 2px border, green tint background, check mark in the corner).
  - "Volunteer": bicycle icon in blue, text "Pick up and deliver food donations". Not selected.
- Input "Password" (lock icon), masked, eye toggle, helper "At least 8 characters. Avoid common passwords or only numbers."
- Checkbox (checked): "I agree to the Terms & Conditions and Privacy Policy", with both phrases as links.
- Primary button full width "Create Account".
- Divider "Already have an account?" and secondary button "Sign In".

SCREEN 1.4 — Verify Email
- Circle icon: open mail. H1 "Verify your email". Subtitle "Enter the 4-digit code we sent to priya.shetty@gmail.com".
- Input "Email" (mail icon), value priya.shetty@gmail.com.
- Label "Verification code", then 4 separate square digit boxes (56px each) showing 4, 7, 2 and one empty box focused.
- Muted caption "The code expires in 10 minutes."
- Primary button "Verify Email".
- Disabled text button "Resend code in 0:23".

SCREEN 1.5 — Forgot Password (step 1)
- Circle icon: key. H1 "Forgot password". Subtitle "Enter your email to receive a reset code".
- Input "Email" (mail icon), value priya.shetty@gmail.com.
- Primary button "Send Reset Code".
- Divider "Remembered your password?" and secondary button "Back to Sign In".

SCREEN 1.6 — Forgot Password (step 2)
- Same header. Subtitle changes to "Enter the code we sent to priya.shetty@gmail.com".
- 4 digit boxes, all empty, first one focused.
- Primary button "Verify Code".
- Text button "Resend code" and text button "Use a different email".
- Divider "Remembered your password?" and secondary button "Back to Sign In".

SCREEN 1.7 — Set New Password
- Circle icon: open lock. H1 "Set new password". Subtitle "Choose a new password for priya.shetty@gmail.com".
- Input "New password" (lock icon, eye toggle), helper "At least 8 characters. Avoid common passwords or only numbers."
- Input "Confirm password" (lock icon) showing the error "Passwords do not match." in danger red.
- Primary button "Reset Password".
```

---

## Phase 2 — Donor

```text
Food4U — Phase 2: Donor. Follow the master prompt exactly. The logged-in user is priya_s (Donor, Murudeshwar).

Donor shell, used on screens 2.1 to 2.7: app bar (title = screen name, menu icon on the right) + bottom tab bar with exactly 4 tabs: "Dashboard" (home icon), "Donate" (heart icon), "History" (clock icon), "Profile" (person icon). Highlight the tab that matches the screen.

Design ONLY these 9 frames.

SCREEN 2.1 — Dashboard (tab: Dashboard, app bar title "Dashboard")
- Greeting: H1 "Hi, priya_s" and muted text "Here's the difference you're making".
- 2 x 2 grid of KPI tiles:
  - "Total Donations" 12 (gift icon, Leaf)
  - "Delivered" 9 (check icon, Delivered green)
  - "In Progress" 1 (bicycle icon, River blue)
  - "Items Donated" 214 (basket icon, Amber)
- Primary button full width with a plus icon: "Donate Food".
- Chart card "Donations over time", caption "Last 6 months": line chart.
- Chart card "By status": doughnut chart with legend Pending 1, Picked Up 1, Delivered 9, Cancelled 1.
- Card "Recent donations" listing 3 rows: #101 Veg Biryani · 25 · Pending; #99 Chapati & Dal · 40 · Picked Up; #95 Rice bags (5 kg) · 10 · Delivered. Each row has the item name, quantity, date and status badge. Text button at the bottom: "View all".
- Card "Your impact": "You've donated 214 items across 12 donations." plus a horizontal progress bar at 75% labelled "Fulfillment rate 75%".

SCREEN 2.2 — Donate Food (tab: Donate, app bar title "Donate Food")
- Header: heart icon in a primary-tint circle, H1 "Make a donation", muted "Help feed those in need by sharing surplus food".
- Card "Donation details" with inputs:
  - "Food name *" (food icon), placeholder "e.g. Rice, Vegetables, Cooked meals"
  - "Quantity *" (scale icon), a number stepper with − and + buttons showing 1, helper "Number of plates, packets or bags"
  - "Pickup pincode *" (pin icon), value 581342, helper "Volunteers in this pincode's area will see your donation"
  - "Pickup address *" (location icon), placeholder "House / street / landmark"
  - "Contact number *" (phone icon), placeholder "Your phone number"
  - "Description" (document icon), 4-line text area, placeholder "Anything volunteers should know (optional)"
- Muted info line with an info icon: "Fields marked with * are required."
- Primary button "Submit Donation", then secondary button "Clear Form".
- Card "How it works" with 4 rows, each with a green check icon: "Fill in the donation details" / "Volunteers in your area see it" / "A volunteer picks it up from you" / "Track its status in History".

SCREEN 2.3 — Donate Food, pincode error
- Same as 2.2 filled in with: Food name "Veg Biryani", Quantity 25, Pickup pincode 560001, Pickup address "12 Beach Road, near Murudeshwar Temple", Contact 98450 12345.
- The pincode input is in error state with red text "We don't operate in this pincode yet."

SCREEN 2.4 — Edit Donation (no tab highlighted; app bar has a back arrow and title "Edit Donation")
- Same form as 2.2, pre-filled with donation #101: Veg Biryani, 25, 581342, "12 Beach Road, near Murudeshwar Temple", 98450 12345, description "Packed in foil trays, cooked today at 12 PM".
- Primary button "Update Donation", then text button "Cancel".
- No "How it works" card.

SCREEN 2.5 — History (tab: History, app bar title "History")
- H1 "Your donations", muted "Track every donation and its status".
- Stat strip of 4 small tiles: "Total" 12, "Pending" 1, "Picked Up" 1, "Delivered" 9.
- Donation cards for #101, #99, #95, #90, in that order (the list continues off-screen). Each card:
  - Header: item name, created date, status badge.
  - Details grid: "Quantity", "Pickup address" (address + " - " + pincode), "Contact", plus "Description" full width when present.
  - #99 and #95: a "Volunteer" row: "Assigned to rahul_n".
  - #90: a "Volunteer" row: "Assigned to meera_k".
  - Status timeline on every card except Pending: three dots joined by a line: "Created" → "Picked Up" → "Delivered". Completed steps are filled in Primary. For #90 the last step reads "Cancelled" in danger red.
  - Only the Pending card (#101) shows two small buttons at the bottom: Secondary "Edit" (pencil icon) and Danger "Delete" (trash icon).

SCREEN 2.6 — History, empty state
- Same shell and header, no stat strip.
- Empty state: food icon, "No donations yet", "Your donations will appear here once you share food.", primary button "Make your first donation".

SCREEN 2.7 — Delete confirmation
- Screen 2.5 dimmed behind a confirm dialog: title "Delete this donation?", message "Veg Biryani (25) will be removed. This can't be undone.", buttons "Cancel" and Danger "Delete".

SCREEN 2.8 — Profile (tab: Profile, app bar title "Profile")
- Profile card: 72px avatar circle with "P" on a green tint, H2 "priya_s", green role chip "Donor", muted "Joined 5 Sep 2026".
- Card "Account details" with icon rows (small muted label above the value): "Email" priya.shetty@gmail.com; "Area" Murudeshwar; "Pincode" 581342; "Email verified" Yes (green check icon); "Last login" 24 Oct 2026, 1:10 PM.
- Danger button full width "Logout".

SCREEN 2.9 — Profile, area pending (user kavya_d)
- Same layout for kavya_d (Donor, kavya.d@gmail.com, pincode 575001), avatar "K".
- Above "Account details", the pending-area banner: title "Area not assigned yet", text "Your pincode didn't match an area. A Super Admin will assign you soon. You can still donate."
- The "Area" row reads "Pending assignment" in warning dark text.
```

---

## Phase 3 — Volunteer

```text
Food4U — Phase 3: Volunteer. Follow the master prompt exactly. The logged-in user is rahul_n (Volunteer, Murudeshwar).

Volunteer shell, used on screens 3.1 to 3.6: app bar (title = screen name, menu icon on the right) + bottom tab bar with exactly 4 tabs: "Dashboard" (home icon), "Pickups" (bicycle icon), "History" (clock icon), "Profile" (person icon).

Design ONLY these 8 frames.

SCREEN 3.1 — Dashboard (tab: Dashboard)
- H1 "Hi, rahul_n", muted "Thanks for delivering hope".
- 2 x 2 grid of KPI tiles:
  - "Picked Up now" 1 (bicycle icon, River blue)
  - "Delivered" 21 (check icon, Delivered green)
  - "Success rate" 91% (trending-up icon, Leaf)
  - "Avg delivery time" 6.4 hrs (clock icon, Amber)
- Card "Your active pickup", showing donation #99 Chapati & Dal · 40 · donor priya_s · House 4, Temple Street - 581342 · Picked Up badge, plus a primary button "Go to Pickups".
- Chart card "Deliveries over time", caption "Last 6 months": line chart.
- Chart card "Completion": doughnut Delivered 21 (green) vs Cancelled 2 (red), legend below.
- Card "Tips" with 3 bullet lines: "Mark the donation as delivered as soon as you hand it over." / "Keep cooked food covered and cool." / "Call the donor if you're running late."

SCREEN 3.2 — Pickups (tab: Pickups)
- H1 "Pickups", muted "Collect and deliver food in Murudeshwar".
- Stat strip of 2 small tiles: "My active" 1, "Available" 2.
- Section title "My active pickups". One donation card for #99 with:
  - Picked Up badge; details grid: "Quantity" 40, "Donor" priya_s, "Contact" 98450 12345 shown as a tappable link with a phone icon, "Pickup address" House 4, Temple Street - 581342 (full width).
  - Info-tint note box with a navigation icon: "Deliver it to the people in need, then mark it as delivered."
  - Primary button full width "Mark as Delivered" (check icon) and Danger button full width "Mark as Cancelled" (x icon).
- Section title "Available in Murudeshwar". Two donation cards, #101 Veg Biryani and #102 Idli & Sambar, each with:
  - Pending badge; details grid: "Quantity", "Donor", "Contact" (tappable), "Pickup address" (full width); "Description" when present.
  - Warning-tint note box with a lightbulb icon: "Tap Pick Up when you collect the food from the donor."
  - Primary button full width "Pick Up" (check icon).

SCREEN 3.3 — Pick up success
- Screen 3.2 with a success toast at the top "Donation picked up!". Card #101 has moved into "My active pickups" with a Picked Up badge.

SCREEN 3.4 — Mark as Cancelled confirmation
- Screen 3.2 dimmed behind a confirm dialog: title "Mark as cancelled?", message "Chapati & Dal (40) will be marked as cancelled. It won't go back to the available list.", buttons "Keep it" and Danger "Mark as Cancelled".

SCREEN 3.5 — Pickups, empty state
- Empty state: check-done icon, "No pickups right now", "New donations in Murudeshwar will show up here.", secondary button "View History".

SCREEN 3.6 — History (tab: History)
- H1 "Task history", muted "Your completed pickups and deliveries".
- Stat strip of 3 small tiles: "Total" 23, "Delivered" 21, "Cancelled" 2.
- Three cards: #95 Rice bags (5 kg) Delivered; #88 Vegetable Pulao Delivered; #85 Curd Rice Cancelled. Each card:
  - Header with a large check (green) or x (red) icon, item name, created date and status badge.
  - Details grid: "Quantity", "Donor", "Contact", "Pickup address".
  - Message box: Delivered cards get a success tint with "Delivered. Great work!"; the cancelled card gets a danger tint with "This pickup was cancelled."
  - Footer line in muted caption: "Created 20 Oct 2026, 10:05 AM · Completed 20 Oct 2026, 4:30 PM" (for #95; show matching dates on the others).

SCREEN 3.7 — Profile (tab: Profile)
- Same layout as the donor Profile: avatar "R" on a blue tint, "rahul_n", blue role chip "Volunteer", "Joined 10 Sep 2026".
- Account details: Email rahul.naik@gmail.com, Area Murudeshwar, Pincode 581342, Email verified Yes.
- Danger button "Logout".

SCREEN 3.8 — Profile, area pending (user arjun_m)
- Same layout for arjun_m (Volunteer, arjun.m@gmail.com, pincode 560001), avatar "A".
- Pending-area banner: title "Area not assigned yet", text "Your pincode didn't match an area. You'll see local pickups once a Super Admin assigns you."
- The "Area" row reads "Pending assignment".
```

---

## Phase 4 — Area Admin

```text
Food4U — Phase 4: Area Admin. Follow the master prompt exactly. The logged-in user is admin_murudeshwar (Area Admin of Murudeshwar). Area Admins see only their own area.

Admin shell, used on all screens: app bar (title = screen name, menu icon on the right) + bottom tab bar with exactly 4 tabs: "Dashboard" (home icon), "Donations" (cube icon), "Users" (people icon), "Profile" (person icon).

Design ONLY these 7 frames.

SCREEN 4.1 — Dashboard (tab: Dashboard)
- H1 "Murudeshwar", muted "Area overview". A small slate role chip "Area Admin" next to the title.
- 2 x 2 grid of KPI tiles:
  - "Total Donations" 64 (cube icon, Leaf)
  - "Delivered" 58 (check icon, Delivered green)
  - "Success rate" 91% (trending-up icon, River blue)
  - "Avg delivery time" 5.8 hrs (clock icon, Amber)
- Card "People": two halves, "Donors" 40 (heart icon, green) and "Volunteers" 12 (bicycle icon, blue).
- Chart card "Donations over time", caption "Last 6 months": line chart.
- Chart card "By status": doughnut Pending 3, Picked Up 1, Delivered 58, Cancelled 2.
- Card "Top volunteers": 3 ranked rows: "1 rahul_n 21 delivered", "2 meera_k 17 delivered", "3 vikram_p 9 delivered", each with an avatar initial.
- Card "My area": rows "Pincodes" 581342, 581343; "Status" with a green "Active" pill; "Opened" 12 Jan 2026.

SCREEN 4.2 — Donations (tab: Donations)
- H1 "Donations", muted "All donations in Murudeshwar".
- Stat strip of 4 small tiles: "Total" 64, "Pending" 3, "Picked Up" 1, "Delivered" 58.
- Donation cards for #101, #102, #99, #95 (the list continues off-screen). Each card:
  - Header: item name, "ID #101" in muted caption, status badge.
  - Details grid: "Donor", "Contact", "Quantity", "Pickup address" (with pincode, full width), "Volunteer" (username, or "Not assigned" in muted text).
  - Footer muted caption: "Created … · Updated …".
  - Small Danger button "Delete" (trash icon) at the bottom right.

SCREEN 4.3 — Delete donation confirmation
- Screen 4.2 dimmed behind a confirm dialog: title "Delete donation #102?", message "Idli & Sambar (30) from hotel_sagar will be removed. This can't be undone.", buttons "Cancel" and Danger "Delete".

SCREEN 4.4 — Users (tab: Users)
- H1 "Users", muted "People in Murudeshwar".
- Stat strip of 3 small tiles: "Total" 53, "Donors" 40, "Volunteers" 12.
- List of rows, each with avatar initial, username, email, a role pill in the role color, and two icon buttons on the right: pencil (edit) and trash (delete, red). Show: admin_murudeshwar (Area Admin, no delete button), rahul_n (Volunteer), meera_k (Volunteer), vikram_p (Volunteer), priya_s (Donor), hotel_sagar (Donor), deepa_r (Donor). The list continues off-screen.

SCREEN 4.5 — Edit user (bottom sheet)
- Screen 4.4 dimmed behind a bottom sheet titled "Edit user".
- Inputs "Username" (value rahul_n) and "Email" (value rahul.naik@gmail.com).
- Muted note with an info icon: "Role and area can't be changed here."
- Primary button "Save" and text button "Cancel".

SCREEN 4.6 — Delete user confirmation
- Screen 4.4 dimmed behind a confirm dialog: title "Delete deepa_r?", message "This removes the user and their donations. This can't be undone.", buttons "Cancel" and Danger "Delete".

SCREEN 4.7 — Profile (tab: Profile)
- Same profile layout as other roles: avatar "A" on a slate tint, "admin_murudeshwar", slate role chip "Area Admin", "Joined 12 Jan 2026".
- Account details: Email admin.murudeshwar@gmail.com, Area Murudeshwar, Pincode 581342, Email verified Yes.
- Danger button "Logout".
```

---

## Phase 5 — Super Admin

```text
Food4U — Phase 5: Super Admin. Follow the master prompt exactly. The logged-in user is anita_rao (Super Admin). The Super Admin sees every area.

Navigation: NO bottom tab bar for this role. The Dashboard is a hub: app bar with title "Super Admin" and the menu icon. Every other screen is a drill-down with a back arrow on the left and its title.

Design ONLY these 10 frames.

SCREEN 5.1 — Dashboard (hub)
- H1 "Hi, anita_rao", muted "All areas at a glance", ink role chip "Super Admin".
- Section "Manage": 2-column grid of 5 action tiles (white cards, icon in a tint square, label, optional count pill):
  - "Areas" (map icon)
  - "Pending Signups" (hourglass icon) with a warning count pill "2"
  - "Unattended Donations" (alert icon) with a danger count pill "2"
  - "Create Area Admin" (person-add icon)
  - "All Users" (people icon)
- 2 x 2 grid of KPI tiles: "Total Donations" 97, "Delivered" 81, "Success rate" 84%, "Avg delivery time" 6.1 hrs.
- Chart card "Donations by area": horizontal bar chart, Murudeshwar 64, Bhatkal 31, Honnavar 2, Gokarna 0.
- Chart card "Users by role": doughnut, Donors 72 (green), Volunteers 20 (blue), Area Admins 2 (slate), Super Admins 1 (ink), legend below.
- Card "Top volunteers": rahul_n 21, meera_k 17, imran_b 14 (ranked rows with avatar initials).
- Card "Areas": one row per area with name, muted "64 total · 58 delivered" (use matching numbers for each area), and a chevron on the right (it opens the area dashboard).

SCREEN 5.2 — Areas (back arrow, title "Areas")
- Card "Open a new town": inputs "Area name" (placeholder "e.g. Murudeshwar") and "Pincodes". The pincodes input is a chip input: typed pincodes become removable chips; show chips 581350 and 581351 entered. Primary button "Create Area" (plus icon).
- List of area cards: name (H3); pincode chips; status pill ("Active" green / "Inactive" grey); muted "Admin: admin_murudeshwar" (or "No Area Admin" in warning dark text for Honnavar and Gokarna); Secondary small button "Edit" and Danger small button "Delete". Show Murudeshwar, Bhatkal, Honnavar and Gokarna.

SCREEN 5.3 — Edit area (bottom sheet)
- Screen 5.2 dimmed behind a bottom sheet titled "Edit area": input "Area name" with value Bhatkal; pincode chip input with chip 581320; a toggle row "Active" switched on; primary button "Save" and text button "Cancel".

SCREEN 5.4 — Area dashboard (back arrow, title "Murudeshwar")
- 2 x 2 KPI tiles: "Total Donations" 64, "Delivered" 58, "Success rate" 91%, "Avg delivery time" 5.8 hrs.
- Chart card "Donations over time": line chart.
- Chart card "By status": doughnut Pending 3, Picked Up 1, Delivered 58, Cancelled 2.
- Card "Top volunteers": rahul_n 21, meera_k 17, vikram_p 9.

SCREEN 5.5 — Pending Signups (back arrow, title "Pending Signups")
- Muted intro: "These users' pincodes didn't match any area. Assign each one to an area."
- Two cards:
  - arjun_m: arjun.m@gmail.com, blue role pill "Volunteer", muted "Pincode 560001". Below: a dropdown "Select area" (closed) and a primary button "Assign".
  - kavya_d: kavya.d@gmail.com, green role pill "Donor", muted "Pincode 575001". Below: the dropdown open, showing options Murudeshwar, Bhatkal, Honnavar, Gokarna, with Bhatkal highlighted, plus a primary button "Assign".

SCREEN 5.6 — Pending Signups, empty state
- Empty state: check icon, "No pending signups", "Every user has an area."

SCREEN 5.7 — Unattended Donations (back arrow, title "Unattended Donations")
- Muted intro: "Pending donations in areas with no active Area Admin."
- Two donation cards: #97 Lemon Rice (20) and #96 Bread Loaves (15). Each shows: Pending badge; "Area" Honnavar; "Pickup address" Bus Stand Road, Honnavar - 581334; "Donor" suresh_h; "Contact" 99001 23456; created date; a danger-tint pill "No active Area Admin"; and a secondary button "Create Area Admin for Honnavar".

SCREEN 5.8 — Create Area Admin (back arrow, title "Create Area Admin")
- Card "New Area Admin", muted subtitle "The account is active right away. No email code needed."
- Inputs: "Username" (value admin_honnavar), "Email" (value admin.honnavar@gmail.com, helper "Gmail address only"), "Password" (value Food4U@2026 shown as visible text, helper "You'll share this with them directly"), and an "Area" dropdown (value Honnavar). Helper under the dropdown: "Only areas without an Area Admin are listed."
- Primary button "Create Area Admin".

SCREEN 5.9 — Area Admin created (success)
- Same app bar. Success card: large green check icon, H2 "Area Admin created", muted "Share these details with them directly. No invite email is sent."
- Detail rows: "Username" admin_honnavar, "Email" admin.honnavar@gmail.com, "Password" Food4U@2026, "Area" Honnavar.
- Secondary button "Copy details" (copy icon) and primary button "Create another".

SCREEN 5.10 — All Users (back arrow, title "All Users")
- Card "Super Admins" with one list row: anita_rao, anita.rao@gmail.com, dark "Super Admin" pill.
- Accordion list, one section per area. The header shows the area name (H3) and a muted summary.
  - Murudeshwar, EXPANDED. Summary "Admin: admin_murudeshwar · 12 volunteers · 40 donors". Inside, three small titled groups:
    - "Area Admin": row admin_murudeshwar
    - "Volunteers (12)": rows rahul_n, meera_k, vikram_p
    - "Donors (40)": rows priya_s, hotel_sagar, deepa_r
    - Every row has the role pill plus pencil and trash icon buttons.
  - Bhatkal, collapsed. Summary "Admin: admin_bhatkal · 7 volunteers · 30 donors".
  - Honnavar, collapsed. Summary "Admin: Unassigned · 0 volunteers · 1 donor" ("Unassigned" in warning dark text).
  - Gokarna, collapsed. Summary "Admin: Unassigned · 0 volunteers · 0 donors".
  - Unassigned, collapsed, with a warning-tint header. Summary "1 volunteer · 1 donor awaiting an area".
```

---

## Phase 6 — Consistency check

```text
Food4U — Phase 6: Consistency check. Do not add new screens.

Review every screen from Phases 1–5 against the master prompt and fix any differences:
- Only the master palette colors are used; status badges match the status system exactly on every screen.
- Every screen has exactly one app bar. Donor, Volunteer and Area Admin screens use their 4-tab bar; Super Admin screens have no tab bar.
- Cards, inputs, buttons, list rows, dialogs and bottom sheets match the style-guide components (radius, spacing, shadow, fonts).
- All names, numbers, dates and addresses match the sample data. Remove any invented data, buttons, fields, icons or features.
- Text matches the quoted copy exactly.
List each fix you made.
```

---

## Drift fix

Use this whenever the tool adds things you didn't ask for or changes colors or data.

```text
Stop. You added things that are not in the brief. Re-read the Food4U master prompt rules: use only the listed screens, components, colors, quoted text and sample data. Remove every element, feature, field and value that I didn't specify, then regenerate the last screen.
```
