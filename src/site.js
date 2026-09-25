// 게임이 다른 주소로 옮겨가면 여기만 바꾸면 됨.
export const GAME_URL = 'https://shrimprium.com';
export const CONTACT_EMAIL = 'hvackkw@naver.com';

// 서브경로 배포에서도 절대경로 링크가 동작하도록 base를 붙임.
export const url = (path) => import.meta.env.BASE_URL.replace(/\/$/, '') + path;
