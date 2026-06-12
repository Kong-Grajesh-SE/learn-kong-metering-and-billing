# Module 03 - Billing & Analytics

> **Scenario.** Usage is being tracked and priced, but nobody is getting billed. You need automated invoicing, payment collection, and cost analytics to complete the monetization loop.

## Module outcomes

By the end of this module, you will be able to:

- Configure billing profiles and automated invoicing
- Integrate with Stripe for payment collection
- Explore cost analytics for usage visualization
- Use the LLM cost database for per-token provider pricing
- Create custom price overrides for specific customers

## Prerequisites

You have completed Module 02 with pricing models, plans, and subscriptions configured.

```bash
# Verify Konnect connectivity
curl -s -H "Authorization: Bearer $KONNECT_TOKEN" \
  https://us.api.konghq.com/v2/users/me | jq '.full_name'
```

## What you need

| Tool | Purpose | Minimum |
|---|---|---|
| Kong Konnect | Platform with Metering & Billing | - |
| Stripe account | Payment processing | test mode |
| jq | JSON inspection | 1.6+ |

## Labs

| Lab | Focus | Time |
|---|---|---|
| [01 - Invoicing & Analytics](/module-03-billing-analytics/labs/01-invoicing-analytics) | Billing profiles, invoicing, Stripe integration, cost analytics, LLM cost DB | ~40 min |

## Suggested reading

- [Invoicing](https://developer.konghq.com/metering-and-billing/invoicing/)
- [Stripe integration](https://developer.konghq.com/metering-and-billing/stripe/)
- [Cost analytics](https://developer.konghq.com/metering-and-billing/cost-analytics/)

## Exit ticket

1. What is the LLM cost database, and how does it help with AI Gateway cost attribution?

## Common pitfalls

| Symptom | Likely cause | Mitigation |
|---|---|---|
| Stripe webhook failures | Webhook endpoint not accessible or secret mismatch | Verify endpoint URL accessibility and webhook signing secret |
| Cost analytics showing $0 | LLM cost database missing model entry or wrong provider | Check provider/model names match the cost database entries |

---

*[← Home](/) · [Lab 01 →](/module-03-billing-analytics/labs/01-invoicing-analytics)*
