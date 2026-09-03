create table if not exists token_blacklist (
  token_hash text primary key,
  kind text not null,
  user_id text,
  reason text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists token_blacklist_expires_idx on token_blacklist (expires_at);
create index if not exists token_blacklist_user_idx on token_blacklist (user_id);
