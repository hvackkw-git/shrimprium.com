import { url } from '../site.js';

export function GET({ site }) {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL(url('/sitemap-index.xml'), site)}\n`);
}
