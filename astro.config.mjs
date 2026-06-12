// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL/BASE_PATH는 GitHub Pages처럼 서브경로에 배포할 때만 설정 (미설정 시 기본값).
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://shrimprium.com',
  base: process.env.BASE_PATH ?? '/',
});
