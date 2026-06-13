// 사이트 전역 설정. 메뉴 추가/변경은 이 파일만 수정하면 됩니다.

// 도메인 분리 후 게임이 play.shrimprium.com 으로 이동하면 여기만 바꾸면 됨.
export const GAME_URL = 'https://shrimprium.com';

export const SUPPORT_EMAIL = 'hvackkw@naver.com';

// 헤더 아래 가로 메뉴. 항목을 추가/변경하려면 이 배열만 수정하면 됨.
export const NAV = [
  { label: '게임소개', href: '/about/' },
  { label: '개발참여', href: '/participate/' },
  { label: '새우백과', href: '/guide/' },
  { label: '개발로그', href: '/news/' },
  { label: '커뮤니티', href: '/community/' },
];

// 서브경로 배포(GitHub Pages 등)에서도 루트 절대경로 링크가 동작하도록 base를 붙여줌.
export const withBase = (path) => import.meta.env.BASE_URL.replace(/\/$/, '') + path;
