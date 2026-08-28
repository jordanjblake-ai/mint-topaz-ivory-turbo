alter table performance_applications
  add column if not exists contact_phone text not null default '';
