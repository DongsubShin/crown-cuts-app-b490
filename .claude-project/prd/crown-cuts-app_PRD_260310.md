# Crown Cuts — Product Requirements Document

**Version:** 1.0
**Date:** 2023-10-27
**Status:** Draft

---

## 0. Project Overview

### Product

**Name:** Crown Cuts App
**Type:** Web Application (Mobile-responsive PWA for Clients/Barbers + Desktop Admin Dashboard)
**Deadline:** March 1, 2024 (Target MVP Launch)
**Status:** Draft

### Description

Crown Cuts is a premium barbershop management platform designed specifically for the Atlanta-based Crown Cuts shop. Moving away from third-party platforms like Booksy, this custom solution provides a seamless bridge between scheduled appointments and a real-time walk-in queue. It empowers the shop's 5 barbers with individual commission tracking while providing the owner with deep CRM insights and automated SMS engagement to reduce no-shows.

### Goals

1. **Operational Efficiency:** Consolidate scheduled bookings and walk-in traffic into a single unified dashboard to eliminate double-bookings.
2. **Financial Transparency:** Automate commission calculations for all 5 barbers based on services rendered and products sold.
3. **Client Retention:** Build a proprietary CRM to track client preferences, visit history, and automate personalized SMS reminders.

### Target Audience

| Audience | Description |
|----------|-------------|
| **Primary** | **Clients:** Local residents in Atlanta seeking high-quality grooming services with easy booking. |
| **Secondary** | **Barbers:** The 5 professional staff members managing their daily schedules and earnings. |
| **Tertiary** | **Owner/Admin:** The business operator managing shop settings, payroll, and marketing. |

### User Types

| Type | DB Value | Description | Key Actions |
|------|----------|-------------|-------------|
| **Client** | `0` | Public customers | Book appointments, join walk-in queue, view history. |
| **Barber** | `1` | Shop staff members | Manage personal schedule, view commissions, check-in clients. |
| **Admin** | `99` | Shop Owner | Manage all barbers, set pricing, view financial reports, CRM access. |

### User Status

| Status | DB Value | Behavior |
|--------|----------|----------|
| **Active** | `0` | Full access to booking and profile features. |
| **Suspended** | `1` | Restricted from booking (used for repeat no-shows). |
| **Withdrawn** | `2` | Account deactivated; data anonymized after 30 days. |

### MVP Scope

**Included:**
- Real-time Appointment Booking Engine.
- Digital Walk-in Queue with SMS "Ready" notifications.
- Barber Commission Tracking (Service-based).
- Stripe Payment Integration (Deposits & Full Payments).
- Automated SMS Reminders (24h and 1h before).

**Excluded (deferred):**
- Inventory/Product Sales Management (Phase 2).
- Multi-location support (Phase 2).
- Native iOS/Android Apps (Phase 1 is PWA only).

---

## 1. Terminology

### Core Concepts

| Term | Definition |
|------|------------|
| **Crown Cuts App** | The unified platform for booking, queueing, and shop management. |
| **Walk-in Queue** | A virtual line for customers without appointments, managed via a QR code at the shop. |
| **Commission Tier** | A percentage-based calculation applied to a barber's gross service revenue. |
| **No-Show Protection** | A feature requiring a non-refundable deposit for specific high-value services. |

### User Roles

| Role | Description |
|------|-------------|
| **Guest** | Unauthenticated user who can view barber profiles and service menus. |
| **Client** | Authenticated user who can manage bookings and payment methods. |
| **Barber** | Staff user with access to their specific calendar and performance metrics. |
| **Admin** | Full system access including financial data and system configuration. |

### Status Values

| Enum | Values | Description |
|------|--------|-------------|
| **BookingStatus** | `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW` | The lifecycle of an appointment. |
| **QueueStatus** | `WAITING`, `NOTIFIED`, `IN_CHAIR`, `REMOVED` | The lifecycle of a walk-in client. |
| **PaymentStatus** | `UNPAID`, `DEPOSIT_PAID`, `PAID_IN_FULL`, `REFUNDED` | Financial state of a transaction. |

---

## 2. System Modules

### Module 1 — Unified Scheduling Engine

This module handles the complex logic of merging fixed appointments with dynamic walk-in availability.

