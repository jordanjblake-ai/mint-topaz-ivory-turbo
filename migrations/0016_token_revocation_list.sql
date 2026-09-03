create table if not exists token_revocation_list (
  jti text primary key,
  kind text not null,
  user_id text,
  reason text not null,
  revoked_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists token_revocation_list_user_idx on token_revocation_list (user_id);
create index if not exists token_revocation_list_expires_idx on token_revocation_list (expires_at);
create index if not exists token_revocation_list_revoked_idx on token_revocation_list (revoked_at desc);
