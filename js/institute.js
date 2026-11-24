renderChrome("institute.html");
const tabs = $("#tabs");
setupTabs(tabs);
let lastTracked = null;

function fillForm() {
  fillInstitutionSelect($("#instSel"));
  fillOptions($("#kindSel"), "kind.", KINDS, true);
}

loadInstitutions().then(fillForm).catch(() => toast(t("err.generic")));
document.addEventListener("langchange", () => {
  const inst = $("#instSel").value; fillForm(); $("#instSel").value = inst;
  if (lastTracked) renderTrack(lastTracked);
});

$("#appForm").addEventListener("submit", async e => {
  e.preventDefault();
  const btn = e.submitter; btn.disabled = true;
  const { data, error } = await db.rpc("submit_application", {
    p_institution_id: Number($("#instSel").value), p_kind: $("#kindSel").value, p_details: $("#details").value
  });
  btn.disabled = false;
  const out = $("#appResult");
  out.hidden = false;
  if (error) { out.className = "result error"; out.textContent = t("err.generic"); return; }
  out.className = "result";
  out.innerHTML = `<p>${esc(t("inst.done"))}</p><div class="row"><span class="code">${esc(data)}</span></div>`;
  const row = out.querySelector(".row");
  row.append(copyBtn(data));
  const go = document.createElement("button");
  go.type = "button"; go.className = "btn small"; go.textContent = t("inst.track.now");
  go.onclick = () => { $("#appNo").value = data; showTab(tabs, "track"); track(data); };
  row.append(go);
  e.target.reset();
});

$("#trackForm").addEventListener("submit", e => { e.preventDefault(); track($("#appNo").value); });

async function track(no) {
  const out = $("#trackOut");
  out.innerHTML = `<p class="muted">${esc(t("loading"))}</p>`;
  const { data, error } = await db.rpc("track_application", { p_app_no: no });
  if (error || !data) { lastTracked = null; out.innerHTML = `<div class="result error">${esc(t(error ? "err.generic" : "inst.notfound"))}</div>`; return; }
  lastTracked = data;
  renderTrack(data);
}

function renderTrack(a) {
  const out = $("#trackOut");
  const shown = a.stage === "deficiency" ? "scrutiny" : a.stage === "rejected" ? "sac_shc" : a.stage;
  const flag = a.stage === "deficiency" ? `<span class="pill warn">${esc(t("stage.deficiency"))}</span>`
             : a.stage === "rejected" ? `<span class="pill bad">${esc(t("stage.rejected"))}</span>` : "";
  out.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <div><h3 style="margin:0">${esc(a.institution.name)}</h3>
        <span class="muted small">${esc(a.institution.aicte_id)} · ${esc(a.institution.city)}, ${esc(a.institution.state)} · ${esc(t("kind." + a.kind))}</span></div>
      <span class="code">${esc(a.app_no)}</span>
    </div>
    ${stepper(PATH, shown, "stage.")}
    <p>${esc(t("inst.stage"))}: <b>${esc(t("stage." + a.stage))}</b> ${flag}
      <span class="muted">· ${esc(t("inst.since"))} ${daysSince(a.stage_since)} ${esc(t("inst.days"))}</span></p>
    <div class="two" style="margin-top:20px;align-items:start">
      <div>
        <h3>${esc(t("inst.history"))}</h3>
        <div class="table-wrap"><table><tbody>
          ${a.history.map(h => `<tr><td>${esc(fmtDate(h.at, true))}</td><td>${esc(t("act." + h.action))}<span class="sub">${esc(actDetail(h))}</span></td></tr>`).join("")}
        </tbody></table></div>
      </div>
      <div>
        <h3>${esc(t("inst.docs"))}</h3>
        ${a.documents.length ? `<div class="table-wrap"><table><tbody>
          ${a.documents.map(d => `<tr><td>${esc(d.doc_type)}<span class="sub">${esc(fmtDate(d.expiry_date))}</span></td><td>${expiryPill(d.expiry_date)}</td></tr>`).join("")}
        </tbody></table></div>` : `<p class="muted">${esc(t("inst.nodocs"))}</p>`}
        <form id="docForm" class="card" style="margin-top:12px;box-shadow:none">
          <b>${esc(t("inst.adddoc"))}</b>
          <label>${esc(t("inst.f.doctype"))}<input id="docType" required maxlength="80" list="docTypes"></label>
          <datalist id="docTypes"><option>Fire safety NOC</option><option>Structural stability certificate</option><option>Land / lease deed</option><option>Affidavit / undertaking</option></datalist>
          <label>${esc(t("inst.f.expiry"))}<input id="docExpiry" type="date" required></label>
          <div><button class="btn small" type="submit">${esc(t("inst.adddoc.btn"))}</button></div>
        </form>
      </div>
    </div>`;
  $("#docForm").addEventListener("submit", async e => {
    e.preventDefault();
    const btn = e.submitter; btn.disabled = true;
    const { error } = await db.rpc("add_document", { p_app_no: a.app_no, p_doc_type: $("#docType").value, p_expiry: $("#docExpiry").value });
    btn.disabled = false;
    if (error) { toast(t("err.generic")); return; }
    toast(t("inst.saved"));
    track(a.app_no);
  });
}

// Open ?app=APP-... directly
const q = new URLSearchParams(location.search).get("app");
if (q) { $("#appNo").value = q; showTab(tabs, "track"); track(q); }
