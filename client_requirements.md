# CLIENT REQUIREMENTS — VANUIT AMBACHT PORTAL
## Status Analysis: What Exists vs What is Missing

**Last Updated:** 08 August 2026
**Type:** Frontend UI Only — No Backend / No Database / No Real APIs
**Source:** Client meeting (Tim & Bram) + Final Requirements Document 08 Aug 2026

---

## STATUS LEGEND

| Symbol | Meaning |
|--------|---------|
| [OK]   | Already implemented and working |
| [PART] | Partially implemented — needs improvement |
| [MISS] | Missing — needs to be built |

---

## 1. SETTINGS PAGE
File: src/pages/admin/Settings.jsx
Current Tabs: Company Details | User Management | Product Fields Configurator | Message Templates

| Requirement                                         | Status | Notes                                                                        |
|-----------------------------------------------------|--------|------------------------------------------------------------------------------|
| Company details (name, email, phone, address)       | [OK]   | Fully working                                                                |
| VAT rate config (21% / 9%)                          | [OK]   | Implemented                                                                  |
| Quote and Invoice number prefix                     | [OK]   | Implemented                                                                  |
| User Management (invite/add users)                  | [OK]   | Invite modal works                                                           |
| User role change (admin/partner/customer)           | [OK]   | Working                                                                      |
| User enable/disable toggle                          | [OK]   | Working                                                                      |
| Product Field Configurator                          | [OK]   | Add/delete fields per product type                                           |
| Message Templates (3 editable templates)            | [OK]   | Working                                                                      |
| Categories management tab                           | [MISS] | No category manager tab — only fieldsets tied to hardcoded product types     |
| Price Breakdown section config                      | [MISS] | Completely missing — no partner price section configuration exists           |
| Quote/Document Template management                  | [PART] | Only message templates, no quote/document template creation                  |
| Google Calendar connect UI                          | [MISS] | Missing                                                                      |
| Gmail connect UI                                    | [MISS] | Missing                                                                      |

---

## 2. LEADS PAGE
File: src/pages/admin/Leads.jsx

| Requirement                                         | Status | Notes                                                                        |
|-----------------------------------------------------|--------|------------------------------------------------------------------------------|
| Lead list with status badges                        | [OK]   | Working                                                                      |
| Add new lead modal                                  | [OK]   | Working                                                                      |
| Lead status inline change                           | [OK]   | Working dropdown                                                             |
| CSV export                                          | [OK]   | Working                                                                      |
| Filter panel                                        | [OK]   | Working                                                                      |
| Dynamic categories from Settings                   | [PART] | Category field exists in form but options are hardcoded, not from Settings   |
| Category-specific fields in lead detail             | [PART] | Basic product type shown but fields not dynamically driven from Settings     |
| WhatsApp photo send UI                              | [PART] | UI exists but images may not load (dummy data issue)                         |

---

## 3. 8-STEP WORKFLOW (WorkflowTracker)
File: src/components/WorkflowTracker.jsx

Steps implemented:
1. New Lead [OK]
2. Partner Price Request [OK]
3. Partner Quote [OK]
4. Create Quote for Lead/Customer [OK]
5. Project Created [OK]
6. Partner Assigned [OK]
7. Planning and Installation [OK]
8. Completed [OK]

| Requirement                                         | Status | Notes                                                                        |
|-----------------------------------------------------|--------|------------------------------------------------------------------------------|
| 8-step lifecycle                                    | [OK]   | All 8 steps implemented                                                      |
| Step indicator and progress bar                     | [OK]   | Visual stepper works                                                         |
| Next action button per step                         | [OK]   | Context-aware                                                                |
| Category-driven field display in Step 2             | [MISS] | Step 2 has hardcoded fields not pulled from Settings field configurator      |

---

## 4. PARTNER PRICE REQUEST
File: src/pages/partner/PartnerPriceRequests.jsx

| Requirement                                         | Status | Notes                                                                        |
|-----------------------------------------------------|--------|------------------------------------------------------------------------------|
| Open price requests list                            | [OK]   | Works                                                                        |
| Expand to see full specs                            | [OK]   | Accordion works                                                              |
| Submit single total price                           | [OK]   | One price field exists                                                       |
| Submitted log history                               | [OK]   | History tab works                                                            |
| Multiple price breakdown sections                   | [MISS] | Only ONE price field — Material/Labour/Transport/Installation breakdown missing |
| Dynamic price sections from Settings                | [MISS] | Settings has no price section config yet                                     |

---

## 5. QUOTES PAGE
File: src/pages/admin/Quotes.jsx

| Requirement                                         | Status | Notes                                                                        |
|-----------------------------------------------------|--------|------------------------------------------------------------------------------|
| Quote list with status                              | [OK]   | Working                                                                      |
| Create quote modal basic                            | [OK]   | Form exists                                                                  |
| PDF preview                                         | [PART] | Generic PDF, not matching Dutch client template format                       |
| Mark as accepted                                    | [OK]   | Status toggle works                                                          |
| Generate Invoice button visible on quote            | [PART] | Auto-generates when accepted but no dedicated visible button per row         |
| Dutch quote template structure                      | [MISS] | Current quote too generic — missing: dimensions, wood type, BBQ, delivery location, worktop |
| Editable quote sections per category                | [MISS] | No category-driven editable fields in quote                                  |

---

## 6. INVOICES PAGE
File: src/pages/admin/Invoices.jsx

| Requirement                                         | Status | Notes                                                                        |
|-----------------------------------------------------|--------|------------------------------------------------------------------------------|
| Invoice list                                        | [OK]   | Working                                                                      |
| Stat cards (total/paid/pending/overdue)             | [OK]   | Working                                                                      |
| Mark as paid                                        | [OK]   | Working                                                                      |
| PDF/print preview                                   | [OK]   | Basic PDF modal                                                              |
| Invoice with line items + VAT + total breakdown     | [PART] | Basic amount only, no proper line-item breakdown with VAT rows               |
| Send Invoice by Email UI button                     | [MISS] | No email button exists (no real API needed, just UI representation)          |
| Invoice linked to related quote                     | [PART] | Auto-created when quote accepted, but no visible quote reference on invoice  |

---

## 7. CUSTOMERS PAGE
File: src/pages/admin/Customers.jsx

| Requirement                                         | Status | Notes                                                                        |
|-----------------------------------------------------|--------|------------------------------------------------------------------------------|
| Customer list with info cards                       | [OK]   | Working with mock data                                                       |
| Customer detail view                                | [OK]   | Shows linked orders/quotes                                                   |
| Add Customer manually button and form               | [MISS] | No Add Customer button or form exists at all                                 |
| Automatic customer creation after invoice sent      | [MISS] | No flow connecting invoice to customer creation                              |

---

## 8. BANK PAGE
File: src/pages/admin/Bank.jsx

