# Kong Metering & Billing Bootcamp

![Konnect](https://img.shields.io/badge/Konnect-Metering%20%26%20Billing-CCFF00?style=for-the-badge&labelColor=001408)
![Platform: Konnect](https://img.shields.io/badge/Platform-Konnect-CCFF00?style=for-the-badge&labelColor=001408)
![Modules: 3](https://img.shields.io/badge/Modules-3-CCFF00?style=for-the-badge&labelColor=001408)

> 💰 **Meter, price, and monetize every API call and LLM token.**

A hands-on bootcamp for learning Kong Metering & Billing - from usage tracking through pricing models, invoicing, and payment collection.

![Bootcamp Recap](./public/bootcamp_recap.png)

## Overview

| | |
|---|---|
| **Platform** | **Kong Konnect** |
| **Format** | 3 modules, 3 labs (~2 hours) |
| **Flow** | metering setup → pricing & plans → billing & analytics |
| **Platform** | Konnect Metering & Billing + Stripe |

## Bootcamp Modules

| # | Module | Key Topics |
|---|---|---|
| 01 | **Metering Setup** | Meters, events, collectors, deduplication |
| 02 | **Pricing & Plans** | Features, pricing models, plans, subscriptions, entitlements |
| 03 | **Billing & Analytics** | Invoicing, Stripe integration, cost analytics, LLM cost DB |

## Modules

| Module | Topic |
|---|---|
| [Module 01 - Metering Setup](./module-01-metering-setup/) | Create meters and ingest usage events |
| [Module 02 - Pricing & Plans](./module-02-pricing-plans/) | Define pricing models, plans, and subscriptions |
| [Module 03 - Billing & Analytics](./module-03-billing-analytics/) | Configure invoicing, Stripe, and cost analytics |

## Prerequisites

- [Kong Konnect](https://cloud.konghq.com) account (with Metering & Billing enabled)
- Kong Gateway or AI Gateway with traffic flowing (from earlier bootcamps)
- [Stripe](https://stripe.com) account (free test mode for Module 03)
- [jq](https://stedolan.github.io/jq/) 1.6+
- [Node.js](https://nodejs.org/) 20 LTS (for docs site)

## Getting Started

### Run the Docs Site Locally

```bash
npm install
npm run docs:dev
```

The docs site will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run docs:build
npm run docs:preview
```

## Project Structure

```
metering-billing-bootcamp/
├── docs/                              # VitePress documentation source
│   └── .vitepress/                    # VitePress config & theme
├── module-01-metering-setup/
│   ├── README.md                      # Module overview
│   └── labs/
│       └── 01-meters-events.md        # Metering Setup
├── module-02-pricing-plans/
│   ├── README.md                      # Module overview
│   └── labs/
│       └── 01-plans-subscriptions.md  # Pricing & Plans
├── module-03-billing-analytics/
│   ├── README.md                      # Module overview
│   └── labs/
│       └── 01-invoicing-analytics.md  # Billing & Analytics
├── index.md                           # Home page
└── package.json
```

## Stack

| Tool | Purpose |
|---|---|
| [Kong Konnect](https://cloud.konghq.com) | API platform with Metering & Billing |
| [Stripe](https://stripe.com) | Payment processing |
| [VitePress](https://vitepress.dev) | Documentation site |

## License

[MIT](./LICENSE)
