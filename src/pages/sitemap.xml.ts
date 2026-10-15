import { site } from '../config/site';
export function GET() {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site.indexable ? `<url><loc>${site.url}/</loc></url>` : ''}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
