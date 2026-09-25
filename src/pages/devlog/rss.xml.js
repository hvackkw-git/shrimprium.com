import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { url } from '../../site.js';

export async function GET(context) {
  const posts = (await getCollection('devlog')).sort((a, b) => b.data.date - a.data.date);
  return rss({
    title: 'Shrimprium Devlog',
    description: 'Updates and behind-the-scenes notes from the making of Shrimprium.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: url(`/devlog/${post.id}/`),
    })),
  });
}
