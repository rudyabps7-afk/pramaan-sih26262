// Shared header, footer, theme, tabs and small helpers.
const LOGO = `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4 55 12v18c0 15-10 26-23 30C19 56 9 45 9 30V12Z" fill="#1d4ed8"/><path d="M21 32l8 8 15-16" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="12" r="6" fill="#e8891a"/></svg>`;

function renderChrome(active) {
  const pages = [["index.html", "nav.home"], ["institute.html", "nav.institute"], ["complaint.html", "nav.complaint"], ["admin.html", "nav.admin"]];
  const header = document.createElement("header");
  header.className = "top";
  header.innerHTML = `<div class="wrap">
    <a class="logo" href="index.html">${LOGO}<span>${APP.name}</span></a>
    <nav class="nav">${pages.map(([href, k]) => `<a href="${href}" data-i18n="${k}" ${href === active ? 'aria-current="page"' : ""}></a>`).join("")}</nav>
    <div class="tools">
      <button class="icon-btn" id="langBtn" data-i18n="lang.toggle" type="button"></button>
      <button class="icon-btn" id="themeBtn" type="button" aria-label="Toggle light/dark">◐</button>
    </div></div>`;
  document.body.prepend(header);

  const footer = document.createElement("footer");
  footer.innerHTML = `<div class="wrap"><span data-i18n="footer.note"></span> · ${esc(APP.psId)} · ${esc(APP.team)}</div>`;
  document.body.append(footer);

  document.getElementById("langBtn").onclick = () => setLang(LANG === "en" ? "hi" : "en");
  document.getElementById("themeBtn").onclick = toggleTheme;
  try { const th = localStorage.getItem("pramaan_theme"); if (th) document.documentElement.dataset.theme = th; } catch {}
  applyI18n();
}

function toggleTheme() {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("pramaan_theme", root.dataset.theme); } catch {}
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
const $ = (sel, root = document) => root.querySelector(sel);

function fmtDate(d, withTime) {
  if (!d) return "";
  const opts = withTime ? { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" } : { day: "numeric", month: "short", year: "numeric" };
  return new Date(d).toLocaleString(LANG === "hi" ? "hi-IN" : "en-IN", opts);
}
function daysSince(d) { return Math.floor((Date.now() - new Date(d).getTime()) / 86400000); }
function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((new Date(dateStr + "T00:00:00") - today) / 86400000);
}

// Pill for a document expiry date
function expiryPill(dateStr) {
  const n = daysUntil(dateStr);
  if (n < 0) return `<span class="pill bad">${esc(t("adm.expired"))} · ${esc(t("adm.dago", { n: -n }))}</span>`;
  if (n <= 7) return `<span class="pill bad">${esc(t("adm.dleft", { n }))}</span>`;
  if (n <= 30) return `<span class="pill warn">${esc(t("adm.dleft", { n }))}</span>`;
  return `<span class="pill ok">${esc(t("adm.dleft", { n }))}</span>`;
}

let toastTimer;
function toast(msg) {
  let el = $("#toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.append(el); }
  el.textContent = msg; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => (el.hidden = true), 4000);
}

function setupTabs(container) {
  const buttons = container.querySelectorAll(".tabs button");
  buttons.forEach(b => b.addEventListener("click", () => showTab(container, b.dataset.tab)));
}
function showTab(container, id) {
  container.querySelectorAll(".tabs button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === id)));
  container.querySelectorAll("[data-panel]").forEach(p => (p.hidden = p.dataset.panel !== id));
}

function copyBtn(text) {
  const b = document.createElement("button");
  b.type = "button"; b.className = "btn secondary small"; b.textContent = t("copy");
  b.onclick = async () => { try { await navigator.clipboard.writeText(text); b.textContent = t("copied"); } catch {} };
  return b;
}

let INSTITUTIONS = [];
async function loadInstitutions() {
  if (INSTITUTIONS.length) return INSTITUTIONS;
  const { data, error } = await db.from("institutions").select("id,name,city,state,aicte_id").order("name");
  if (error) throw error;
  INSTITUTIONS = data;
  return data;
}
function fillInstitutionSelect(sel, extra) {
  sel.innerHTML = `<option value="">${esc(t("choose"))}</option>` +
    INSTITUTIONS.map(i => `<option value="${i.id}">${esc(i.name)} · ${esc(i.city)}</option>`).join("") +
    (extra ? `<option value="other">${esc(extra)}</option>` : "");
}
function fillOptions(sel, prefix, values, keep) {
  const cur = keep ? sel.value : "";
  sel.innerHTML = `<option value="">${esc(t("choose"))}</option>` + values.map(v => `<option value="${v}">${esc(t(prefix + v))}</option>`).join("");
  sel.value = cur;
}

const KINDS = ["extension", "increase_intake", "new_course", "new", "closure"];
const STAGES = ["submitted", "scrutiny", "deficiency", "evc", "sac_shc", "approved", "rejected"];
const PATH = ["submitted", "scrutiny", "evc", "sac_shc", "approved"];
const CATS = ["safety", "fake_faculty", "fees", "infrastructure", "unapproved", "other"];
const STATUSES = ["received", "under_review", "action_taken", "closed"];

// Readable detail text for an audit/history row
function actDetail(l) {
  if (l.action === "application_submitted" && KINDS.includes(l.detail)) return t("kind." + l.detail);
  if (l.action === "complaint_filed" && CATS.includes(l.detail)) return t("cat." + l.detail);
  if (l.action === "complaint_updated" && STATUSES.includes(l.detail)) return t("status." + l.detail);
  if (l.action === "stage_changed" && l.detail) {
    return l.detail.replace(/^(\w+) → (\w+)/, (m, a, b) => `${t("stage." + a)} → ${t("stage." + b)}`);
  }
  return l.detail || "";
}

function stepper(steps, current, prefix) {
  const idx = steps.indexOf(current);
  return `<ol class="stepper">${steps.map((s, i) => `<li class="${i < idx ? "done" : i === idx ? "current" : ""}">${esc(t(prefix + s))}</li>`).join("")}</ol>`;
}
