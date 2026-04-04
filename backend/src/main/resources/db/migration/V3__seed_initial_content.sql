insert into studios (
  id, slug, owner_user_id, owner_display_name, category, name, location, description,
  price_amount, price_unit, contact, capacity, status, created_at, updated_at
) values
  (
    'studio-seed-001',
    'maison-de-lartiste',
    null,
    '은금슬쩍 큐레이션',
    '주얼리 공방',
    'Maison de L''Artiste',
    '서촌',
    '전통적인 왁스 카빙과 은공예에 집중할 수 있는 조용하고 햇살 가득한 2층 스튜디오입니다.',
    450000,
    'MONTH',
    '010-2014-1101',
    3,
    'ACTIVE',
    timestamp '2026-03-20 11:00:00',
    timestamp '2026-03-20 11:00:00'
  ),
  (
    'studio-seed-002',
    'the-forge-collective',
    null,
    '은금슬쩍 큐레이션',
    '금속 공방',
    'The Forge Collective',
    '성수동',
    '네 명의 마스터 주얼러가 공유하는 고급 산업용 공간입니다. 무거운 금속 작업을 위한 설비가 완비되어 있습니다.',
    620000,
    'MONTH',
    '010-2014-1102',
    4,
    'ACTIVE',
    timestamp '2026-03-24 10:30:00',
    timestamp '2026-03-24 10:30:00'
  ),
  (
    'studio-seed-003',
    'silent-earth',
    null,
    '은금슬쩍 큐레이션',
    '도예 공방',
    'Silent Earth Studio',
    '한남',
    '손의 감각과 흙의 질감에 집중할 수 있는 조용한 작업실입니다. 자연광과 우드 톤 가구, 정갈한 동선이 특징입니다.',
    85000,
    'DAY',
    '010-2014-1103',
    4,
    'ACTIVE',
    timestamp '2026-03-27 14:00:00',
    timestamp '2026-03-27 14:00:00'
  );

