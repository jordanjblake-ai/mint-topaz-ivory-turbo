create table if not exists camp_messages (
  id text primary key,
  from_id text not null,
  tag text not null,
  body text not null,
  reply text,
  replied_by text,
  group_id text,
  week integer,
  created_at timestamptz not null default now(),
  replied_at timestamptz
);
create index if not exists camp_messages_from_idx on camp_messages (from_id);

create table if not exists camp_mail_log (
  id serial primary key,
  message_id text not null,
  kind text not null,
  recipients text not null,
  subject text not null,
  body text not null,
  status text not null,
  created_at timestamptz not null default now()
);
create index if not exists camp_mail_log_message_idx on camp_mail_log (message_id);
