# n8n Automation Setup — Diploma Dost

Four workflows live in `n8n/workflows/`. They handle:

| # | File | What it does |
|---|------|-------------|
| 01 | `01-upload-approval-notify.json` | Receives Supabase webhook → sends Telegram notification with ✅/❌ buttons |
| 02 | `02-upload-approval-handler.json` | Catches button click → approves (`verified=true`) or rejects (deletes row) in Supabase |
| 03 | `03-cetcell-dse-monitor.json` | Daily cron → checks CET Cell WordPress API for changes → parses schedule → upserts to Supabase → Telegram alert |
| 04 | `04-msbte-notice-watcher.json` | Daily cron → checks msbte.org.in for new notices → Telegram alert on change |

---

## Step 1 — Create your Telegram bot

1. Open Telegram, search for **@BotFather**
2. Send `/newbot`
3. Choose a name (e.g. "Diploma Dost Admin") and a username (e.g. `diplomadost_admin_bot`)
4. BotFather replies with your **bot token** — copy it, looks like `1234567890:ABCxyz...`
5. Start a chat with your bot (search for it and press Start)
6. Get your **Chat ID** by messaging **@userinfobot** — it replies with your numeric ID (e.g. `987654321`)

---

## Step 2 — Sign up for n8n.cloud (free tier)

1. Go to **https://n8n.io/cloud** → click "Start for free"
2. Create an account (GitHub sign-in works)
3. Free tier: **5 workflows**, **2,500 executions/month** — enough for these 4 workflows

---

## Step 3 — Configure n8n Variables

In n8n: **Settings → Variables → Add Variable** (one for each):

| Variable name | Value |
|--------------|-------|
| `TELEGRAM_BOT_TOKEN` | Your bot token from Step 1 |
| `TELEGRAM_CHAT_ID` | Your numeric chat ID from Step 1 |
| `SUPABASE_URL` | Your Supabase project URL, e.g. `https://xyzxyz.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (Dashboard → Settings → API → service_role) |

> **Important**: `SUPABASE_SERVICE_KEY` has full database access — only use it in n8n, never expose it in frontend code.

---

## Step 4 — Run the SQL migration

In **Supabase Dashboard → SQL Editor**, paste and run the contents of:

```
supabase/migrations/20260626_cap_dse_schedule.sql
```

This creates the `cap_dse_schedule` table that Workflow 03 writes into.

---

## Step 5 — Import the four workflows

In n8n:
1. **Workflows → New → Import from file**
2. Import each JSON from `n8n/workflows/` in order (01, 02, 03, 04)
3. After importing each: review nodes, then click **Activate** (top-right toggle)

---

## Step 6 — Set up Supabase Database Webhook (for Workflow 01)

This tells Supabase to call Workflow 01 whenever a user submits a resource.

1. In n8n, open Workflow 01. Click the **Webhook — New Upload** node.
2. Copy the **Production webhook URL** (looks like `https://yourapp.n8n.cloud/webhook/upload-submitted`)
3. In Supabase Dashboard → **Database → Webhooks → Create a new hook**:
   - **Name**: `upload-approval-notify`
   - **Table**: `notes_submissions`
   - **Events**: ✅ Insert
   - **Type**: HTTP Request
   - **URL**: paste the n8n webhook URL
   - **Method**: POST
   - **Headers**: `Content-Type: application/json`
4. Save the webhook

> The webhook fires immediately on every insert into `notes_submissions`, sending the new row data to n8n.

---

## How it works end-to-end

### Upload approval flow (Workflows 01 + 02)

```
User uploads resource
  → row inserted in notes_submissions (verified=false)
  → Supabase Database Webhook → n8n Workflow 01
  → Telegram message with [✅ Approve] [❌ Reject] buttons
  → You tap a button
  → Telegram callback → n8n Workflow 02
  → Approve: PATCH notes_submissions SET verified=true
    Reject:  DELETE notes_submissions WHERE id=...
  → Telegram message updated to show result (buttons removed)
```

### CET Cell DSE monitor (Workflow 03)

```
Daily at 9:00 AM IST
  → Fetch https://cetcell.mahacet.org/wp-json/wp/v2/pages/27513
  → Compare 'modified' timestamp with last stored value
  → If unchanged → stop (no notification)
  → If changed:
      → Try to parse schedule table from page HTML
      → If rows found → upsert into cap_dse_schedule Supabase table
      → Send Telegram: what changed + excerpt + link
```

The first time it runs it will always send a notification (no previous timestamp stored). After that it only alerts on changes.

### MSBTE notice watcher (Workflow 04)

```
Daily at 9:30 AM IST
  → Fetch https://msbte.org.in/
  → Extract notice links (PDF links, keyword-matching anchors)
  → Hash the notice list and compare with previous hash
  → If unchanged → stop
  → If changed → Telegram alert with new notices and links
```

---

## Troubleshooting

**Workflow 01 not triggering**: Check Supabase Webhook logs (Database → Webhooks → click hook → view logs). Make sure Workflow 01 is **Activated** in n8n.

**Workflow 02 Telegram trigger not working**: Telegram bots receive updates via long-polling or webhooks. n8n's telegramTrigger uses Telegram's webhook mode — it registers a webhook URL with Telegram automatically when you activate the workflow. If it stops working, deactivate and re-activate Workflow 02.

**CET Cell returns 403/404**: The WordPress REST API endpoint `wp-json/wp/v2/pages/27513` is public. If it changes (CET Cell updates their site), you may need to find the new page ID via `https://cetcell.mahacet.org/wp-json/wp/v2/pages?slug=cap-2026-27`.

**MSBTE site unreachable**: `msbte.org.in` blocks some IP ranges. Try `msbte.ac.in` as an alternative URL in Workflow 04's HTTP Request node.

**Free tier limit hit (2,500 runs/month)**: Each daily cron fires once/day = ~30 runs/month per workflow. With 4 workflows that's ~120/month — well within the 2,500 limit. Upload approvals add ~50–100 runs/month depending on volume. You have plenty of headroom.
