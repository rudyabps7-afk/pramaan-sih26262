-- Demo data. All institutions are fictional.
insert into public.institutions (aicte_id, name, city, state, type, region) values
 ('1-DEMO-0001', 'Kalinga Demo Institute of Technology', 'Bhubaneswar', 'Odisha', 'Engineering', 'Kolkata RO'),
 ('1-DEMO-0002', 'Mahanadi College of Engineering (Demo)', 'Cuttack', 'Odisha', 'Engineering', 'Kolkata RO'),
 ('1-DEMO-0003', 'Ganga Valley School of Management (Demo)', 'Patna', 'Bihar', 'Management', 'Kolkata RO'),
 ('1-DEMO-0004', 'Hooghly Institute of Pharmacy (Demo)', 'Howrah', 'West Bengal', 'Pharmacy', 'Kolkata RO'),
 ('1-DEMO-0005', 'Deccan Demo Polytechnic', 'Pune', 'Maharashtra', 'Diploma', 'Mumbai RO'),
 ('1-DEMO-0006', 'Yamuna Institute of Architecture (Demo)', 'New Delhi', 'Delhi', 'Architecture', 'Northern RO'),
 ('1-DEMO-0007', 'Kaveri College of Engineering (Demo)', 'Mysuru', 'Karnataka', 'Engineering', 'Bengaluru RO'),
 ('1-DEMO-0008', 'Narmada School of Computer Applications (Demo)', 'Bhopal', 'Madhya Pradesh', 'MCA', 'Bhopal RO'),
 ('1-DEMO-0009', 'Brahmaputra Institute of Technology (Demo)', 'Guwahati', 'Assam', 'Engineering', 'Kolkata RO'),
 ('1-DEMO-0010', 'Sabarmati Hotel Management College (Demo)', 'Ahmedabad', 'Gujarat', 'Hotel Management', 'Western RO');

-- Documents with spread-out expiry dates (some overdue, some due soon)
insert into public.documents (institution_id, doc_type, expiry_date)
select i.id, d.doc_type, (current_date + d.days::int)
from public.institutions i
cross join lateral (values
  ('Fire safety NOC',               ((i.id * 37) % 120) - 20),
  ('Structural stability certificate', ((i.id * 53) % 400) - 30),
  ('Land / lease deed',             ((i.id * 71) % 900) + 60),
  ('Affidavit / undertaking',       ((i.id * 29) % 200) - 10)
) as d(doc_type, days);

-- Applications in different stages, backdated so some are overdue
insert into public.applications (institution_id, kind, details, stage, stage_since, created_at)
select i.id, s.kind, s.details, s.stage, now() - (s.days || ' days')::interval, now() - ((s.days + 10) || ' days')::interval
from (values
  ('1-DEMO-0001', 'extension',       'Extension of approval for 2027-28',          'scrutiny',  4),
  ('1-DEMO-0002', 'increase_intake', 'B.Tech CSE intake 120 → 180',               'evc',       19),
  ('1-DEMO-0003', 'new_course',      'New PGDM in Business Analytics',             'deficiency', 9),
  ('1-DEMO-0004', 'extension',       'Extension of approval for 2027-28',          'sac_shc',   3),
  ('1-DEMO-0005', 'new',             'New diploma institute, 3 branches',           'submitted', 2),
  ('1-DEMO-0006', 'extension',       'Extension of approval for 2027-28',          'approved',  1),
  ('1-DEMO-0007', 'new_course',      'M.Tech in AI & Data Science',                 'scrutiny',  12),
  ('1-DEMO-0009', 'increase_intake', 'Diploma Civil intake 60 → 90',               'evc',       6)
) as s(aicte_id, kind, details, stage, days)
join public.institutions i on i.aicte_id = s.aicte_id;

insert into public.audit_log (actor, action, ref, detail, at)
select 'institute', 'application_submitted', a.app_no, a.kind, a.created_at from public.applications a;

-- A few complaints
insert into public.complaints (institution_id, category, description, city, status, officer_note, created_at, updated_at)
select i.id, c.category, c.description, i.city, c.status, c.note, now() - (c.days || ' days')::interval, now() - (c.days || ' days')::interval
from (values
  ('1-DEMO-0002', 'fake_faculty',  'The same professor is listed as full-time faculty at two other colleges.', 'under_review', 'Faculty IDs sent for cross-check.', 5),
  ('1-DEMO-0005', 'safety',        'Hostel building has visible cracks in the stairwell and no fire extinguishers.', 'received', null, 1),
  ('1-DEMO-0008', 'fees',          'College is collecting a "development fee" not listed in the approved fee structure.', 'action_taken', 'Show-cause notice issued.', 14)
) as c(aicte_id, category, description, status, note, days)
join public.institutions i on i.aicte_id = c.aicte_id;

insert into public.audit_log (actor, action, ref, detail, at)
select 'public', 'complaint_filed', c.ticket_no, c.category, c.created_at from public.complaints c;
