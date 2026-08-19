# EMBERA HOUSE — Fire. Flavour. Moments.

> **An ultra-premium, editorial, cinematic restaurant platform and management ecosystem.**  
> Crafted with Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma ORM, and modern transactional table booking architecture.

---

## 🏛️ Brand & Vision

**EMBERA HOUSE** is an ode to ancestral wood-fired craftsmanship and hyper-seasonal British terroir. Located at **44 St. James's Place, Mayfair, London**, the restaurant brings together sweet birch flame, biodynamic cellar selections, and unhurried hospitality.

---

## ✨ Features Overview

### 1. Public Culinary Experience
- **Cinematic Homepage**:
  - Full-screen ambient hero with live service status badge (*"Service Live Tonight"*) and Mayfair location marker.
  - Editorial Welcome Introduction with asymmetric overlapping layout.
  - 6 Signature Dishes showcase with dietary badges and Chef's Picks.
  - Interactive **Philosophy Section** with animated core pillars: `SEASON`, `FIRE`, `CRAFT`, `GARDEN`, `TABLE`.
  - Live **Interactive Menu Preview** with category tabs and dietary flags.
  - **Dining Experiences**: Detailed cards for *Main Dining Room*, *Garden Terrace*, *Chef's Hearth Counter*, and *Private Dining Salon*.
  - **Chef Story**: Feature narrative on Executive Chef Mateo Vane and culinary values.
  - **Seasonal Tasting Menu Highlight**: 7-course Autumn Solstice feature with direct booking CTA.
  - **Visual Gallery**: Masonry grid with accessible, keyboard-navigated fullscreen lightbox.
  - **Special Events**: Upcoming winemaker dinners and hearth masterclasses.
  - **Testimonials Carousel**: Curated editorial guest quotes.
  - **Table Reservation Banner**: High-conversion booking callout.
  - **Journal Dispatch**: Editorial essays on foraging, viticulture, and hearth chemistry.
  - **Newsletter**: Live database-persisted subscriber box with duplicate prevention.
  - **Editorial Footer**: Complete navigation, guest policies, dress code, accessibility, transit, dynamic year.

### 2. Table Reservation Engine (`/reserve`)
- **7-Step Interactive Booking Stepper**:
  1. **Party Size** (1 to 16 guests)
  2. **Date Selection** (with service day calendar checks)
  3. **Dynamic Time Slots** (Calculated based on room tables, cover limits, and existing bookings)
  4. **Guest Details** (Name, Email, Phone)
  5. **Dining Preferences** (Seating Area, Occasion, Dietary, Allergies, Accessibility, Special notes)
  6. **Review & Policy Acknowledgment** (6-hour cancellation window terms)
  7. **Confirmation & Token Generation** (Instant `EH-XXXXXX` code, Add to Calendar `.ics` file download, email dispatch simulation)
- **Concurrency & Capacity Engine**: Database transactions preventing race conditions and double-bookings.

### 3. Customer Portal & Authentication (`/account`, `/login`, `/register`)
- **Secure Password Hashing**: Utilizes bcrypt / Argon2 standard password hashing.
- **JWT Session Management**: HTTP-only secure session cookies.
- **Member Dashboard**:
  - Upcoming Reservations with live cancellation & modification within the 6-hour policy window.
  - Past Reservation History.
  - Saved Favourite Dishes with one-click toggling and direct menu links.
  - Saved dietary, allergen, and seating preferences.

