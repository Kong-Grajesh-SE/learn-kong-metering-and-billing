# Lab 02 - Pricing & Plans

> **Story so far.** You've created meters for API requests, LLM tokens, and compute units. Usage events are flowing in and being tracked with deduplication.
>
> **Problem.** Meters track usage, but there's no pricing attached. You can't charge customers without defining what things cost, packaging them into plans, and creating subscriptions.
>
> **This lab.** You'll define features in the product catalog, create pricing models (free tier, flat fee, usage-based, tiered), build plans with rate cards, create customers and subscriptions, configure entitlements for access and usage limits, and set up notifications for usage thresholds.

---

## Before you start

```bash
# Verify meters from Lab 01 exist
curl -s "$KONNECT_API/v1/metering/meters" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq '.data[] | .name'
# "api-requests"
# "llm-tokens"
# "compute-units"
```

---

## Step 1 - Define features in the product catalog (10 min)

**What it does:** Features are the billable units in your product catalog. Each feature maps to a meter and defines what customers are paying for.

### Create features

```bash
# Feature: API Requests
curl -s -X POST "$KONNECT_API/v1/metering/features" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "api-requests",
    "display_name": "API Requests",
    "description": "API requests through Kong Gateway",
    "meter_id": "'$API_METER_ID'"
  }' | jq '.'

# Feature: LLM Tokens
curl -s -X POST "$KONNECT_API/v1/metering/features" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "llm-tokens",
    "display_name": "LLM Tokens",
    "description": "AI LLM token consumption",
    "meter_id": "'$AI_METER_ID'"
  }' | jq '.'

# Feature: Compute Units
curl -s -X POST "$KONNECT_API/v1/metering/features" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "compute-units",
    "display_name": "Compute Units",
    "description": "Custom compute resource consumption",
    "meter_id": "'$GENERIC_METER_ID'"
  }' | jq '.'
```

**✅ Checkpoint.** Three features are defined in the product catalog, each linked to a meter.

---

## Step 2 - Create pricing models (15 min)

**What it does:** Pricing models define how features are priced. Kong supports four models that can be combined for sophisticated pricing strategies.

### Understand the four pricing models

| Model | Description | Example |
|---|---|---|
| **Free tier** | No charge up to a usage limit | First 1,000 API calls free |
| **Flat fee** | Fixed monthly/annual charge | $99/month platform fee |
| **Usage-based** | Pay per unit consumed | $0.001 per API request |
| **Tiered** | Price changes at usage thresholds | 0-1K: free, 1K-10K: $0.005, 10K+: $0.001 |

### Create a usage-based pricing model

```bash
curl -s -X POST "$KONNECT_API/v1/metering/pricing-models" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "api-pay-per-use",
    "display_name": "API Pay-Per-Use",
    "type": "usage_based",
    "unit_price": 0.001,
    "currency": "USD",
    "feature_id": "'$(curl -s "$KONNECT_API/v1/metering/features" \
      -H "Authorization: Bearer $KONNECT_TOKEN" \
      | jq -r '.data[] | select(.name == "api-requests") | .id')'"
  }' | jq '.'
```

### Create a tiered pricing model for LLM tokens

```bash
curl -s -X POST "$KONNECT_API/v1/metering/pricing-models" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "llm-tiered",
    "display_name": "LLM Tiered Pricing",
    "type": "tiered",
    "tiers": [
      {"up_to": 10000, "unit_price": 0.00},
      {"up_to": 100000, "unit_price": 0.0001},
      {"up_to": null, "unit_price": 0.00005}
    ],
    "currency": "USD",
    "feature_id": "'$(curl -s "$KONNECT_API/v1/metering/features" \
      -H "Authorization: Bearer $KONNECT_TOKEN" \
      | jq -r '.data[] | select(.name == "llm-tokens") | .id')'"
  }' | jq '.'
```

::: tip Combining pricing models
Real-world plans often combine models: a flat monthly fee ($99/mo) + usage-based API calls ($0.001/req) + free tier for the first 1,000 LLM tokens. Build each model separately and combine them in a plan.
:::

**✅ Checkpoint.** You have usage-based and tiered pricing models defined.

---

## Step 3 - Build plans with rate cards (10 min)

**What it does:** Plans package pricing models into offerings that customers subscribe to. Rate cards define which pricing models are included in each plan.

