create table if not exists studios (
  id varchar(36) primary key,
  slug varchar(160) not null unique,
  owner_user_id varchar(36),
  owner_display_name varchar(80) not null,
  category varchar(60) not null,
  name varchar(120) not null,
  location varchar(160) not null,
  description text not null,
  price_amount integer not null,
  price_unit varchar(20) not null,
  contact varchar(80) not null,
  capacity integer,
  status varchar(20) not null,
  created_at timestamp not null,
  updated_at timestamp not null,
  constraint fk_studios_owner foreign key (owner_user_id) references users(id)
);

create index if not exists idx_studios_created_at on studios(created_at);

create table if not exists studio_images (
  id varchar(36) primary key,
  studio_id varchar(36) not null,
  image_url varchar(512) not null,
  sort_order integer not null,
  created_at timestamp not null,
  constraint fk_studio_images_studio foreign key (studio_id) references studios(id) on delete cascade
);

create index if not exists idx_studio_images_studio_id on studio_images(studio_id);

create table if not exists studio_amenities (
  id varchar(36) primary key,
  studio_id varchar(36) not null,
  amenity_name varchar(120) not null,
  sort_order integer not null,
  created_at timestamp not null,
  constraint fk_studio_amenities_studio foreign key (studio_id) references studios(id) on delete cascade
);

create index if not exists idx_studio_amenities_studio_id on studio_amenities(studio_id);

create table if not exists community_posts (
  id varchar(36) primary key,
  slug varchar(160) not null unique,
  author_user_id varchar(36),
  author_display_name varchar(80) not null,
  category varchar(20) not null,
  title varchar(180) not null,
  excerpt varchar(255) not null,
  body text not null,
  view_count integer not null default 0,
  comment_count integer not null default 0,
  created_at timestamp not null,
  updated_at timestamp not null,
  constraint fk_community_posts_author foreign key (author_user_id) references users(id)
);

create index if not exists idx_community_posts_created_at on community_posts(created_at);

create table if not exists community_post_images (
  id varchar(36) primary key,
  post_id varchar(36) not null,
  image_url varchar(512) not null,
  sort_order integer not null,
  created_at timestamp not null,
  constraint fk_community_post_images_post foreign key (post_id) references community_posts(id) on delete cascade
);

create index if not exists idx_community_post_images_post_id on community_post_images(post_id);

create table if not exists community_comments (
  id varchar(36) primary key,
  post_id varchar(36) not null,
  author_user_id varchar(36),
  author_display_name varchar(80) not null,
  body text not null,
  created_at timestamp not null,
  updated_at timestamp not null,
  constraint fk_community_comments_post foreign key (post_id) references community_posts(id) on delete cascade,
  constraint fk_community_comments_author foreign key (author_user_id) references users(id)
);

create index if not exists idx_community_comments_post_id on community_comments(post_id);
create index if not exists idx_community_comments_created_at on community_comments(created_at);
