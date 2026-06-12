import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Kong Metering & Billing Bootcamp',
  description: 'Kong Partner Enablement - Metering & Billing: meters, pricing models, plans, entitlements, invoicing, cost analytics, and API monetization.',

  srcDir: '..',
  outDir: '../dist',
  cacheDir: '../.vitepress-cache',

  base: '/learn-kong-metering-and-billing/',

  appearance: 'force-dark',
  cleanUrls: true,

  ignoreDeadLinks: true,

  rewrites: {
    'module-01-metering-setup/README.md': 'module-01-metering-setup/index.md',
    'module-02-pricing-plans/README.md': 'module-02-pricing-plans/index.md',
    'module-03-billing-analytics/README.md': 'module-03-billing-analytics/index.md',
  },

  srcExclude: [
    'node_modules/**',
    'dist/**',
    'docs/.vitepress/**',
    '.vitepress-cache/**',
    'README.md',
    '.github/**',
  ],

  head: [
    ['link', { rel: 'icon',           href: '/learn-kong-metering-and-billing/favicon.png', type: 'image/png', sizes: '32x32' }],
    ['link', { rel: 'shortcut icon',  href: '/learn-kong-metering-and-billing/favicon.png', type: 'image/png' }],
    ['link', { rel: 'apple-touch-icon', href: '/learn-kong-metering-and-billing/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#000F06' }],
    ['meta', { property: 'og:title', content: 'Kong Metering & Billing Bootcamp' }],
    ['meta', { property: 'og:description', content: 'Hands-on API monetization: meters, pricing, billing, and cost analytics' }],
    ['meta', { property: 'og:image', content: '/learn-kong-metering-and-billing/kong-gateway-logo.svg' }],
  ],

  markdown: {
    theme: { light: 'github-light', dark: 'one-dark-pro' },
    lineNumbers: true,
  },

  themeConfig: {
    logo: '/kong-logomark-lime.svg',
    siteTitle: 'Metering & Billing Bootcamp',

    nav: [
      { text: '🏠 Home', link: '/' },
      {
        text: '🚀 Getting Started',
        items: [
          { text: '✅ Prerequisites', link: '/prerequisites' },
        ],
      },
      {
        text: '📚 Modules',
        items: [
          { text: '📊 Module 01: Metering Setup',       link: '/module-01-metering-setup/' },
          { text: '   └─ Lab 01: Meters & Events',       link: '/module-01-metering-setup/labs/01-meters-events' },
          { text: '💰 Module 02: Pricing & Plans',       link: '/module-02-pricing-plans/' },
          { text: '   └─ Lab 01: Plans & Subscriptions', link: '/module-02-pricing-plans/labs/01-plans-subscriptions' },
          { text: '🧾 Module 03: Billing & Analytics',   link: '/module-03-billing-analytics/' },
          { text: '   └─ Lab 01: Invoicing & Analytics', link: '/module-03-billing-analytics/labs/01-invoicing-analytics' },
        ],
      },
      {
        text: '🔗 Resources',
        items: [
          { text: '📖 Metering & Billing Docs', link: 'https://developer.konghq.com/metering-and-billing/', target: '_blank' },
          { text: '📖 Konnect Docs',            link: 'https://developer.konghq.com/konnect/', target: '_blank' },
          { text: '☁️ Konnect',                 link: 'https://cloud.konghq.com', target: '_blank' },
        ],
      },
      { text: '🏠 All Bootcamps', link: 'https://kong-grajesh-se.github.io/learn-kong-bootcamps/', target: '_blank' },
    ],

    sidebar: [
      {
        text: '🚀 Getting Started',
        collapsed: false,
        items: [
          { text: '✅ Prerequisites', link: '/prerequisites' },
        ],
      },
      {
        text: '📊 Module 01 - Metering Setup',
        collapsed: false,
        items: [
          { text: '📋 Overview',                  link: '/module-01-metering-setup/' },
          { text: '📊 Lab 01: Meters & Events',   link: '/module-01-metering-setup/labs/01-meters-events' },
        ],
      },
      {
        text: '💰 Module 02 - Pricing & Plans',
        collapsed: false,
        items: [
          { text: '📋 Overview',                          link: '/module-02-pricing-plans/' },
          { text: '💰 Lab 01: Plans & Subscriptions',     link: '/module-02-pricing-plans/labs/01-plans-subscriptions' },
        ],
      },
      {
        text: '🧾 Module 03 - Billing & Analytics',
        collapsed: false,
        items: [
          { text: '📋 Overview',                          link: '/module-03-billing-analytics/' },
          { text: '🧾 Lab 01: Invoicing & Analytics',     link: '/module-03-billing-analytics/labs/01-invoicing-analytics' },
        ],
      },
    ],

    editLink: {
      pattern: 'https://github.com/Kong-Grajesh-SE/learn-kong-metering-and-billing/edit/main/:path',
      text: 'Edit this page on GitHub',
    },

    lastUpdated: {
      text: 'Updated',
      formatOptions: { dateStyle: 'medium' },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Kong-Grajesh-SE/learn-kong-metering-and-billing' },
    ],

    footer: {
      message: 'Kong Metering & Billing Bootcamp - Partner Enablement',
      copyright: '© Kong Inc. 2026 - The AI Connectivity Company',
    },

    search: { provider: 'local' },
  },
})
