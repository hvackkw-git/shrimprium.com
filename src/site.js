// 게임이 다른 주소로 옮겨가면 여기만 바꾸면 됨.
export const GAME_URL = 'https://play.shrimprium.com';
// 스토어 주소. 비워 두면 해당 버튼이 나타나지 않음.
export const APP_STORE_URL = 'https://apps.apple.com/app/shrimprium-shrimp-tank-sim/id6773724320';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.shrimprium.app';
export const CONTACT_EMAIL = 'hvackkw@gmail.com';

// 서브경로 배포에서도 절대경로 링크가 동작하도록 base를 붙임.
export const url = (path) => import.meta.env.BASE_URL.replace(/\/$/, '') + path;
