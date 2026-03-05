
-- 1. Add onboarding fields to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS age_range text,
  ADD COLUMN IF NOT EXISTS housing_status text,
  ADD COLUMN IF NOT EXISTS geographic_location text,
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

-- 2. Add receipt_hash and category_id to transactions
ALTER TABLE public.transactions 
  ADD COLUMN IF NOT EXISTS receipt_hash text,
  ADD COLUMN IF NOT EXISTS category_id uuid;

-- Unique constraint for image-based dedup
ALTER TABLE public.transactions 
  ADD CONSTRAINT transactions_user_receipt_hash_unique UNIQUE (user_id, receipt_hash);

-- 3. Spending categories table
CREATE TABLE public.spending_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false
);
ALTER TABLE public.spending_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.spending_categories FOR SELECT USING (true);

-- Seed categories
INSERT INTO public.spending_categories (name, is_primary) VALUES
  ('Rent', true),
  ('Mortgage', true),
  ('Car Payment', true),
  ('Insurance', true),
  ('Utilities', true),
  ('Groceries', false),
  ('Dining', false),
  ('Shopping', false),
  ('Gas', false),
  ('Entertainment', false),
  ('Healthcare', false),
  ('Other', false);

-- FK from transactions to spending_categories
ALTER TABLE public.transactions 
  ADD CONSTRAINT transactions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.spending_categories(id);

-- 4. User primary categories
CREATE TABLE public.user_primary_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category_id uuid NOT NULL REFERENCES public.spending_categories(id),
  monthly_amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, category_id)
);
ALTER TABLE public.user_primary_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own primary categories" ON public.user_primary_categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own primary categories" ON public.user_primary_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own primary categories" ON public.user_primary_categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own primary categories" ON public.user_primary_categories FOR DELETE USING (auth.uid() = user_id);

-- 5. Referrals table
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL,
  referred_email text NOT NULL,
  referred_user_id uuid,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referrer_id, referred_email)
);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);
CREATE POLICY "Users can insert own referrals" ON public.referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- 6. HD transfers table
CREATE TABLE public.hd_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid NOT NULL,
  to_user_id uuid NOT NULL,
  amount integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.hd_transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transfers" ON public.hd_transfers FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "Users can insert transfers from self" ON public.hd_transfers FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- 7. Family submissions table
CREATE TABLE public.family_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  family_member_name text NOT NULL,
  category_id uuid REFERENCES public.spending_categories(id),
  is_primary boolean NOT NULL DEFAULT false,
  order_total numeric NOT NULL,
  order_date date NOT NULL,
  month text NOT NULL,
  hd_earned integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.family_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own family submissions" ON public.family_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own family submissions" ON public.family_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
