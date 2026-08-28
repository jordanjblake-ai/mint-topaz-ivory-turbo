alter table performance_applications
  add column if not exists partner_first_name text not null default '',
  add column if not exists partner_last_name text not null default '';
