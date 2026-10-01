(() => {
  const USER = "Ioan";
  const PASSWORD = "Ianik";
  const SESSION_KEY = "orar-admin-session";
  const GROUPS_KEY = "orar-an2-groups";
  const dayNames = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"];

  const loginPanel = document.getElementById("login-panel");
  const loginForm = document.getElementById("login-form");
  const loginStatus = document.getElementById("login-status");
  const adminApp = document.getElementById("admin-app");
  const pdfPanel = document.getElementById("pdf-panel");
  const form = document.getElementById("parse-form");
  const statusEl = document.getElementById("form-status");
  const publishedPanel = document.getElementById("published-panel");
  const publishedEl = document.getElementById("published");
  const editor = document.getElementById("editor");
  const editPicker = document.getElementById("edit-picker");
  const editBoard = document.getElementById("edit-board");
  const editorTitle = document.getElementById("editor-title");
  const editorWarnings = document.getElementById("editor-warnings");
  const editorGroups = document.getElementById("editor-groups");
  const editorLessons = document.getElementById("editor-lessons");
  const saveStatus = document.getElementById("save-status");
  const backList = document.getElementById("btn-back-list");

  let draft = null;
  let activeGroup = "";
  let staticMode = false;
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

  function showStaticYear2() {
    staticMode = true;
    setVisible(pdfPanel, false);
    setVisible(publishedPanel, false);
    const schedule = year2FromFile();
    if (!schedule) {
      setVisible(publishedPanel, true);
      publishedEl.innerHTML = "<p class='hint'>Lipsește data.js cu orarul anului II.</p>";
      return;
    }
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
    const body = await response.json();
    const schedules = body.schedules || [];
    if (!schedules.length) {
      publishedEl.innerHTML = "<p class='hint'>Niciun orar publicat încă.</p>";
      return;
    }
    publishedEl.innerHTML = schedules
      .map((schedule) => {
        const count = Object.values(schedule.groups || {}).reduce(
          (sum, days) => sum + Object.values(days).reduce((inner, list) => inner + list.length, 0),
          0
        );
        return `<article class="published-card">
          <div>
            <strong>${escapeHtml(schedule.faculty)} · Anul ${escapeHtml(schedule.year)}</strong>
            <p>${escapeHtml(schedule.form)} · ${escapeHtml(schedule.semester)} · ${escapeHtml(schedule.au)} · ${count} ore</p>
          </div>
          <div class="editor-actions">
            <button type="button" class="btn ghost" data-edit="${escapeHtml(schedule.id)}">Corectează</button>
            <button type="button" class="btn ghost danger" data-delete="${escapeHtml(schedule.id)}">Șterge</button>
          </div>
        </article>`;
      })
      .join("");
    publishedEl._schedules = schedules;
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
    setVisible(pdfPanel, false);
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
    setVisible(editPicker, true);
    setVisible(editBoard, false);
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
    setVisible(editPicker, false);
    setVisible(editBoard, true);
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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusEl.textContent = "Citesc PDF-ul…";
    const data = new FormData(form);
    try {
      const response = await fetch("api/admin/parse", { method: "POST", body: data });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Citirea a eșuat");
      statusEl.textContent = "";
      openDraft(body.schedule);
    } catch (error) {
      statusEl.textContent = error.message;
    }
  });

  document.getElementById("btn-publish").addEventListener("click", async () => {
    if (!draft) return;
    if (staticMode) {
      localStorage.setItem(GROUPS_KEY, JSON.stringify(draft.groups));
      saveStatus.textContent = "Salvat în acest browser.";
      return;
    }
    saveStatus.textContent = "Salvez…";
    const response = await fetch("api/admin/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const body = await response.json();
    saveStatus.textContent = response.ok ? "Salvat. Studenții îl văd pe pagina principală." : body.error || "Salvarea a eșuat";
  });

  backList.addEventListener("click", () => {
    draft = null;
    setVisible(editor, false);
    setVisible(pdfPanel, true);
    setVisible(publishedPanel, true);
    document.getElementById("admin-title").textContent = "Administrare";
    document.getElementById("admin-subtitle").textContent = "Orarul anului II";
    loadPublished();
  });

  publishedEl.addEventListener("click", async (event) => {
    const edit = event.target.closest("[data-edit]");
    const remove = event.target.closest("[data-delete]");
    if (edit) {
      const schedule = (publishedEl._schedules || []).find((item) => item.id === edit.dataset.edit);
      if (schedule) openDraft(schedule);
    }
    if (remove) {
      if (!confirm("Ștergi acest orar de pe pagina studenților?")) return;
      await fetch(`api/admin/schedules/${encodeURIComponent(remove.dataset.delete)}`, { method: "DELETE" });
      loadPublished();
    }
  });

  function showAdmin() {
    setVisible(loginPanel, false);
    setVisible(adminApp, true);
    document.getElementById("admin-subtitle").textContent = "Orarul anului II";
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
