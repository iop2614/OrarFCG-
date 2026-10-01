(() => {
  const USER = "Ioan";
  const PASSWORD = "Ianik";
  const SESSION_KEY = "orar-admin-session";
  const GROUPS_KEY = "orar-an2-groups";

  const loginPanel = document.getElementById("login-panel");
  const loginForm = document.getElementById("login-form");
  const loginStatus = document.getElementById("login-status");
  const adminApp = document.getElementById("admin-app");
  const pdfPanel = document.getElementById("pdf-panel");
  const form = document.getElementById("parse-form");
  const statusEl = document.getElementById("form-status");
  const publishedEl = document.getElementById("published");
  const editor = document.getElementById("editor");
  const editorTitle = document.getElementById("editor-title");
  const editorWarnings = document.getElementById("editor-warnings");
  const editorGroups = document.getElementById("editor-groups");
  const editorLessons = document.getElementById("editor-lessons");

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

  function setEditorVisible(visible) {
    editor.hidden = !visible;
    editor.classList.toggle("hidden", !visible);
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
    pdfPanel.hidden = true;
    pdfPanel.classList.add("hidden");
    const schedule = year2FromFile();
    if (!schedule) {
      publishedEl.innerHTML = "<p class='hint'>Lipsește data.js cu orarul anului II.</p>";
      return;
    }
    publishedEl.innerHTML = `<article class="published-card">
      <div>
        <strong>FCG · Anul II</strong>
        <p>zi · toamnă · ${escapeHtml(schedule.au)}. Corectezi orele aici, fără bază de date.</p>
      </div>
      <button type="button" class="btn ghost" id="btn-open-year2">Corectează</button>
    </article>`;
    document.getElementById("btn-open-year2").addEventListener("click", () => openDraft(year2FromFile()));
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

  function openDraft(schedule) {
    draft = structuredClone(schedule);
    activeGroup = draft.groupOrder[0] || "";
    editorTitle.textContent = `${draft.faculty} · Anul ${draft.year} · ${draft.semester}`;
    const warnings = draft.warnings || [];
    editorWarnings.textContent = warnings.length
      ? warnings.join(" ")
      : `${draft.lessonCount || "Orarul"} este gata de verificat. Publicarea înlocuiește orarul cu același an și semestru.`;
    renderGroupTabs();
    renderLessons();
    setEditorVisible(true);
    editor.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderGroupTabs() {
    editorGroups.innerHTML = draft.groupOrder
      .map((code) => {
        const active = code === activeGroup ? " active" : "";
        return `<button type="button" class="group-card${active}" data-group="${escapeHtml(code)}">
          <span class="code">${escapeHtml(code)}</span>
        </button>`;
      })
      .join("");
  }

  function lessonsOf(group) {
    const days = draft.groups[group] || {};
    const rows = [];
    for (const day of draft.days) {
      for (const lesson of days[day] || []) rows.push({ day, lesson });
    }
    rows.sort((a, b) => draft.days.indexOf(a.day) - draft.days.indexOf(b.day) || a.lesson.slot - b.lesson.slot);
    return rows;
  }

  function renderLessons() {
    const rows = lessonsOf(activeGroup);
    const cards = rows
      .map(({ day, lesson }, index) => {
        return `<article class="lesson-edit" data-index="${index}">
          <div class="lesson-edit-top">
            <strong>${escapeHtml(day)} · ora ${lesson.slot}</strong>
            <button type="button" class="btn ghost danger" data-remove="${index}">Șterge</button>
          </div>
          <div class="admin-form compact">
            <label>Ora
              <select data-field="slot">
                ${[1, 2, 3, 4, 5, 6, 7].map((slot) => `<option value="${slot}" ${Number(lesson.slot) === slot ? "selected" : ""}>${slot} · ${times[slot]}</option>`).join("")}
              </select>
            </label>
            <label>Săptămâna
              <select data-field="weeks">
                <option value="both" ${lesson.weeks === "both" ? "selected" : ""}>Ambele</option>
                <option value="impara" ${lesson.weeks === "impara" ? "selected" : ""}>Impară</option>
                <option value="para" ${lesson.weeks === "para" ? "selected" : ""}>Pară</option>
              </select>
            </label>
            <label>Tip
              <select data-field="type">
                <option value="" ${!lesson.type ? "selected" : ""}>—</option>
                <option value="curs" ${lesson.type === "curs" ? "selected" : ""}>curs</option>
                <option value="sem" ${lesson.type === "sem" ? "selected" : ""}>seminar</option>
                <option value="lab" ${lesson.type === "lab" ? "selected" : ""}>laborator</option>
              </select>
            </label>
            <label class="span-2">Disciplina<input data-field="subject" value="${escapeHtml(lesson.subject)}" /></label>
            <label>Cadrul didactic<input data-field="teacher" value="${escapeHtml(lesson.teacher)}" /></label>
            <label>Sala<input data-field="room" value="${escapeHtml(lesson.room)}" /></label>
          </div>
        </article>`;
      })
      .join("");
    editorLessons.innerHTML = `${cards}<button type="button" id="btn-add" class="btn ghost">Adaugă oră</button>`;
  }

  function rowAt(index) {
    return lessonsOf(activeGroup)[index];
  }

  editorGroups.addEventListener("click", (event) => {
    const button = event.target.closest("[data-group]");
    if (!button || !draft) return;
    activeGroup = button.dataset.group;
    renderGroupTabs();
    renderLessons();
  });

  editorLessons.addEventListener("change", (event) => {
    const field = event.target.dataset.field;
    const card = event.target.closest("[data-index]");
    if (!field || !card || !draft) return;
    const row = rowAt(Number(card.dataset.index));
    if (!row) return;
    if (field === "slot") {
      row.lesson.slot = Number(event.target.value);
      row.lesson.time = times[row.lesson.slot];
      return;
    }
    row.lesson[field] = event.target.value;
  });

  editorLessons.addEventListener("click", (event) => {
    if (event.target.id === "btn-add") {
      const day = draft.days[0];
      draft.groups[activeGroup][day].push({
        slot: 1,
        time: times[1],
        weeks: "both",
        subject: "",
        type: "curs",
        teacher: "",
        room: "",
      });
      renderLessons();
      return;
    }
    const remove = event.target.closest("[data-remove]");
    if (!remove || !draft) return;
    const row = rowAt(Number(remove.dataset.remove));
    if (!row) return;
    draft.groups[activeGroup][row.day] = draft.groups[activeGroup][row.day].filter((item) => item !== row.lesson);
    renderLessons();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusEl.textContent = "Citesc PDF-ul…";
    const data = new FormData(form);
    try {
      const response = await fetch("/api/admin/parse", { method: "POST", body: data });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Citirea a eșuat");
      statusEl.textContent = "PDF-ul a fost citit. Verifică orele, apoi publică.";
      openDraft(body.schedule);
    } catch (error) {
      statusEl.textContent = error.message;
    }
  });

  document.getElementById("btn-publish").addEventListener("click", async () => {
    if (!draft) return;
    if (staticMode) {
      localStorage.setItem(GROUPS_KEY, JSON.stringify(draft.groups));
      setEditorVisible(false);
      draft = null;
      showStaticYear2();
      publishedEl.insertAdjacentHTML(
        "afterbegin",
        "<p class='hint'>Orarul anului II a fost salvat. Reîncarcă pagina studenților din acest browser.</p>"
      );
      return;
    }
    statusEl.textContent = "Public…";
    const response = await fetch("/api/admin/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const body = await response.json();
    if (!response.ok) {
      statusEl.textContent = body.error || "Publicarea a eșuat";
      return;
    }
    statusEl.textContent = "Orarul este public. Studenții îl văd la pagina principală.";
    setEditorVisible(false);
    draft = null;
    loadPublished();
  });

  document.getElementById("btn-discard").addEventListener("click", () => {
    draft = null;
    setEditorVisible(false);
    statusEl.textContent = "";
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
      await fetch(`/api/admin/schedules/${encodeURIComponent(remove.dataset.delete)}`, { method: "DELETE" });
      loadPublished();
    }
  });

  function showAdmin() {
    loginPanel.hidden = true;
    loginPanel.classList.add("hidden");
    adminApp.hidden = false;
    adminApp.classList.remove("hidden");
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
