# CLIENT REQUIREMENTS – Vanuit Ambacht Platform (Master Specification)

> **Official Client Specification & Feature Requirement Document**
>
> Version: 2.0 (Updated 3 August 2026)
> Scope: **Vanuit Ambacht All-In-One Operations Dashboard & Quotation Engine**

---

## 1. Executive Summary & Core Platform Vision

Vanuit Ambacht (Tim & Bram) is a premier Dutch craftsman company specializing in luxury outdoor kitchens (*Buitenkeukens*), outdoor living structures (*Buitenverblijven*), and custom woodwork.

The platform serves as their complete operating system for:
1. **Lead Capture & Marketing Sync** (Meta Facebook/Instagram Ads & Website form auto-import).
2. **Simplified 7-Step Partner Price Request Wizard** (Without premature inquiry planning/deadlines).
3. **Dynamic Pixel-Perfect 6-Page Dutch Quotation (Offerte) Module** (With online digital approval link `.../offerte/{token}`).
4. **Plaud AI Voice Recorder & Task Management** (Auto-extracting tasks from meeting audio).
5. **Bank Statement Import** (PDF, Excel TXT, Excel XLS statement imports).

---

## 2. Brand Style & UI Guidelines

### Color Palette
- **Primary Olive Green**: `#3e4e36` (Buttons, headers, active navigation)
- **Soft Green**: `#49593f` (Secondary badges, subtler cards)
- **Deep Green**: `#33412c` (Dark contrast elements)
- **Sand / Warm Beige**: `#d6cfc2` (Backgrounds, cards)
- **Sand Light**: `#eae5dc` (Light card backgrounds)
- **Paper**: `#f7f4ee` (Base paper background)
- **Charcoal / Ink**: `#2e2e29` (Primary typography)

### Typography
- **Display Headings**: `Playfair Display` (Serif display heading style)
- **Body & UI Text**: `Montserrat` (Clean sans-serif text)

---

## 3. Detailed Module Specifications

---

### MODULE 1: DASHBOARD HERO BANNER & ANALYTICS (`/admin/dashboard`)

#### 1.1 Hero Banner Styling
- **Background Image**: Luxury outdoor kitchen brand photo (`dasbordes images.png`).
- **Container Dimensions**: `w-full h-56 sm:h-64 md:h-72 lg:h-[300px]` (300px height).
- **Image Framing**: `object-cover object-[center_35%]` (Full umbrella, Kamado grill, wooden counter, wine fridge, coffee poster, and patio floor visible).
- **Action Buttons Position**: Placed in **Top-Right Corner** (`top-5 right-6`) with compact styling (`text-[11px] py-1 px-2.5 rounded-md`).
  - Button 1: `+ Nieuwe lead` (Cream background)
  - Button 2: `+ Offerte Maken` (Glassmorphism blur background)

#### 1.2 Analytics & KPI Filter Options
- **Date Range Selector**:
  - Last 7 days
  - Last 30 days
  - Current month
  - Last 3 months
  - Last 6 months
  - Last 12 months
  - Custom date range
- **KPI Metrics Cards**:
  1. *Total number of leads*
  2. *Cost per lead* (€14,60 average)
  3. *Number of quotations sent*
  4. *Percentage of leads that received a quotation* (%)
  5. *Confirmed orders (Won)*
  6. *Conversion rate %* (Lead to order)
  7. *Active Meta Ads Status Indicator*

---

### MODULE 2: LEADS MANAGEMENT & 7-STEP WIZARD (`/admin/leads`)

#### 2.1 Lead List & Table Features
- **Auto-Tagging Lead Source**: Meta Ads (Facebook/Instagram) vs Website Form Import.
- **Product Category Tags**: `Buitenkeuken`, `Overkapping`, `Kliko-ombouw`, `Snijplanken`.
- **Inline 1-Click Status Dropdown**: Direct table status update without opening edit modal:
  - `Nieuw` (New)
  - `Bericht verstuurd` (Message sent)
  - `In gesprek` (In conversation)
  - `Offerte verstuurd` (Quotation sent)
  - `Gewonnen` (Won)
  - `Verloren` (Lost)