| Requirement                                         | Status | Notes                                                                        |
|-----------------------------------------------------|--------|------------------------------------------------------------------------------|
| Transaction list with categories                    | [OK]   | Working with mock data                                                       |
| Search and filter                                   | [OK]   | Working                                                                      |
| Import Bank Statements button and modal             | [PART] | UploadCloud icon imported, modal may be partially coded — needs verification |
| File format selector PDF/Excel TXT/XLS              | [PART] | Needs verification/completion                                                |
| Import progress and transaction preview             | [MISS] | Not implemented                                                              |
| Auto-categorization UI                              | [PART] | Category column exists but no clear auto-categorize UI representation        |

---

## 9. PLANNING PAGE
File: src/pages/admin/Planning.jsx

| Requirement                                         | Status | Notes                                                                        |
|-----------------------------------------------------|--------|------------------------------------------------------------------------------|
| 6-week calendar grid                                | [OK]   | Working                                                                      |
| Partner filter                                      | [OK]   | Dropdown filter works                                                        |
| Capacity overload warnings                          | [OK]   | Red banner works                                                             |
| Day-level planning view                             | [MISS] | Only week-level — no day view exists at all                                  |
| Week to Day view toggle                             | [MISS] | viewMode toggle does not exist                                               |
| Mon/Tue/Wed/Thu/Fri/Sat/Sun day cards               | [MISS] | Missing                                                                      |
| Google Calendar connect UI                          | [MISS] | Missing                                                                      |

---

## 10. TASKS PAGE
File: src/pages/admin/Tasks.jsx

| Requirement                                         | Status | Notes                                                                        |
|-----------------------------------------------------|--------|------------------------------------------------------------------------------|
| Task list with assignee/priority/due date           | [OK]   | Working                                                                      |
| Add/Edit/Delete tasks                               | [OK]   | Working                                                                      |
| Plaud AI Import modal                               | [OK]   | Modal exists                                                                 |
| Audio upload UI (MP3/WAV/M4A)                       | [OK]   | UI exists                                                                    |
| Paste transcript text area                          | [OK]   | Large text area with sample                                                  |
| AI Analysis result display                          | [OK]   | Mock analysis shown                                                          |
| Auto task creation from Action Items                | [OK]   | Create Tasks button works                                                    |
| Assignee Tim/Bram on auto-created tasks             | [OK]   | Working                                                                      |

TASKS PAGE IS FULLY COMPLETE

---

## 11. PROJECTS PAGE
File: src/pages/admin/Projects.jsx

| Requirement                                         | Status | Notes                                                                        |
|-----------------------------------------------------|--------|------------------------------------------------------------------------------|
| Project list                                        | [OK]   | Working                                                                      |
| Project detail view                                 | [OK]   | Full detail with specs                                                       |
| Admin photo upload in project detail                | [MISS] | No photo section exists — completely missing                                 |
| Photo gallery in project                            | [MISS] | Missing                                                                      |
| Photos visible in customer portal                   | [MISS] | No connection from Projects to Customer portal photos                        |

---

## 12. PARTNER PORTAL

### PartnerProjects — src/pages/partner/PartnerProjects.jsx

| Requirement                                         | Status | Notes                                                                        |
|-----------------------------------------------------|--------|------------------------------------------------------------------------------|
| Assigned project list                               | [OK]   | Working                                                                      |
| Project specs, address, drawings                    | [OK]   | Shown in expand                                                              |
| Upload Photo from partner portal                    | [MISS] | Upload icon imported but NO upload UI or modal built                         |
| Mock notification to admin on photo upload          | [MISS] | Missing                                                                      |

### PartnerPriceRequests — src/pages/partner/PartnerPriceRequests.jsx

| Requirement                                         | Status | Notes                                                                        |
|-----------------------------------------------------|--------|------------------------------------------------------------------------------|
| Open requests and submit                            | [OK]   | Works                                                                        |
| Price breakdown form (material/labour/transport)    | [MISS] | Only ONE price field — no breakdown                                          |

---

## 13. CUSTOMER PORTAL

| Page                   | Requirement                              | Status | Notes                                          |
|------------------------|------------------------------------------|--------|------------------------------------------------|
| CustomerPhotos.jsx     | Photo gallery                            | [OK]   | Static mock photos shown                       |
| CustomerPhotos.jsx     | Photos from admin/partner uploads        | [MISS] | Static only, not connected to upload flow      |
| CustomerProject.jsx    | Project info and phase display           | [OK]   | Working                                        |
| CustomerDocuments.jsx  | Document list with quote/invoice         | [OK]   | Working                                        |
| CustomerQuotes.jsx     | Quote viewing + invoice auto-generation  | [OK]   | Working                                        |
| CustomerContact.jsx    | Tim and Bram contacts with WhatsApp/Call | [OK]   | Working                                        |

---

## MISSING FEATURES — PRIORITY ORDER

### PHASE 1 — Settings (Do First)
- S1: Categories tab — Add/Edit/Enable/Disable categories
- S2: Price Breakdown Config tab — Add/Edit/Reorder partner price sections
- S3: Extend Templates tab for document/quote templates

### PHASE 2 — Leads
- L1: Category options pulled from Settings categories
- L2: Category-specific fields in Workflow Step 2 from Settings

### PHASE 3 — Partner Price Request (Important for client)
- P1: Price breakdown form with multiple sections (Material/Labour/Transport/Installation/Other/Total)
- P2: Sections driven from Settings price config

### PHASE 4 — Quotes (Important for client)
- Q1: Dutch quote template with proper sections (dimensions, wood, BBQ, delivery, worktop)
- Q2: Visible Generate Invoice button on each quote

### PHASE 5 — Invoices and Customers
- I1: Send Invoice by Email button (UI only)
- I2: Quote reference on invoice
- C1: Add Customer manually — button and form
- C2: Auto customer from invoice concept

### PHASE 6 — Bank
- B1: Complete import modal with file format selector and mock preview
- B2: Auto-categorization UI

### PHASE 7 — Planning (Important for client)
- PL1: Day-level view toggle
- PL2: Week to Day drill-down (Mon to Sun per week)
- PL3: Google Calendar connect UI

### PHASE 8 — Tasks (COMPLETE — nothing to do)

### PHASE 9 — Projects and Photos
- PR1: Admin photo upload in Project detail (COMPLETE)
- PR2: Partner photo upload in PartnerProjects (COMPLETE)
- PR3: Mock admin notification on partner photo upload (COMPLETE)
- PR4: CustomerPhotos receives photos from upload flow (COMPLETE)
- PR5: Admin Projects Screen clean-up per Frontend Briefing Lead Flow v1.0 Page 8/11 (COMPLETE)
  - Removed Kliko webshop orders tab and Kliko category dropdown references
  - Removed webshop item/status columns and Shipped status
  - Table updated to exact 7-column schema: PROJECT NO., CATEGORY, PROJECT, CUSTOMER, PARTNER, STATUS (To confirm / In production / On site / Completed), VALUE (INCL. VAT), COMPLETION
  - Bilingual NL/EN support for all labels

