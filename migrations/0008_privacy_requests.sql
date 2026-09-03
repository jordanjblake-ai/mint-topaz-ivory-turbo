create table if not exists privacy_requests (
  id text primary key,
  request_type text not null,
  name text not null,
  email text not null,
  detail text not null default '',
  status text not null default 'received',
  created_at timestamptz not null default now()
);

create index if not exists privacy_requests_email_idx on privacy_requests (email);
create index if not exists privacy_requests_created_idx on privacy_requests (created_at desc);
