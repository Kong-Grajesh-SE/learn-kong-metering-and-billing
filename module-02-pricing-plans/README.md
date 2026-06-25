# Module 02 - Pricing & Plans

> **Scenario.** Meters are tracking usage, but there's no pricing attached. You can't charge customers without defining what things cost, packaging them into plans, and creating subscriptions with entitlements.

## Module outcomes

By the end of this module, you will be able to:

- Define features in the product catalog
- Create pricing models (free tier, flat fee, usage-based, tiered)
- Build plans with rate cards
- Create customers and assign subscriptions
- Configure entitlements for access control and usage limits
- Set up notifications and webhook alerts for usage thresholds

## Prerequisites

You have completed Module 01 with meters created and events flowing.

```bash
# Verify Konnect connectivity
curl -s -H "Authorization: Bearer $KONNECT_TOKEN" \
  https://us.api.konghq.com/v2/users/me | jq '.full_name'
```

## What you need

| Tool | Purpose | Minimum |
|---|---|---|
| Kong Konnect | Platform with Metering & Billing | - |
| jq | JSON inspection | 1.6+ |

## Labs

| Lab | Focus | Time |
|---|---|---|
| [01 - Plans & Subscriptions](/module-02-pricing-plans/labs/01-plans-subscriptions) | Features, pricing models, plans, rate cards, subscriptions, entitlements | ~50 min |

## Suggested reading

- [Pricing models](https://developer.konghq.com/metering-and-billing/pricing-models/)
- [Entitlements](https://developer.konghq.com/metering-and-billing/entitlements/)

## Exit ticket

1. Describe the four pricing models available. How would you combine them for a SaaS API with free, standard, and enterprise tiers?

## Common pitfalls

| Symptom | Likely cause | Mitigation |
|---|---|---|
| Entitlement not enforcing limits | Entitlement attached to wrong subscription or plan | Verify subscription-to-plan-to-entitlement chain |

---

*[← Home](/) · [Lab 01 →](/module-02-pricing-plans/labs/01-plans-subscriptions)*
