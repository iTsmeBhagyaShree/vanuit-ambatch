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
- PR1: Admin photo upload in Project detail
- PR2: Partner photo upload in PartnerProjects
- PR3: Mock admin notification on partner photo upload
- PR4: CustomerPhotos receives photos from upload flow

### PHASE 10 — Language Consistency
- All newly added components must support both NL and EN

---

## IMPLEMENTATION RULES (Non-Negotiable)

1. NO backend, NO API, NO database
2. NO redesign of existing pages
3. NO change to existing colors, fonts, typography, spacing
4. NO removal of existing features
5. Use localStorage for state (already established pattern)
6. Use existing components: Card, Button, Badge, Table
7. Match existing design tokens exactly
8. All text must support NL and EN using: language === 'EN' ? 'English' : 'Dutch'
9. New modals follow AnimatePresence + motion.div pattern
10. New toasts: fixed top-20 right-4 z-[9999] with x:80 to x:0 animation

---

Updated: 08 August 2026
No code changes made in this document update — analysis only
