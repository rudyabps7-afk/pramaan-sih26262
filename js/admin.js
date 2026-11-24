renderChrome("admin.html");
const tabs = $("#tabs");
setupTabs(tabs);

const S = { apps: [], complaints: [], docs: [], audit: [], inst: {} };
let channel = null;
let flashIds = new Set();

// ---------- Auth ----------
async function start() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) return showLogin();
  $("#loginBox").hidden = true; $("#signupBox").hidden = true;
  $("#who").hidden = false;
  $("#whoEmail").textContent = session.user.email;
  const { data: adminRow } = await db.from("admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
  if (!adminRow) { $("#notAdmin").hidden = false; $("#dash").hidden = true; return; }
  $("#notAdmin").hidden = true;
  $("#dash").hidden = false;
  await loadAll();
  subscribe();
}
function showLogin() {
  $("#loginBox").hidden = false; $("#signupBox").hidden = true; $("#who").hidden = true; $("#dash").hidden = true; $("#notAdmin").hidden = true;
}
$("#loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const btn = e.submitter; btn.disabled = true;
  const { error } = await db.auth.signInWithPassword({ email: $("#email").value, password: $("#password").value });
  btn.disabled = false;
  if (error) { $("#loginErr").hidden = false; $("#loginErr").textContent = error.message; return; }
  $("#loginErr").hidden = true; $("#password").value = "";
  start();
});
$("#toSignup").onclick = () => { $("#loginBox").hidden = true; $("#signupBox").hidden = false; };
$("#toLogin").onclick = () => { $("#signupBox").hidden = true; $("#loginBox").hidden = false; };
$("#signupForm").addEventListener("submit", async e => {
  e.preventDefault();
  const btn = e.submitter; btn.disabled = true;
  const { data, error } = await db.auth.signUp({
    email: $("#suEmail").value, password: $("#suPassword").value,
    options: { emailRedirectTo: location.origin + location.pathname }
  });
  btn.disabled = false;
  const msg = $("#signupMsg"); msg.hidden = false;
  if (error) { msg.className = "result error"; msg.textContent = error.message; return; }
  $("#suPassword").value = "";
  if (data.session) { $("#signupBox").hidden = true; start(); return; }
  msg.className = "result"; msg.textContent = t("adm.signup.check");
});
$("#signOut").onclick = async () => {
  if (channel) { db.removeChannel(channel); channel = null; }
  await db.auth.signOut(); showLogin();
};

// ---------- Data ----------
async function loadAll() {
  const [inst, apps, cmp, docs, audit] = await Promise.all([
    db.from("institutions").select("id,name,city,aicte_id"),
    db.from("applications").select("*").order("stage_since"),
    db.from("complaints").select("*").order("created_at", { ascending: false }),
    db.from("documents").select("*").order("expiry_date"),
    db.from("audit_log").select("*").order("at", { ascending: false }).limit(60)
  ]);
  const err = [inst, apps, cmp, docs, audit].find(r => r.error);
  if (err) { toast(t("err.generic")); return; }
  S.inst = Object.fromEntries(inst.data.map(i => [i.id, i]));
  S.apps = apps.data; S.complaints = cmp.data; S.docs = docs.data; S.audit = audit.data;
  render();
}

function subscribe() {
  if (channel) return;
  let timer;
  const reload = () => { clearTimeout(timer); timer = setTimeout(loadAll, 300); };
  channel = db.channel("admin-live")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "complaints" }, p => {
      toast(`${t("adm.new.cmp")}: ${p.new.ticket_no}`); flashIds.add("c" + p.new.id); reload();
    })
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "applications" }, p => {
      toast(`${t("adm.new.app")}: ${p.new.app_no}`); flashIds.add("a" + p.new.id); reload();
    })
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "applications" }, reload)
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "complaints" }, reload)
    .on("postgres_changes", { event: "*", schema: "public", table: "documents" }, reload)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "audit_log" }, reload)
    .subscribe();
}

// ---------- Render ----------
const instName = id => S.inst[id] ? S.inst[id].name : "";
const isOpenStage = s => !["approved", "rejected"].includes(s);
const overdue = a => isOpenStage(a.stage) && APP.sla[a.stage] != null && daysSince(a.stage_since) > APP.sla[a.stage];

function render() {
  const open = S.apps.filter(a => isOpenStage(a.stage));
  const expiring = S.docs.filter(d => { const n = daysUntil(d.expiry_date); return n >= 0 && n <= 30; });
  const expired = S.docs.filter(d => daysUntil(d.expiry_date) < 0);
  const openCmp = S.complaints.filter(c => c.status !== "closed");
  $("#kpis").innerHTML = [
    ["adm.k.pending", open.length, ""], ["adm.k.overdue", open.filter(overdue).length, "bad"],
    ["adm.k.expiring", expiring.length, "warn"], ["adm.k.expired", expired.length, "bad"], ["adm.k.open", openCmp.length, ""]
  ].map(([k, n, cls]) => `<div class="kpi ${n ? cls : ""}"><div class="n">${n}</div><div class="l">${esc(t(k))}</div></div>`).join("");

  renderApps(); renderComplaints(); renderAlerts(); renderAudit();
  setTimeout(() => flashIds.clear(), 2500);
}