### 4. Admin Management Console (`/admin`)
- **Role-Based Access Control**: `SUPER_ADMIN`, `MANAGER`, `STAFF`.
- **Live Metrics Dashboard**: Today's covers, active bookings, dish counts, unread inquiries, monthly overview.
- **Reservations Console** (`/admin/reservations`): Filter by status, search guest names/codes, live status switcher (`Confirmed`, `Seated`, `Completed`, `Cancelled`, `No-Show`).
- **Menu & Dish CMS** (`/admin/menu`): Add new dishes, edit pricing, ingredients, sommelier pairings, and toggle 86'd availability on the fly.
- **Table Floor Layout** (`/admin/tables`): Visual room capacity status across Main Dining, Garden Terrace, Chef's Table, and Private Salon.
- **Guest Inquiries & Dispatch** (`/admin/enquiries`): Review contact submissions and manage newsletter subscriber lists.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling & Design System** | Tailwind CSS, PostCSS, Cormorant Garamond & Plus Jakarta Sans |
| **Animation & Micro-interactions** | Framer Motion, CSS Keyframes |
| **Database & ORM** | Prisma ORM, SQLite (Default zero-config local) / PostgreSQL |
| **Authentication** | Bcryptjs password hashing, JSON Web Tokens (JWT), HTTP-Only Cookies |
| **Form Validation** | Zod schema validation |
| **Testing** | Vitest unit & integration test runner |
| **Icons** | Lucide React |
| **Containerization** | Docker, Docker Compose |

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js 18.x, 20.x, or 22.x+
- npm 9.x+

### 1. Clone & Install
```bash
git clone https://github.com/emberahouse/embera-house.git
cd embera-house
npm install
```

### 2. Environment Configuration
Create a `.env` file from the provided template:
```bash
cp .env.example .env
```
*(Default settings are pre-configured for zero-setup SQLite database `dev.db`)*

### 3. Initialize & Seed Database
```bash
npm run db:push
npm run db:seed
```
This populates the database with:
- 8 Menu Categories & 32 Artisan Culinary Dishes
- 8 Upcoming Dining Events & Masterclasses
- 20 High-Definition Gallery Assets
- 8 Editorial Journal Posts
- 15 Restaurant Tables across 4 Dining Rooms
- Opening Hours and Service Periods
- Pre-configured Admin & Customer Accounts

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Super Admin / Executive Chef** | `admin@emberahouse.com` | `EmberaAdmin2026!` | `/admin` |
| **Restaurant Manager** | `manager@emberahouse.com` | `EmberaAdmin2026!` | `/admin` |
| **Patron / Customer** | `julian@sterling.co.uk` | `Customer2026!` | `/account` |

---

## 🧪 Testing & Verification

Run the test suite (Utilities, Cryptography, Reservation Availability):
```bash
npm run test
```

Run TypeScript strict typecheck:
```bash
npm run typecheck
```

Build the production bundle:
```bash
npm run build
```

---

## 🐳 Docker Deployment

To launch the full production environment with PostgreSQL and Redis:
```bash
docker compose up -d --build
```
The application will be accessible at `http://localhost:3000`.

---

## 📡 API Endpoints Reference

All endpoints are versioned under `/api/v1/`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/search?q={query}` | Search dishes, events, and articles |
| `POST` | `/api/v1/auth/register` | Register new guest account |
| `POST` | `/api/v1/auth/login` | Sign in & receive session cookie |
| `POST` | `/api/v1/auth/logout` | Terminate session |
| `GET` | `/api/v1/auth/me` | Fetch active user session profile |
| `GET` | `/api/v1/reservations/availability` | Calculate real-time table capacity |
| `POST` | `/api/v1/reservations` | Transactional reservation creation |
| `GET` | `/api/v1/reservations/:id` | View reservation status & token |
| `PATCH` | `/api/v1/reservations/:id` | Modify or cancel reservation |
| `POST` | `/api/v1/contact` | Submit guest inquiry |
| `POST` | `/api/v1/newsletter` | Subscribe to dispatch |
| `POST` | `/api/v1/favourites` | Toggle user dish bookmark |
| `GET` | `/api/v1/admin/stats` | Admin operational metrics |
| `GET/POST` | `/api/v1/admin/menu` | Admin dish query & creation |
| `PATCH/DELETE`| `/api/v1/admin/menu/:id` | Admin dish update & deletion |

---

## 📜 License

EMBERA HOUSE LTD © 2026. All rights reserved.
