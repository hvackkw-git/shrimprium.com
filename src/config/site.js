// 사이트 전역 설정.

// 도메인 분리 후 게임이 play.shrimprium.com 으로 이동하면 여기만 바꾸면 됨.
export const GAME_URL = 'https://shrimprium.com';

export const SUPPORT_EMAIL = 'hvackkw@naver.com';

export const NAV = [
  { label: '게임 소개', href: '/' },
  { label: '데브로그', href: '/devlog/' },
];

// 서브경로 배포(GitHub Pages 등)에서도 루트 절대경로 링크가 동작하도록 base를 붙여줌.
export const withBase = (path) => import.meta.env.BASE_URL.replace(/\/$/, '') + path;
