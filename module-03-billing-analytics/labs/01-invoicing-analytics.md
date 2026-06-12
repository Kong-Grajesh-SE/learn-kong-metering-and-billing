# Lab 03 - Billing & Analytics

> **Story so far.** You've created meters, defined features, built pricing models and plans, and subscribed customers with entitlements and notifications.
>
> **Problem.** Usage is being tracked and priced, but nobody is getting billed. You need automated invoicing, payment collection, and cost analytics to complete the monetization loop.
>
> **This lab.** You'll configure billing profiles, set up automated invoicing, integrate with Stripe for payments, explore cost analytics for usage visualization, explore the LLM cost database for per-token provider pricing, and create custom price overrides.

---

## Before you start

```bash
# Verify customers and subscriptions from Lab 02
curl -s "$KONNECT_API/v1/metering/customers" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq '.data[] | .name'
# "acme-corp"

curl -s "$KONNECT_API/v1/metering/subscriptions" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq '.data[0] | {customer_id, plan_id}'

# Stripe test key (for payment integration)
export STRIPE_TEST_KEY="sk_test_your_key_here"
```

---

## Step 1 - Configure billing profiles (10 min)

**What it does:** Billing profiles define how and when customers are invoiced — billing address, payment terms, tax settings, and invoice schedule.

### Create a billing profile

```bash
curl -s -X POST "$KONNECT_API/v1/metering/billing-profiles" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "'$CUSTOMER_ID'",
    "billing_email": "billing@acme.example.com",
    "billing_address": {
      "line1": "123 API Street",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94105",
      "country": "US"
    },
    "payment_terms_days": 30,
    "currency": "USD"
  }' | jq '.'
```

### Verify the billing profile

```bash
curl -s "$KONNECT_API/v1/metering/billing-profiles?customer_id=$CUSTOMER_ID" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq '.'
```

**✅ Checkpoint.** Acme Corp has a billing profile with address and payment terms.

---

## Step 2 - Set up automated invoicing (10 min)

**What it does:** Configures automatic invoice generation at the end of each billing period based on metered usage and plan pricing.

### Configure invoicing

```bash
curl -s -X POST "$KONNECT_API/v1/metering/invoice-settings" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "auto_generate": true,
    "generation_day": 1,
    "due_days_after_generation": 30,
    "include_usage_breakdown": true
  }' | jq '.'
```

### Preview an invoice

```bash
# Preview what the current period's invoice would look like
curl -s "$KONNECT_API/v1/metering/invoices/preview?customer_id=$CUSTOMER_ID" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq '.'
```

::: tip Invoice lifecycle
Invoices go through these states: **draft** → **finalized** → **sent** → **paid** (or **overdue**). Auto-generate creates drafts, which you can review before finalizing.
:::

**✅ Checkpoint.** Automated invoicing is configured. You can preview invoices before they're finalized.

---

## Step 3 - Integrate with Stripe (10 min)

**What it does:** Connects Konnect Metering & Billing to Stripe for payment processing. Invoices are synced to Stripe, and payments are collected automatically.

### Connect Stripe to Konnect

```bash
curl -s -X POST "$KONNECT_API/v1/metering/payment-providers" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "stripe",
    "api_key": "'$STRIPE_TEST_KEY'",
    "auto_charge": true
  }' | jq '.'
```

### Link customer to Stripe

```bash
# Create or link a Stripe customer
curl -s -X POST "$KONNECT_API/v1/metering/customers/$CUSTOMER_ID/payment-methods" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "stripe",
    "auto_sync": true
  }' | jq '.'
```

### Verify Stripe connection

```bash
# Check the payment provider status
curl -s "$KONNECT_API/v1/metering/payment-providers" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq '.data[] | {provider, status}'
```

::: tip Stripe test mode
Always use Stripe test mode (`sk_test_...`) for bootcamp exercises. Test mode provides fake card numbers and doesn't process real payments. Switch to live keys only in production.
:::

**✅ Checkpoint.** Stripe is connected. Invoices will be synced to Stripe for payment collection.

---

## Step 4 - Explore cost analytics (5 min)

**What it does:** Cost analytics let you query and visualize feature usage costs across customers, time periods, and dimensions.

### Query usage costs

```bash
# Get cost breakdown by feature
curl -s "$KONNECT_API/v1/metering/analytics/costs?group_by=feature" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq '.'

# Get cost breakdown by customer
curl -s "$KONNECT_API/v1/metering/analytics/costs?group_by=customer" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq '.'
```

### Time-series usage

```bash
# Get daily usage for the past week
curl -s "$KONNECT_API/v1/metering/analytics/usage?interval=day&period=7d" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq '.'
```

**✅ Checkpoint.** You can query costs by feature, customer, and time period.

---

## Step 5 - Explore the LLM cost database (5 min)

**What it does:** The LLM cost database contains per-token pricing for major AI providers (OpenAI, Anthropic, Google, etc.). This enables accurate cost attribution for AI Gateway traffic without manual price configuration.

### Query the LLM cost database

```bash
# List available providers and models
curl -s "$KONNECT_API/v1/metering/llm-costs" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq '.data[] | {provider, model, input_cost_per_token, output_cost_per_token}' \
  | head -30

# Query a specific model
curl -s "$KONNECT_API/v1/metering/llm-costs?provider=openai&model=gpt-4o" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq '.'
```

::: tip Cost attribution for AI Gateway
When you use the AI LLM meter type, Konnect automatically looks up per-token costs from this database. This means your invoices show accurate dollar amounts based on actual provider pricing — no manual price updates needed when providers change rates.
:::

**✅ Checkpoint.** You can query the LLM cost database for per-token pricing across providers and models.

---

## Step 6 - Create custom price overrides (5 min)

**What it does:** Overrides standard pricing for specific customers — useful for enterprise deals, promotional pricing, or volume discounts.

### Create a price override

```bash
curl -s -X POST "$KONNECT_API/v1/metering/price-overrides" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "'$CUSTOMER_ID'",
    "feature_name": "api-requests",
    "override_type": "unit_price",
    "unit_price": 0.0005,
    "reason": "Enterprise volume discount"
  }' | jq '.'
```

### Verify the override

```bash
curl -s "$KONNECT_API/v1/metering/price-overrides?customer_id=$CUSTOMER_ID" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq '.'
```

**✅ Checkpoint.** Acme Corp gets a 50% discount on API requests ($0.0005 vs $0.001 per request).

---

## Summary

| Command / Concept | Purpose |
|---|---|
| Billing profile | Customer billing address, payment terms, currency |
| Automated invoicing | Auto-generate invoices at billing period end |
| Invoice preview | See what the current period's invoice would look like |
| Stripe integration | Sync invoices to Stripe for payment collection |
| Cost analytics | Query and visualize usage costs by feature, customer, time |
| LLM cost database | Per-token pricing for AI providers (auto cost attribution) |
| Price overrides | Custom pricing for specific customers |

---

*[← Lab 02: Pricing & Plans](/module-02-pricing-plans/labs/01-plans-subscriptions) · [Module Overview →](/module-03-billing-analytics/)*
