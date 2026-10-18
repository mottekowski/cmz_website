import { site } from '../config/site';
export function GET() {
  const routes = ['/', '/on-repeat/'];
  const urls = site.indexable
    ? routes.map((route) => `<url><loc>${new URL(route, site.url).href}</loc></url>`).join('')
    : '';
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
