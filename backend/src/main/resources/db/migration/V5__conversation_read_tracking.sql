alter table conversations
  add column if not exists inquirer_last_read_at timestamp with time zone;

alter table conversations
  add column if not exists owner_last_read_at timestamp with time zone;

update conversations
set inquirer_last_read_at = coalesce(inquirer_last_read_at, updated_at),
    owner_last_read_at = coalesce(owner_last_read_at, updated_at)
where inquirer_last_read_at is null
   or owner_last_read_at is null;
