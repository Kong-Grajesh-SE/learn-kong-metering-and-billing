# Lab 01 - Metering Setup

> **Story so far.** Your APIs are running on Kong Gateway and AI Gateway. Developers are consuming them, but you have no visibility into who is using what, how much, or how often.
>
> **Problem.** Without usage metering, you can't bill customers, enforce usage limits, or understand consumption patterns. You're flying blind.
>
> **This lab.** You'll understand metering concepts (meters, events, collectors), create meters for API gateway traffic, AI LLM token usage, and generic custom usage, ingest usage events, and verify event processing with deduplication.

---

## Before you start

```bash
# Verify Konnect connectivity
curl -s -H "Authorization: Bearer $KONNECT_TOKEN" \
  https://us.api.konghq.com/v2/users/me | jq '.full_name'

# Verify jq
jq --version
```

You need a Kong Konnect account with Metering & Billing enabled.

```bash
export KONNECT_TOKEN="kpat_your_token_here"
export KONNECT_API="https://us.api.konghq.com"
```

---

## Step 1 - Understand metering concepts (5 min)

**What it does:** Before creating meters, you need to understand the core concepts of Kong's metering system.

### Core concepts

| Concept | Description |
|---|---|
| **Meter** | A named counter that tracks a specific type of usage (API calls, tokens, compute units) |
| **Event** | A single usage record ingested into a meter (e.g., "user X made 1 API call at time T") |
| **Collector** | The mechanism that feeds events into meters (gateway plugin, API ingestion, or custom) |
| **Deduplication** | Events with the same unique ID are counted only once, preventing double-billing |

### Types of meters

| Type | Source | Example |
|---|---|---|
| **API Gateway** | Kong Gateway traffic | Requests per service, bytes transferred |
| **AI LLM** | AI Gateway token usage | Prompt tokens, completion tokens per model |
| **Generic** | Custom API ingestion | Compute hours, storage GB, custom units |

::: tip Start with API Gateway meters
API Gateway meters are the easiest to set up - they automatically collect events from your Kong Gateway traffic. AI LLM meters work similarly for AI Gateway. Generic meters require you to ingest events via API.
:::

**✅ Checkpoint.** You understand the three meter types and how events flow from collectors into meters.

---

## Step 2 - Create an API Gateway meter (10 min)

**What it does:** Creates a meter that automatically tracks API requests flowing through your Kong Gateway.

### Create the meter via Konnect API

```bash
curl -s -X POST "$KONNECT_API/v1/metering/meters" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "api-requests",
    "display_name": "API Requests",
    "description": "Tracks all API requests through Kong Gateway",
    "type": "api_gateway",
    "aggregation": "count",
    "event_properties": {
      "service": "string",
      "route": "string",
      "consumer": "string",
      "status_code": "integer"
    }
  }' | jq '.'
```

### Save the meter ID

```bash
export API_METER_ID=$(curl -s "$KONNECT_API/v1/metering/meters" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq -r '.data[] | select(.name == "api-requests") | .id')

echo "API Meter ID: $API_METER_ID"
```

### Verify the meter in Konnect UI

1. Navigate to **Metering & Billing** → **Meters** in Konnect
2. You should see your `API Requests` meter listed

**✅ Checkpoint.** You have an API Gateway meter created and can see it in the Konnect dashboard.

---

## Step 3 - Create an AI LLM meter (10 min)

**What it does:** Creates a meter that tracks LLM token usage from your AI Gateway - prompt tokens, completion tokens, and total tokens per model and provider.

### Create the AI meter

```bash
curl -s -X POST "$KONNECT_API/v1/metering/meters" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "llm-tokens",
    "display_name": "LLM Token Usage",
    "description": "Tracks AI LLM token consumption across models",
    "type": "ai_llm",
    "aggregation": "sum",
    "event_properties": {
      "model": "string",
      "provider": "string",
      "token_type": "string",
      "consumer": "string"
    }
  }' | jq '.'
```

