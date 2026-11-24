-- SIH26262 demo: AICTE approval workflow, compliance monitoring and complaints
-- Public visitors never read tables directly. They use the functions below
-- (submit_*, track_*). Only signed-in admins (rows in public.admins) can read
-- tables and change stages/statuses.

-- ---------- Tables ----------
create table public.institutions (
  id bigint generated always as identity primary key,
  aicte_id text unique not null,
  name text not null,
  city text not null,
  state text not null,
  type text not null,
  region text not null,
  created_at timestamptz not null default now()
);

create sequence public.app_no_seq start 1001;
create table public.applications (
  id bigint generated always as identity primary key,
  app_no text unique not null default
    ('APP-' || nextval('public.app_no_seq') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 4))),
  institution_id bigint not null references public.institutions(id),
  kind text not null check (kind in ('new','extension','increase_intake','new_course','closure')),
  details text check (char_length(details) <= 1000),
  stage text not null default 'submitted'
    check (stage in ('submitted','scrutiny','deficiency','evc','sac_shc','approved','rejected')),
  stage_since timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index on public.applications (institution_id);

create table public.documents (
  id bigint generated always as identity primary key,
  institution_id bigint not null references public.institutions(id),
  doc_type text not null check (char_length(doc_type) <= 80),
  expiry_date date not null,
  created_at timestamptz not null default now()
);
create index on public.documents (institution_id);
create index on public.documents (expiry_date);

create sequence public.ticket_seq start 5001;
create table public.complaints (
  id bigint generated always as identity primary key,
  ticket_no text unique not null default
    ('CMP-' || nextval('public.ticket_seq') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 4))),
  institution_id bigint references public.institutions(id),
  institution_name text check (char_length(institution_name) <= 160),
  category text not null
    check (category in ('safety','fake_faculty','fees','infrastructure','unapproved','other')),
  description text not null check (char_length(description) between 10 and 2000),
  city text check (char_length(city) <= 80),
  status text not null default 'received'
    check (status in ('received','under_review','action_taken','closed')),
  officer_note text check (char_length(officer_note) <= 1000),
  lang text not null default 'en' check (lang in ('en','hi')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.complaints (institution_id);

create table public.audit_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor text not null,
  action text not null,
  ref text,
  detail text
);
create index on public.audit_log (ref);

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- ---------- Row level security ----------
alter table public.institutions enable row level security;
alter table public.applications enable row level security;
alter table public.documents   enable row level security;
alter table public.complaints  enable row level security;
alter table public.audit_log   enable row level security;
alter table public.admins      enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

create policy "anyone reads institutions" on public.institutions
  for select to anon, authenticated using (true);
create policy "admins read applications" on public.applications
  for select to authenticated using ((select public.is_admin()));
create policy "admins read documents" on public.documents
  for select to authenticated using ((select public.is_admin()));
create policy "admins read complaints" on public.complaints
  for select to authenticated using ((select public.is_admin()));
create policy "admins read audit" on public.audit_log
  for select to authenticated using ((select public.is_admin()));
create policy "user sees own admin row" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

-- ---------- Public functions ----------
create or replace function public.submit_complaint(
  p_institution_id bigint, p_institution_name text, p_category text,
  p_description text, p_city text, p_lang text default 'en'
) returns text
language plpgsql security definer set search_path = '' as $$
declare v_ticket text;
begin
  insert into public.complaints (institution_id, institution_name, category, description, city, lang)
  values (p_institution_id, nullif(trim(p_institution_name), ''), p_category,
          trim(p_description), nullif(trim(p_city), ''), coalesce(p_lang, 'en'))
  returning ticket_no into v_ticket;
  insert into public.audit_log (actor, action, ref, detail)
  values ('public', 'complaint_filed', v_ticket, p_category);
  return v_ticket;
end $$;

