// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages 미리보기처럼 서브경로에 배포할 때만 SITE_URL/BASE_PATH를 설정.
const site = process.env.SITE_URL ?? 'https://shrimprium.com';
const base = process.env.BASE_PATH ?? '/';
// public/ 의 정적 페이지는 사이트맵에 자동으로 들어가지 않아 직접 넣음.
const staticPages = ['privacy.html', 'delete-account.html'].map((page) => new URL(base.replace(/\/?$/, '/') + page, site).href);

export default defineConfig({
  site,
  base,
  integrations: [sitemap({ customPages: staticPages })],
});