### PHASE 11 — Garden Room & Poolhouse Customer Portal Extension
- STEP 0: Existing Customer Portal Codebase Audit & Gap Analysis (COMPLETE)
- STEP 1: Garden Room Data Model & Project Type Support (COMPLETE)
  - Created dedicated helper `src/utils/projectType.js` exporting `PROJECT_TYPES`, `detectProjectType()`, `isGardenRoomFamily()`, `normalizeProjectType()`.
  - Supported project types: `outdoor_kitchen` (default for backward compatibility), `garden_room`, `poolhouse`, `canopy`.
  - Memory-only normalization implemented without mutating existing `localStorage` keys or breaking Outdoor Kitchen data.
  - Zero UI changes made. Production build verified cleanly (0 errors).

- STEP 2: Dynamic Customer Portal Navigation Labels (COMPLETE & VERIFIED)
  - Updated `src/layouts/Sidebar.jsx` to dynamically switch ALL THREE dynamic customer navigation labels using `isGardenRoomFamily(activeCustomerProject)`:
    1. `Ontwerp & opties` ➔ `Ontwerp & renders` (EN: `Design & Options` ➔ `Design & Renders`)
    2. `Planning & levering` ➔ `Planning & bouw` (EN: `Planning & Delivery` ➔ `Planning & Build`)
    3. `Foto's uit de werkplaats` ➔ `Foto's & updates` (EN: `Workshop Photos` ➔ `Photos & Updates`)
  - Legacy & `outdoor_kitchen` projects retain base labels.
  - Active customer project detected dynamically from `localStorage` (`app_projects`) matching logged-in customer user.
  - Zero route path changes made (`/customer/...` paths unchanged). Production build verified cleanly (0 errors).

- STEP 3: Implement Customer Portal "Ontwerp & renders" Screen (COMPLETE & VERIFIED)
  - Created `src/components/customer/RenderViewer.jsx`: 16:7 main render container, Day/Evening toggle (when evening render exists), 2-6 thumbnail view switcher, graceful placeholder ("De renders van jouw ontwerp volgen hier."), image error boundary.
  - Created `src/components/customer/RenderDetailCards.jsx`: 3 detail cards (Hout, Dak, Vloer) with image, title, and description.
  - Created `src/components/customer/RenderVersionList.jsx`: Version history list (V1, V2) with version number, date, thumbnail, and mandatory "Wat is gewijzigd:" text line.
  - Updated `src/pages/customer/CustomerProject.jsx`: Extended design tab rendering to conditionally display "Ontwerp & renders" screen when `isGardenRoomFamily(activeProject)` is true.
  - Outdoor Kitchen & legacy projects remain 100% untouched. Production build verified cleanly (0 errors).

- STEP 4: Implement Customer Portal "Planning & build" Screen & Navigation/Flow Fix (COMPLETE & VERIFIED)
  - Fixed Sidebar navigation links in `src/layouts/Sidebar.jsx`: Resolved link overlap bug where "Design & Options" and "Planning & Delivery" were highlighting together. Implemented custom `isLinkActive(linkPath)` helper using route + query param matching.
  - Distinct Customer Navigation Links for Outdoor Kitchen (7 items) vs Garden Room Family (9 items: Overview, My Quote, Design & Renders, Planning & Build, Photos & Updates, Documents, Payments, Messages & Contact, Handover & Aftercare).
  - English Copy Standard: Converted all newly added Step 4 UI strings, labels, badges, buttons, cards, empty states, and modal text into clean English for testing clarity.
  - Screen Flow Separation: `CustomerProject.jsx` now strictly isolates screen content per active tab (`overview`, `design`, `planning`, `payments`, `handover`).
  - Production build verified cleanly (`✓ built in 9.72s`, 0 errors).

- STEP 4 OVERVIEW: 1-to-1 Project-Type Based Customer Overview UI (COMPLETE & VERIFIED - 19 August 2026 12:46:45 PM IST)
  - Created `src/components/customer/OutdoorKitchenOverview.jsx`: 1-to-1 implementation of Client Mockup 1 (6-stage timeline: Request -> Quote -> Approval & Design -> In Workshop -> Delivery -> Aftercare, Current phase box, Customer action box, Latest workshop photo card, 3 side summary cards, Vertical activity log, Dedicated contact person Tim & Bram).
  - Created `src/components/customer/GardenRoomOverview.jsx`: 1-to-1 implementation of Client Mockups 1 & 2 (7-stage timeline: Approval & Design -> Site Survey -> Prep -> Materials -> Build -> Delivery -> Aftercare, Provisional schedule badge, Current phase box, 2 customer action cards, Main 3D render preview card, 3 side summary cards, Horizontal WeekBar timeline, Dedicated contact person Tim & Bram).
  - Single Overview Route `/customer/project`: `CustomerProject.jsx` evaluates `isGardenRoomFamily(activeProject)` and dynamically renders `<GardenRoomOverview />` or `<OutdoorKitchenOverview />`.
  - All UI copy standardized to **English** for development and testing clarity.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 16.45s`).

- STEP 4 OVERVIEW SYNC & VIEW SWITCHER: Real-Time Project Type Synchronization & Testing View Switcher (COMPLETE & VERIFIED - 19 August 2026 1:19:30 PM IST)
  - Fixed `CustomerProject.jsx` state initialization & event listeners: Now reactively listens to `storage` and `app_data_changed` window events. Changing the category dropdown in Admin Projects (`/admin/projects`) instantly updates `activeProject.projectType` on Customer Portal in real time!
  - Added **Testing View Switcher Bar** on top of Overview screen: Allows switching between **"Outdoor Kitchen (6-Stage)"** and **"Garden Room / Poolhouse (7-Stage)"** directly on the Customer Portal with 1 click!
  - Sidebar links (`7 items` vs `9 items`) & Overview layouts update instantly upon click or dropdown selection.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.13s`).

- STEP 4 WEEKBAR TIMELINE: 1-to-1 Client Mockup WeekBar Styling & Color Legend (COMPLETE & VERIFIED - 19 August 2026 2:50:45 PM IST)
  - Updated `src/components/customer/WeekBar.jsx` to match Client Mockup Image 2 1-to-1:
    * Title & Subtitle: "Your planning in weeks" / "At a glance: what happens when. The entire schedule is finalized after the site survey."
    * 9 Rounded Rectangular Week Cards (Week 34 to 42) with 3 lines of copy inside each card (Large Week Number, Date Subline, All-Caps Phase Label).
    * Client Color Palette: Pale green (`#E9EFE4`), Active Amber (`#B4823A`), Light Mint (`#E4EBE0`), Warm Beige (`#EAE4D9`), Dark Forest Green (`#3A4B35`).
    * Added Color Legend Bar below week blocks (completed, now, preparation, materials, build).
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 8.34s`).

- MY QUOTE IMPLEMENTATION: Project-Type Based "My Quote" Screen (COMPLETE & VERIFIED - 19 August 2026 3:05:30 PM IST)
  - Created `src/components/customer/OutdoorKitchenQuote.jsx`: 1-to-1 implementation of Client Mockup Image 1 (50/50 payment structure, quote header with `OF-2026325` & approval badge, line items, 5 included investment benefits, quote totals card, follow project / PDF / payments action buttons, previous version history card).
  - Created `src/components/customer/GardenRoomQuote.jsx`: 1-to-1 implementation of Client Mockup Image 2 (40/40/20 payment structure, quote header with `OF-2026418` & approval badge, line items with provisional sum `*` support and explanation note, 5 included investment benefits, quote totals card, action buttons).
  - Updated `src/pages/customer/CustomerQuotes.jsx`: Evaluates `isGardenRoomFamily(activeProject)` on route `/customer/quote` or `/customer/quotes` under single "My Quote" sidebar menu.
  - Included **Testing View Switcher Bar** on top for 1-click dev testing between `[ Outdoor Kitchen (50/50) ]` and `[ Garden Room / Poolhouse (40/40/20) ]`.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 7.17s`).

