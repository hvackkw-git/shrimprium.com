// 새우 위키 데이터 — 게임 본체(src/genetics/genetics.js)의 실제 수치를 그대로 옮김.
// 별점: computeShrimpStars(1 + 색상점수 + 패턴점수), 돌연변이 품종은 게임에 정의된 고정 별점.
// 스프라이트: 게임 assets/shrimp_variants 의 4프레임 시트(256×32, 프레임 64×32).

// 유전자 색상 축 (게임 COLORS + 표시 hex)
export const GENE_COLORS = [
  { key: 'RED',    label: '레드',   hex: '#ff4757' },
  { key: 'BLUE',   label: '블루',   hex: '#3F6FF3' },
  { key: 'YELLOW', label: '옐로우', hex: '#F3C83F' },
  { key: 'BLACK',  label: '블랙',   hex: '#3A3A3A' },
  { key: 'WILD',   label: '야생',   hex: '#8B7355' },
  { key: 'WHITE',  label: '화이트', hex: '#F0F0F8' },
];

export const PATTERNS = [
  { key: 'NONE',     label: '무지',   stars: 0,   desc: '패턴 없음. 색 자체의 매력으로 승부합니다.' },
  { key: 'SPECKLE',  label: '스페클', stars: 0.5, desc: '몸 전체에 점무늬가 흩뿌려집니다.' },
  { key: 'BACKLINE', label: '백라인', stars: 0.5, desc: '등을 따라 한 줄의 라인이 흐릅니다.' },
  { key: 'RILI',     label: '릴리',   stars: 1,   desc: '머리·꼬리만 색이 남고 몸통은 투명한 최상위 패턴.' },
];

export const OPACITY_TIERS = [
  { tier: 1, label: '불투명', range: '80~100%', desc: '색이 가장 진하게 발현된 상태. 특수 품종 판정에 자주 요구됩니다.' },
  { tier: 2, label: '반투명', range: '40~80%',  desc: '중간 단계. 교배를 거듭해 위/아래로 이동합니다.' },
  { tier: 3, label: '투명',   range: '0~40%',   desc: '젤리 계열 품종의 조건. 유리처럼 비쳐 보입니다.' },
];

// 별점 → 등급 (게임 STAR_GRADE_KEYS와 동일)
export const STAR_GRADES = [
  { minStars: 4, label: '레전드', color: '#FF8C00' },
  { minStars: 3, label: '에픽',   color: '#9B59B6' },
  { minStars: 2, label: '유니크', color: '#3498DB' },
  { minStars: 1, label: '레어',   color: '#2ECC71' },
  { minStars: 0, label: '노멀',   color: '#E0E0E0' },
];
export const gradeOf = (stars) => STAR_GRADES.find((g) => stars >= g.minStars) ?? STAR_GRADES.at(-1);

export const CATEGORIES = [
  { key: 'base',      label: '기본색' },
  { key: 'composite', label: '조합색' },
  { key: 'special',   label: '패턴·특수' },
  { key: 'mutation',  label: '돌연변이' },
];

