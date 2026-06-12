// 사이트 전역 설정. 메뉴 추가/변경은 이 파일만 수정하면 됩니다.

// 도메인 분리 후 게임이 play.shrimprium.com 으로 이동하면 여기만 바꾸면 됨.
export const GAME_URL = 'https://shrimprium.com';

export const SUPPORT_EMAIL = 'hvackkw@naver.com';

// 햄버거 메뉴 그룹 — 게임의 패널 그룹 색상(초록=배우기 / 골드=구경하기 / 시안=지원)
export const MENU_GROUPS = [
  { label: 'LEARN', theme: 'theme-green', items: [
    { label: '가이드', href: '/guide/' },
    { label: 'FAQ', href: '/faq/' },
  ]},
  { label: 'EXPLORE', theme: 'theme-yellow', items: [
    { label: '새우 도감', href: '/shrimpedia/' },
    { label: '소식', href: '/news/' },
    // 커뮤니티는 백엔드 도입 시 주석 해제
    // { label: '커뮤니티', href: '/community/' },
  ]},
  { label: 'SUPPORT', theme: 'theme-blue', items: [
    { label: '문의/지원', href: '/support/' },
  ]},
];

// 서브경로 배포(GitHub Pages 등)에서도 루트 절대경로 링크가 동작하도록 base를 붙여줌.
export const withBase = (path) => import.meta.env.BASE_URL.replace(/\/$/, '') + path;
