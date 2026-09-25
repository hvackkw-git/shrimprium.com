// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages 미리보기처럼 서브경로에 배포할 때만 SITE_URL/BASE_PATH를 설정.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://shrimprium.com',
  base: process.env.BASE_PATH ?? '/',
});
