create table if not exists portal_otp (
  id text primary key,
  email text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists portal_otp_email_created_idx on portal_otp (email, created_at desc);
