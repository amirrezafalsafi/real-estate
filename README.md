# Sarpanah - Real Estate & Property Management Platform

A modern, high-performance real estate platform built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Prisma ORM**. Designed for high scalability, search engine visibility, and seamless property listing and management for buyers, agents, and administrators.

---

## Overview

**Sarpanah** provides a unified real estate experience with:
- A high-speed public property marketplace with real-time filtering, comparison, and dynamic property showcases.
- A client self-service portal for managing listings, inquiries, and saved favorites.
- A secured, rate-limited administrative control panel with full CRUD capabilities over properties, inquiries, and platform metrics.

---

## Key Features

### 1. Public Marketplace
- **Property Exploration**: Instant search and multi-facet filtering by transaction type (Sale / Rent), property category (Apartments, Villas, Land, Offices, Commercial), price range, floor area, bedroom count, and amenities.
- **Detailed Property Showcase**: SEO-optimized dynamic pages (`/properties/[slug]`) featuring responsive image galleries, comprehensive feature matrices, location information, and embedded inquiry forms.
- **Smart Property Comparison**: Side-by-side comparative analysis of property attributes (`/compare`).
- **Free Property Submission**: Multi-step submission workflow (`/submit-property`) for property owners and landlords.
- **Responsive & Accessible**: Native RTL support, typography powered by Vazirmatn, and smooth circular wave light/dark theme switching powered by the View Transitions API.

### 2. User Portal (`/panel`)
- **Interactive Dashboard**: Real-time overview of active listings, pending inquiries, and saved properties.
- **Listing Management**: View, update, and monitor the publication status of submitted real estate listings.
- **Inquiry Tracker**: Direct access to incoming client inquiries with contact details and property references.
- **Saved Favorites**: Bookmark properties for fast evaluation.
- **Flexible Authentication**: Secure JWT-based authentication supporting login by **Username**, **Email**, or **Phone Number**.

### 3. Admin Control Center (`/admin`)
- **Restricted Back-Office**: Secure administrative portal isolated from public navigation routes.
- **Listing Administration**: Create, modify, feature, archive, and delete properties with image ordering and metadata controls.
- **Leads & Inquiries Pipeline**: Read receipts, status tracking, and direct customer outreach workflows.
- **Brute-Force Protection**: IP and identifier-based rate limiting on sensitive administrative authentication endpoints.
- **System Settings**: Platform-wide configuration and preferences.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16.4.6 (App Router, Turbopack, Partial Prerendering, Server Actions) |
| **Frontend** | React 19.3.0, TypeScript 5, Tailwind CSS 4.3.3 |
| **Icons & Styling** | Lucide React, Modern View Transitions API |
| **Database & ORM** | Prisma ORM 7.10.1, SQLite / LibSQL & PostgreSQL Adapters |
| **Authentication** | Jose (Stateless Signed JWTs), HTTP-only Secure Cookies, Bcrypt.js |
| **Validation** | Zod, React Hook Form, Yup |
| **State & Data** | TanStack React Query v5 |

---

## Directory Structure

```text
├── prisma/
│   ├── schema.prisma       # Database models and relations
│   └── seed.ts             # Sample data seeder
├── public/
│   └── images/             # Static assets and sample property media
├── src/
│   ├── app/
│   │   ├── (admin)/        # Administrative routes (/admin)
│   │   ├── (site)/         # Public marketplace & user panel (/panel)
│   │   └── api/            # Route handlers (auth, properties, inquiries)
│   ├── components/
│   │   ├── features/       # Feature-specific components
│   │   ├── providers/      # Context providers (auth, theme)
│   │   ├── site/           # Shared layout components (header, footer, sidebars)
│   │   └── ui/             # Reusable UI primitives (buttons, modals, badges)
│   ├── lib/                # Database clients, auth utilities, formatting helpers
│   └── proxy.ts            # Route protection and authorization proxy
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites
- **Node.js**: v20 or higher (v24 recommended)
- **npm** or **pnpm**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amirrezafalsafi/sar-panah.git
   cd sar-panah
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the project root:
   ```env
   DATABASE_URL="file:./dev.db"
   USER_JWT_SECRET="your-secure-user-jwt-secret-key"
   ADMIN_JWT_SECRET="your-secure-admin-jwt-secret-key"
   NODE_ENV="development"
   ```

4. Run database migrations and seed sample data:
   ```bash
   npx prisma db push
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run build`: Generates an optimized production build and validates all routes.
- `npm run start`: Runs the built production server.
- `npm run lint`: Runs ESLint code style and quality checks.
- `npm run verify`: Runs both ESLint and the Next.js production build gate.

---

## Authentication Portals

- **User Portal**: `/auth/login` (Login with Username, Email, or Phone Number)
- **User Dashboard**: `/panel`
- **Admin Portal**: `/admin/login` (Encrypted admin authentication)
- **Admin Dashboard**: `/admin`
