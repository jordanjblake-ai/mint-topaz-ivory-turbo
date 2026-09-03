alter table member_profiles
  add column if not exists emergency_first_name text not null default '';

alter table member_profiles
  add column if not exists emergency_last_name text not null default '';

update member_profiles
set
  emergency_first_name = split_part(trim(emergency_name), ' ', 1),
  emergency_last_name = trim(replace(trim(emergency_name), split_part(trim(emergency_name), ' ', 1), ''))
where coalesce(trim(emergency_name), '') <> ''
  and coalesce(emergency_first_name, '') = '';

create table if not exists member_bookings (
  id text primary key,
  user_id text,
  email text not null,
  kind text not null,
  product text not null,
  package_id text not null default '',
  weeks text not null default '[]',
  party_size integer not null default 1,
  title text not null,
  detail text not null default '',
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

create index if not exists member_bookings_email_idx on member_bookings (lower(email));
create index if not exists member_bookings_user_idx on member_bookings (user_id);
