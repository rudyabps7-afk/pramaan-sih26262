renderChrome("complaint.html");
const tabs = $("#tabs");
setupTabs(tabs);
let lastTrack = null;

function fillForm() {
  const inst = $("#instSel").value;
  fillInstitutionSelect($("#instSel"), t("cmp.f.other"));
  $("#instSel").value = inst;
  fillOptions($("#catSel"), "cat.", CATS, true);
}
loadInstitutions().then(fillForm).catch(() => toast(t("err.generic")));
document.addEventListener("langchange", () => { fillForm(); resetChat(); if (lastTrack) renderTrack(lastTrack); });

$("#instSel").addEventListener("change", e => {
  const other = e.target.value === "other";
  $("#instNameWrap").hidden = !other;
  $("#instName").required = other;
  const inst = INSTITUTIONS.find(i => String(i.id) === e.target.value);
  if (inst && !$("#city").value) $("#city").value = inst.city;
});

$("#cmpForm").addEventListener("submit", async e => {
  e.preventDefault();
  const btn = e.submitter; btn.disabled = true;
  const instVal = $("#instSel").value;
  const { data, error } = await db.rpc("submit_complaint", {
    p_institution_id: instVal && instVal !== "other" ? Number(instVal) : null,
    p_institution_name: instVal === "other" ? $("#instName").value : null,
    p_category: $("#catSel").value, p_description: $("#desc").value, p_city: $("#city").value, p_lang: LANG
  });
  btn.disabled = false;
  const out = $("#cmpResult"); out.hidden = false;
  if (error) { out.className = "result error"; out.textContent = t("err.generic"); return; }
  out.className = "result";
  out.innerHTML = `<p>${esc(t("cmp.done"))}</p><div class="row"><span class="code">${esc(data)}</span></div>`;
  out.querySelector(".row").append(copyBtn(data));
  e.target.reset(); $("#instNameWrap").hidden = true;
  $("#ticket").value = data;
});

// ---------- Guided helper (keyword rules, not AI) ----------
const KEYWORDS = {
  safety: ["crack", "fire", "unsafe", "collapse", "building", "extinguisher", "wire", "roof", "hostel", "दरार", "आग", "असुरक्षित", "इमारत", "छत", "हॉस्टल", "गिर"],
  fake_faculty: ["faculty", "teacher", "professor", "ghost", "fake", "lecturer", "शिक्षक", "प्रोफेसर", "फ़र्ज़ी", "फर्जी", "अध्यापक"],
  fees: ["fee", "fees", "money", "charge", "donation", "capitation", "refund", "फ़ीस", "फीस", "पैसे", "डोनेशन", "शुल्क"],
  infrastructure: ["lab", "library", "computer", "classroom", "equipment", "toilet", "water", "लैब", "पुस्तकालय", "कंप्यूटर", "शौचालय", "पानी", "कक्षा"],
  unapproved: ["approval", "approved", "unapproved", "recognised", "recognized", "fake college", "मंज़ूरी", "मान्यता", "बिना"]
};
function guess(text) {
  const s = text.toLowerCase();
  let best = "other", score = 0;
  for (const [cat, words] of Object.entries(KEYWORDS)) {
    const n = words.filter(w => s.includes(w)).length;
    if (n > score) { score = n; best = cat; }
  }
  return score ? best : null;
}
function bubble(text, who) {
  const b = document.createElement("div");
  b.className = "bubble " + who; b.textContent = text;
  $("#chat").append(b);
}
function pick(cat, text) {
  $("#catSel").value = cat;
  if (text && !$("#desc").value) $("#desc").value = text;
  bubble(cat === "other" && !text ? t("cat.other") : t("cmp.helper.picked", { cat: t("cat." + cat) }), "bot");
}
function resetChat() {
  const chat = $("#chat"); chat.innerHTML = "";
  bubble(t("cmp.helper.hello"), "bot");
  const chips = document.createElement("div"); chips.className = "chips";
  CATS.filter(c => c !== "other").forEach(c => {
    const b = document.createElement("button"); b.type = "button"; b.textContent = t("cat." + c);
    b.onclick = () => { bubble(t("cat." + c), "me"); pick(c); };
    chips.append(b);
  });
  chat.append(chips);
}
resetChat();
$("#chatForm").addEventListener("submit", e => {
  e.preventDefault();
  const text = $("#chatIn").value.trim(); if (!text) return;
  bubble(text, "me"); $("#chatIn").value = "";
  const cat = guess(text);
  if (cat) pick(cat, text);
  else { $("#catSel").value = "other"; if (!$("#desc").value) $("#desc").value = text; bubble(t("cmp.helper.unsure"), "bot"); }
});

// ---------- Tracking ----------
$("#trackForm").addEventListener("submit", async e => {
  e.preventDefault();
  const out = $("#trackOut");
  out.innerHTML = `<p class="muted">${esc(t("loading"))}</p>`;
  const { data, error } = await db.rpc("track_complaint", { p_ticket: $("#ticket").value });
  if (error || !data || !data.length) { lastTrack = null; out.innerHTML = `<div class="result error">${esc(t(error ? "err.generic" : "cmp.notfound"))}</div>`; return; }
  lastTrack = data[0]; renderTrack(lastTrack);
});
function renderTrack(c) {
  $("#trackOut").innerHTML = `
    <div class="row" style="justify-content:space-between">
      <div><h3 style="margin:0">${esc(t("cat." + c.category))}</h3><span class="muted small">${esc(c.institution || "")}</span></div>
      <span class="code">${esc(c.ticket_no)}</span>
    </div>
    ${stepper(STATUSES, c.status, "status.")}
    <p class="small muted">${esc(t("cmp.filed"))}: ${esc(fmtDate(c.created_at, true))} · ${esc(t("cmp.updated"))}: ${esc(fmtDate(c.updated_at, true))}</p>
    ${c.officer_note ? `<div class="card" style="box-shadow:none"><b>${esc(t("cmp.note"))}</b><p style="margin:6px 0 0">${esc(c.officer_note)}</p></div>` : ""}`;
}