#### Main Features

1. **Time-Slot Generator** — Calculates available gaps based on barber working hours and existing bookings.
2. **Buffer Management** — Automatically adds 5-10 minute cleaning buffers between services.
3. **Conflict Resolver** — Prevents a walk-in from being "seated" if a confirmed appointment is arriving within 15 minutes.

#### Technical Flow

##### Booking an Appointment

1. User selects a Service (e.g., "Executive Fade") and a Barber.
2. App queries the Backend for available slots for that specific Barber/Service duration.
3. Backend returns available `DateTime` objects.
4. User selects a slot and provides payment info.
5. On success:
   - Stripe processes the deposit.
   - Appointment record is created with `CONFIRMED` status.
   - SMS confirmation is sent via Twilio.
6. On failure:
   - Show "Slot no longer available" and refresh options.

---

### Module 2 — Walk-in Queue Management

Digitalizes the physical "waiting list" to allow customers to wait nearby (e.g., a coffee shop) rather than in the lobby.

#### Main Features

1. **QR Check-in** — Public-facing page for on-site registration.
2. **Wait-time Estimator** — Calculates wait time based on average service duration and queue length.
3. **Automated Paging** — SMS trigger when the barber is 5 minutes from being ready.

#### Technical Flow

1. Client scans QR code at shop entrance.
2. Client enters Name and Phone Number.
3. System checks for the next available barber or allows "First Available" selection.
4. On success: Client is added to `QueueTable` with status `WAITING`.
5. When Barber clicks "Next" in their dashboard:
   - Status updates to `NOTIFIED`.
   - SMS sent: "Crown Cuts is ready for you! Please head to the shop."

---

### Module 3 — Commission & Financials

Automates the end-of-week payroll process for the shop owner.

#### Main Features

1. **Commission Calculator** — Applies 60/40 or 70/30 splits (configurable per barber).
2. **Payout Reporting** — Weekly summary of gross vs. net earnings per staff member.
3. **Transaction Logging** — Immutable log of all Stripe payments and cash-entry overrides.

#### Technical Flow

1. Barber marks appointment as `COMPLETED`.
2. System triggers `calculateCommission(appointmentId)`.
3. Logic: `(ServicePrice * BarberRate) + Tips = BarberPayout`.
4. Record is saved to `EarningsTable` linked to the Barber's ID and the specific Work Week.

---

## 3. User Application

### 3.1 Page Architecture

**Stack:** React (Vite), React Router, Tailwind CSS, TanStack Query.

#### Route Groups

| Group | Access |
|-------|--------|
| Public | Anyone (Landing, Service Menu, Barber Profiles) |
| Auth | Unauthenticated (Login, Signup, Password Recovery) |
| Protected | Logged-in Clients (My Bookings, Profile) |
| Staff | Barbers & Admins (Schedule, Queue Management, Earnings) |

#### Page Map

**Public**
| Route | Page |
|-------|------|
| `/` | Home / Landing Page |
| `/services` | Service Menu & Pricing |
| `/barbers` | Barber Profiles & Portfolios |
| `/queue/join` | Walk-in Registration (QR Target) |

**Auth**
| Route | Page |
|-------|------|
| `/login` | Login |
| `/register` | Client Signup |

**Protected (Client)**
| Route | Page |
|-------|------|
| `/dashboard` | Upcoming Appointments & Quick Book |
| `/book` | Booking Flow (Step-by-step) |
| `/history` | Past Services & Receipts |
| `/settings` | Profile & SMS Preferences |

**Staff (Barber View)**
| Route | Page |
|-------|------|
| `/staff/schedule` | Daily/Weekly Calendar View |
| `/staff/queue` | Active Walk-in List |
| `/staff/earnings` | Personal Commission Dashboard |

---

### 3.2 Feature List by Page

#### `/` — Home
- Hero section with "Book Now" and "Join Queue" CTAs.
- Dynamic "Current Wait Time" display for walk-ins.
- Gallery of recent work (Instagram integration).

#### `/book` — Booking Flow
- **Step 1:** Service Selection (Category-based: Haircuts, Shaves, Bundles).
- **Step 2:** Barber Selection (Show availability badges).
- **Step 3:** Calendar Picker (Date/Time).
- **Step 4:** Payment/Confirmation (Stripe Elements).