- ENGLISH COPY STANDARD ENFORCEMENT ON QUOTES: Strictly English Titles & Headers (COMPLETE & VERIFIED - 19 August 2026 3:14:45 PM IST)
  - Updated `OutdoorKitchenQuote.jsx` and `GardenRoomQuote.jsx` to dynamically sanitize raw product names: converts Dutch titles like `Buitenkeuken Thermo Fraké` to `Custom Outdoor Kitchen Thermo Fraké` / `Garden Room Canopy with Poolhouse`.
  - Enforced strict English copy standard across all newly added Customer Portal UI components for dev/testing clarity.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.09s`).

- MY QUOTE 1-TO-1 VISUAL REFINEMENT: Top Header Banner, Provisional Sum Note & Color Alignment (COMPLETE & VERIFIED - 19 August 2026 3:20:15 PM IST)
  - Added **Top Header Banner** above "My Quote" heading: Left side displays `Custom Outdoor Kitchen / Garden Room — project ID`, Right side displays `Updates 3` pill + `WhatsApp us` button matching Client Mockup Screenshot 2 1-to-1.
  - Refined **Provisional Sum Note** on Garden Room Quote: Removed heavy alert box; styled as clean muted italic text with mono bullet `* Provisional sum: this amount is a careful estimate...` matching mockup.
  - Aligned Quote ID code font (`#9E7B3B`), Approval Badge style (`✓ Quote approved`), Totals Box font-size & background (`#2A3425`), and Action Button styling (`bg-primary` for primary action, white border `#D6CFC2` for secondary actions).
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.86s`).

- LAYOUT CONTAINER OPTIMIZATION: Reduced Empty Sidebar Gap (COMPLETE & VERIFIED - 19 August 2026 3:23:00 PM IST)
  - Updated `CustomerQuotes.jsx`, `CustomerProject.jsx`, `OutdoorKitchenQuote.jsx`, `GardenRoomQuote.jsx`, `OutdoorKitchenOverview.jsx`, and `GardenRoomOverview.jsx`.
  - Expanded container max-width from narrow `max-w-4xl mx-auto` to `max-w-5xl w-full` matching client mockup screenshot 1-to-1.
  - Eliminated excessive empty space on the left side of the main card container.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 7.61s`).

- CLIENT PDF BRIEF 1-TO-1 AUDIT & VERIFICATION: Outdoor Kitchen Page 13 & Garden Room Page 7 (COMPLETE & VERIFIED - 19 August 2026 3:31:30 PM IST)
  - Audited `OutdoorKitchenQuote.jsx` and `GardenRoomQuote.jsx` line-by-line against the official PDF briefs (`Customer-Portal-Brief-Outdoor-Kitchens-EN_2.pdf` page 13 & `Customer-Portal-Brief-Garden-Rooms-EN.pdf` page 7).
  - Verified 1-to-1 exact match for section ordering, line items, price badges, provisional sum note `*`, payment schedule cards (50/50 vs 40/40/20), action button hierarchy, and font styling with zero visual mismatch or lag.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.38s`).

- UNIVERSAL CUSTOMER SIDEBAR MENUS: All 9 Menu Items Active Universally (COMPLETE & VERIFIED - 19 August 2026 3:38:00 PM IST)
  - Updated `src/layouts/Sidebar.jsx` so that `CUSTOMER_LINKS` permanently displays all 9 customer portal menu items (`Overview`, `My Quote`, `Design & Renders`, `Planning & Build`, `Photos & Updates`, `Documents`, `Payments`, `Messages & Contact`, `Handover & Aftercare`) across all project types.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 8.76s`).

- DESIGN & RENDERS PAGE 8 IMPLEMENTATION: 1-to-1 Garden Room Design View (COMPLETE & VERIFIED - 19 August 2026 3:44:00 PM IST)
  - Created `src/components/customer/GardenRoomDesignView.jsx`: 1-to-1 implementation of Client Mockup PDF Page 8 (`Customer-Portal-Brief-Garden-Rooms-EN.pdf`).
  - Top Header Tag Bar (`Custom Garden Room — project 2026-021`, `Updates 3`, `WhatsApp us`).
  - Page Heading (`Design & renders`) & Subtitle.
  - Interactive **Render Viewer** Card: Day/Night mode toggle, 4 interactive angle thumbnails (`Front View`, `Side View`, `Interior Poolhouse`, `From the Garden`), active overlay badge.
  - **Material & Finishing Details** Grid: 3 cards (`Douglas, fine-sawn`, `EPDM roof & aluminum trim`, `Ceramic tiles 60×60`).
  - **Layout Scale Diagram Bar**: `poolhouse enclosed 3.00 m` (37.5%) + `lounge covered 5.00 m` (62.5%) = `8.00 m`.
  - Right Sidebar Cards: 2×2 Specs Grid (`Dimensions`, `Timber Type`, `Roof`, `Build Time`), Your Selections list with provisional sum note, About Douglas Timber info card.
  - **Design Versions History** Card: `Version 2` (Current) & `Version 1` with `Submit feedback` action button.
  - Rendered in `CustomerProject.jsx` on `/customer/project?tab=design`.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 7.47s`).

- DESIGN & RENDERS 1-TO-1 VISUAL REFINEMENT: Full-Bleed Viewport, Soft Blue Badge & Clean Thumbnails (COMPLETE & VERIFIED - 19 August 2026 3:49:30 PM IST)
  - Refined `GardenRoomDesignView.jsx` to match Client Mockup Screenshot 1 1-to-1.
  - Render Viewport Card: Converted inner nested box into a 100% full-bleed render image viewport (`w-full h-80 sm:h-[420px] rounded-2xl`).
  - Version Badge: Updated pill styling to soft blue-gray `bg-[#D7E3EC] text-[#2B4B68]` matching mockup.
  - Day/Night Switcher: Styled dark pill `bg-[#2B3827]` for active mode.
  - 4 View Angle Thumbnails: Clean full-width image preview boxes without inner text overlay; text labels (`Front View`, `Side View`, `Interior Poolhouse`, `From the Garden`) placed neatly below with active thick dark border (`border-2 border-primary ring-2 ring-primary/20`).
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 7.16s`).

- DESIGN & RENDERS TEXTURE & HEIGHT OPTIMIZATION: Vertical Wood Slat Plank Lines & Height Reduction (COMPLETE & VERIFIED - 19 August 2026 3:53:30 PM IST)
  - Applied CSS repeating linear gradient vertical wood slat lines (`repeating-linear-gradient(90deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 2px, transparent 2px, transparent 16px)`) across the main render viewport, Douglas material card, and all 4 angle thumbnails matching Screenshot 1 1-to-1.
  - Reduced main render viewport container height from tall `h-80 sm:h-[420px]` to optimal `h-56 sm:h-72` matching Screenshot 1 1-to-1.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.44s`).

