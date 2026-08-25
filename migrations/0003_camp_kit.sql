create table if not exists camp_kit (
  person_id text primary key,
  top_size text not null,
  shorts_size text not null,
  print_name text not null,
  country text not null,
  updated_at timestamptz not null default now()
);
