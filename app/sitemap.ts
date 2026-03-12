import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

async function getBlogSlugs(): Promise<{ slug: string; updated: string }[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('posts')
    .select('slug, created_at')
    .not('slug', 'is', null);
  if (error) return [];
  return (data ?? []).map((r) => ({
    slug: r.slug as string,
    updated: (r.created_at as string) || '',
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getBlogSlugs();

  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/request`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  for (const { slug, updated } of slugs) {
    entries.push({
      url: `${baseUrl}/blog/${encodeURIComponent(slug)}`,
      lastModified: updated ? new Date(updated) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  return entries;
}
