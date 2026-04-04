create table if not exists users (
  id varchar(36) primary key,
  role varchar(20) not null,
  status varchar(20) not null,
  display_name varchar(80),
  activity_field varchar(40),
  region varchar(80),
  onboarding_completed boolean not null default false,
  deleted_at timestamp,
  last_login_at timestamp,
  created_at timestamp not null,
  updated_at timestamp not null
);

create table if not exists social_accounts (
  id varchar(36) primary key,
  user_id varchar(36) not null,
  provider varchar(20) not null,
  provider_user_id varchar(191) not null,
  provider_email varchar(191),
  email_verified boolean not null default false,
  provider_nickname varchar(120),
  linked_at timestamp not null,
  last_login_at timestamp not null,
  constraint fk_social_accounts_user foreign key (user_id) references users(id),
  constraint uk_social_accounts_provider_user unique (provider, provider_user_id)
);

create index if not exists idx_social_accounts_user_id on social_accounts(user_id);

create table if not exists user_terms_consents (
  id varchar(36) primary key,
  user_id varchar(36) not null,
  consent_type varchar(40) not null,
  version varchar(40) not null,
  agreed boolean not null,
  agreed_at timestamp,
  created_at timestamp not null,
  constraint fk_user_terms_consents_user foreign key (user_id) references users(id),
  constraint uk_user_terms_consents unique (user_id, consent_type, version)
);

create table if not exists auth_sessions (
  id varchar(36) primary key,
  user_id varchar(36) not null,
  session_token_hash varchar(128) not null,
  user_agent_hash varchar(128),
  ip_hash varchar(128),
  expires_at timestamp not null,
  revoked_at timestamp,
  last_seen_at timestamp not null,
  created_at timestamp not null,
  constraint fk_auth_sessions_user foreign key (user_id) references users(id),
  constraint uk_auth_sessions_token_hash unique (session_token_hash)
);

create index if not exists idx_auth_sessions_user_id on auth_sessions(user_id);
create index if not exists idx_auth_sessions_expires_at on auth_sessions(expires_at);

create table if not exists oauth_login_states (
  id varchar(36) primary key,
  provider varchar(20) not null,
  state_token varchar(128) not null,
  redirect_path varchar(512) not null,
  requester_ip_hash varchar(128),
  requester_user_agent_hash varchar(128),
  expires_at timestamp not null,
  used_at timestamp,
  created_at timestamp not null,
  constraint uk_oauth_login_states_state unique (state_token)
);

create index if not exists idx_oauth_login_states_expires_at on oauth_login_states(expires_at);
