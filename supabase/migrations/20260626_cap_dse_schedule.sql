-- cap_dse_schedule: auto-populated by n8n from CET Cell WordPress API.
-- n8n workflow 03-cetcell-dse-monitor.json upserts rows when the page changes.
-- Frontend (AdmissionProgress.jsx) reads this table and shows official schedule.

create table if not exists public.cap_dse_schedule (
  id            uuid        primary key default gen_random_uuid(),
  activity      text        not null,
  round_label   text,                          -- "Pre-CAP", "CAP Round I", etc.
  start_date    text,                          -- DD/MM/YYYY as published by CET Cell
  end_date      text,                          -- DD/MM/YYYY as published by CET Cell
  date_display  text,                          -- "04 Jul – 19 Jul 2026" (human-friendly)
  link          text,                          -- official circular URL if any
  status        text        not null default 'tba'
                constraint  cap_dse_status_check check (status in ('tba', 'current', 'completed')),
  sort_order    integer     not null default 0,
  source_url    text,                          -- CET Cell page that was scraped
  scraped_at    timestamptz,                   -- when n8n last populated this row
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at on every change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_cap_dse_schedule_updated_at
  before update on public.cap_dse_schedule
  for each row execute function public.set_updated_at();

-- RLS
alter table public.cap_dse_schedule enable row level security;

-- Anyone can read
create policy "cap_dse_schedule_public_read"
  on public.cap_dse_schedule for select using (true);

-- Only service role (n8n) can insert/update/delete
create policy "cap_dse_schedule_service_insert"
  on public.cap_dse_schedule for insert with check (true);

create policy "cap_dse_schedule_service_update"
  on public.cap_dse_schedule for update using (true) with check (true);

create policy "cap_dse_schedule_service_delete"
  on public.cap_dse_schedule for delete using (true);

-- Index for ordered display
create index if not exists idx_cap_dse_schedule_sort
  on public.cap_dse_schedule (sort_order asc);
