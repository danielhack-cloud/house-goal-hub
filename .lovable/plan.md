

# HomeDollars.com Platform Build Plan

## Overview

Rebrand the current SavMoney platform to **HomeDollars.com** and build out the core member experience: shopping through Amazon, tracking purchases, earning HomeDollars (1 HD per $1 spent), and accumulating toward a home down payment goal.

---

## Phase 1: Rebrand and Core UI Updates

**Files to update:** `AppSidebar.tsx`, `Index.tsx`, `Members.tsx`, `MemberProfile.tsx`, `Rewards.tsx`, `Jobs.tsx`, `index.html`

- Rename all "SavMoney" references to "HomeDollars"
- Update branding, logo text, and footer
- Update page title in `index.html`

---

## Phase 2: Member Dashboard Redesign

**File:** `Index.tsx`

- Replace current admin-focused dashboard with a **member-facing** dashboard showing:
  - **HomeDollars Balance** (total earned)
  - **Lifetime Amazon Spending** tracked
  - **Home Savings Goal** progress bar (e.g., $50,000 down payment target)
  - **Recent Transactions** table (date, Amazon order, amount, HomeDollars earned)
- Add a prominent "Shop on Amazon" call-to-action button (affiliate link placeholder)

---

## Phase 3: Transaction Tracking Page

**New file:** `src/pages/Transactions.tsx`

Build a transactions page with two earning methods:

### Method 1: Amazon Shopping Link
- "Shop Now" button that routes users to Amazon via an affiliate-style link
- Explanation of how purchases are tracked

### Method 2: Receipt Upload
- Upload area where users can submit a screenshot of their Amazon receipt
- Form fields: order date, order total, optional order ID
- Status indicators: Pending Review, Verified, HomeDollars Credited
- Sample mock data showing past submissions

### Transaction History Table
- Columns: Date, Order ID, Amount Spent, HomeDollars Earned, Source (Link / Receipt), Status
- Filter by date range and status

---

## Phase 4: HomeDollars Rewards Page Update

**File:** `Rewards.tsx`

- Rebrand points to "HomeDollars" (1 HD = $1 spent)
- Show earning rate explanation
- Add a **Home Savings Goal** section with progress visualization
- Tier system based on lifetime HomeDollars earned:
  - Starter: 0-999 HD
  - Builder: 1,000-4,999 HD
  - Foundation: 5,000-14,999 HD
  - Homeowner: 15,000+ HD

---

## Phase 5: Member Profile Update

**File:** `MemberProfile.tsx`

- Add HomeDollars balance and lifetime earnings to profile header
- Add home buying goal and timeline fields
- Show recent transaction activity
- Display current tier and progress to next tier

---

## Phase 6: Navigation and Routing

**Files:** `AppSidebar.tsx`, `App.tsx`

- Add "Transactions" nav item with a receipt/shopping icon
- Rename "Rewards" to "HomeDollars"
- Add route for `/transactions`
- Reorder sidebar: Dashboard, Transactions, HomeDollars, Members, Job Board, etc.

---

## Technical Notes

- **Amazon API integration and real receipt processing** require backend infrastructure (Supabase/Cloud) and would be a future phase. This build will use mock data and UI placeholders that are ready to connect.
- **Receipt screenshot upload** UI will be built now; actual OCR/parsing (like Fetch app does) would need a service like Firecrawl or a custom edge function — can be added after enabling Lovable Cloud.
- All pages use the existing `DashboardLayout` pattern and shadcn/ui components already in the project.

---

## Files Changed or Created

| File | Action |
|------|--------|
| `index.html` | Update title |
| `src/components/AppSidebar.tsx` | Rebrand + add Transactions nav |
| `src/App.tsx` | Add `/transactions` route |
| `src/pages/Index.tsx` | Member-facing dashboard redesign |
| `src/pages/Transactions.tsx` | New - transaction tracking + receipt upload |
| `src/pages/Rewards.tsx` | Rebrand to HomeDollars rewards |
| `src/pages/MemberProfile.tsx` | Add HomeDollars data to profile |
| `src/pages/Members.tsx` | Minor rebrand updates |
| `src/pages/Jobs.tsx` | Minor rebrand updates |