- DESIGN & RENDERS NIGHT MODE ATMOSPHERE ENHANCEMENT: Warm Ambient Lighting & Golden Slat Lines (COMPLETE & VERIFIED - 19 August 2026 3:56:00 PM IST)
  - Fixed pitch-dark Night Mode rendering issue in `GardenRoomDesignView.jsx`.
  - Added warm illuminated night gradients (`from-[#2D3A29] via-[#3D4E39] to-[#1E2B1D]`) and warm ambient spotlight radial glows (`radial-gradient(ellipse at 50% 40%, rgba(255, 220, 160, 0.4) 0%, rgba(0,0,0,0) 70%)`).
  - Adapted vertical wood plank slat lines to crisp golden-white lines (`rgba(255, 230, 190, 0.4)`) in Night Mode for beautiful visibility across main viewport & thumbnails.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.64s`).

- DESIGN & RENDERS UNIVERSAL RENDERING: Render Viewer Active by Default (COMPLETE & VERIFIED - 19 August 2026 3:58:00 PM IST)
  - Updated `src/pages/customer/CustomerProject.jsx` so that the **Design & Renders** tab (`/customer/project?tab=design`) renders `<GardenRoomDesignView />` by default.
  - Ensured interactive 3D render viewer, day/night mode switcher, 4 angle thumbnails, material details grid, layout diagram scale bar, and design versions history card display consistently for all customer project views.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.56s`).

- OUTDOOR KITCHEN DESIGN & OPTIONS SCREEN 3 IMPLEMENTATION: 1-to-1 Outdoor Kitchen View (COMPLETE & VERIFIED - 19 August 2026 4:01:30 PM IST)
  - Created `src/components/customer/OutdoorKitchenDesignView.jsx`: 1-to-1 implementation of Client Mockup PDF Screen 3 (`Customer-Portal-Brief-Outdoor-Kitchens-EN_2.pdf`).
  - Top Header Tag Bar (`Custom Outdoor Kitchen — project 2026-014`, `Updates 3`, `WhatsApp us`).
  - Render Card: Full-bleed timber render image with vertical wood slat lines (`repeating-linear-gradient`) & `RENDER · YOUR DESIGN` badge.
  - Layout Diagram Scale Bar (0 to 240cm): 2 Drawer Cabinets + 1 Dark Forest Green Big Green Egg Cutout + 1 Open Compartment Cabinet.
  - 2×2 Specs Grid (`Dimensions` 240×80cm, `Timber Type` Thermo Fraké, `Cutout` Big Green Egg Large, `Delivery Time` 3 to 5 weeks).
  - About Thermo Fraké timber info card.
  - Your Selections List (Worktop, Layout & Storage, Water & Cooling, Finishing & Delivery).
  - **Working Drawing Card** (`Werktekening`): Drawing preview box with `DRAWING · VERSION 2` badge, `• New` pill, `View drawing` & `Download` buttons, question link.
  - Rendered in `CustomerProject.jsx` on `/customer/project?tab=design` for Outdoor Kitchen projects.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 7.06s`).

- TESTING DESIGN VIEW SWITCHER BAR IMPLEMENTATION: 1-Click Toggle for Design & Renders (COMPLETE & VERIFIED - 19 August 2026 4:07:30 PM IST)
  - Added **Testing Design View Switcher** bar to top of Design & Renders page (`src/pages/customer/CustomerProject.jsx`).
  - Allows 1-click toggle between `[ Outdoor Kitchen (Design & Options) ]` and `[ Garden Room / Poolhouse (Design & Renders) ]`.
  - Persists active project type state dynamically across all views.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.76s`).

- TESTING DESIGN VIEW SWITCHER CLICKABILITY FIX: Moved Switcher Logic Above Early Returns (COMPLETE & VERIFIED - 19 August 2026 4:09:30 PM IST)
  - Fixed clickability issue of top **Testing Design View Switcher** bar in `src/pages/customer/CustomerProject.jsx`.
  - Moved `handleSwitchTypeDirectly` definition above early return statements so button clicks immediately update `activeProject` state and persist to `localStorage`.
  - Clicking `[ Outdoor Kitchen (Design & Options) ]` instantly switches to Outdoor Kitchen 1-to-1 design view.
  - Clicking `[ Garden Room / Poolhouse (Design & Renders) ]` instantly switches to Garden Room 1-to-1 design view.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 7.00s`).

- OUTDOOR KITCHEN DESIGN & OPTIONS 1-TO-1 VISUAL PARITY: Backgrounds, Specs Colors & Dotted Line (COMPLETE & VERIFIED - 19 August 2026 4:12:30 PM IST)
  - Refined `src/components/customer/OutdoorKitchenDesignView.jsx` to match Client Mockup Screenshot 1 1-to-1.
  - Card Backgrounds: Changed from stark white to soft warm off-white/cream (`bg-[#FAF8F5] border border-[#D8D2C5]`).
  - 2x2 Specs Grid Cards: Alternating soft greige (`bg-[#EDE9E3]`) and pale sage green (`bg-[#E3E8DF]`) backgrounds matching mockup.
  - Dotted Dimension Line: Added clean dotted scale line (`0 cm` .......... `240 cm`).
  - Render Viewport: Set height to ~240px (`h-52 sm:h-60`) with crisp vertical timber slat plank lines.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 7.05s`).

- SPECS CARDS FONT SIZE SCALING: Increased Text Sizes & Readability (COMPLETE & VERIFIED - 19 August 2026 4:14:30 PM IST)
  - Enlarged font sizes across 2×2 specs cards grid & info card in `OutdoorKitchenDesignView.jsx` & `GardenRoomDesignView.jsx`.
  - Top mono labels (`DIMENSIONS`, `TIMBER TYPE`, `CUTOUT`, `DELIVERY TIME`, `ABOUT THERMO FRAKÉ`): Increased from tiny `9px` to crisp `text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-accent`.
  - Main values (`240 × 80`, `Thermo Fraké`, `Big Green Egg`, `3 to 5 weeks`): Increased to `text-base sm:text-lg font-bold text-primary font-heading`.
  - Sub-labels (`centimeter`, `lifespan 20 to 25 yrs`, `Large, right of center`, `after your approval`): Increased to `text-xs font-medium text-dark/70`.
  - Body text in About Thermo Fraké card: Increased to `text-xs sm:text-[13px] text-dark/80 font-medium`.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.67s`).

