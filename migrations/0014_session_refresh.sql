create table if not exists session_refresh (
  id text primary key,
  family_id text not null,
  user_id text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  family_expires_at timestamptz not null,
  consumed_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists session_refresh_family_idx on session_refresh (family_id);
create index if not exists session_refresh_user_idx on session_refresh (user_id);
create index if not exists session_refresh_hash_idx on session_refresh (token_hash);