// sprite: /assets/shrimp/shrimp-4frame-<sprite>.png · overlay: 패턴 시트(BACKLINE/RILI/SPECKLE)
export const BREEDS = [
  // ── 기본색 (색상 가중치 우세종) ──
  { id: 'wild_natural', cat: 'base', name: '야생 새우', hex: '#8B7355', sprite: 'wild_natural', stars: 1,
    recipe: '초기 개체의 기본 형태 (야생 유전자 80%)',
    desc: '모든 계통의 시작점. 수수하지만 어떤 색으로든 뻗어나갈 수 있는 가능성을 품고 있습니다.' },
  { id: 'cherry_red', cat: 'base', name: '체리 새우', hex: '#ff4757', sprite: 'cherry_red', stars: 1.5,
    recipe: '레드 유전자 우세 (교배 시 레드 강화 선택)',
    desc: '선명한 빨간색의 대표 관상새우. 레드 계열 강화의 출발점입니다.' },
  { id: 'blue_velvet', cat: 'base', name: '블루벨벳 새우', hex: '#3F6FF3', sprite: 'blue_velvet', stars: 1.5,
    recipe: '블루 유전자 우세 (교배 시 블루 강화 선택)',
    desc: '벨벳처럼 부드러운 파란빛. 블루 계열 특수종의 재료가 됩니다.' },
  { id: 'yellow_goldenback', cat: 'base', name: '옐로우 새우', hex: '#F3C83F', sprite: 'yellow_goldenback', stars: 1.5,
    recipe: '옐로우 유전자 우세 (교배 시 옐로우 강화 선택)',
    desc: '수조를 환하게 만드는 밝은 노란색.' },
  { id: 'black_king', cat: 'base', name: '블랙 새우', hex: '#3A3A3A', sprite: 'black_king', stars: 1.5,
    recipe: '블랙 유전자 우세 (교배 시 블랙 강화 선택)',
    desc: '묵직한 검은색. 제브라·악마 새우 등 고급 조합의 핵심 재료.' },
  { id: 'white_pearl', cat: 'base', name: '알비노 새우', hex: '#F0F0F8', sprite: 'white_pearl', stars: 4.5,
    recipe: '화이트 유전자 우세 — 돌연변이(2%)로만 발현되는 색',
    desc: '자연 상태에선 나오지 않는 화이트 유전자의 순수 발현체. 모든 돌연변이 특수종의 열쇠입니다.' },

  // ── 조합색 (두 색 각각 40% 이상) ──
  { id: 'dark_red', cat: 'composite', name: '검붉은 새우', hex: '#5C0F0F', sprite: 'dark_red', stars: 2,
    recipe: '블랙 40% + 레드 40% 이상',
    desc: '와인처럼 깊게 가라앉은 붉은색. 블랙과 레드 계통을 반씩 섞어 만듭니다.' },
  { id: 'dark_blue', cat: 'composite', name: '검푸른 새우', hex: '#0F1F5C', sprite: 'dark_blue', stars: 2,
    recipe: '블랙 40% + 블루 40% 이상',
    desc: '심해의 어둠을 닮은 남색. 조명 아래에서 진가가 드러납니다.' },
  { id: 'green_jade', cat: 'composite', name: '초록 새우', hex: '#3F9A3F', sprite: 'green_jade', stars: 2,
    recipe: '옐로우 40% + 블루 40% 이상',
    desc: '옐로우와 블루가 만나 태어나는 비취색. 수초 사이에선 숨은그림찾기가 됩니다.' },
  { id: 'purple_galaxy', cat: 'composite', name: '보라 새우', hex: '#7A3FB3', sprite: 'purple_galaxy', stars: 2,
    recipe: '레드 40% + 블루 40% 이상',
    desc: '레드와 블루의 균형이 만드는 고귀한 보라색.' },
  { id: 'orange_sunkist', cat: 'composite', name: '오렌지 새우', hex: '#E8850A', sprite: 'orange_sunkist', stars: 2,
    recipe: '레드 40% + 옐로우 40% 이상',
    desc: '선키스트 오렌지를 닮은 따뜻한 주황색.' },

  // ── 패턴·투명도 특수 품종 ──
  { id: 'fire_red', cat: 'special', name: '파이어레드 새우', hex: '#ff4757', sprite: 'cherry_red', stars: 1.5,
    recipe: '레드 우세 + 불투명(1티어)',
    desc: '체리보다 진하고 균일하게 꽉 찬 붉은색. 불투명도를 끝까지 끌어올려야 합니다.' },
  { id: 'red_rili', cat: 'special', name: '레드릴리 새우', hex: '#ff4757', sprite: 'cherry_red', overlay: 'RILI', stars: 2.5,
    recipe: '레드 우세 + 불투명(1티어) + 릴리 패턴',
    desc: '붉은 머리·꼬리와 투명한 몸통의 대비가 매력. 릴리 패턴의 대표작입니다.' },
  { id: 'red_rili_jelly', cat: 'special', name: '레드릴리 젤리 새우', hex: '#ff8a94', sprite: 'cherry_red', overlay: 'RILI', stars: 2.5,
    recipe: '레드 우세 + 투명(3티어) + 릴리 패턴',
    desc: '릴리 패턴에 몸 전체가 젤리처럼 비치는 희귀 변형.' },
  { id: 'blue_dream', cat: 'special', name: '블루드림 새우', hex: '#3F6FF3', sprite: 'blue_velvet', stars: 1.5,
    recipe: '블루 우세 + 불투명(1티어)',
    desc: '꿈결처럼 깊고 진한 파란색의 완성형.' },
  { id: 'blue_jelly', cat: 'special', name: '블루젤리 새우', hex: '#8fb0ff', sprite: 'blue_velvet', stars: 1.5,
    recipe: '블루 우세 + 투명(3티어)',
    desc: '빛이 통과하는 맑은 파란색. 투명도를 일부러 낮춰 만드는 품종입니다.' },
  { id: 'black_king_bean', cat: 'special', name: '블랙킹콩 새우', hex: '#1c1c1c', sprite: 'black_king', stars: 1.5,
    recipe: '블랙 우세 + 불투명(1티어)',
    desc: '빈틈없이 새까만 최고급 블랙. 킹콩이라는 이름값을 합니다.' },
  { id: 'goldenback', cat: 'special', name: '골든백 새우', hex: '#F3C83F', sprite: 'yellow_goldenback', stars: 1.5,
    recipe: '옐로우 우세 + 불투명(1티어)',
    desc: '등을 따라 금빛 라인이 흐르는 옐로우의 완성형.' },
  { id: 'red_backline', cat: 'special', name: '레드백라인 새우', hex: '#ff4757', sprite: 'cherry_red', overlay: 'BACKLINE', stars: 2,
    recipe: '레드 우세 + 백라인 패턴',
    desc: '붉은 몸 위로 등줄기 라인이 또렷하게 흐릅니다.' },
  { id: 'blue_backline', cat: 'special', name: '블루백라인 새우', hex: '#3F6FF3', sprite: 'blue_velvet', overlay: 'BACKLINE', stars: 2,
    recipe: '블루 우세 + 백라인 패턴',
    desc: '파란 몸과 등 라인의 조합. 위에서 내려다볼 때 가장 아름답습니다.' },
  { id: 'red_speckle', cat: 'special', name: '레드스페클 새우', hex: '#ff4757', sprite: 'cherry_red', overlay: 'SPECKLE', stars: 2,
    recipe: '레드 우세 + 스페클 패턴',
    desc: '붉은 바탕에 흩뿌려진 점무늬가 개체마다 다른 표정을 만듭니다.' },

  // ── 돌연변이 특수 품종 (화이트 유전자 조합 · 게임 고정 별점) ──
  { id: 'crystalred_shrimp', cat: 'mutation', name: '크리스탈 레드 새우', hex: '#ff5c69', sprite: 'crystalred_shrimp', stars: 5,
    recipe: '화이트 50% + 레드 40% 이상',
    desc: '홍백 무늬의 명품 새우. 실제 쉬림프 취미에서도 최고 인기 품종입니다.' },
  { id: 'zebra_shrimp', cat: 'mutation', name: '제브라 새우', hex: '#d8d8e0', sprite: 'zebra_shrimp', stars: 4.5,
    recipe: '화이트 50% + 블랙 40% 이상',
    desc: '흑백 줄무늬가 선명한 희귀종.' },
  { id: 'rainbow_shrimp', cat: 'mutation', name: '무지개 새우', hex: '#ff9ff3', sprite: 'rainbow_shrimp', stars: 5,
    recipe: '화이트 20% + 레드·옐로우·블루 각 25% 이상',
    desc: '세 가지 원색이 공존하는 기적의 배합. 각도마다 다른 색이 떠오릅니다.' },
  { id: 'aurora_shrimp', cat: 'mutation', name: '오로라 새우', hex: '#7ce8ff', sprite: 'aurora_shrimp', stars: 5,
    recipe: '화이트 40% + 블루 25% + 레드 25% 이상',
    desc: '보는 각도에 따라 색이 흐르는 전설의 품종.' },
  { id: 'starlight_shrimp', cat: 'mutation', name: '별빛 새우', hex: '#ffe28a', sprite: 'starlight_shrimp', stars: 5,
    recipe: '화이트 40% + 블랙 25% + 옐로우 25% 이상',
    desc: '밤하늘에 금빛 별이 박힌 듯한 무늬.' },
  { id: 'radioactive_shrimp', cat: 'mutation', name: '방사능 새우', hex: '#7dff5e', sprite: 'radioactive_shrimp', stars: 5,
    recipe: '화이트 40% + 옐로우 25% + 블루 25% 이상',
    desc: '어둠 속에서 빛나는 듯한 형광 그린. 위험해 보이지만 무해합니다. 아마도.' },
  { id: 'ghost_shrimp', cat: 'mutation', name: '유령 새우', hex: '#bfe8ff', sprite: 'ghost_shrimp', stars: 4.5,
    recipe: '화이트 70% + 블루 10% + 블랙 10% 이상',
    desc: '있는 듯 없는 듯, 수조를 떠도는 반투명 실루엣.' },
  { id: 'devil_shrimp', cat: 'mutation', name: '악마 새우', hex: '#b3232f', sprite: 'black_king', stars: 4.5,
    recipe: '화이트 40% + 레드 25% + 블랙 25% 이상',
    desc: '검붉은 기운을 두른 위험한 미모.' },
  { id: 'princess_shrimp', cat: 'mutation', name: '분홍 새우', hex: '#ffb3c8', sprite: 'princess_shrimp', stars: 4.5,
    recipe: '화이트 30% + 레드 30% + 야생 30% 이상',
    desc: '사랑스러운 파스텔 핑크. 공주님 대접이 필요합니다.' },
  { id: 'mech_shrimp', cat: 'mutation', name: '기계 새우', hex: '#9aa7b8', sprite: 'mech_shrimp', stars: 5,
    recipe: '화이트 30% + 블랙 30% + 야생 30% 이상',
    desc: '관절에서 기계음이 나는 것 같은 메탈릭 바디.' },
  { id: 'digital_shrimp', cat: 'mutation', name: '디지털 새우', hex: '#5effd0', sprite: 'digital_shrimp1', stars: 5,
    recipe: '화이트 80% + 야생 10% 이상',
    desc: '픽셀이 흐트러지는 글리치 새우. 존재 자체가 버그인지 기적인지는 아직 논쟁 중.' },
];

export const spriteUrl = (sprite) => `/assets/shrimp/shrimp-4frame-${sprite}.png`;
export const overlayUrl = (overlay) => `/assets/shrimp/${overlay}.png`;