insert into studio_images (id, studio_id, image_url, sort_order, created_at) values
  ('studio-image-001', 'studio-seed-001', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3rg3F2p-W5Vfxw7-FTEux-_7G6FtrAgMUcjrQ15Qa7BQ6cUxwBKakk89QWwobbTWSKlRnFs1BBIbE__CZCp9pYf3kHjZLQiIOFleCZoV3HDXbvxpjxHg_e-moBufkgRZAgneaH1vxRWjcW-glX4crTiTV3Dclx30yG50IKlimWl7fndpDvMtTDRvyd4SmCATywwUXxpyeAIdwm_05U3nNYIFjISpnoFvwCZxG7QUWjCZxh4jzwwF1p_7rEbEnLpBgct00kz6Gm1Y', 0, timestamp '2026-03-20 11:00:00'),
  ('studio-image-002', 'studio-seed-002', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoS1F5DlOtIZaawuruVX2_fQqugectv32be0hyYWf77M7N1sfPcWdejYVDtzd4-HypdmAGLO7CCTLQ8PFyFcf0hD8ZS6vzoILMTaZksEHCNo3P47MTn6Em6qoYhgC0LsM_15MLHgg_m1IgHi3qVFo8Pit11-jKQK5oYNH-3JI3qfDLLdIDKaNVsRBMpMObcoivXrBu7EryGi9rSM7WOnNttBimV12GHWSAFnC9uUXit8DTOfbeHiJ7q0ILlu6yOtgN1ob6jymnWRQ', 0, timestamp '2026-03-24 10:30:00'),
  ('studio-image-003', 'studio-seed-003', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCE4Q6a293ZJNF1xGTdcaVqTmX2AbYegyqITfMIlHqs_iUF9ESZplKw2Eg_eWj67zhpeRwfUX07J4OWHkIZrQYH60GatkWTnjWHd_TbQcHK-7yxk5rFvCW4lwwZNcwHSHewflrPo_vhrwumueIJEM3_MnWZP7o9WbKVbfxFoLKCRMRTWXviIFrA8VggWPXyTulohr9pKpBhOE2rr9nZ85zHGXGTlysnT6-QJBPrV8AM0NbNGxI4nL1l8l35S3RESpmKOCh-UfzCeT0', 0, timestamp '2026-03-27 14:00:00'),
  ('studio-image-004', 'studio-seed-003', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-nhEpKxrMBXiWVczhKhtV7mC6LBButmKnWuD4zhjx-uHwOYVc0DoTgPxMZUNzqwOcYzyNeaGHKBxbfT_qk9Cppa_CxmetKAUq7kS4J9Irh046fwKlSLlR9iGdcDSDr6U4l6-QrV0ELDXNKm1SSJzBF73Q92y8h4yqz9tQfMAQD4bZGFpWoUS8eVwmzT3o_pfgdNPVwpVgqa8f8iO-P4pdGMgYfgKRiR9OZaBcY0qfx5nTTqcTQJrny3FHlo_7YFheRI2AVfgaeTg', 1, timestamp '2026-03-27 14:00:00');

insert into studio_amenities (id, studio_id, amenity_name, sort_order, created_at) values
  ('studio-amenity-001', 'studio-seed-001', '연마기', 0, timestamp '2026-03-20 11:00:00'),
  ('studio-amenity-002', 'studio-seed-001', '가마', 1, timestamp '2026-03-20 11:00:00'),
  ('studio-amenity-003', 'studio-seed-001', '와이파이', 2, timestamp '2026-03-20 11:00:00'),
  ('studio-amenity-004', 'studio-seed-002', '롤링 밀', 0, timestamp '2026-03-24 10:30:00'),
  ('studio-amenity-005', 'studio-seed-002', '레이저 용접기', 1, timestamp '2026-03-24 10:30:00'),
  ('studio-amenity-006', 'studio-seed-002', '24시간 이용 가능', 2, timestamp '2026-03-24 10:30:00'),
  ('studio-amenity-007', 'studio-seed-003', '전동 물레', 0, timestamp '2026-03-27 14:00:00'),
  ('studio-amenity-008', 'studio-seed-003', '오크 작업 테이블', 1, timestamp '2026-03-27 14:00:00'),
  ('studio-amenity-009', 'studio-seed-003', '린넨 앞치마', 2, timestamp '2026-03-27 14:00:00');

insert into community_posts (
  id, slug, author_user_id, author_display_name, category, title, excerpt, body, view_count, comment_count, created_at, updated_at
) values
  (
    'post-seed-001',
    'sunny-seongsu-workspace',
    null,
    '구름실버',
    'free',
    '오늘 성수 쪽 작업실 날씨 너무 좋네요',
    '오후 자연광이 좋아서 사진 찍기 딱 좋았어요. 비슷한 분위기 공방 아시는 분 있으면 추천 부탁드려요.',
    '오늘 오후에 성수 쪽 작업실에 있었는데, 창으로 들어오는 빛이 정말 좋더라고요.\n\n요즘은 제품 컷도 중요하지만 작업하는 분위기가 담긴 사진을 같이 올리는 편이라, 빛이 좋은 공방을 더 자주 찾게 됩니다.\n\n혹시 성수나 서울숲 근처에서 자연광 괜찮은 공간 아시는 분 있으면 공유 부탁드려요.',
    128,
    2,
    timestamp '2026-04-02 13:00:00',
    timestamp '2026-04-02 13:00:00'
  ),
  (
    'post-seed-002',
    'silver-cleaning-tip',
    null,
    '민트링',
    'qa',
    '은세척기 없이 산화 자국 정리하는 팁 있을까요?',
    '초음파 세척기 없이도 집에서 정리 가능한 방법이 있으면 알려주세요. 베이킹소다 방법은 어느 정도까지 효과가 있는지 궁금합니다.',
    '작업실 장비 없이 집에서 간단히 관리할 수 있는 방법을 찾고 있어요.\n\n베이킹소다+호일 조합 이야기가 많던데, 무광 제품이나 얇은 체인 제품에도 괜찮은지 감이 잘 안 옵니다.\n\n장비 없이도 산화 자국 정리해보신 분들 경험을 듣고 싶어요.',
    203,
    2,
    timestamp '2026-04-01 11:30:00',
    timestamp '2026-04-01 11:30:00'
  ),
  (
    'post-seed-003',
    'used-dust-collector',
    null,
    'atelier noon',
    'market',
    '소형 집진기 중고로 내놓습니다',
    '한남 작업실 정리 중입니다. 1년 정도 사용했고 작동 상태 좋아요. 성수/한남 직거래 우선, 관심 있으면 댓글 남겨주세요.',
    '작업실 장비 일부를 정리하고 있어서 소형 집진기 하나 양도하려고 합니다.\n\n필터는 최근 교체했고 본체 외관도 큰 흠집 없이 깨끗합니다.\n\n가격은 댓글이나 메시지로 문의 주시면 상태 사진과 함께 전달드릴게요.',
    89,
    2,
    timestamp '2026-04-01 09:40:00',
    timestamp '2026-04-01 09:40:00'
  ),
  (
    'post-seed-004',
    'weekend-flea-market',
    null,
    '온화주얼리',
    'free',
    '이번 주말 플리마켓 준비하시는 분 계신가요?',
    '패키징 마감 아이디어 공유해요. 작은 카드나 스티커 어디서 제작하는지 궁금합니다.',
    '주말 플리마켓 준비하면서 마지막으로 늘 고민되는 게 포장 마감이네요.\n\n소량 제작이 가능한 곳을 찾고 있는데, 인쇄 품질이나 종이 질감이 괜찮았던 업체가 있으면 추천받고 싶습니다.',
    154,
    2,
    timestamp '2026-03-31 16:00:00',
    timestamp '2026-03-31 16:00:00'
  ),
  (
    'post-seed-005',
    'laser-welding-recommendation',
    null,
    'silver monday',
    'qa',
    '레이저 용접 맡길 수 있는 공방 추천 부탁드려요',
    '소량 수리 맡길 곳을 찾고 있어요. 신뢰할 만한 곳 있으면 비용대와 함께 알려주시면 큰 도움이 됩니다.',
    '얇은 체인 연결부 수리 때문에 레이저 용접 가능한 공방을 찾고 있습니다.\n\n직접 맡겨보신 분들의 후기와 대략적인 비용대가 궁금해요.',
    97,
    1,
    timestamp '2026-03-30 12:20:00',
    timestamp '2026-03-30 12:20:00'
  ),
  (
    'post-seed-006',
    'wax-carving-tool-set',
    null,
    'mora studio',
    'market',
    '왁스 카빙 툴 세트 양도합니다',
    '입문용으로 괜찮은 구성이고 사용감 적습니다. 사진 필요하시면 글 남겨주세요. 택배도 가능합니다.',
    '왁스 카빙 툴 세트를 정리하려고 합니다.\n\n입문하시는 분들이 바로 써보기 좋은 구성으로 묶여 있고, 택배 거래도 가능합니다.',
    76,
    1,
    timestamp '2026-03-29 15:00:00',
    timestamp '2026-03-29 15:00:00'
  );

insert into community_comments (
  id, post_id, author_user_id, author_display_name, body, created_at, updated_at
) values
  ('comment-seed-001', 'post-seed-001', null, 'atelier noon', '서울숲 쪽은 오후 3시 이후가 특히 좋아요. 큰 창 있는 곳 몇 군데 있는데 원하시면 공유드릴게요.', timestamp '2026-04-02 14:00:00', timestamp '2026-04-02 14:00:00'),
  ('comment-seed-002', 'post-seed-001', null, '온화주얼리', '한남 쪽 공유 공방도 추천해요. 실버 제품 찍기 좋았어요.', timestamp '2026-04-02 15:10:00', timestamp '2026-04-02 15:10:00'),
  ('comment-seed-003', 'post-seed-002', null, 'silver monday', '무광 제품은 폴리싱 천이 더 안전했어요.', timestamp '2026-04-01 13:00:00', timestamp '2026-04-01 13:00:00'),
  ('comment-seed-004', 'post-seed-002', null, '구름실버', '체인은 오래 담그지 말고 짧게 여러 번 확인하는 편이 좋아요.', timestamp '2026-04-01 14:10:00', timestamp '2026-04-01 14:10:00'),
  ('comment-seed-005', 'post-seed-003', null, 'mora studio', '혹시 모델명 알 수 있을까요? 소음 정도도 궁금합니다.', timestamp '2026-04-01 10:00:00', timestamp '2026-04-01 10:00:00'),
  ('comment-seed-006', 'post-seed-003', null, 'atelier noon', '모델명은 메시지로 보내드릴게요. 소음은 일반 데스크 환풍기보다 조금 큰 정도였습니다.', timestamp '2026-04-01 10:30:00', timestamp '2026-04-01 10:30:00'),
  ('comment-seed-007', 'post-seed-004', null, '구름실버', '저는 종이 질감 때문에 소량 인쇄보다 리소 느낌 나는 곳을 선호해요.', timestamp '2026-03-31 16:40:00', timestamp '2026-03-31 16:40:00'),
  ('comment-seed-008', 'post-seed-004', null, '민트링', '무광 투명 스티커로 봉투 씰 마감하면 깔끔합니다.', timestamp '2026-03-31 17:10:00', timestamp '2026-03-31 17:10:00');