- FULL RESPONSIVE MOBILE, TABLET & DESKTOP OPTIMIZATION: Fluid Grids & Scaling (COMPLETE & VERIFIED - 19 August 2026 4:15:30 PM IST)
  - Enhanced mobile, tablet & desktop responsiveness across `OutdoorKitchenDesignView.jsx` and `GardenRoomDesignView.jsx`.
  - Layout Diagram Modules Bar: Configured `grid grid-cols-2 sm:grid-cols-4 gap-2.5` so on mobile devices (<640px) modules form a clean 2x2 grid without overflowing.
  - 2×2 Specs Cards Grid: Configured `grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3.5` with fluid padding (`p-3.5 sm:p-4`) so text never clips on small mobile screens.
  - Action Buttons & Cards: Fluid padding `p-4 sm:p-5 rounded-2xl` for seamless responsive presentation across all device viewports.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 7.54s`).

- TIMBER INFO CARD PADDING & TYPOGRAPHY FIX: Breathable Padding & Sizing (COMPLETE & VERIFIED - 19 August 2026 4:17:00 PM IST)
  - Fixed top text overlap and cramped padding in About Thermo Fraké and About Douglas Timber cards (`OutdoorKitchenDesignView.jsx` & `GardenRoomDesignView.jsx`).
  - Added clean container padding `p-5 sm:p-5 rounded-2xl` and top text padding `pt-0.5`.
  - Adjusted body text to optimal font size `text-xs text-dark/70 font-medium leading-relaxed`.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 7.07s`).

- GARDEN ROOM PLANNING & BUILD PAGE 9 IMPLEMENTATION: 1-to-1 Site Survey & Timeline (COMPLETE & VERIFIED - 19 August 2026 4:24:30 PM IST)
  - Created `src/components/customer/GardenRoomPlanningView.jsx`: 1-to-1 implementation of Client Mockup PDF Page 9 (`Customer-Portal-Brief-Garden-Rooms-EN.pdf`).
  - Top Header Tag Bar (`Custom Garden Room — project 2026-021`, `Updates 3`, `WhatsApp us`).
  - Card 1: Build Timeline Header Box (`DE BOUW VAN JOUW BUITENVERBLIJF`, `Week 41 & 42 · 5 to 16 October 2026`, `Tentative` badge).
  - Card 2: Site Survey Proposal Card (`Ons voorstel voor de schouw`, `Thursday 27 August 2026`, `Approve` action button, custom date input field, `Request another day` button).
  - Week-by-Week Timeline (6 stages: 33-34 Ontwerp Completed, 35 Schouw Proposal Awaiting, 39 Preparation, 40 Materials, 41-42 Build, +3mnd Checkup).
  - Right Column Cards: Interactive Prep Checklist (5 checkboxes), Courtesy for Neighbours (`Burenbrief` PDF download button), and How the Build Works (4 ground rules).
  - Rendered under `/customer/project?tab=planning` with Testing View Switcher bar.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 7.93s`).

- OUTDOOR KITCHEN PLANNING & DELIVERY SCREEN 4 IMPLEMENTATION: 1-to-1 Delivery Schedule & Timeline (COMPLETE & VERIFIED - 19 August 2026 4:27:30 PM IST)
  - Created `src/components/customer/OutdoorKitchenPlanningView.jsx`: 1-to-1 implementation of Client Mockup PDF Screen 4 (`Customer-Portal-Brief-Outdoor-Kitchens-EN_2.pdf`).
  - Top Header Tag Bar (`Custom Outdoor Kitchen — project 2026-014`, `Updates 3`, `WhatsApp us`).
  - Card 1: Expected Delivery Header Box (`VERWACHTE LEVERING`, `Week 38 · 14 to 18 September 2026`, `✓ On schedule` green badge).
  - Card 2: Delivery Proposal Card (`Ons voorstel voor de levering`, `Tuesday 15 September 2026`, `Approve` button, custom date input field, `Request another day` button).
  - Detailed Project Timeline (10 steps: Inquiry, Price indication, Quote sent, Approval, Working drawing, Materials, **Active Workshop expanded detail box "In de werkplaats"**, Quality inspection, Delivery, Aftercare).
  - Right Column Cards: How Delivery Works (4 delivery steps) and How You Can Help Us (4 interactive delivery prep checkboxes).
  - Rendered under `/customer/project?tab=planning` with Testing Planning View Switcher bar.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.61s`).

- PLANNING & DELIVERY 1-TO-1 VISUAL ALIGNMENT FIX: Matching Client Mockup Colors & Fonts (COMPLETE & VERIFIED - 19 August 2026 4:34:30 PM IST)
  - Compared Screenshot 1 (Client Mockup) vs Screenshot 2 (Implementation) and resolved all visual mismatches.
  - Refined Date Highlight Box background to soft sage green (`bg-[#EAF0E8] border border-[#BACBB7]`).
  - Refined Approve Action Button to rich warm gold/brown (`bg-[#9B7A38] text-white hover:bg-[#8A6B2F]`).
  - Refined Expected Delivery badge to soft muted green (`bg-[#E5F0E3] text-[#2D5A27]`).
  - Refined Proposal Status badge to warm amber (`bg-[#FDF8EE] text-[#9E7B3B] border-[#E8D4B0]`).
  - Increased typography size across headings, subheadings, and timeline items (`text-sm sm:text-base` & `text-xs sm:text-[13px] font-medium`).
  - Applied changes to both `OutdoorKitchenPlanningView.jsx` and `GardenRoomPlanningView.jsx`.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.77s`).

- GLOBAL WARM CREAM PAGE BACKGROUND FIX: 1-to-1 Color Match with Client Mockup (COMPLETE & VERIFIED - 19 August 2026 4:38:30 PM IST)
  - Fixed dark greyish-green background issue (`#D6CFC2`) across the portal.
  - Updated global `--background-color` variable in `src/index.css` to warm light cream (`#FAF7F2`), matching Client Screenshot 1 1-to-1.
  - Updated `TopNav.jsx` header background to warm light cream `bg-[#FAF7F2] border-b border-[#E6E0D4]`.
  - Updated `CustomerProject.jsx` Testing Switcher bars to warm cream `bg-[#FAF7F2] border border-[#E4DED4]`.
  - Result: All cards (`#FAF8F5` / `bg-white`) now pop cleanly against the warm cream page background (`#FAF7F2`) exactly like the client's mockup.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 7.23s`).

