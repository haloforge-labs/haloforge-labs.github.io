import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://haloforgelabs.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Halowin Bubo',
      description: 'Halowin Bubo documentation for AMD Strix Halo laptops and Windows users.',
      favicon: '/favicon.svg',
      disable404Route: true,
      head: [
        { tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: '16x16 32x32' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' } },
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://haloforgelabs.com/og-card-dark.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { property: 'og:image:alt', content: 'Halowin Bubo from HaloForge Labs: a local LLM server for AMD Strix Halo, native on Windows. 51–55 tok/s decode, 29/35 on reasoning checks, 1,364 tok/s prefill, at about 70 W.' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://haloforgelabs.com/og-card-dark.png' } },
        { tag: 'meta', attrs: { name: 'twitter:image:alt', content: 'Halowin Bubo from HaloForge Labs: a local LLM server for AMD Strix Halo, native on Windows. 51–55 tok/s decode, 29/35 on reasoning checks, 1,364 tok/s prefill, at about 70 W.' } },
      ],
      customCss: ['./src/styles/theme.css', './src/styles/docs.css'],
      components: { SiteTitle: './src/components/DocsSiteTitle.astro', Header: './src/components/DocsHeader.astro' },
      sidebar: [
        { label: 'Halowin Bubo', link: '/bubo/' },
        {
          label: 'Documentation',
          items: [
            { label: 'Overview', slug: 'docs' },
            { label: 'System setup', slug: 'docs/system-setup' },
            { label: 'Install', slug: 'docs/install' },
            { label: 'Quickstart', slug: 'docs/quickstart' },
            { label: 'Supported models', slug: 'docs/models' },
            { label: 'Profiles', slug: 'docs/profiles' },
            { label: 'Options', slug: 'docs/options' },
            { label: 'API reference', slug: 'docs/api' },
            { label: 'Known issues', slug: 'docs/known-issues' },
            { label: 'Benchmarks', slug: 'docs/benchmarks' },
            { label: 'Under the hood', slug: 'docs/under-the-hood' },
            { label: 'NPU prefill', slug: 'docs/npu' },
          ],
        },
        { label: 'About HaloForge Labs', link: '/about/' },
      ],
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 2 },
      expressiveCode: { themes: ['github-light', 'github-dark'] },
    }),
  ],
});
