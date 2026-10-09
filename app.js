(() => {
  const STORAGE_KEY = "orar-selection";
  const REF_MONDAY = Date.UTC(2026, 8, 14);

  const programPicker = document.getElementById("program-picker");
  const programGrid = document.getElementById("program-grid");
  const picker = document.getElementById("picker");
  const timetable = document.getElementById("timetable");
  const groupGrid = document.getElementById("group-grid");
  const activeGroupEl = document.getElementById("active-group");
  const weekBoard = document.getElementById("week-board");
  const btnChange = document.getElementById("btn-change");
  const btnProgram = document.getElementById("btn-program");
  const currentWeekLabel = document.getElementById("current-week-label");
  const eyebrow = document.getElementById("eyebrow");
  const subtitle = document.getElementById("subtitle");

  let schedules = [];
  let usingServer = false;
  let selectedId = "";
  let selectedGroup = "";
  let weekMode = "auto";

  const dayNames = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"];

  function currentSchedule() {
    return schedules.find((item) => item.id === selectedId) || null;
  }

  function savedSelection() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function remember() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: selectedId, group: selectedGroup }));
  }

  function legacySchedule(data) {
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
      groups: data.groups,
    };
  }

  function startOfMonday(date) {
    const value = new Date(date);
    const day = (value.getDay() + 6) % 7;
    value.setHours(0, 0, 0, 0);
    value.setDate(value.getDate() - day);
    return value;
  }

  function detectCurrentWeekType(date = new Date()) {
    const monday = startOfMonday(date);
    const mondayUtc = Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate());
    const weeks = Math.round((mondayUtc - REF_MONDAY) / (7 * 24 * 60 * 60 * 1000));
    return weeks % 2 === 0 ? "impara" : "para";
  }

  function effectiveWeek() {
    return weekMode === "auto" ? detectCurrentWeekType() : weekMode;
  }

  function todayDayName() {
    return dayNames[(new Date().getDay() + 6) % 7];
  }

  function escapeHtml(str) {
    return String(str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function weekLabel(weeks) {
    if (weeks === "impara") return "Impară";
    if (weeks === "para") return "Pară";
    return "Ambele";
  }

  function matchesWeek(lesson) {
    const mode = effectiveWeek();
    if (mode === "all") return true;
    if (lesson.weeks === "both") return true;
    return lesson.weeks === mode;
  }

  function setVisible(element, visible) {
    element.hidden = !visible;
    element.classList.toggle("hidden", !visible);
  }

  function updateHeader() {
    const schedule = currentSchedule();
    if (!schedule) return;
    eyebrow.textContent = `UTM · ${schedule.faculty} · a.u. ${schedule.au}`;
    subtitle.textContent = `Anul ${schedule.year} · ${schedule.form} · ${schedule.semester}`;
  }

  function updateWeekStatus() {
    const current = detectCurrentWeekType();
    const showing = effectiveWeek();
    const currentText = weekLabel(current);
    if (weekMode === "auto" || showing === current) {
      currentWeekLabel.innerHTML = `Săptămâna curentă: <strong>${escapeHtml(currentText)}</strong>`;
    } else if (showing === "all") {
      currentWeekLabel.innerHTML = `Săptămâna curentă: <strong>${escapeHtml(currentText)}</strong> · vezi toate`;
    } else {
      currentWeekLabel.innerHTML = `Săptămâna curentă: <strong>${escapeHtml(currentText)}</strong> · afișezi ${escapeHtml(weekLabel(showing)).toLowerCase()}`;
    }
  }

  function syncWeekButtons() {
    document.querySelectorAll(".week-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.week === weekMode);
    });
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

  function renderPrograms() {
    programGrid.innerHTML = orderedSchedules(schedules)
      .map((schedule) => {
        return `<button type="button" class="group-card" data-program="${escapeHtml(schedule.id)}" role="listitem">
          <span class="code">${escapeHtml(schedule.faculty)} · Anul ${escapeHtml(schedule.year)}</span>
          <span class="meta">${escapeHtml(schedule.form)} · ${escapeHtml(schedule.semester)} · ${escapeHtml(schedule.au)}</span>
        </button>`;
      })
      .join("");
  }

  function renderPicker() {
    const schedule = currentSchedule();
    if (!schedule) return;
    groupGrid.innerHTML = schedule.groupOrder
      .map((code) => {
        return `<button type="button" class="group-card" data-group="${escapeHtml(code)}" role="listitem">
          <span class="code">${escapeHtml(code)}</span>
          <span class="meta">Anul ${escapeHtml(schedule.year)} · ${escapeHtml(schedule.form)}</span>
        </button>`;
      })
      .join("");
  }

  function renderLesson(lesson) {
    const type = lesson.type || "";
    const typeBadge = type
      ? `<span class="badge type-${escapeHtml(type)}">${escapeHtml(type)}</span>`
      : "";
    const weekBadge =
      lesson.weeks === "both"
        ? ""
        : `<span class="badge week-${escapeHtml(lesson.weeks)}">${weekLabel(lesson.weeks)}</span>`;
    const teacher = lesson.teacher
      ? `<span><strong>Cadru:</strong> ${escapeHtml(lesson.teacher)}</span>`
      : "";
    const room = lesson.room
      ? `<span><strong>Sala:</strong> ${escapeHtml(lesson.room)}</span>`
      : "";
    return `<article class="lesson ${escapeHtml(type)}">
      <div class="lesson-top">
        <span class="time">${escapeHtml(lesson.time)}</span>
        ${typeBadge}
        ${weekBadge}
      </div>
      <p class="subject">${escapeHtml(lesson.subject || lesson.raw)}</p>
      <div class="meta-row">${teacher}${room}</div>
    </article>`;
  }

  function renderTimetable() {
    const schedule = currentSchedule();
    if (!schedule) return;
    const groupData = schedule.groups[selectedGroup] || {};
    activeGroupEl.textContent = selectedGroup;
    updateWeekStatus();
    syncWeekButtons();
    const today = todayDayName();
    const mode = effectiveWeek();
    weekBoard.innerHTML = schedule.days
      .map((day) => {
        const lessons = (groupData[day] || []).filter(matchesWeek);
        const isToday = day === today;
        const body = lessons.length
          ? lessons.map(renderLesson).join("")
          : `<p class="empty-day">Fără ore în această zi${mode !== "all" ? " (pentru săptămâna selectată)" : ""}.</p>`;
        return `<section class="day-col${isToday ? " today" : ""}">
          <h3 class="day-head">${escapeHtml(day)}${isToday ? " · azi" : ""}</h3>
          <div class="day-body">${body}</div>
        </section>`;
      })
      .join("");
  }

  function showPrograms() {
    setVisible(programPicker, true);
    setVisible(picker, false);
    setVisible(timetable, false);
    renderPrograms();
  }

  function showPicker() {
    setVisible(programPicker, false);
    setVisible(picker, true);
    setVisible(timetable, false);
    setVisible(btnProgram, schedules.length > 1);
    updateHeader();
    renderPicker();
  }

  function showTimetable() {
    setVisible(programPicker, false);
    setVisible(picker, false);
    setVisible(timetable, true);
    setVisible(btnProgram, schedules.length > 1);
    updateHeader();
    renderTimetable();
  }

  function selectProgram(id) {
    selectedId = id;
    const saved = savedSelection();
    const schedule = currentSchedule();
    selectedGroup = saved.id === id && schedule && schedule.groups[saved.group] ? saved.group : "";
    remember();
    if (selectedGroup) showTimetable();
    else showPicker();
  }

  function selectGroup(code) {
    selectedGroup = code;
    remember();
    showTimetable();
  }

  programGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-program]");
    if (!button) return;
    selectProgram(button.dataset.program);
  });

  groupGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-group]");
    if (!button) return;
    selectGroup(button.dataset.group);
  });

  btnChange.addEventListener("click", () => {
    selectedGroup = "";
    remember();
    showPicker();
  });

  btnProgram.addEventListener("click", () => {
    selectedId = "";
    selectedGroup = "";
    remember();
    showPrograms();
  });

  document.querySelectorAll(".week-btn").forEach((button) => {
    button.addEventListener("click", () => {
      weekMode = button.dataset.week;
      renderTimetable();
    });
  });

  function readLocalCatalog() {
    try {
      return JSON.parse(localStorage.getItem("orar-catalog") || "null");
    } catch {
      localStorage.removeItem("orar-catalog");
      return null;
    }
  }

  function newerSchedules(fileBody, localBody) {
    const fileTime = Date.parse(fileBody?.updatedAt || "") || 0;
    const localTime = Date.parse(localBody?.updatedAt || "") || 0;
    const fileList = fileBody?.schedules || [];
    const localList = localBody?.schedules || [];
    if (localList.length && localTime >= fileTime) return localList;
    if (fileList.length) return fileList;
    return localList;
  }

  async function start() {
    let fileBody = null;
    try {
      const remote = await fetch("https://raw.githubusercontent.com/iop2614/OrarFCG-/main/orar.json?t=" + Date.now());
      if (remote.ok) fileBody = await remote.json();
    } catch {
      fileBody = null;
    }
    if (!fileBody) {
      try {
        const file = await fetch("orar.json?t=" + Date.now());
        if (file.ok) fileBody = await file.json();
      } catch {
        fileBody = null;
      }
    }
    const fromFile = fileBody?.schedules?.length ? fileBody.schedules : newerSchedules(null, readLocalCatalog());
    if (fromFile.length) {
      schedules = fromFile;
    } else {
      try {
        const response = await fetch("api/catalog");
        if (!response.ok) throw new Error("offline");
        const body = await response.json();
        schedules = body.schedules || [];
        usingServer = true;
      } catch {
        if (window.ORAR_DATA) {
          const schedule = legacySchedule(window.ORAR_DATA);
          const savedGroups = localStorage.getItem("orar-an2-groups");
          if (savedGroups) {
            try {
              schedule.groups = JSON.parse(savedGroups);
            } catch {
              localStorage.removeItem("orar-an2-groups");
            }
          }
          schedules = [schedule];
        }
      }
    }
    if (!schedules.length) {
      picker.querySelector("h2").textContent = "Niciun orar publicat";
      picker.querySelector(".hint").textContent = "Orarul nu este publicat încă.";
      setVisible(picker, true);
      return;
    }

    if (schedules.length > 1) {
      showPrograms();
      return;
    }
    const saved = savedSelection();
    const known = schedules.find((item) => item.id === saved.id);
    selectedId = known ? known.id : schedules[0].id;
    selectedGroup = known && known.groups[saved.group] ? saved.group : "";
    if (selectedGroup) showTimetable();
    else showPicker();
  }

  start();
})();