```bash
export AI_METER_ID=$(curl -s "$KONNECT_API/v1/metering/meters" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq -r '.data[] | select(.name == "llm-tokens") | .id')

echo "AI Meter ID: $AI_METER_ID"
```

**✅ Checkpoint.** You have an AI LLM meter that will track token usage from your AI Gateway.

---

## Step 4 - Create a generic meter (5 min)

**What it does:** Creates a generic meter for custom usage tracking. Generic meters accept events via the ingestion API - useful for tracking compute hours, storage, or any custom metric.

### Create a generic meter

```bash
curl -s -X POST "$KONNECT_API/v1/metering/meters" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "compute-units",
    "display_name": "Compute Units",
    "description": "Tracks custom compute unit consumption",
    "type": "generic",
    "aggregation": "sum",
    "event_properties": {
      "resource_type": "string",
      "customer_id": "string"
    }
  }' | jq '.'
```

```bash
export GENERIC_METER_ID=$(curl -s "$KONNECT_API/v1/metering/meters" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq -r '.data[] | select(.name == "compute-units") | .id')

echo "Generic Meter ID: $GENERIC_METER_ID"
```

**✅ Checkpoint.** You have three meters: API requests, LLM tokens, and compute units.

---

## Step 5 - Ingest usage events (5 min)

**What it does:** Sends usage events to the generic meter via the ingestion API. API Gateway and AI LLM meters collect events automatically, but generic meters need manual ingestion.

### Ingest events

```bash
# Ingest a batch of compute unit events
curl -s -X POST "$KONNECT_API/v1/metering/meters/$GENERIC_METER_ID/events" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      {
        "id": "evt-001",
        "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
        "value": 10,
        "properties": {
          "resource_type": "gpu",
          "customer_id": "cust-001"
        }
      },
      {
        "id": "evt-002",
        "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
        "value": 25,
        "properties": {
          "resource_type": "cpu",
          "customer_id": "cust-001"
        }
      }
    ]
  }' | jq '.'
```

### Test deduplication

```bash
# Re-send the same event (same id "evt-001") - it should be deduplicated
curl -s -X POST "$KONNECT_API/v1/metering/meters/$GENERIC_METER_ID/events" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      {
        "id": "evt-001",
        "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
        "value": 10,
        "properties": {
          "resource_type": "gpu",
          "customer_id": "cust-001"
        }
      }
    ]
  }' | jq '.'
```

::: tip Deduplication prevents double-billing
Every event needs a unique `id`. If you ingest the same `id` twice, it's counted only once. This is critical for reliable billing - network retries won't cause duplicate charges.
:::

**✅ Checkpoint.** Events are ingested. Re-sending the same event ID doesn't create duplicates.

---

## Step 6 - Verify event processing (5 min)

**What it does:** Queries the meter to verify events were processed correctly.

### Query meter usage

```bash
# Check usage for the generic meter
curl -s "$KONNECT_API/v1/metering/meters/$GENERIC_METER_ID/usage?group_by=resource_type" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq '.'
```

### List all meters

```bash
curl -s "$KONNECT_API/v1/metering/meters" \
  -H "Authorization: Bearer $KONNECT_TOKEN" \
  | jq '.data[] | {name: .name, type: .type, display_name: .display_name}'
```

**✅ Checkpoint.** You can see the ingested usage broken down by properties. All three meters are active.

---

## Summary

| Command / Concept | Purpose |
|---|---|
| Meter | Named counter tracking a specific usage type |
| Event | Single usage record with unique ID, timestamp, value |
| API Gateway meter | Automatic collection from Kong Gateway traffic |
| AI LLM meter | Automatic collection from AI Gateway token usage |
| Generic meter | Custom usage via API ingestion |
| Deduplication | Same event ID counted only once |
| `POST /v1/metering/meters` | Create a new meter |
| `POST /v1/metering/meters/:id/events` | Ingest usage events |
| `GET /v1/metering/meters/:id/usage` | Query meter usage |

---

*[← Module Overview](/module-01-metering-setup/) · [Next → Lab 02: Pricing & Plans](/module-01-metering-setup/labs/02-pricing-plans)*
