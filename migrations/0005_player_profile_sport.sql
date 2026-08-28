alter table performance_applications
  add column if not exists sport text not null default 'beach';
