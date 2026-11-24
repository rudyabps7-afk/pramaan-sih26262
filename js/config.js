// Public settings. The publishable key is meant to be in the browser:
// Row Level Security in Supabase decides what it can read or change.
window.APP = {
  name: "Pramaan",
  team: "Your Team Name",          // change to your registered SIH team name
  psId: "SIH26262",
  supabaseUrl: "https://ikrcmeirwdoapaaonphc.supabase.co",
  supabaseKey: "sb_publishable_G3BMd5eNEXAnGHMFbe3zqw_vN46YrYA",
  // Days an application may stay in a stage before it shows as overdue
  sla: { submitted: 3, scrutiny: 10, deficiency: 15, evc: 14, sac_shc: 7 }
};
window.db = window.supabase.createClient(APP.supabaseUrl, APP.supabaseKey);
