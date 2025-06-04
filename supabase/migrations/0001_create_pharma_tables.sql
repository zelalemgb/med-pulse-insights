-- Products table
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  product_name text not null,
  product_code text,
  unit text not null,
  unit_price numeric not null,
  ven_classification text not null,
  facility_specific boolean not null default false,
  procurement_source text not null,
  frequency text not null,
  facility_id uuid references health_facilities(id) on delete cascade,
  annual_consumption numeric default 0,
  aamc numeric default 0,
  wastage_rate numeric default 0,
  awamc numeric default 0,
  forecast jsonb,
  seasonality jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- Period data table
create table if not exists period_data (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  period integer not null,
  period_name text not null,
  beginning_balance numeric default 0,
  received numeric default 0,
  positive_adj numeric default 0,
  negative_adj numeric default 0,
  ending_balance numeric default 0,
  stock_out_days integer default 0,
  expired_damaged numeric default 0,
  consumption_issue numeric default 0,
  aamc numeric default 0,
  wastage_rate numeric default 0,
  calculated_at timestamptz
);
create unique index if not exists period_data_product_period_idx on period_data(product_id, period);

-- Import logs table
create table if not exists import_logs (
  id uuid primary key default uuid_generate_v4(),
  filename text,
  total_rows integer,
  successful_rows integer,
  error_rows integer,
  warnings jsonb,
  mapping jsonb,
  imported_by uuid references auth.users(id),
  imported_at timestamptz default now()
);
