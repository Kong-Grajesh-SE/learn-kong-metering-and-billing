# Module 01 - Metering Setup

> **Scenario.** Your APIs are running on Kong Gateway and AI Gateway. Developers are consuming them, but you have no visibility into who is using what, how much, or how often. Without usage metering, you can't bill customers, enforce usage limits, or understand consumption patterns.

## Module outcomes

By the end of this module, you will be able to:

- Understand metering concepts (meters, events, collectors)
- Create meters for API gateway traffic and AI LLM token usage
- Create generic meters for custom usage tracking
- Ingest usage events with deduplication
- Verify event processing and troubleshoot ingestion issues

## Prerequisites

You have a Kong Konnect account with Metering & Billing enabled and traffic flowing through your gateway.

```bash
# Verify Konnect connectivity
curl -s -H "Authorization: Bearer $KONNECT_TOKEN" \
  https://us.api.konghq.com/v2/users/me | jq '.full_name'

# Verify gateway traffic
curl -s http://localhost:8000/flights | head -5

# jq
jq --version
# jq-1.6+
```

## What you need

| Tool | Purpose | Minimum |
|---|---|---|
| Kong Konnect | Platform with Metering & Billing | - |
| Kong Gateway or AI Gateway | Traffic source | 3.14+ |
| jq | JSON inspection | 1.6+ |

## Labs

| Lab | Focus | Time |
|---|---|---|
| [01 - Meters & Events](/module-01-metering-setup/labs/01-meters-events) | Meters, events, collectors, event processing, deduplication | ~40 min |

## Suggested reading

- [Metering & Billing overview](https://developer.konghq.com/metering-and-billing/)
- [Meters and events](https://developer.konghq.com/metering-and-billing/meters/)

## Exit ticket

1. What is the difference between API gateway metering and generic metering? When would you use each?

## Common pitfalls

| Symptom | Likely cause | Mitigation |
|---|---|---|
| Events not appearing after ingestion | Deduplication key collision or incorrect meter ID | Verify unique event IDs and correct meter reference |
| Usage counts don't match gateway metrics | Meter filter not matching all relevant traffic | Check meter filter expressions against actual request attributes |

---

*[← Home](/) · [Lab 01 →](/module-01-metering-setup/labs/01-meters-events)*
