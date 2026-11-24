# Pramaan – SIH26262 prototype

AICTE approval workflow, compliance alerts and public complaints. Plain HTML/CSS/JS + Supabase (Postgres, realtime, auth). No build step.

## Pages
| Page | What it does |
|---|---|
| `index.html` | Landing page: problem, flow, features, team |
| `institute.html` | Submit an application, track it by number, add/renew compliance documents |
| `complaint.html` | Public complaint form (no sign-in), guided category helper (keyword rules, not AI), track by ticket |
| `admin.html` | Officer dashboard: KPIs, move applications between stages, update complaints, expiry alerts, audit log. Updates live. |

All pages switch between English and Hindi (`js/i18n.js`) and light/dark.

## Change team name / project name
Edit `js/config.js` (`team`, `name`).

## Run locally
```bash
python3 -m http.server 5173
```
Open http://localhost:5173

## Database
Supabase project `sih26262-demo` (Mumbai). Schema and demo data: `supabase/schema.sql`, `supabase/seed.sql`.

- The public can only call `submit_complaint`, `track_complaint`, `submit_application`, `track_application`, `add_document`, and read the institutions list.
- Only users listed in `public.admins` can read records and call `admin_set_stage` / `admin_set_complaint`.
- Every action is written to `audit_log`.

### Add an admin
1. Supabase dashboard → Authentication → Users → Add user (tick "Auto confirm"), set the email and password yourself.
2. In the SQL editor run:
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'officer@example.com';
   ```

## Deploy (free)
Drag the folder onto https://app.netlify.com/drop, or use Vercel. Nothing to build.

## Honest scope
This is a working prototype. Not yet built: real file upload/OCR, SMS/email alerts, EVC mobile app, DigiLocker/Bhashini integrations.
