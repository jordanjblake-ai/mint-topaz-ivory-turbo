create table if not exists performance_applications (
  user_id text primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  gender text not null,
  level text not null,
  top_style text not null,
  top_size text not null,
  has_partner boolean not null default false,
  partner_name text not null default '',
  emergency_first_name text not null,
  emergency_last_name text not null,
  emergency_phone text not null,
  message text not null default '',
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