function renderApps() {
  const el = tabs.querySelector('[data-panel="apps"]');
  el.innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>${esc(t("adm.c.app"))}</th><th>${esc(t("adm.c.inst"))}</th><th>${esc(t("adm.c.stage"))}</th><th>${esc(t("adm.c.days"))}</th><th>${esc(t("adm.c.action"))}</th></tr></thead>
    <tbody>${S.apps.map(a => {
      const d = daysSince(a.stage_since);
      const sla = APP.sla[a.stage];
      const dayPill = !isOpenStage(a.stage) ? `<span class="pill">${d}</span>`
        : overdue(a) ? `<span class="pill bad">${d} / ${sla} · ${esc(t("adm.overdue"))}</span>` : `<span class="pill ok">${d} / ${sla}</span>`;
      return `<tr class="${flashIds.has("a" + a.id) ? "flash" : ""}">
        <td><b>${esc(a.app_no)}</b><span class="sub">${esc(t("kind." + a.kind))}</span></td>
        <td>${esc(instName(a.institution_id))}<span class="sub">${esc(a.details || "")}</span></td>
        <td><span class="pill brand">${esc(t("stage." + a.stage))}</span></td>
        <td>${dayPill}</td>
        <td><form class="row" data-app="${a.id}" style="gap:6px;flex-wrap:nowrap">
          <select name="stage" style="min-width:140px">${STAGES.map(s => `<option value="${s}" ${s === a.stage ? "selected" : ""}>${esc(t("stage." + s))}</option>`).join("")}</select>
          <input name="note" placeholder="${esc(t("adm.note.ph"))}" maxlength="200" style="min-width:120px">
          <button class="btn small" type="submit">${esc(t("adm.save"))}</button></form></td></tr>`;
    }).join("")}</tbody></table></div>`;
  el.querySelectorAll("form[data-app]").forEach(f => f.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = e.submitter; btn.disabled = true;
    const { error } = await db.rpc("admin_set_stage", { p_app_id: Number(f.dataset.app), p_stage: f.stage.value, p_note: f.note.value });
    btn.disabled = false;
    toast(error ? t("err.generic") : t("adm.updated"));
    if (!error) loadAll();
  }));
}

function renderComplaints() {
  const el = tabs.querySelector('[data-panel="cmp"]');
  el.innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>${esc(t("adm.c.ticket"))}</th><th>${esc(t("adm.c.cat"))}</th><th>${esc(t("adm.c.inst"))}</th><th>${esc(t("adm.c.status"))}</th></tr></thead>
    <tbody>${S.complaints.map(c => `<tr class="${flashIds.has("c" + c.id) ? "flash" : ""}">
      <td><b>${esc(c.ticket_no)}</b><span class="sub">${esc(fmtDate(c.created_at, true))} · ${c.lang === "hi" ? "हिंदी" : "EN"}</span></td>
      <td>${esc(t("cat." + c.category))}<span class="sub">${esc(c.description)}</span></td>
      <td>${esc(instName(c.institution_id) || c.institution_name || "")}<span class="sub">${esc(c.city || "")}</span></td>
      <td><form class="row" data-cmp="${c.id}" style="gap:6px">
        <select name="status">${STATUSES.map(s => `<option value="${s}" ${s === c.status ? "selected" : ""}>${esc(t("status." + s))}</option>`).join("")}</select>
        <input name="note" placeholder="${esc(t("adm.note.ph"))}" value="${esc(c.officer_note || "")}" maxlength="1000" style="min-width:140px">
        <button class="btn small" type="submit">${esc(t("adm.save"))}</button></form></td></tr>`).join("")}</tbody></table></div>`;
  el.querySelectorAll("form[data-cmp]").forEach(f => f.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = e.submitter; btn.disabled = true;
    const { error } = await db.rpc("admin_set_complaint", { p_id: Number(f.dataset.cmp), p_status: f.status.value, p_note: f.note.value });
    btn.disabled = false;
    toast(error ? t("err.generic") : t("adm.updated"));
    if (!error) loadAll();
  }));
}

function renderAlerts() {
  const el = tabs.querySelector('[data-panel="alerts"]');
  const rows = S.docs.filter(d => daysUntil(d.expiry_date) <= 30);
  el.innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>${esc(t("adm.c.inst"))}</th><th>${esc(t("adm.c.doc"))}</th><th>${esc(t("adm.c.expiry"))}</th></tr></thead>
    <tbody>${rows.map(d => `<tr><td>${esc(instName(d.institution_id))}</td><td>${esc(d.doc_type)}</td>
      <td>${expiryPill(d.expiry_date)}<span class="sub">${esc(fmtDate(d.expiry_date))}</span></td></tr>`).join("")}</tbody></table></div>`;
}

function renderAudit() {
  const el = tabs.querySelector('[data-panel="audit"]');
  el.innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>${esc(t("adm.c.when"))}</th><th>${esc(t("adm.c.who"))}</th><th>${esc(t("adm.c.what"))}</th></tr></thead>
    <tbody>${S.audit.map(l => `<tr><td>${esc(fmtDate(l.at, true))}</td><td>${esc(l.actor)}</td>
      <td>${esc(t("act." + l.action))} · <b>${esc(l.ref || "")}</b><span class="sub">${esc(actDetail(l))}</span></td></tr>`).join("")}</tbody></table></div>`;
}

document.addEventListener("langchange", () => { if (!$("#dash").hidden) render(); });
db.auth.onAuthStateChange((event) => { if (event === "SIGNED_OUT") showLogin(); });
start();