### Create a plan

```bash
curl -s -X POST "$KONNECT_API/v1/metering/plans" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "developer",
    "display_name": "Developer Plan",
    "description": "For individual developers and small teams",
    "billing_period": "monthly"
  }' | jq '.'
```

### Add rate cards to the plan

```bash
export PLAN_ID=$(curl -s "$KONNECT_API/v1/metering/plans" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq -r '.data[] | select(.name == "developer") | .id')

# Add API requests rate card
curl -s -X POST "$KONNECT_API/v1/metering/plans/$PLAN_ID/rate-cards" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pricing_model_id": "'$(curl -s "$KONNECT_API/v1/metering/pricing-models" \
      -H "Authorization: Bearer $KONNECT_TOKEN" \
      | jq -r '.data[] | select(.name == "api-pay-per-use") | .id')'"
  }' | jq '.'
```

**✅ Checkpoint.** A Developer plan exists with rate cards linking to your pricing models.

---

## Step 4 - Create customers and subscriptions (5 min)

**What it does:** Creates customer records and subscribes them to plans.

### Create a customer

```bash
curl -s -X POST "$KONNECT_API/v1/metering/customers" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "acme-corp",
    "display_name": "Acme Corporation",
    "email": "billing@acme.example.com"
  }' | jq '.'
```

### Create a subscription

```bash
export CUSTOMER_ID=$(curl -s "$KONNECT_API/v1/metering/customers" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq -r '.data[] | select(.name == "acme-corp") | .id')

curl -s -X POST "$KONNECT_API/v1/metering/subscriptions" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "'$CUSTOMER_ID'",
    "plan_id": "'$PLAN_ID'",
    "start_date": "'$(date -u +%Y-%m-%d)'"
  }' | jq '.'
```

**✅ Checkpoint.** Acme Corp is a customer subscribed to the Developer plan.

---

## Step 5 - Configure entitlements (5 min)

**What it does:** Entitlements define what a subscription grants access to and any usage limits. They connect features to subscriptions with optional caps.

### Create an entitlement with usage limits

```bash
export SUBSCRIPTION_ID=$(curl -s "$KONNECT_API/v1/metering/subscriptions" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq -r '.data[0].id')

curl -s -X POST "$KONNECT_API/v1/metering/entitlements" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subscription_id": "'$SUBSCRIPTION_ID'",
    "feature_id": "'$(curl -s "$KONNECT_API/v1/metering/features" \
      -H "Authorization: Bearer $KONNECT_TOKEN" \
      | jq -r '.data[] | select(.name == "api-requests") | .id')'",
    "usage_limit": 100000,
    "limit_type": "soft"
  }' | jq '.'
```

::: tip Soft vs Hard limits
- **Soft limit:** Usage continues past the limit, but a notification is triggered. Good for fair-use policies.
- **Hard limit:** Usage is blocked at the limit. Good for strict quota enforcement.
:::

**✅ Checkpoint.** Entitlements link the subscription to features with a 100K request soft limit.

---

## Step 6 - Set up notifications (5 min)

**What it does:** Configures webhook alerts when usage reaches specified thresholds.

### Create a notification rule

```bash
curl -s -X POST "$KONNECT_API/v1/metering/notifications" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "usage-80-percent",
    "display_name": "80% Usage Alert",
    "type": "webhook",
    "threshold_percent": 80,
    "webhook_url": "https://hooks.example.com/metering-alerts"
  }' | jq '.'
```

**✅ Checkpoint.** A notification fires at 80% of the usage limit. In production, this would alert your billing or customer success team.

---

## Summary

| Command / Concept | Purpose |
|---|---|
| Feature | Billable unit in the product catalog (linked to a meter) |
| Pricing model | How a feature is priced (free, flat, usage-based, tiered) |
| Plan | Package of pricing models for a subscription |
| Rate card | Links a pricing model to a plan |
| Customer | Billing entity (organization or individual) |
| Subscription | Customer assigned to a plan with a start date |
| Entitlement | Access and usage limits for a feature within a subscription |
| Notification | Webhook alert at usage thresholds |

---

*[← Lab 01: Metering Setup](/module-01-metering-setup/labs/01-meters-events) · [Next → Lab 03: Billing & Analytics](/module-03-billing-analytics/labs/01-invoicing-analytics)*