- **3-Day Red Warning Alert**:
  - Shows Red Warning Badge ("3 days ago") on leads with no follow-up for 3 days.
  - 1-click on badge opens ready-made 1st follow-up message.
- **Auto Team Lead Assignee**: Automatically assign lead to **Tim** or **Bram**.
- **Quick Action Choice (2 Paths)**:
  - **Option A**: `Prijsaanvraag partner` (Opens 7-Step Wizard for partner price request)
  - **Option B**: `Offerte maken` (Opens 6-Page Dynamic PDF Quote Generator)

#### 2.2 Simplified 7-Step Project Wizard (`Prijsaanvraag partner`)
*(Note: Planning, start date, deadlines, and duration REMOVED from inquiry stage).*
1. **Stap 1: Projecttype** (Select category: Buitenkeuken, Overkapping, etc.)
2. **Stap 2: Basisgegevens** (Customer name, email, phone, installation address)
3. **Stap 3: Ontwerp en maten** (Dimensions: e.g. 240×80 cm)
4. **Stap 4: Uitvoering en materialen** (Thermo Fraké wood, Big Green Egg Large cutout)
5. **Stap 5: Locatie** (Site access & installation location details)
6. **Stap 6: Foto’s huidige situatie en render** (2 attachments only: Existing garden photo + 3D Render design)
7. **Stap 7: Controleren en versturen** (Review & send price request to partner)

#### 2.3 Auto-Message Templates & WhatsApp
- **Reposition Action Buttons**: Move `WhatsApp`, `Bellen`, and `E-mail` buttons from top header to **below the workflow process step section**.
- **3 Auto-Loaded Dutch Message Templates**:
  - *Template 1*: Initial Inquiry Response
  - *Template 2*: 1st Follow-up Message
  - *Template 3*: 2nd Follow-up Message
- **WhatsApp Direct Photos Attachment**: Option to attach project photos inside WhatsApp sender.
- **Template Manager**: Edit/manage message template texts in **Settings (`/admin/settings`)**.

---

### MODULE 3: DYNAMIC 6-PAGE QUOTATION (OFFERTE) MODULE (`/admin/quotes`)

#### 3.1 Pixel-Perfect 6-Page A4 Dutch PDF Layout
- **Page 1 (Cover Page)**:
  - Dark Green theme (`#3E4E36`), `OFFERTE` tag, Title *"Uw buitenkeuken, op maat gemaakt."*, Subtitle, 3 Horizontal photo strip at bottom.
  - Footer: Customer Name (`Bjorn Valk`), Quote Number (`OF-2026325`), Date (`21 juli 2026`), Valid Until (`19 augustus 2026`).
- **Page 2 (Personal Letter & USPs)**:
  - Intro Letter *"Beste Bjorn,"*, Founders Photo Card (`Tim & Bram`), 4 Cream USP Cards (*Vakmensen*, *Aanspreekpunt*, *Garantie*, *Eerlijke prijs*).
- **Page 3 (Uw Configuratie - Dynamic Page)**:
  - **4 Stat Tiles**: `AFMETING` (240×80 cm), `HOUTSOORT` (Thermo Fraké), `UITSPARING` (Big Green Egg Large), `LEVERTIJD` (3 tot 5 weken).
  - **Specifications List**: Repeater sections with checkmarks (Bovenblad, Indeling, Afwerking, Bezorging).
  - **Configuration Photo**: Center-cropped frame (62×42mm) with draggable focal point picker.
  - **2D Front View Diagram**: Visual 2D blocks (`Kastje` | `Kastje` | `Big Green Egg` | `Kastje`) with `240 cm` scale line.
  - **Material Infobox**: Dark green note box ("Over Thermo Fraké").