- PHOTOS & UPDATES / WORKSHOP GALLERY 1-TO-1 IMPLEMENTATION: Garden Rooms Page 10 & Outdoor Kitchen Screen 5 (COMPLETE & VERIFIED - 19 August 2026 4:46:00 PM IST)
  - Created `src/components/customer/GardenRoomPhotosView.jsx`: 1-to-1 implementation of Client Mockup PDF Page 10 (`Customer-Portal-Brief-Garden-Rooms-EN.pdf` & Screenshot 1).
    - Top Header Tag Bar (`Custom Garden Room — project 2026-021`, `Updates 3`, `WhatsApp us`).
    - Section 1: `WEEK 34 · DESIGN` (Message box from Tim & Bram with `• New` soft blue pill + Render Version 2 preview card).
    - Section 2: `UPCOMING MILESTONES` (3 grey thumbnail cards: Week 39 Preparation, Week 41 Structure, Week 42 Handover).
    - Section 3: Instagram Consent Banner (`May we share your garden room on our Instagram?` with interactive action buttons).
  - Created `src/components/customer/OutdoorKitchenPhotosView.jsx`: 1-to-1 implementation of Client Mockup PDF Screen 5 (`Customer-Portal-Brief-Outdoor-Kitchens-EN_2.pdf` & Screenshot 2).
    - Top Header Tag Bar (`Custom Outdoor Kitchen — project 2026-014`, `Updates 3`, `WhatsApp us`).
    - Section 1: `IN THE WORKSHOP · AUGUST 2026` (3 photo cards with timber slat renders, date badges `17 AUGUST`, `15 AUGUST`, `14 AUGUST`, titles & descriptions).
    - Section 2: `UPCOMING MILESTONES` (3 grey thumbnail cards: Early Sept Worktop, 10 Sept Oiling, Week 38 Garden).
    - Section 3: Instagram Consent Banner (`May we share your kitchen on our Instagram?` with interactive action buttons).
  - Updated `src/pages/customer/CustomerPhotos.jsx` with Testing View Switcher bar (`[ Outdoor Kitchen (Photos from Workshop) ]` & `[ Garden Room / Poolhouse (Photos & Updates) ]`).
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.43s`).

- PHOTOS SWITCHER BUTTON CLICKABILITY & TOGGLE FIX (COMPLETE & VERIFIED - 19 August 2026 4:47:30 PM IST)
  - Refined state management in `src/pages/customer/CustomerPhotos.jsx`.
  - Directly binds `activeType` state to switcher button selection and syncs with `localStorage`.
  - Evaluates `isGardenRoom` directly against `activeType === 'garden_room'`, ensuring instant, smooth 1-click toggling between `OutdoorKitchenPhotosView` and `GardenRoomPhotosView`.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.29s`).

- DOCUMENTS 1-TO-1 IMPLEMENTATION: Garden Rooms Screen 6 & Outdoor Kitchen Screen 6 (COMPLETE & VERIFIED - 19 August 2026 4:53:30 PM IST)
  - Created `src/components/customer/GardenRoomDocumentsView.jsx`: 1-to-1 implementation of Client Mockup PDF Screen 6 (`Customer-Portal-Brief-Garden-Rooms-EN.pdf` & Screenshot 1).
    - Top Header Tag Bar (`Custom Garden Room — project 2026-021`, `Updates 3`, `WhatsApp us`).
    - 11 Document Items (Offerte OF-2026418, Opdrachtbevestiging, Vergunningscheck, Werktekening v2 [`• New`], Renderpakket v2, Factuur 1e termijn 40%, Voorbereidingsgids, Algemene voorwaarden, Factuur 2e termijn 40% [`Not yet available`], Garantiebewijs [`Not yet available`], Onderhoudsgids Douglas & EPDM [`Not yet available`]).
    - Interactive View PDF preview modal & direct download button.
  - Created `src/components/customer/OutdoorKitchenDocumentsView.jsx`: 1-to-1 implementation of Client Mockup PDF Screen 6 (`Customer-Portal-Brief-Outdoor-Kitchens-EN_2.pdf` & Screenshot 2).
    - Top Header Tag Bar (`Custom Outdoor Kitchen — project 2026-014`, `Updates 3`, `WhatsApp us`).
    - 9 Document Items (Offerte OF-2026325, Opdrachtbevestiging, Werktekening v2, Factuur 1e termijn 50% [`• New`], Algemene voorwaarden, Onderhoudsgids hout & bovenblad, Factuur 2e termijn 50% [`Not yet available`], Garantiebewijs [`Not yet available`], Opleverbevestiging [`Not yet available`]).
    - Interactive View PDF preview modal & direct download button.
  - Updated `src/pages/customer/CustomerDocuments.jsx` with Testing View Switcher bar (`[ Outdoor Kitchen (Documents) ]` & `[ Garden Room / Poolhouse (Documents) ]`).
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.32s`).

- PAYMENTS (BETALINGEN) 1-TO-1 IMPLEMENTATION: Outdoor Kitchen Screen 7 & Garden Rooms Page 12 (COMPLETE & VERIFIED - 19 August 2026 4:57:30 PM IST)
  - Created `src/components/customer/OutdoorKitchenPaymentsView.jsx`: 1-to-1 implementation of Client Mockup PDF Screen 7 (`Customer-Portal-Brief-Outdoor-Kitchens-EN_2.pdf` & Screenshot 1).
    - Top Header Tag Bar (`Custom Outdoor Kitchen — project 2026-014`, `Updates 3`, `WhatsApp us`).
    - Payment Summary Card (TOTAL € 3,920.00, PAID € 1,960.00, REMAINING € 1,960.00, 50% green progress bar).
    - 2 Instalment Cards Grid: 1st term 50% upon agreement [`✓ Paid` soft green pill], 2nd term 50% upon delivery [`Upcoming upon delivery` soft grey pill].
    - Bottom Row Cards: Bank Transfer Details (IBAN box `NL27 ABNA 0132 2698 56 t.n.v. Vanuit Ambacht · Vleuten`) & Invoice Question Contact.
  - Created `src/components/customer/GardenRoomPaymentsView.jsx`: 1-to-1 implementation of Client Mockup PDF Page 12 (`Customer-Portal-Brief-Garden-Rooms-EN.pdf` & Screenshot 2).
    - Top Header Tag Bar (`Custom Garden Room — project 2026-021`, `Updates 3`, `WhatsApp us`).
    - Payment Summary Card (TOTAL € 37,950.00, PAID € 15,180.00, REMAINING € 22,770.00, 40% green progress bar).
    - 3 Instalment Cards Grid: 1st term 40% upon agreement [`✓ Paid`], 2nd term 40% at start of build [`At start of build`], 3rd term 20% upon delivery [`Upon delivery`].
    - Bottom Row Cards: Bank Transfer Details (IBAN box) & Invoice/Term Question Contact.
  - Updated `src/pages/customer/CustomerProject.jsx` (Payments tab) with Testing View Switcher bar (`[ Outdoor Kitchen (Payments) ]` & `[ Garden Room / Poolhouse (Payments) ]`).
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 7.78s`).

