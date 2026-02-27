

## Plan: Full Mobile Optimization + Camera Button

The core issue: the sidebar is a fixed 256px (`w-64`) column that never collapses, pushing content off-screen on mobile. Every page using `DashboardLayout` inherits this problem.

### Steps

1. **Rebuild DashboardLayout with responsive sidebar**
   - On mobile (`< md`): hide sidebar, show a top header bar with hamburger menu icon + logo
   - Sidebar opens as a slide-over sheet/drawer on mobile tap
   - On desktop (`>= md`): keep the current fixed sidebar behavior
   - Main content: `ml-64` only on `md+`, full-width on mobile with appropriate padding (`p-4` instead of `p-8`)

2. **Update AppSidebar for mobile drawer behavior**
   - Accept an `open` + `onClose` prop
   - Wrap in a sheet/overlay on mobile, fixed sidebar on desktop
   - Add close button and backdrop for mobile drawer

3. **Mobile-optimize Transactions page**
   - Stack the two cards vertically on mobile (already `md:grid-cols-2`, should work)
   - Add a prominent "Take Photo" camera button that works on both native (Capacitor camera) and web (falls back to file input with `capture="environment"`)
   - Make the transaction history table horizontally scrollable on mobile, or convert to card-based layout
   - Increase touch target sizes on form inputs and buttons

4. **Mobile-optimize Dashboard (Index) page**
   - Header: stack title and "Shop on Amazon" button vertically on mobile
   - Make transaction table scrollable on small screens

5. **Mobile-optimize remaining pages** (Rewards, Jobs, LiveFeed, Members)
   - Ensure grids collapse properly on small screens
   - Jobs: stack apply/bookmark buttons below job info on mobile
   - Members table: horizontal scroll wrapper

6. **Add safe area insets for native app**
   - Add `env(safe-area-inset-*)` padding in CSS for notched devices
   - Apply to the top header bar and bottom of sidebar

### Technical Details

- The mobile sidebar will use the existing shadcn `Sheet` component for the slide-over drawer
- `useIsMobile()` hook already exists at 768px breakpoint and will be used for conditional rendering
- Camera button on Transactions: on native, uses existing `useCamera` hook; on web, uses `<input capture="environment">` to open the phone camera directly from the browser
- Safe area CSS: `padding-top: env(safe-area-inset-top)` added to the layout wrapper and `viewport-fit=cover` meta tag in `index.html`
- All table-based views get `overflow-x-auto` wrappers on mobile

