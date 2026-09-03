create table if not exists member_profiles (
  user_id text primary key,
  first_name text not null default '',
  last_name text not null default '',
  email text not null default '',
  phone text not null default '',
  address_line text not null default '',
  city text not null default '',
  postcode text not null default '',
  country text not null default 'United Kingdom',
  emergency_name text not null default '',
  emergency_phone text not null default '',
  emergency_phone_alt text not null default '',
  emergency_email text not null default '',
  medical text not null default '',
  dietary text not null default '',
  ukbt text not null default '',
  vest_size text not null default '',
  shorts_size text not null default '',
  sports text not null default '[]',
  membership_expires_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists member_profiles_email_idx on member_profiles (email);
