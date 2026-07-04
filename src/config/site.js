// 사이트 전역 설정. 메뉴 추가/변경은 이 파일만 수정하면 됩니다.

// 도메인 분리 후 게임이 play.shrimprium.com 으로 이동하면 여기만 바꾸면 됨.
export const GAME_URL = 'https://shrimprium.com';

export const SUPPORT_EMAIL = 'hvackkw@naver.com';

// 헤더 아래 가로 메뉴. 항목을 추가/변경하려면 이 배열만 수정하면 됨.
export const NAV = [
  { label: '게임소개', href: '/about/' },
  { label: '새우위키', href: '/wiki/' },
  { label: '미니게임', href: '/game/' },
  { label: '스튜디오', href: '/studio/' },
  { label: '수조갤러리', href: '/gallery/' },
  { label: '사육가이드', href: '/guide/' },
  { label: '개발로그', href: '/news/' },
  { label: '커뮤니티', href: '/community/' },
];

// 모바일 하단 탭바 (앱 스타일 5탭). 홈 탭은 경로가 정확히 일치할 때만 활성.
export const TAB_NAV = [
  { label: '홈', href: '/', icon: '🏠' },
  { label: '위키', href: '/wiki/', icon: '📖' },
  { label: '게임', href: '/game/', icon: '🎮' },
  { label: '스튜디오', href: '/studio/', icon: '🎨' },
  { label: '갤러리', href: '/gallery/', icon: '🐚' },
];

// 서브경로 배포(GitHub Pages 등)에서도 루트 절대경로 링크가 동작하도록 base를 붙여줌.
export const withBase = (path) => import.meta.env.BASE_URL.replace(/\/$/, '') + path;
