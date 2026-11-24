// English / Hindi strings. Use data-i18n="key" on elements, data-i18n-ph="key" for placeholders.
const STRINGS = {
  en: {
    "nav.home": "Home", "nav.institute": "Institute portal", "nav.complaint": "Report a problem", "nav.admin": "AICTE admin",
    "lang.toggle": "हिंदी", "theme.toggle": "Theme",
    "footer.note": "Prototype for Smart India Hackathon 2026. All colleges and data shown are fictional demo data.",

    "home.eyebrow": "Smart India Hackathon 2026 · SIH26262",
    "home.title": "Approvals that move on time. Compliance that never lapses.",
    "home.lead": "One platform for AICTE approvals: every application is routed through scrutiny, expert visit and committee review with deadlines, every certificate is tracked until it expires, and anyone can report a problem in English or Hindi.",
    "home.cta.institute": "Try the institute portal", "home.cta.complaint": "Report a problem", "home.cta.admin": "Open admin dashboard",
    "home.problem.eyebrow": "The problem", "home.problem.title": "Deadlines slip and nobody notices",
    "home.p1.t": "Files stall between desks", "home.p1.d": "Applications wait in scrutiny or for an expert visit with no clear owner or due date, and institutes cannot see where their file is.",
    "home.p2.t": "Certificates quietly expire", "home.p2.d": "Fire NOCs, structural stability certificates and undertakings run out after approval, and no one is alerted until something goes wrong.",
    "home.p3.t": "Complaints have nowhere to go", "home.p3.d": "Students and parents who see unsafe buildings, fake faculty or extra fees don't know where to report it or what happened next.",
    "home.flow.eyebrow": "How it works", "home.flow.title": "One tracked path from application to ongoing compliance",
    "flow.1.t": "Apply", "flow.1.d": "Institute submits online and gets a tracking number",
    "flow.2.t": "Scrutiny", "flow.2.d": "Documents checked; deficiencies sent back with a deadline",
    "flow.3.t": "Expert visit (EVC)", "flow.3.d": "Visit scheduled and report recorded",
    "flow.4.t": "SAC / SHC", "flow.4.d": "Committee decision",
    "flow.5.t": "Approval", "flow.5.d": "Letter issued",
    "flow.6.t": "Compliance", "flow.6.d": "Certificates tracked; alerts 30 and 7 days before expiry",
    "home.feat.eyebrow": "What's in the prototype", "home.feat.title": "Working today, on a real shared database",
    "feat.1.t": "Live admin dashboard", "feat.1.d": "New complaints and applications appear instantly for officers, on any device.",
    "feat.2.t": "Deadline alerts", "feat.2.d": "Files overdue in a stage and certificates expiring soon are flagged automatically.",
    "feat.3.t": "Public complaints", "feat.3.d": "No sign-in. A guided helper picks the right category. Track by ticket number.",
    "feat.4.t": "Full audit trail", "feat.4.d": "Every stage change and status update is logged with who did it and when.",
    "feat.5.t": "English and Hindi", "feat.5.d": "Every page switches language with one tap.",
    "feat.6.t": "Secure by design", "feat.6.d": "Database row-level security: the public can only file and track; only signed-in officers see records.",
    "home.team.eyebrow": "Team", "home.tech": "Built with HTML, CSS and JavaScript, Supabase (PostgreSQL, realtime, auth) and free static hosting.",

    "inst.title": "Institute portal", "inst.lead": "Submit an approval application, then track it and keep your compliance documents up to date.",
    "inst.tab.new": "New application", "inst.tab.track": "Track application",
    "inst.f.inst": "Institution", "inst.f.kind": "Application type", "inst.f.details": "Details (optional)",
    "inst.f.details.ph": "e.g. B.Tech CSE intake 120 → 180", "inst.submit": "Submit application",
    "inst.done": "Application submitted. Save your tracking number:", "inst.track.now": "Track it now",
    "inst.f.appno": "Application number", "inst.track.btn": "Track",
    "inst.notfound": "No application found with that number.",
    "inst.stage": "Current stage", "inst.since": "in this stage for", "inst.days": "days",
    "inst.history": "History", "inst.docs": "Compliance documents", "inst.nodocs": "No documents on record.",
    "inst.adddoc": "Add or renew a document", "inst.f.doctype": "Document", "inst.f.expiry": "Valid until", "inst.adddoc.btn": "Save document",
    "inst.saved": "Document saved.",

    "cmp.title": "Report a problem", "cmp.lead": "No sign-in needed. Your report goes straight to AICTE officers and you get a ticket number to track it.",
    "cmp.tab.new": "File a report", "cmp.tab.track": "Track a report",
    "cmp.helper.title": "Not sure which category?", "cmp.helper.note": "Guided helper: picks a category from keywords. It is not an AI model.",
    "cmp.helper.hello": "Tell me in a line what happened, or tap one of these:",
    "cmp.helper.ph": "e.g. hostel walls have cracks", "cmp.helper.send": "Send",
    "cmp.helper.picked": "This sounds like: {cat}. I've filled it in the form; check the details and submit.",
    "cmp.helper.unsure": "I couldn't tell the category. I've set it to \"Other\"; you can change it.",
    "cmp.f.inst": "College", "cmp.f.other": "Not in the list", "cmp.f.instname": "College name", "cmp.f.city": "City",
    "cmp.f.cat": "What is the problem?", "cmp.f.desc": "Describe what you saw", "cmp.f.desc.ph": "What, where and since when. At least 10 characters.",
    "cmp.submit": "Submit report", "cmp.done": "Report received. Your ticket number:",
    "cmp.f.ticket": "Ticket number", "cmp.track.btn": "Track", "cmp.notfound": "No report found with that ticket number.",
    "cmp.note": "Officer's note", "cmp.filed": "Filed", "cmp.updated": "Last update",

    "adm.title": "AICTE admin dashboard", "adm.signin": "Officer sign-in", "adm.email": "Email", "adm.password": "Password",
    "adm.signin.btn": "Sign in", "adm.signout": "Sign out",
    "adm.signup.link": "No account? Create one", "adm.signin.link": "Have an account? Sign in",
    "adm.signup": "Create officer account", "adm.signup.btn": "Create account",
    "adm.signup.note": "A new account can't see any records until an existing admin approves it.",
    "adm.signup.check": "Account created. Check your email and click the confirmation link, then come back and sign in.", "adm.notadmin": "This account is signed in but is not an AICTE admin yet.",
    "adm.live": "Live", "adm.k.pending": "Applications in progress", "adm.k.overdue": "Overdue in stage",
    "adm.k.expiring": "Documents expiring ≤30 days", "adm.k.expired": "Documents expired", "adm.k.open": "Open complaints",
    "adm.tab.apps": "Applications", "adm.tab.cmp": "Complaints", "adm.tab.alerts": "Compliance alerts", "adm.tab.audit": "Audit log",
    "adm.c.app": "Application", "adm.c.inst": "Institution", "adm.c.stage": "Stage", "adm.c.days": "Days in stage", "adm.c.action": "Move to",
    "adm.c.ticket": "Ticket", "adm.c.cat": "Category", "adm.c.status": "Status", "adm.c.doc": "Document", "adm.c.expiry": "Expiry",
    "adm.c.when": "When", "adm.c.who": "Who", "adm.c.what": "What", "adm.note.ph": "Note (optional)", "adm.save": "Save",
    "adm.new.cmp": "New complaint received", "adm.new.app": "New application received", "adm.updated": "Saved",
    "adm.overdue": "overdue", "adm.expired": "expired", "adm.dleft": "{n} days left", "adm.dago": "{n} days ago",

    "kind.new": "New institution", "kind.extension": "Extension of approval", "kind.increase_intake": "Increase in intake",
    "kind.new_course": "New course", "kind.closure": "Closure",
    "stage.submitted": "Submitted", "stage.scrutiny": "Scrutiny", "stage.deficiency": "Deficiency raised", "stage.evc": "Expert visit (EVC)",
    "stage.sac_shc": "SAC / SHC", "stage.approved": "Approved", "stage.rejected": "Rejected",
    "cat.safety": "Unsafe building / fire safety", "cat.fake_faculty": "Fake or ghost faculty", "cat.fees": "Extra or illegal fees",
    "cat.infrastructure": "Missing labs / infrastructure", "cat.unapproved": "Unapproved college or course", "cat.other": "Other",
    "status.received": "Received", "status.under_review": "Under review", "status.action_taken": "Action taken", "status.closed": "Closed",
    "act.application_submitted": "Application submitted", "act.stage_changed": "Stage changed", "act.document_added": "Document added",
    "act.complaint_filed": "Complaint filed", "act.complaint_updated": "Complaint updated",
    "err.generic": "Something went wrong. Please try again.", "loading": "Loading…", "choose": "Choose…", "copy": "Copy", "copied": "Copied"
  },
  hi: {
    "nav.home": "होम", "nav.institute": "संस्थान पोर्टल", "nav.complaint": "शिकायत करें", "nav.admin": "AICTE एडमिन",
    "lang.toggle": "English", "theme.toggle": "थीम",
    "footer.note": "स्मार्ट इंडिया हैकथॉन 2026 के लिए प्रोटोटाइप। दिखाए गए सभी कॉलेज और डेटा काल्पनिक डेमो डेटा हैं।",

    "home.eyebrow": "स्मार्ट इंडिया हैकथॉन 2026 · SIH26262",
    "home.title": "समय पर मंज़ूरी। अनुपालन जो कभी न चूके।",
    "home.lead": "AICTE मंज़ूरी के लिए एक प्लेटफ़ॉर्म: हर आवेदन जाँच, विशेषज्ञ दौरे और समिति समीक्षा से समय-सीमा के साथ गुज़रता है, हर प्रमाणपत्र की समाप्ति तक निगरानी होती है, और कोई भी हिंदी या अंग्रेज़ी में शिकायत कर सकता है।",
    "home.cta.institute": "संस्थान पोर्टल देखें", "home.cta.complaint": "शिकायत करें", "home.cta.admin": "एडमिन डैशबोर्ड खोलें",
    "home.problem.eyebrow": "समस्या", "home.problem.title": "समय-सीमा निकल जाती है और किसी को पता नहीं चलता",
    "home.p1.t": "फ़ाइलें मेज़ों के बीच अटकती हैं", "home.p1.d": "आवेदन जाँच या विशेषज्ञ दौरे के इंतज़ार में बिना ज़िम्मेदार व्यक्ति या तारीख़ के पड़े रहते हैं, और संस्थान नहीं देख पाते कि फ़ाइल कहाँ है।",
    "home.p2.t": "प्रमाणपत्र चुपचाप समाप्त हो जाते हैं", "home.p2.d": "मंज़ूरी के बाद फ़ायर NOC, संरचनात्मक स्थिरता प्रमाणपत्र और शपथपत्र समाप्त हो जाते हैं, और कुछ गलत होने तक कोई सूचना नहीं मिलती।",
    "home.p3.t": "शिकायतों का कोई ठिकाना नहीं", "home.p3.d": "असुरक्षित इमारत, फ़र्ज़ी शिक्षक या अतिरिक्त फ़ीस देखने वाले छात्र और अभिभावक नहीं जानते कि कहाँ शिकायत करें या आगे क्या हुआ।",
    "home.flow.eyebrow": "यह कैसे काम करता है", "home.flow.title": "आवेदन से लेकर लगातार अनुपालन तक एक ट्रैक किया गया रास्ता",
    "flow.1.t": "आवेदन", "flow.1.d": "संस्थान ऑनलाइन जमा करता है और ट्रैकिंग नंबर पाता है",
    "flow.2.t": "जाँच", "flow.2.d": "दस्तावेज़ जाँचे जाते हैं; कमियाँ समय-सीमा के साथ लौटाई जाती हैं",
    "flow.3.t": "विशेषज्ञ दौरा (EVC)", "flow.3.d": "दौरा तय और रिपोर्ट दर्ज",
    "flow.4.t": "SAC / SHC", "flow.4.d": "समिति का निर्णय",
    "flow.5.t": "मंज़ूरी", "flow.5.d": "पत्र जारी",
    "flow.6.t": "अनुपालन", "flow.6.d": "प्रमाणपत्रों की निगरानी; समाप्ति से 30 और 7 दिन पहले अलर्ट",
    "home.feat.eyebrow": "प्रोटोटाइप में क्या है", "home.feat.title": "आज ही काम करता है, असली साझा डेटाबेस पर",
    "feat.1.t": "लाइव एडमिन डैशबोर्ड", "feat.1.d": "नई शिकायतें और आवेदन अधिकारियों को किसी भी डिवाइस पर तुरंत दिखते हैं।",
    "feat.2.t": "समय-सीमा अलर्ट", "feat.2.d": "किसी चरण में देर से चल रही फ़ाइलें और जल्द समाप्त होने वाले प्रमाणपत्र अपने-आप चिह्नित होते हैं।",
    "feat.3.t": "सार्वजनिक शिकायतें", "feat.3.d": "साइन-इन नहीं। एक सहायक सही श्रेणी चुनता है। टिकट नंबर से ट्रैक करें।",
    "feat.4.t": "पूरा ऑडिट रिकॉर्ड", "feat.4.d": "हर चरण बदलाव और स्थिति अपडेट किसने और कब किया, दर्ज होता है।",
    "feat.5.t": "हिंदी और अंग्रेज़ी", "feat.5.d": "हर पेज एक टैप में भाषा बदलता है।",
    "feat.6.t": "सुरक्षित डिज़ाइन", "feat.6.d": "डेटाबेस रो-लेवल सुरक्षा: जनता केवल शिकायत दर्ज और ट्रैक कर सकती है; रिकॉर्ड केवल साइन-इन अधिकारी देखते हैं।",
    "home.team.eyebrow": "टीम", "home.tech": "HTML, CSS और JavaScript, Supabase (PostgreSQL, रियलटाइम, ऑथ) और मुफ़्त होस्टिंग से बना।",

    "inst.title": "संस्थान पोर्टल", "inst.lead": "मंज़ूरी का आवेदन जमा करें, फिर उसे ट्रैक करें और अनुपालन दस्तावेज़ अपडेट रखें।",
    "inst.tab.new": "नया आवेदन", "inst.tab.track": "आवेदन ट्रैक करें",
    "inst.f.inst": "संस्थान", "inst.f.kind": "आवेदन का प्रकार", "inst.f.details": "विवरण (वैकल्पिक)",
    "inst.f.details.ph": "जैसे B.Tech CSE सीटें 120 → 180", "inst.submit": "आवेदन जमा करें",
    "inst.done": "आवेदन जमा हो गया। अपना ट्रैकिंग नंबर सहेजें:", "inst.track.now": "अभी ट्रैक करें",
    "inst.f.appno": "आवेदन संख्या", "inst.track.btn": "ट्रैक करें",
    "inst.notfound": "इस नंबर का कोई आवेदन नहीं मिला।",
    "inst.stage": "वर्तमान चरण", "inst.since": "इस चरण में", "inst.days": "दिन",
    "inst.history": "इतिहास", "inst.docs": "अनुपालन दस्तावेज़", "inst.nodocs": "कोई दस्तावेज़ दर्ज नहीं।",
    "inst.adddoc": "दस्तावेज़ जोड़ें या नवीनीकरण करें", "inst.f.doctype": "दस्तावेज़", "inst.f.expiry": "मान्य तिथि तक", "inst.adddoc.btn": "दस्तावेज़ सहेजें",
    "inst.saved": "दस्तावेज़ सहेजा गया।",

    "cmp.title": "शिकायत करें", "cmp.lead": "साइन-इन की ज़रूरत नहीं। आपकी शिकायत सीधे AICTE अधिकारियों तक जाती है और आपको ट्रैक करने के लिए टिकट नंबर मिलता है।",
    "cmp.tab.new": "शिकायत दर्ज करें", "cmp.tab.track": "शिकायत ट्रैक करें",
    "cmp.helper.title": "श्रेणी को लेकर पक्का नहीं?", "cmp.helper.note": "सहायक: शब्दों से श्रेणी चुनता है। यह AI मॉडल नहीं है।",
    "cmp.helper.hello": "एक पंक्ति में बताइए क्या हुआ, या इनमें से एक चुनें:",
    "cmp.helper.ph": "जैसे हॉस्टल की दीवारों में दरारें हैं", "cmp.helper.send": "भेजें",
    "cmp.helper.picked": "यह लगता है: {cat}। मैंने फ़ॉर्म में भर दिया है; विवरण जाँचें और जमा करें।",
    "cmp.helper.unsure": "श्रेणी समझ नहीं आई। मैंने \"अन्य\" चुना है; आप बदल सकते हैं।",
    "cmp.f.inst": "कॉलेज", "cmp.f.other": "सूची में नहीं है", "cmp.f.instname": "कॉलेज का नाम", "cmp.f.city": "शहर",
    "cmp.f.cat": "समस्या क्या है?", "cmp.f.desc": "आपने क्या देखा, बताइए", "cmp.f.desc.ph": "क्या, कहाँ और कब से। कम से कम 10 अक्षर।",
    "cmp.submit": "शिकायत जमा करें", "cmp.done": "शिकायत मिल गई। आपका टिकट नंबर:",
    "cmp.f.ticket": "टिकट नंबर", "cmp.track.btn": "ट्रैक करें", "cmp.notfound": "इस टिकट नंबर की कोई शिकायत नहीं मिली।",
    "cmp.note": "अधिकारी की टिप्पणी", "cmp.filed": "दर्ज", "cmp.updated": "अंतिम अपडेट",

    "adm.title": "AICTE एडमिन डैशबोर्ड", "adm.signin": "अधिकारी साइन-इन", "adm.email": "ईमेल", "adm.password": "पासवर्ड",
    "adm.signin.btn": "साइन इन", "adm.signout": "साइन आउट",
    "adm.signup.link": "खाता नहीं है? बनाएँ", "adm.signin.link": "खाता है? साइन इन करें",
    "adm.signup": "अधिकारी खाता बनाएँ", "adm.signup.btn": "खाता बनाएँ",
    "adm.signup.note": "नया खाता तब तक कोई रिकॉर्ड नहीं देख सकता जब तक मौजूदा एडमिन उसे मंज़ूरी न दे।",
    "adm.signup.check": "खाता बन गया। अपना ईमेल देखें और पुष्टि लिंक पर क्लिक करें, फिर वापस आकर साइन इन करें।", "adm.notadmin": "यह खाता साइन-इन है, पर अभी AICTE एडमिन नहीं है।",
    "adm.live": "लाइव", "adm.k.pending": "चल रहे आवेदन", "adm.k.overdue": "चरण में देरी",
    "adm.k.expiring": "≤30 दिन में समाप्त दस्तावेज़", "adm.k.expired": "समाप्त दस्तावेज़", "adm.k.open": "खुली शिकायतें",
    "adm.tab.apps": "आवेदन", "adm.tab.cmp": "शिकायतें", "adm.tab.alerts": "अनुपालन अलर्ट", "adm.tab.audit": "ऑडिट लॉग",
    "adm.c.app": "आवेदन", "adm.c.inst": "संस्थान", "adm.c.stage": "चरण", "adm.c.days": "चरण में दिन", "adm.c.action": "आगे भेजें",
    "adm.c.ticket": "टिकट", "adm.c.cat": "श्रेणी", "adm.c.status": "स्थिति", "adm.c.doc": "दस्तावेज़", "adm.c.expiry": "समाप्ति",
    "adm.c.when": "कब", "adm.c.who": "किसने", "adm.c.what": "क्या", "adm.note.ph": "टिप्पणी (वैकल्पिक)", "adm.save": "सहेजें",
    "adm.new.cmp": "नई शिकायत मिली", "adm.new.app": "नया आवेदन मिला", "adm.updated": "सहेजा गया",
    "adm.overdue": "देरी", "adm.expired": "समाप्त", "adm.dleft": "{n} दिन बाकी", "adm.dago": "{n} दिन पहले",

    "kind.new": "नया संस्थान", "kind.extension": "मंज़ूरी का विस्तार", "kind.increase_intake": "सीटों में वृद्धि",
    "kind.new_course": "नया पाठ्यक्रम", "kind.closure": "बंद करना",
    "stage.submitted": "जमा", "stage.scrutiny": "जाँच", "stage.deficiency": "कमी बताई गई", "stage.evc": "विशेषज्ञ दौरा (EVC)",
    "stage.sac_shc": "SAC / SHC", "stage.approved": "मंज़ूर", "stage.rejected": "अस्वीकृत",
    "cat.safety": "असुरक्षित इमारत / अग्नि सुरक्षा", "cat.fake_faculty": "फ़र्ज़ी शिक्षक", "cat.fees": "अतिरिक्त या अवैध फ़ीस",
    "cat.infrastructure": "लैब / सुविधाएँ नहीं", "cat.unapproved": "बिना मंज़ूरी कॉलेज या कोर्स", "cat.other": "अन्य",
    "status.received": "प्राप्त", "status.under_review": "समीक्षा में", "status.action_taken": "कार्रवाई की गई", "status.closed": "बंद",
    "act.application_submitted": "आवेदन जमा", "act.stage_changed": "चरण बदला", "act.document_added": "दस्तावेज़ जोड़ा",
    "act.complaint_filed": "शिकायत दर्ज", "act.complaint_updated": "शिकायत अपडेट",
    "err.generic": "कुछ गलत हो गया। फिर से कोशिश करें।", "loading": "लोड हो रहा है…", "choose": "चुनें…", "copy": "कॉपी", "copied": "कॉपी हुआ"
  }
};

function getLang() {
  try { return localStorage.getItem("pramaan_lang") === "hi" ? "hi" : "en"; } catch { return "en"; }
}
let LANG = getLang();

function t(key, vars) {
  let s = (STRINGS[LANG] && STRINGS[LANG][key]) || STRINGS.en[key] || key;
  if (vars) for (const k in vars) s = s.replace("{" + k + "}", vars[k]);
  return s;
}

function applyI18n(root = document) {
  document.documentElement.lang = LANG;
  root.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
}

function setLang(l) {
  LANG = l;
  try { localStorage.setItem("pramaan_lang", l); } catch {}
  applyI18n();
  document.dispatchEvent(new CustomEvent("langchange"));
}
