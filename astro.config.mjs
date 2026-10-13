import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://haloforgelabs.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'HaloForge Labs',
      description: 'Halowin Bubo documentation for AMD Strix Halo laptops and Windows users.',
      favicon: '/favicon.svg',
      disable404Route: true,
      head: [
        { tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: '16x16 32x32' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' } },
      ],
      customCss: ['./src/styles/theme.css', './src/styles/docs.css'],
      components: { SiteTitle: './src/components/DocsSiteTitle.astro' },
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