#### `/staff/schedule` — Barber Dashboard
- Toggle between "List View" and "Calendar View".
- "Check-in" button for arriving clients.
- "No-show" button (triggers penalty/log).
- Manual "Add Walk-in" button for phone-in customers.

#### `/staff/queue` — Queue Management
- Drag-and-drop reordering (Admin only).
- "Notify Client" button (Manual SMS trigger).
- "Start Service" button (Moves client from Queue to In-Chair).

---

## 4. Admin Dashboard

### 4.1 Page Architecture

**Access:** Admin role only (Owner)

| Route | Page |
|-------|------|
| `/admin` | Shop Overview (Real-time Stats) |
| `/admin/barbers` | Staff Management & Commission Rates |
| `/admin/clients` | CRM / Client Database |
| `/admin/services` | Service & Pricing Management |
| `/admin/reports` | Financial & Payout Reports |
| `/admin/settings` | Shop Hours & SMS Templates |

---

### 4.2 Feature List by Page

#### `/admin` — Shop Overview
- Today's Revenue (Cash vs. Card).
- Barber Utilization Rates (Percentage of day spent in-chair).
- Active Walk-in vs. Appointment count.

#### `/admin/barbers` — Staff Management
- CRUD for Barber profiles.
- Set individual commission percentages (e.g., Senior Barber at 70%, Junior at 60%).
- Manage individual working hours/days off.

#### `/admin/clients` — CRM
- Searchable database by Name/Phone.
- View "Lifetime Value" (LTV) per client.
- Notes field (e.g., "Prefers #2 guard on sides").
- Flag "Problem Clients" (No-show history).

#### `/admin/reports` — Financials
- Exportable CSV for weekly payroll.
- Revenue breakdown by service category.
- Tax reporting summary (Stripe fees vs. Gross).

---

## 5. Tech Stack

### Architecture

The system follows a modern decoupled architecture with a focus on real-time updates for the queue.

```
crown-cuts-app/
├── backend/       ← NestJS API (Node.js)
├── frontend/      ← React (Vite) Client/Staff App
└── database/      ← PostgreSQL (Relational Data)
```

### Technologies

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Backend | NestJS | 10.x | Scalable TypeScript API |
| Language | TypeScript | 5.x | Type safety across stack |
| ORM | TypeORM | 0.3.x | Database abstraction |
| Database | PostgreSQL | 15.x | Relational data storage |
| Frontend | React | 18.x | UI Library |
| Routing | React Router | 6.x | Client-side navigation |
| State | TanStack Query | 5.x | Server state management |
| CSS | Tailwind CSS | 3.x | Utility-first styling |
| Payments | Stripe | — | Payment processing |
| SMS | Twilio | — | Automated notifications |

### Third-Party Integrations

| Service | Purpose |
|---------|---------|
| **Stripe** | Handling deposits, full payments, and saved cards. |
| **Twilio** | Sending SMS reminders and queue notifications. |
| **Cloudinary** | Hosting barber portfolio images and profile photos. |
| **Google Calendar API** | (Optional) Syncing barber schedules to their personal phones. |

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| **PWA over Native** | Faster development, no App Store fees, easy QR code access for walk-ins. |
| **PostgreSQL** | Required for complex relational queries involving commissions and schedules. |
| **NestJS** | Provides a structured framework for complex business logic like the booking engine. |

---

## 6. Open Questions

| # | Question | Context / Impact | Owner | Status |
|:-:|----------|-----------------|-------|--------|
| 1 | **Booksy Migration** | Do we need to import historical client data from Booksy? | Client | ⏳ Open |
| 2 | **Deposit Amount** | Is it a flat fee (e.g., $25) or a percentage (e.g., 50%)? | Client | ⏳ Open |
| 3 | **Hardware** | Will there be a dedicated tablet at the front for walk-ins? | Client | ⏳ Open |
| 4 | **Cancellation Policy** | What is the cutoff time for a client to cancel and keep their deposit? | Client | ⏳ Open |
| 5 | **Commission Logic** | Does commission apply to tips, or do barbers keep 100% of tips? | Client | ⏳ Open |