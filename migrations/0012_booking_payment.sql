alter table member_bookings
  add column if not exists payment text not null default 'deposit';

alter table member_bookings
  add column if not exists amount_charged integer not null default 0;
