import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://haloforgelabs.com',
  output: 'static',
  trailingSlash: 'always',
  redirects: { '/bubo/': '/', '/docs/benchmarks/': '/benchmarks/' },
  integrations: [
    starlight({
      title: 'Halowin Bubo',
      description: 'Halowin Bubo documentation for AMD Strix Halo laptops and Windows users.',
      favicon: '/favicon.svg',
      disable404Route: true,
      head: [
        ...(process.argv.includes('dev') ? [{ tag: 'script', attrs: { src: '/review-loader.js', defer: true } }] : []),
        { tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: '16x16 32x32' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' } },
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://haloforgelabs.com/og-card-v011-dark.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { property: 'og:image:alt', content: 'Halowin Bubo from HaloForge Labs: a local LLM server for AMD Strix Halo, native on Windows. 68.5 tok/s writing in a long agent session, 107.5 tok/s on code edits and 1,384 tok/s reading a 32K prompt, at about 70 W.' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://haloforgelabs.com/og-card-v011-dark.png' } },
        { tag: 'meta', attrs: { name: 'twitter:image:alt', content: 'Halowin Bubo from HaloForge Labs: a local LLM server for AMD Strix Halo, native on Windows. 68.5 tok/s writing in a long agent session, 107.5 tok/s on code edits and 1,384 tok/s reading a 32K prompt, at about 70 W.' } },
      ],
      customCss: ['./src/styles/theme.css', './src/styles/docs.css'],
      components: { SiteTitle: './src/components/DocsSiteTitle.astro', Header: './src/components/DocsHeader.astro', Footer: './src/components/DocsFooter.astro' },
      sidebar: [
        { label: 'Benchmarks', link: '/benchmarks/' },
        { label: 'Supported models', link: '/models/' },
        {
          label: 'Documentation',
          items: [
            { label: 'Overview', slug: 'docs' },
            { label: 'System setup', slug: 'docs/system-setup' },
            { label: 'Install', slug: 'docs/install' },
            { label: 'Use the app', slug: 'docs/app' },
            { label: 'Quickstart', slug: 'docs/quickstart' },
            { label: 'Supported models', slug: 'docs/models' },
            { label: 'Profiles', slug: 'docs/profiles' },
            { label: 'Options', slug: 'docs/options' },
            { label: 'API reference', slug: 'docs/api' },
            { label: 'Known issues', slug: 'docs/known-issues' },
            { label: 'How it works', slug: 'docs/under-the-hood' },
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