create or replace function public.track_complaint(p_ticket text)
returns table (ticket_no text, category text, status text, officer_note text,
               institution text, created_at timestamptz, updated_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select c.ticket_no, c.category, c.status, c.officer_note,
         coalesce(i.name, c.institution_name), c.created_at, c.updated_at
  from public.complaints c left join public.institutions i on i.id = c.institution_id
  where c.ticket_no = upper(trim(p_ticket));
$$;

create or replace function public.submit_application(
  p_institution_id bigint, p_kind text, p_details text
) returns text
language plpgsql security definer set search_path = '' as $$
declare v_no text;
begin
  insert into public.applications (institution_id, kind, details)
  values (p_institution_id, p_kind, nullif(trim(p_details), ''))
  returning app_no into v_no;
  insert into public.audit_log (actor, action, ref, detail)
  values ('institute', 'application_submitted', v_no, p_kind);
  return v_no;
end $$;

create or replace function public.add_document(p_app_no text, p_doc_type text, p_expiry date)
returns void
language plpgsql security definer set search_path = '' as $$
declare v_inst bigint;
begin
  select institution_id into v_inst from public.applications where app_no = upper(trim(p_app_no));
  if v_inst is null then raise exception 'Application not found'; end if;
  insert into public.documents (institution_id, doc_type, expiry_date) values (v_inst, trim(p_doc_type), p_expiry);
  insert into public.audit_log (actor, action, ref, detail)
  values ('institute', 'document_added', upper(trim(p_app_no)), trim(p_doc_type) || ' until ' || p_expiry);
end $$;

create or replace function public.track_application(p_app_no text) returns json
language sql stable security definer set search_path = '' as $$
  select json_build_object(
    'app_no', a.app_no, 'kind', a.kind, 'stage', a.stage, 'stage_since', a.stage_since,
    'created_at', a.created_at,
    'institution', json_build_object('name', i.name, 'aicte_id', i.aicte_id, 'city', i.city, 'state', i.state),
    'history', coalesce((select json_agg(json_build_object('at', l.at, 'action', l.action, 'detail', l.detail) order by l.at)
                         from public.audit_log l where l.ref = a.app_no), '[]'::json),
    'documents', coalesce((select json_agg(json_build_object('doc_type', d.doc_type, 'expiry_date', d.expiry_date) order by d.expiry_date)
                           from public.documents d where d.institution_id = a.institution_id), '[]'::json)
  )
  from public.applications a join public.institutions i on i.id = a.institution_id
  where a.app_no = upper(trim(p_app_no));
$$;

-- ---------- Admin functions ----------
create or replace function public.admin_set_stage(p_app_id bigint, p_stage text, p_note text default null)
returns void
language plpgsql security definer set search_path = '' as $$
declare v_no text; v_old text;
begin
  if not public.is_admin() then raise exception 'Not allowed'; end if;
  select app_no, stage into v_no, v_old from public.applications where id = p_app_id for update;
  if v_no is null then raise exception 'Application not found'; end if;
  update public.applications set stage = p_stage, stage_since = now() where id = p_app_id;
  insert into public.audit_log (actor, action, ref, detail)
  values ((select email from auth.users where id = auth.uid()), 'stage_changed', v_no,
          v_old || ' → ' || p_stage || coalesce(': ' || nullif(trim(p_note), ''), ''));
end $$;

create or replace function public.admin_set_complaint(p_id bigint, p_status text, p_note text default null)
returns void
language plpgsql security definer set search_path = '' as $$
declare v_ticket text;
begin
  if not public.is_admin() then raise exception 'Not allowed'; end if;
  update public.complaints
     set status = p_status, officer_note = coalesce(nullif(trim(p_note), ''), officer_note), updated_at = now()
   where id = p_id returning ticket_no into v_ticket;
  if v_ticket is null then raise exception 'Complaint not found'; end if;
  insert into public.audit_log (actor, action, ref, detail)
  values ((select email from auth.users where id = auth.uid()), 'complaint_updated', v_ticket, p_status);
end $$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
revoke execute on function public.admin_set_stage(bigint, text, text) from public, anon;
revoke execute on function public.admin_set_complaint(bigint, text, text) from public, anon;
grant execute on function public.admin_set_stage(bigint, text, text) to authenticated;
grant execute on function public.admin_set_complaint(bigint, text, text) to authenticated;

-- ---------- Realtime (admin dashboard updates live; RLS still applies) ----------
alter publication supabase_realtime add table public.applications, public.complaints, public.documents, public.audit_log;