- PAYMENTS CARDS COMPACT PROPORTIONS & PADDING OPTIMIZATION (COMPLETE & VERIFIED - 19 August 2026 5:02:30 PM IST)
  - Reduced oversized box heights and padding across `OutdoorKitchenPaymentsView.jsx` and `GardenRoomPaymentsView.jsx`.
  - Updated card container padding to compact `p-4 sm:p-4.5 rounded-2xl`.
  - Adjusted payment summary numbers to refined font size `text-lg sm:text-xl font-heading font-bold`.
  - Reduced IBAN bank transfer box padding to `p-3 rounded-xl`.
  - Overall vertical layout gap optimized to fluid `space-y-4 font-body`.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.05s`).

- CARDS & BUTTONS WIDTH COMPACT OPTIMIZATION (COMPLETE & VERIFIED - 19 August 2026 5:05:30 PM IST)
  - Reduced oversized box widths by switching main customer container wrappers to compact `max-w-4xl w-full mx-auto` (~896px).
  - Updated action buttons (`Factuur bekijken` / `View invoice`, `WhatsApp us`, `Pay now`) inside instalment and contact cards to compact auto-width `px-4 py-1.5 rounded-xl inline-block`, matching Client Mockup Screenshot 1 1-to-1.
  - Reduced IBAN bank transfer box width to `max-w-md`.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 5.95s`).

- MESSAGES & CONTACT (BERICHTEN & CONTACT) 1-TO-1 IMPLEMENTATION: Screen 8 (COMPLETE & VERIFIED - 19 August 2026 5:14:30 PM IST)
  - Created `src/components/customer/OutdoorKitchenContactView.jsx`: 1-to-1 implementation of Client Mockup PDF Screen 8 (`Customer-Portal-Brief-Outdoor-Kitchens-EN_2.pdf` & Screenshots 1 & 2).
    - Top Header Tag Bar (`Custom Outdoor Kitchen — project 2026-014`, `Updates 3`, `WhatsApp us`).
    - Two-Column Layout: Left Chat Message Thread with Tim & Bram (`T&B`) and Customer Sander (`SV`), `✓ Alles gelezen` badge, input field + `📎 Foto` attachment + `Versturen` send button.
    - Right Sidebar Cards: 1. `DIRECT CONTACT` (Tim & Bram, WhatsApp, Phone, Email buttons), 2. `WIJ WERKEN ZONDER SHOWROOM` (`Stuur mij houtstalen` warm gold button), 3. `WIE BOUWT JOUW KEUKEN` (`VS` craftsman badge).
    - FAQ Accordion Section (`Veelgestelde vragen` with 5 expandable items).
  - Created `src/components/customer/GardenRoomContactView.jsx`: 1-to-1 implementation for Garden Rooms Screen 8 (`Customer-Portal-Brief-Garden-Rooms-EN.pdf`).
    - Adapted for Garden Rooms (`Custom Garden Room — project 2026-021`, timber/EPDM samples, vergunningsvrij check FAQ).
  - Updated `src/pages/customer/CustomerContact.jsx` with Testing View Switcher bar (`[ Outdoor Kitchen (Messages & Contact) ]` & `[ Garden Room / Poolhouse (Messages & Contact) ]`).
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 8.68s`).

- ENGLISH TRANSLATION & BALANCED LEFT MARGIN ALIGNMENT (COMPLETE & VERIFIED - 19 August 2026 5:18:30 PM IST)
  - Translated all Dutch text across `OutdoorKitchenContactView.jsx` and `GardenRoomContactView.jsx` to clean, natural English (Chat titles, message bubbles, `All read` badges, input placeholders, send buttons, sidebar card titles, descriptions, action buttons, and FAQ questions/answers).
  - Fixed large left empty space issue by removing forced container centering (`mx-auto`) across `CustomerContact.jsx`, `CustomerDocuments.jsx`, `CustomerPhotos.jsx`, and `CustomerProject.jsx`, setting container width to `max-w-5xl w-full` for balanced left-aligned layout next to the sidebar.
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.62s`).

- GARDEN ROOMS MESSAGES & CONTACT 1-TO-1 IMPLEMENTATION: Page 13 (COMPLETE & VERIFIED - 19 August 2026 5:27:30 PM IST)
  - Updated `src/components/customer/GardenRoomContactView.jsx`: 1-to-1 implementation of Client Mockup PDF Page 13 (`Customer-Portal-Brief-Garden-Rooms-EN.pdf` & Screenshots 1 & 2).
    - Top Header Tag Bar (`Custom Garden Room — project 2026-021`, `Updates 3`, `WhatsApp us`).
    - Two-Column Layout: Left Chat Message Thread with Bram (`T&B`) and Customer Sander (`SV`) matching Page 13 messages 1-to-1 in English (render v2, poolhouse floor tiles, site survey confirmation).
    - Right Sidebar Cards: 1. `DIRECT CONTACT` (Tim & Bram, WhatsApp, Phone, Email buttons), 2. `WIJ WERKEN ZONDER SHOWROOM` (`Stuur mij houtstalen` warm gold button for Douglas samples), 3. `WIE BOUWT JOUW BUITENVERBLIJF` (`VS` craftsman badge).
    - FAQ Accordion Section (`Frequently Asked Questions` with 5 expandable items specific to Garden Rooms: permit check, 5-10 days build duration, staying home, Douglas maintenance, changes before pre-fab).
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 6.34s`).

- HANDOVER & AFTERCARE (OPLEVERING & NAZORG) 1-TO-1 IMPLEMENTATION: Screen 9 (COMPLETE & VERIFIED - 19 August 2026 5:33:30 PM IST)
  - Created `src/components/customer/GardenRoomHandoverView.jsx`: 1-to-1 implementation of Client Mockup PDF Page 14 (`Customer-Portal-Brief-Garden-Rooms-EN.pdf` & Screenshots 1 & 2) in English.
    - Top Header Tag Bar (`Custom Garden Room — project 2026-021`, `Updates 3`, `WhatsApp us`).
    - Handover Photo Banner Card (`YOUR GARDEN ROOM · 16 OCTOBER 2026`).
    - Section 1: Handover Approval Card (`Is everything correct?`, 4 interactive checkboxes: drawing & render, roof & drainage, sliding doors & electrics, garden clean, `Everything correct — confirm` dark green button) + Warranty & Aftercare Card (`GARANTIE & NAZORG`, `Download warranty certificate`, `Request aftercare`).
    - Section 2: Seasonal Maintenance Calendar (`Onderhoudskalender`, 4 seasonal cards: Spring treat timber, Summer enjoy, Autumn roof & drain clear, Winter nothing needed + seasonal reminder checkbox).
    - Section 3: Bottom 3 Cards Grid (`The 3-month check` scheduled for Jan 2027, `Would you like to help us?` Google review & Instagram buttons, `Complete your outdoor living?` outdoor kitchen cross-sell price request).
  - Created `src/components/customer/OutdoorKitchenHandoverView.jsx`: Tailored 1-to-1 implementation for Outdoor Kitchens Screen 9 in English (`YOUR OUTDOOR KITCHEN · 18 SEPTEMBER 2026`, granite/beton cire & Kamado maintenance).
  - Updated `src/pages/customer/CustomerProject.jsx` under `activeTab === 'handover'` with Testing View Switcher bar (`[ Outdoor Kitchen (Handover & Aftercare) ]` & `[ Garden Room / Poolhouse (Handover & Aftercare) ]`).
  - Verified production build (`npm run build`) completed with 0 errors (`✓ built in 8.13s`).

---

Updated: 19 August 2026 (5:33:30 PM IST)
Handover & Aftercare 1-to-1 Implementation Completed & Verified.











