- **Page 4 (Investering - Pricing Page)**:
  - Line Items Table: `Aantal`, `Bedrag` (`€ 3.495,00`), and green **"Inbegrepen"** badge for 0-cost included items.
  - Left Box: *Inbegrepen bij jouw investering* checklist.
  - Right Box: Dark Green Totals Box (`Totaal excl. btw € 2.888,43`, `BTW 21% € 606,57`, `Totaal incl. btw € 3.495,00`).
  - Payment Terms: **50% Bij akkoord (€ 1.747,50)** & **50% Bij levering (€ 1.747,50)**.
- **Page 5 (Process Timeline & Guarantees)**:
  - 5 Process Steps Timeline (*Akkoord*, *Tekening*, *Productie 3-5 weken*, *Bezorging*, *Garantie*).
  - Founders Quote Box + 2 Policy Guarantee Cards (*Wijzigingen vóór productie*, *Meerwerk/minderwerk*).
- **Page 6 (Approval & Signatures)**:
  - Top Dark Green Box: *"Akkoord geven kan in één minuut"* with WhatsApp & Email CTA buttons.
  - 2 Physical Signature Cards (*Opdrachtgever* & *Vanuit Ambacht*).
  - Footer Company Details (KvK 93067429, BTW NL866264863B01, IBAN, Address).

#### 3.2 Digital Approval Token Link (`/offerte/{token}`)
- **Online Customer View**: Customer opens link on mobile/desktop without login.
- **Floating Approval Bar**: Total amount + **"Akkoord geven"** button.
- **Confirmation Modal**: Name + Checkbox *"Ik ga akkoord met deze offerte en de algemene voorwaarden"*.
- **Automated Approval Trigger**:
  1. Status auto-locks to **`Akkoord`**.
  2. Saves Name, Date/Time, IP Address, and Quote Version.
  3. Sends Confirmation PDF with "Digitaal akkoord gegeven" stamp to customer email.
  4. Triggers instant alert to `info@vanuitambacht.nl`.
- **Expired Link**: Replaces approval button with friendly contact options.

#### 3.3 Quotation Extras
- Duplicate quotation feature ("Create new quote based on previous").
- Auto quote counter: `OF-{year}{sequence}` (e.g. `OF-2026-001`).
- Pre-saved Product Library (fixed items for outdoor kitchens, fridges, taps).

---

### MODULE 4: AI TASK MANAGEMENT & PLAUD INTEGRATION (`/admin/tasks`)

#### 4.1 Plaud AI Integration & Voice Recordings
- Import/record Plaud meeting audio and transcripts.
- AI Meeting Analyzer: Extracts key decisions, client requirements, and action items.
- Auto-creates structured tasks in **Tasks Board** with assignee (**Tim** / **Bram**), due date, and priority.

---

### MODULE 5: ACCOUNTING BANK STATEMENT IMPORT (`/admin/accounting`)

#### 5.1 Import Bank Statements Button
- Add **"Import Bank Statements"** button under Bank tab.
- Dropdown File Format Selector (`Bestandsformaat`):
  1. **PDF**
  2. **Excel (TXT)**
  3. **Excel (XLS)**
- Automatically parses bank exports and logs transactions into accounting ledger.

---

## 4. Summary Matrix of All Modules

| Module | Location | Core Functionality | Status |
| :--- | :--- | :--- | :--- |
| **Hero Banner & Analytics** | `/admin/dashboard` | 300px height, Top-Right buttons, Date Range KPI Cards | Banner Updated ✅ / KPIs Ready for Dev |
| **Leads & 7-Step Wizard** | `/admin/leads` | Auto-tagging, 7-Step Wizard, 3-Day Alert, Repositioned WhatsApp Buttons, Message Templates | Ready for Dev |
| **Dynamic Quotation PDF** | `/admin/quotes` | 6-Page Pixel-Perfect Dutch PDF + Digital Approval Token Link (`/offerte/{token}`) | Ready for Dev |
| **Plaud AI Tasks** | `/admin/tasks` | Voice meeting recording import ➔ AI Task extraction | Ready for Dev |
| **Bank Import** | `/admin/accounting` | Bank Statement Import Dropdown (PDF, Excel TXT, Excel XLS) | Ready for Dev |
