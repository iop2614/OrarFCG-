(() => {
  const USER = "Ioan";
  const PASSWORD = "Ianik";
  const SESSION_KEY = "orar-admin-session";
  const GROUPS_KEY = "orar-an2-groups";
  const CATALOG_KEY = "orar-catalog";
  const TOKEN_KEY = "orar-github-token";
const REMOVED_KEY = "orar-removed-ids";
  const GITHUB_REPO = "iop2614/OrarFCG-";
  const dayNames = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"];

  const loginPanel = document.getElementById("login-panel");
  const loginForm = document.getElementById("login-form");
  const loginStatus = document.getElementById("login-status");
  const adminApp = document.getElementById("admin-app");
  const publishedPanel = document.getElementById("published-panel");
  const publishedEl = document.getElementById("published");
  const editor = document.getElementById("editor");
  const programPicker = document.getElementById("program-picker");
  const programGrid = document.getElementById("program-grid");
  const editPicker = document.getElementById("edit-picker");
  const editBoard = document.getElementById("edit-board");
  const editorTitle = document.getElementById("editor-title");
  const editorWarnings = document.getElementById("editor-warnings");
  const editorGroups = document.getElementById("editor-groups");
  const editorLessons = document.getElementById("editor-lessons");
  const saveStatus = document.getElementById("save-status");
  const backList = document.getElementById("btn-back-list");
  const btnProgram = document.getElementById("btn-program");

  let draft = null;
  let activeGroup = "";
  let staticMode = false;
  let schedules = [];
  const times = {
    1: "08:00–09:30",
    2: "09:45–11:15",
    3: "11:30–13:00",
    4: "13:30–15:00",
    5: "15:15–16:45",
    6: "17:00–18:30",
    7: "18:45–20:15",
  };

  function escapeHtml(str) {
    return String(str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function setVisible(element, visible) {
    if (!element) return;
    element.hidden = !visible;
    element.classList.toggle("hidden", !visible);
  }

  function todayDayName() {
    return dayNames[(new Date().getDay() + 6) % 7];
  }

  function year2FromFile() {
    const data = window.ORAR_DATA;
    if (!data) return null;
    let groups = data.groups;
    const saved = localStorage.getItem(GROUPS_KEY);
    if (saved) {
      try {
        groups = JSON.parse(saved);
      } catch {
        localStorage.removeItem(GROUPS_KEY);
      }
    }
    return {
      id: "fcg-ii-zi-toamna-2026",
      faculty: "FCG",
      facultyName: data.meta?.faculty || "Facultatea de Construcții și Geodezie",
      year: "II",
      form: "zi",
      au: data.meta?.au || "2026-2027",
      semester: "toamnă",
      groupOrder: data.groupOrder,
      days: data.days,
      times: data.times,
      groups,
      warnings: [],
    };
  }

  function readLocalCatalog() {
    try {
      return JSON.parse(localStorage.getItem(CATALOG_KEY) || "null");
    } catch {
      localStorage.removeItem(CATALOG_KEY);
      return null;
    }
  }

  async function readFileCatalog() {
    try {
      const response = await fetch("orar.json");
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  function removedIds() {
    try {
      const list = JSON.parse(localStorage.getItem(REMOVED_KEY) || "[]");
      return new Set(Array.isArray(list) ? list : []);
    } catch {
      return new Set();
    }
  }

  function newerSchedules(fileBody, localBody) {
    const removed = removedIds();
    const map = new Map();
    for (const item of fileBody?.schedules || []) {
      if (item && item.id && !removed.has(item.id)) map.set(item.id, item);
    }
    for (const item of localBody?.schedules || []) {
      if (item && item.id && !removed.has(item.id)) map.set(item.id, item);
    }
    return [...map.values()];
  }

  function catalogPayload() {
    if (draft) {
      const copy = structuredClone(draft);
      const index = schedules.findIndex((item) => item.id === copy.id);
      if (index >= 0) schedules[index] = copy;
      else schedules.push(copy);
    }
    return { updatedAt: new Date().toISOString(), schedules };
  }

  function githubToken() {
    const field = document.getElementById("github-token");
    const typed = field && field.value.trim();
    if (typed) {
      localStorage.setItem(TOKEN_KEY, typed);
      return typed;
    }
    return localStorage.getItem(TOKEN_KEY) || "";
  }

  async function pushOrar(payload) {
    const token = githubToken();
    if (!token) {
      setVisible(document.getElementById("github-key"), true);
      throw new Error("Lipește cheia GitHub, apoi apasă din nou.");
    }
    const api = `https://api.github.com/repos/${GITHUB_REPO}/contents/orar.json`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    };
    const removed = removedIds();
    let lastError = "Orarul nu a putut fi pus pe site.";
    for (let attempt = 0; attempt < 3; attempt += 1) {
      let sha = "";
      let remoteSchedules = [];
      const current = await fetch(`${api}?ref=main&t=${Date.now()}`, { headers, cache: "no-store" });
      if (current.ok) {
        const info = await current.json();
        sha = info.sha || "";
        if (info.content) {
          try {
            const remote = JSON.parse(decodeURIComponent(escape(atob(info.content.replace(/\n/g, "")))));
            remoteSchedules = remote.schedules || [];
          } catch {
            remoteSchedules = [];
          }
        }
      } else if (current.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        throw new Error("Cheia GitHub nu este acceptată. Lipește una nouă.");
      } else if (current.status !== 404) {
        const error = await current.json().catch(() => ({}));
        throw new Error(error.message || "Nu pot citi orarul de pe site.");
      }
      const merged = new Map();
      for (const item of remoteSchedules) {
        if (item && item.id && !removed.has(item.id)) merged.set(item.id, item);
      }
      for (const item of payload.schedules || []) {
        if (item && item.id && !removed.has(item.id)) merged.set(item.id, item);
      }
      const next = { updatedAt: new Date().toISOString(), schedules: [...merged.values()] };
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(next))));
      const body = { message: "Actualizare orar", content, branch: "main" };
      if (sha) body.sha = sha;
      const saved = await fetch(api, { method: "PUT", headers, cache: "no-store", body: JSON.stringify(body) });
      if (saved.ok) {
        schedules = next.schedules;
        localStorage.removeItem(REMOVED_KEY);
        return next;
      }
      const error = await saved.json().catch(() => ({}));
      if (saved.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        throw new Error("Cheia GitHub nu este acceptată. Lipește una nouă.");
      }
      lastError = error.message || lastError;
      if (saved.status !== 409) throw new Error(lastError);
    }
    throw new Error(lastError);
  }

  function schedulesFromJson(body) {
    if (Array.isArray(body)) return { list: body, replace: true };
    if (Array.isArray(body?.schedules)) return { list: body.schedules, replace: true };
    if (body?.groups && body?.groupOrder) return { list: [body], replace: false };
    throw new Error("Fișierul nu este un orar JSON.");
  }

  async function showStaticYear2() {
    staticMode = true;
    setVisible(publishedPanel, false);
    setVisible(document.getElementById("github-key"), true);
    const tokenField = document.getElementById("github-token");
    if (tokenField && !tokenField.value) tokenField.value = localStorage.getItem(TOKEN_KEY) || "";
    document.getElementById("btn-publish").textContent = "Pune pe site";
    const picked = newerSchedules(await readFileCatalog(), readLocalCatalog());
    if (picked.length) {
      schedules = picked;
      if (schedules.length === 1) openDraft(schedules[0]);
      else showPrograms();
      return;
    }
    const schedule = year2FromFile();
    if (!schedule) {
      schedules = [];
      showPrograms();
      return;
    }
    schedules = [schedule];
    openDraft(schedule);
  }

  async function loadPublished() {
    let response;
    try {
      response = await fetch("api/catalog");
    } catch {
      showStaticYear2();
      return;
    }
    if (!response.ok) {
      showStaticYear2();
      return;
    }
    staticMode = false;
    document.getElementById("btn-publish").textContent = "Salvează";
    const body = await response.json();
    schedules = body.schedules || [];
    setVisible(publishedPanel, false);
    if (!schedules.length) {
      schedules = [];
      showPrograms();
      document.getElementById("import-status").textContent = "Niciun orar încă. Importă un fișier JSON.";
      return;
    }
    if (schedules.length === 1) openDraft(schedules[0]);
    else showPrograms();
  }

  function orderedSchedules(list) {
    const rank = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6 };
    return [...list].sort((a, b) => {
      const ay = rank[String(a.year || "").toUpperCase()] || 50;
      const by = rank[String(b.year || "").toUpperCase()] || 50;
      if (ay !== by) return ay - by;
      return String(a.semester || "").localeCompare(String(b.semester || ""), "ro");
    });
  }

  function showPrograms() {
    draft = null;
    activeGroup = "";
    setVisible(publishedPanel, false);
    setVisible(editor, true);
    setVisible(programPicker, true);
    setVisible(editPicker, false);
    setVisible(editBoard, false);
    document.getElementById("admin-eyebrow").textContent = "UTM · FCG";
    document.getElementById("admin-title").textContent = "Orar Construcții";
    document.getElementById("admin-subtitle").textContent = "Toți anii · editare";
    setVisible(document.getElementById("btn-publish-catalog"), staticMode);
    programGrid.innerHTML = orderedSchedules(schedules)
      .map((schedule) => {
        return `<div class="program-item">
          <button type="button" class="group-card" data-program="${escapeHtml(schedule.id)}">
            <span class="code">${escapeHtml(schedule.faculty)} · Anul ${escapeHtml(schedule.year)}</span>
            <span class="meta">${escapeHtml(schedule.form)} · ${escapeHtml(schedule.semester)} · ${escapeHtml(schedule.au)}</span>
          </button>
          <button type="button" class="edit-remove" data-delete="${escapeHtml(schedule.id)}">Șterge</button>
        </div>`;
      })
      .join("");
  }

  function paintHeader() {
    const eyebrow = document.getElementById("admin-eyebrow");
    const title = document.getElementById("admin-title");
    if (!draft) return;
    eyebrow.textContent = `UTM · ${draft.faculty} · a.u. ${draft.au}`;
    title.textContent = "Orar Construcții";
    document.getElementById("admin-subtitle").textContent = `Anul ${draft.year} · ${draft.form} · ${draft.semester} · editare`;
  }

  function openDraft(schedule) {
    draft = structuredClone(schedule);
    activeGroup = "";
    setVisible(publishedPanel, false);
    setVisible(editor, true);
    setVisible(backList, !staticMode);
    paintHeader();
    const warnings = draft.warnings || [];
    editorWarnings.textContent = warnings.join(" ");
    setVisible(editorWarnings, warnings.length > 0);
    showGroupPicker();
  }

  function showGroupPicker() {
    setVisible(programPicker, false);
    setVisible(editPicker, true);
    setVisible(editBoard, false);
    setVisible(backList, !staticMode && schedules.length > 1);
    setVisible(document.getElementById("btn-publish-groups"), staticMode);
    editorGroups.innerHTML = draft.groupOrder
      .map((code) => {
        return `<button type="button" class="group-card" data-group="${escapeHtml(code)}">
          <span class="code">${escapeHtml(code)}</span>
          <span class="meta">Anul ${escapeHtml(draft.year)} · ${escapeHtml(draft.form)}</span>
        </button>`;
      })
      .join("");
  }

  function dayList(day) {
    if (!draft.groups[activeGroup][day]) draft.groups[activeGroup][day] = [];
    return draft.groups[activeGroup][day];
  }

  function lessonCard(day, lesson) {
    const index = dayList(day).indexOf(lesson);
    const type = lesson.type || "";
    return `<article class="lesson ${escapeHtml(type)} editing" data-day="${escapeHtml(day)}" data-index="${index}">
      <div class="lesson-top">
        <select class="edit-time" data-field="slot" aria-label="Ora">
          ${[1, 2, 3, 4, 5, 6, 7].map((slot) => `<option value="${slot}" ${Number(lesson.slot) === slot ? "selected" : ""}>${times[slot]}</option>`).join("")}
        </select>
        <select class="edit-badge badge type-${escapeHtml(type)}" data-field="type" aria-label="Tip">
          <option value="" ${!type ? "selected" : ""}>—</option>
          <option value="curs" ${type === "curs" ? "selected" : ""}>curs</option>
          <option value="sem" ${type === "sem" ? "selected" : ""}>sem</option>
          <option value="lab" ${type === "lab" ? "selected" : ""}>lab</option>
        </select>
        <select class="edit-badge badge week-${escapeHtml(lesson.weeks)}" data-field="weeks" aria-label="Săptămâna">
          <option value="both" ${lesson.weeks === "both" ? "selected" : ""}>Ambele</option>
          <option value="impara" ${lesson.weeks === "impara" ? "selected" : ""}>Impară</option>
          <option value="para" ${lesson.weeks === "para" ? "selected" : ""}>Pară</option>
        </select>
        <button type="button" class="edit-remove" data-remove>Șterge</button>
      </div>
      <input class="edit-subject" data-field="subject" value="${escapeHtml(lesson.subject)}" placeholder="Disciplina" aria-label="Disciplina" />
      <div class="meta-row">
        <label class="edit-meta"><span>Cadru</span><input data-field="teacher" value="${escapeHtml(lesson.teacher)}" placeholder="Cadrul didactic" aria-label="Cadrul didactic" /></label>
        <label class="edit-meta"><span>Sala</span><input data-field="room" value="${escapeHtml(lesson.room)}" placeholder="Sala" aria-label="Sala" /></label>
      </div>
    </article>`;
  }

  function renderBoard() {
    const today = todayDayName();
    editorTitle.textContent = activeGroup;
    editorLessons.innerHTML = draft.days
      .map((day) => {
        const lessons = dayList(day).slice().sort((a, b) => a.slot - b.slot || dayList(day).indexOf(a) - dayList(day).indexOf(b));
        const isToday = day === today;
        const cards = lessons.length
          ? lessons.map((lesson) => lessonCard(day, lesson)).join("")
          : `<p class="empty-day">Fără ore în această zi.</p>`;
        return `<section class="day-col${isToday ? " today" : ""}">
          <h3 class="day-head">${escapeHtml(day)}${isToday ? " · azi" : ""}</h3>
          <div class="day-body">
            ${cards}
            <button type="button" class="btn ghost add-pair" data-add-day="${escapeHtml(day)}">Adaugă pereche</button>
          </div>
        </section>`;
      })
      .join("");
  }

  function showBoard(group) {
    activeGroup = group;
    if (!draft.groups[activeGroup]) draft.groups[activeGroup] = {};
    setVisible(programPicker, false);
    setVisible(editPicker, false);
    setVisible(editBoard, true);
    setVisible(btnProgram, !staticMode && schedules.length > 1);
    saveStatus.textContent = "";
    renderBoard();
  }

  function lessonFromCard(card) {
    const list = dayList(card.dataset.day);
    return list[Number(card.dataset.index)] || null;
  }

  editorGroups.addEventListener("click", (event) => {
    const button = event.target.closest("[data-group]");
    if (!button || !draft) return;
    showBoard(button.dataset.group);
  });

  document.getElementById("btn-change-group").addEventListener("click", () => {
    if (!draft) return;
    showGroupPicker();
  });

  editorLessons.addEventListener("input", (event) => {
    const field = event.target.dataset.field;
    if (!field || field === "slot" || field === "type" || field === "weeks") return;
    const card = event.target.closest("[data-index]");
    const lesson = card && lessonFromCard(card);
    if (!lesson) return;
    lesson[field] = event.target.value;
    saveStatus.textContent = "";
  });

  editorLessons.addEventListener("change", (event) => {
    const field = event.target.dataset.field;
    const card = event.target.closest("[data-index]");
    if (!field || !card || !draft) return;
    const lesson = lessonFromCard(card);
    if (!lesson) return;
    if (field === "slot") {
      lesson.slot = Number(event.target.value);
      lesson.time = times[lesson.slot];
      renderBoard();
      return;
    }
    if (field === "type" || field === "weeks") {
      lesson[field] = event.target.value;
      renderBoard();
    }
  });

  editorLessons.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add-day]");
    if (add && draft) {
      const list = dayList(add.dataset.addDay);
      const used = new Set(list.map((item) => Number(item.slot)));
      let slot = 1;
      while (used.has(slot) && slot < 7) slot += 1;
      list.push({
        slot,
        time: times[slot],
        weeks: "both",
        subject: "",
        type: "curs",
        teacher: "",
        room: "",
      });
      renderBoard();
      const inputs = editorLessons.querySelectorAll(`[data-day="${CSS.escape(add.dataset.addDay)}"] .edit-subject`);
      const last = inputs[inputs.length - 1];
      if (last) last.focus();
      return;
    }
    const remove = event.target.closest("[data-remove]");
    if (!remove || !draft) return;
    const card = remove.closest("[data-index]");
    const lesson = card && lessonFromCard(card);
    if (!lesson) return;
    draft.groups[activeGroup][card.dataset.day] = dayList(card.dataset.day).filter((item) => item !== lesson);
    renderBoard();
  });

  let publishing = false;

  async function publishCatalog() {
    if (publishing) return;
    if (!draft && !schedules.length) return;
    publishing = true;
    try {
      if (staticMode) {
        const payload = catalogPayload();
        saveStatus.textContent = "Pun pe site…";
        document.getElementById("import-status").textContent = "";
        try {
          const published = await pushOrar(payload);
          localStorage.setItem(CATALOG_KEY, JSON.stringify(published));
          localStorage.removeItem(GROUPS_KEY);
          const message = "Orarul este pe site. Studenții îl văd după reîncărcare.";
          saveStatus.textContent = message;
          document.getElementById("import-status").textContent = message;
        } catch (error) {
          saveStatus.textContent = error.message;
          document.getElementById("import-status").textContent = error.message;
        }
        return;
      }
      saveStatus.textContent = "Salvez…";
      const response = await fetch("api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const body = await response.json();
      if (!response.ok) {
        saveStatus.textContent = body.error || "Salvarea a eșuat";
        return;
      }
      const saved = structuredClone(draft);
      const index = schedules.findIndex((item) => item.id === saved.id);
      if (index >= 0) schedules[index] = saved;
      else schedules.push(saved);
      localStorage.removeItem(CATALOG_KEY);
      saveStatus.textContent = "Salvat. Studenții îl văd pe pagina principală.";
    } finally {
      publishing = false;
    }
  }

  document.getElementById("btn-publish").addEventListener("click", publishCatalog);
  document.getElementById("btn-publish-catalog").addEventListener("click", publishCatalog);
  document.getElementById("btn-publish-groups").addEventListener("click", publishCatalog);

  document.getElementById("btn-import").addEventListener("click", () => {
    document.getElementById("json-file").click();
  });
  document.getElementById("btn-import-groups").addEventListener("click", () => {
    document.getElementById("json-file").click();
  });

  document.getElementById("json-file").addEventListener("change", async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    const importStatus = document.getElementById("import-status");
    if (!file) return;
    try {
      const body = JSON.parse(await file.text());
      const parsed = schedulesFromJson(body);
      for (const schedule of parsed.list) {
        if (!schedule.groups || !schedule.groupOrder) throw new Error("Fișierul nu este un orar JSON.");
      }
      for (const schedule of parsed.list) {
        const removed = removedIds();
        removed.delete(schedule.id);
        localStorage.setItem(REMOVED_KEY, JSON.stringify([...removed]));
        const index = schedules.findIndex((item) => item.id === schedule.id);
        if (index >= 0) schedules[index] = schedule;
        else schedules.push(schedule);
      }
      if (!staticMode) {
        const response = await fetch("api/admin/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schedules }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Importul a eșuat");
        localStorage.removeItem(CATALOG_KEY);
      } else {
        localStorage.setItem(CATALOG_KEY, JSON.stringify({ updatedAt: new Date().toISOString(), schedules }));
      }
      importStatus.textContent = staticMode
        ? "Anul din JSON a fost adăugat. Apasă „Pune pe site” ca să apară pentru studenți."
        : "JSON-ul a fost adăugat.";
      if (schedules.length === 1) openDraft(schedules[0]);
      else showPrograms();
    } catch (error) {
      importStatus.textContent = error.message;
      setVisible(programPicker, true);
    }
  });

  function returnToPrograms() {
    if (schedules.length > 1) showPrograms();
    else if (schedules.length === 1) openDraft(schedules[0]);
    else showPrograms();
  }

  backList.addEventListener("click", returnToPrograms);
  btnProgram.addEventListener("click", returnToPrograms);

  programGrid.addEventListener("click", async (event) => {
    const remove = event.target.closest("[data-delete]");
    if (remove) {
      if (!confirm("Ștergi acest orar de pe pagina studenților?")) return;
      if (!staticMode) {
        await fetch(`api/admin/schedules/${encodeURIComponent(remove.dataset.delete)}`, { method: "DELETE" });
      }
      schedules = schedules.filter((item) => item.id !== remove.dataset.delete);
      if (staticMode) {
        const removed = removedIds();
        removed.add(remove.dataset.delete);
        localStorage.setItem(REMOVED_KEY, JSON.stringify([...removed]));
        localStorage.setItem(CATALOG_KEY, JSON.stringify({ updatedAt: new Date().toISOString(), schedules }));
        document.getElementById("import-status").textContent = "Anul a fost scos. Apasă „Pune pe site” ca să dispară și pentru studenți.";
      }
      returnToPrograms();
      return;
    }
    const button = event.target.closest("[data-program]");
    if (!button) return;
    const schedule = schedules.find((item) => item.id === button.dataset.program);
    if (schedule) openDraft(schedule);
  });

  function showAdmin() {
    setVisible(loginPanel, false);
    setVisible(adminApp, true);
    document.getElementById("admin-subtitle").textContent = "Se încarcă orarele…";
    loadPublished().catch(() => showStaticYear2());
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    if (data.get("user") === USER && data.get("password") === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      loginStatus.textContent = "";
      showAdmin();
      return;
    }
    loginStatus.textContent = "Utilizator sau parolă incorectă.";
  });

  if (sessionStorage.getItem(SESSION_KEY) === "1") showAdmin();
})();
