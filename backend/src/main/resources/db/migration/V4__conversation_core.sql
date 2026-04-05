insert into users (
  id, role, status, display_name, activity_field, region, onboarding_completed, deleted_at, last_login_at, created_at, updated_at
)
select
  'user-seed-curation-host',
  'USER',
  'ACTIVE',
  '은금슬쩍 큐레이션',
  '공방 운영',
  '서울',
  true,
  null,
  timestamp '2026-04-05 09:00:00',
  timestamp '2026-04-05 09:00:00',
  timestamp '2026-04-05 09:00:00'
where not exists (
  select 1 from users where id = 'user-seed-curation-host'
);

update studios
set owner_user_id = 'user-seed-curation-host'
where owner_user_id is null
  and slug in ('maison-de-lartiste', 'the-forge-collective', 'silent-earth');

create table if not exists conversations (
  id varchar(36) primary key,
  user_id varchar(36) not null,
  workshop_id varchar(36) not null,
  created_at timestamp not null,
  updated_at timestamp not null,
  constraint fk_conversations_user foreign key (user_id) references users(id),
  constraint fk_conversations_workshop foreign key (workshop_id) references studios(id) on delete cascade,
  constraint uk_conversations_user_workshop unique (user_id, workshop_id)
);

create index if not exists idx_conversations_user_id on conversations(user_id);
create index if not exists idx_conversations_workshop_id on conversations(workshop_id);
create index if not exists idx_conversations_updated_at on conversations(updated_at);

create table if not exists messages (
  id varchar(36) primary key,
  conversation_id varchar(36) not null,
  sender_id varchar(36) not null,
  content text not null,
  created_at timestamp not null,
  constraint fk_messages_conversation foreign key (conversation_id) references conversations(id) on delete cascade,
  constraint fk_messages_sender foreign key (sender_id) references users(id)
);

create index if not exists idx_messages_conversation_id on messages(conversation_id);
create index if not exists idx_messages_created_at on messages(created_at);
