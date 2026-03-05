

## Plan: Duplicate Receipt Prevention, Member Onboarding Profile, Referral System, and Spending Categories

This is a large feature set. Here is the breakdown:

---

### 1. Remove Tiers from Rewards Page

Strip the "Membership Tiers" section and the "Current Tier" metric card from `src/pages/Rewards.tsx`. Also remove the "Current Tier" metric from `src/pages/Index.tsx`. Keep the HD balance, spending tracking, and savings goal sections.

---

### 2. Duplicate Receipt Detection

**Database migration:**
- Add a `receipt_hash` column (text, nullable) to the `transactions` table
- Add a unique constraint on `(user_id, receipt_hash)` to prevent exact duplicates
- Also add a unique constraint on `(user_id, order_date, order_total, order_id)` for detail-based dedup

**Edge function update (`parse-receipt`):**
- Compute a hash (SHA-256) of the base64 image data and return it alongside parsed fields

**Frontend (`Capture.tsx`):**
- Pass the hash along when inserting the transaction
- Catch the unique constraint violation and show a user-friendly "This receipt has already been submitted" error

---

### 3. Member Onboarding Profile

**Database migration:**
- Add columns to `profiles` table: `age_range` (text), `housing_status` (text: 'renter' or 'homeowner'), `geographic_location` (text), `onboarding_completed` (boolean, default false)

**New onboarding flow:**
- Create `src/pages/Onboarding.tsx` -- a multi-step form collecting age range, renter/homeowner status, and geographic location
- After signup confirmation + first login, redirect users to `/onboarding` if `onboarding_completed` is false
- Update `AuthContext` or the dashboard redirect logic to check this flag

---

### 4. Referral System (Invite Friends & Family)

**Database migration:**
- Create `referrals` table: `id`, `referrer_id` (uuid), `referred_email` (text), `referred_user_id` (uuid, nullable), `status` (text: 'pending'/'accepted'), `created_at`
- Create `hd_transfers` table: `id`, `from_user_id`, `to_user_id`, `amount` (integer), `created_at` -- to track when referred users choose to transfer HD to the referrer
- RLS: users can see their own referrals and transfers

**Frontend:**
- Add a "Refer Friends" section on the dashboard or a dedicated page
- Allow members to enter email addresses to invite
- Once a referred person signs up and links back, they can opt to transfer earned HD to the referrer's account

---

### 5. Spending Categories with Primary/Non-Primary Rules

**Database migration:**
- Create `spending_categories` table: `id`, `name` (text), `is_primary` (boolean) -- seeded with categories like Rent, Mortgage, Car Payment, Groceries, Dining, Shopping, etc.
- Add `category_id` (uuid, nullable, FK to spending_categories) to `transactions` table
- Create `user_primary_categories` table: `id`, `user_id`, `category_id`, `monthly_amount` (numeric) -- user's own primary recurring expenses (entered once)
- Create `family_submissions` table: `id`, `user_id` (the member submitting), `family_member_name` (text), `category_id`, `is_primary` (boolean), `order_total`, `order_date`, `month` (text YYYY-MM), `created_at`

**Business rules (enforced in frontend + edge function):**
- Users enter their own primary categories once (rent, mortgage, car payment, etc.) and can update anytime
- Users can submit up to 3-5 friends/family members' primary category transactions per month
- Unlimited non-primary (groceries, dining, Amazon, etc.) transactions for friends/family
- Track monthly limits per user in the frontend and validate server-side

**Frontend:**
- Add category selection to the receipt capture flow
- Create a "Family & Friends" section where users can add family members and submit transactions on their behalf
- Show monthly submission counts and limits

---

### Summary of Database Changes

```text
profiles (ALTER):
  + age_range text
  + housing_status text
  + geographic_location text
  + onboarding_completed boolean DEFAULT false

transactions (ALTER):
  + receipt_hash text
  + category_id uuid (nullable)
  + UNIQUE(user_id, receipt_hash)
  + UNIQUE(user_id, order_date, order_total, order_id)

NEW: spending_categories (id, name, is_primary)
NEW: user_primary_categories (id, user_id, category_id, monthly_amount)
NEW: referrals (id, referrer_id, referred_email, referred_user_id, status, created_at)
NEW: hd_transfers (id, from_user_id, to_user_id, amount, created_at)
NEW: family_submissions (id, user_id, family_member_name, category_id, is_primary, order_total, order_date, month, created_at)
```

### New/Modified Files

- `supabase/functions/parse-receipt/index.ts` -- add hash computation
- `src/pages/Rewards.tsx` -- remove tiers
- `src/pages/Index.tsx` -- remove tier metric card
- `src/pages/Capture.tsx` -- add receipt_hash, category selection, duplicate error handling
- `src/pages/Onboarding.tsx` -- new onboarding flow
- `src/pages/Auth.tsx` or `AuthContext` -- redirect to onboarding if not completed
- `src/pages/Referrals.tsx` or section in dashboard -- referral invites and HD transfer opt-in
- `src/pages/FamilySubmissions.tsx` -- manage family member transaction submissions

