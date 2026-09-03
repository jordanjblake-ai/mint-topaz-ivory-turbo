create table if not exists security_events (
  id text primary key,
  at timestamptz not null default now(),
  action text not null,
  actor_id text,
  role text,
  outcome text not null,
  detail text
);

create index if not exists security_events_at_idx on security_events (at desc);
create index if not exists security_events_action_idx on security_events (action);
