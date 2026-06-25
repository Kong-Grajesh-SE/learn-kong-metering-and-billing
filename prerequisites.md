---
outline: deep
description: Everything you need installed before starting the Kong Metering & Billing Bootcamp.
---

# Prerequisites

::: warning Requires Metering & Billing enabled
This bootcamp requires a Kong Konnect account with the Metering & Billing feature enabled. You also need traffic flowing through Kong Gateway or AI Gateway.
:::

## Required tools

| Tool | Purpose | Min Version | Install |
|---|---|---|---|
| **Kong Konnect** | Platform with Metering & Billing | - | [cloud.konghq.com](https://cloud.konghq.com) |
| **Kong Gateway or AI Gateway** | Traffic source for metering | 3.14+ | From earlier bootcamps |
| **Stripe account** | Payment processing (Lab 03) | - | [stripe.com](https://stripe.com) (free test mode) |
| **jq** | Parse JSON responses | 1.6+ | `brew install jq` |
| **Node.js** | Run the docs site locally | 20 LTS | `brew install node@20` |

## Prior bootcamp experience

You should have completed at least one of:

- [API Gateway Bootcamp](../api-gateway-bootcamp/) - Services, Routes, Plugins, Consumers
- [AI Gateway Bootcamp](../ai-gateway-bootcamp/) - AI proxy configuration with LLM traffic

Having live traffic flowing through your gateway is essential - metering needs events to track.

## Konnect setup

1. Sign up at [cloud.konghq.com](https://cloud.konghq.com)
2. Create a Personal Access Token (PAT): **Account** → **Tokens** → **Generate Token**
3. Verify **Metering & Billing** is available in your Konnect sidebar

```bash
export KONNECT_TOKEN="kpat_your_token_here"
```

## Stripe setup (for Lab 03)

1. Sign up at [stripe.com](https://stripe.com) (free)
2. Switch to **Test Mode** in the Stripe dashboard
3. Copy your test API keys from **Developers** → **API keys**

```bash
export STRIPE_TEST_KEY="sk_test_your_key_here"
```

## Verify your setup

```bash
# Konnect connectivity (verify your token works)
curl -s -H "Authorization: Bearer $KONNECT_TOKEN" \
  https://us.api.konghq.com/v2/users/me | jq '.full_name'

# jq
jq --version
# jq-1.6+

# Verify gateway traffic is flowing
curl -s http://localhost:8000/flights | head -5
```

---

*Ready? Start with [Lab 01 - Metering Setup →](/module-01-metering-setup/labs/01-meters-events)*
