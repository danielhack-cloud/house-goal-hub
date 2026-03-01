

## Plan: App-style Bottom Navigation with Three Tabs

### Overview

Transform the mobile experience from a sidebar/hamburger menu into a native app-style bottom navigation bar with three tabs: **Track** (left), **Capture** (center), **Spend** (right). Desktop keeps the sidebar layout unchanged.

### Architecture

```text
Bottom Nav:  [ Track ]  [ Capture ]  [ Spend ]
               /track     /capture     /spend
```

- **Track** (`/track`) — Dashboard showing HD balance, savings goals, spending breakdown, recent transactions (merge current Index + Rewards dashboard content)
- **Capture** (`/capture`) — Streamlined receipt capture screen. Immediately opens camera, shows receipt preview, auto-submits (refactored from current Transactions page)
- **Spend** (`/spend`) — HD balance display + catalog of redemption options (mortgage, plumber, roof, etc. with fake examples for now)

### Files to Create

1. **`src/components/BottomNav.tsx`** — Fixed bottom navigation bar component
   - Three icons+labels: Track (LayoutDashboard), Capture (Camera), Spend (Home)
   - Active state highlighting with primary color pill/background like the reference image
   - Safe area padding for iOS notch devices
   - Only renders on mobile

2. **`src/pages/Track.tsx`** — New combined dashboard page
   - HD balance, lifetime spending, transaction count, tier metrics
   - Savings goal progress bar
   - Spending category breakdown (fake data for now)
   - Recent transactions list

3. **`src/pages/Capture.tsx`** — Dedicated camera/receipt page
   - Large camera button as primary action
   - Receipt preview thumbnail
   - Auto-parse + auto-submit flow (extracted from Transactions.tsx)
   - Celebration dialog on success
   - Minimal UI — focused on the one action

4. **`src/pages/Spend.tsx`** — Redemption marketplace
   - HD balance display at top
   - Grid of redemption cards with fake examples:
     - Mortgage payment ($500 HD)
     - Plumber service ($150 HD)
     - Roof repair ($300 HD)
     - Home insurance ($200 HD)
     - Landscaping ($100 HD)
     - Home cleaning ($75 HD)
   - Each card shows image/icon, title, HD cost, "Redeem" button (non-functional for now)

### Files to Modify

5. **`src/components/DashboardLayout.tsx`** — Add BottomNav on mobile, increase bottom padding to account for nav bar height, remove hamburger menu on mobile

6. **`src/App.tsx`** — Add routes for `/track`, `/capture`, `/spend`; keep existing routes for desktop compatibility

### Design Details

- Bottom nav bar: fixed to bottom, ~64px height, white background, subtle top border/shadow
- Center "Capture" button slightly larger/elevated with primary color circle (like a FAB)
- Active tab gets primary color icon + label
- Inactive tabs are muted gray
- Safe area insets for iOS home indicator

