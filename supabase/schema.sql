-- NAGAS FOODS — Trichy: Supabase PostgreSQL Schema
-- Run this SQL inside your Supabase SQL Editor before enabling SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY.

create table if not exists public.nagas_products (
  id text primary key,
  name text not null,
  category text not null check (category in ('dates', 'honey', 'dry-fruits')),
  origin text not null default 'Trichy',
  tasting_note text not null default '',
  description text not null default '',
  image_url text not null default '',
  image_focus text,
  variants jsonb not null default '[]'::jsonb,
  sold_out boolean not null default false,
  featured boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.nagas_orders (
  id text primary key,
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_phone text not null,
  customer jsonb not null,
  items jsonb not null default '[]'::jsonb,
  subtotal integer not null default 0,
  delivery_fee integer not null default 0,
  total integer not null default 0,
  payment_method text not null,
  stage text not null default 'Placed' check (stage in ('Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'))
);

create index if not exists idx_nagas_orders_phone on public.nagas_orders (customer_phone);
create index if not exists idx_nagas_orders_created on public.nagas_orders (created_at desc);

create table if not exists public.nagas_testimonials (
  id text primary key,
  author text not null,
  location text not null default 'Trichy',
  item_bought text not null default '',
  quote text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.nagas_inquiries (
  id text primary key,
  name text not null,
  phone text not null,
  email text not null default '',
  message text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

create table if not exists public.nagas_settings (
  id text primary key default 'default',
  whatsapp_number text not null default '6379178126',
  delivery_fee integer not null default 49,
  free_delivery_threshold integer not null default 999,
  announcement_text text not null default '',
  hero_media jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (server accesses via service role key)
alter table public.nagas_products enable row level security;
alter table public.nagas_orders enable row level security;
alter table public.nagas_testimonials enable row level security;
alter table public.nagas_inquiries enable row level security;
alter table public.nagas_settings enable row level security;

-- Public read access for storefront catalogue, testimonials, and settings
drop policy if exists "Public read products" on public.nagas_products;
create policy "Public read products" on public.nagas_products for select using (true);

drop policy if exists "Public read testimonials" on public.nagas_testimonials;
create policy "Public read testimonials" on public.nagas_testimonials for select using (true);

drop policy if exists "Public read settings" on public.nagas_settings;
create policy "Public read settings" on public.nagas_settings for select using (true);
