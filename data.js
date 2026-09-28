// ============================================================
// ORAR ANUL II — 2026-2027
// Semestrul de toamnă
// Sursa: „Orar anul II zi CFDP.pdf”
// ============================================================

window.ORAR_DATA = {
  meta: {
    title: "Orarul activităților didactice a.u. 2026-2027, semestrul de toamnă",
    year: "Anul II",
    source: "Orar anul II zi CFDP.pdf",
    weekTypes: ["impara", "para"],

    slots: {
      1: "08:00–09:30",
      2: "09:45–11:15",
      3: "11:30–13:00",
      4: "13:30–15:00",
      5: "15:15–16:45",
      6: "17:00–18:30",
      7: "18:45–20:15"
    },

    groups: [
      "CIC-2501",
      "IMC-2502",
      "IGC-2503",
      "EDI-2504",
      "IAPC-2505",
      "CFDP-251",
      "ISTGCC-251",
      "ISTGCC-251 D"
    ]
  },

  groups: {

    // ==========================================================
    // CIC-2501
    // ==========================================================
    "CIC-2501": {

      "Luni": [
        E("ME/RI (lab)", "lab", "a.u. Șaragov I.", "9-134", "impara", 1),
        E("Proiectare de construcții I", "", "a.u. Țurcanu I.", "10-129", "para", 1),
        E("Mecanica aplicată a fluidelor RI (curs)", "curs",
          "conf.univ., dr. Chetrari N./Șaragov I./Leancă L.", "9-142", "both", 2),
        E("Mecanica aplicată a fluidelor RI (curs)", "curs",
          "conf.univ., dr. Chetrari N./Șaragov I./Leancă L.", "9-142", "both", 3),
        E("ME/RI (sem)", "sem",
          "conf.univ., dr. Chetrari N., Leancă L.", "9-142", "both", 4)
      ],

      "Marți": [
        E("Bazele statului și dreptului (curs)", "curs",
          "conf.univ., dr. Ursu V.", "10-309", "both", 3),
        E("Clădiri civile (curs)", "curs",
          "conf.univ., dr. Ciobanu N.", "10-302", "both", 4),
        E("L. străină III", "", "", "10-113, 122A, 123, 124", "both", 5)
      ],

      "Miercuri": [
        E("Economia construcțiilor (curs)", "curs",
          "conf.univ., dr. Albu I.", "10-129", "both", 1),
        E("Rezistența materialelor (curs)", "curs",
          "conf.univ., dr. Balan V.", "10-129", "both", 2),
        E("Economia construcțiilor (sem)", "sem",
          "conf.univ., dr. Albu I.", "10-336", "both", 3),
        E("Rezistența materialelor (lab)", "lab",
          "conf.univ., dr. Balan V.", "10-124", "impara", 4)
      ],

      "Joi": [
        E("Matematici speciale (curs)", "curs",
          "conf.univ., dr. Leah I.", "10-129", "both", 4),
        E("Matematici speciale (sem)", "sem",
          "Ciuhrii V.", "10-108", "para", 5)
      ],

      "Vineri": [
        E("Rezistența materialelor (curs)", "curs",
          "conf.univ., dr. Balan V.", "10-113", "both", 1),
        E("Rezistența materialelor (sem)", "sem",
          "conf.univ., dr. Balan E.", "10-108", "both", 2),
        E("Clădiri civile (sem)", "sem",
          "a.u. Țurcanu I.", "10-123", "both", 3)
      ]
    },

    // ==========================================================
    // IMC-2502
    // ==========================================================
    "IMC-2502": {

      "Luni": [
        E("ME/RI (lab)", "lab",
          "a.u. Șaragov I.", "9-134", "both", 1),
        E("Geodezie tridimensională (lab)", "lab",
          "a.u. Botnaru D.", "10-105", "both", 2),
        E("Clădiri civile (sem)", "sem",
          "Rudic O.", "10-231", "both", 3),
        E("ME/RI (sem)", "sem",
          "conf.univ., dr. Chetrari N., Leancă L.", "9-142", "both", 4)
      ],

      "Marți": [
        E("Clădiri civile (sem)", "sem",
          "a.u. Țurcanu I.", "10-112", "both", 1),
        E("Geologie inginerească (curs)", "curs",
          "conf.univ., dr. Râșcovoi A.", "10-129", "both", 2),
        E("Bazele statului și dreptului (curs)", "curs",
          "conf.univ., dr. Ursu V.", "10-309", "both", 3),
        E("Clădiri civile (curs)", "curs",
          "conf.univ., dr. Ciobanu N.", "10-309", "both", 4),
        E("L. străină III", "", "",
          "10-113, 122A, 123, 124", "both", 5)
      ],

      "Miercuri": [
        E("Statistica în construcții și imobiliare (lab)", "lab",
          "conf.univ., dr. Albu D.", "10-230", "both", 2),
        E("Statistica în construcții și imobiliare (curs)", "curs",
          "conf.univ., dr. Albu D.", "10-335", "both", 3),
        E("Geologie inginerească (curs)", "curs",
          "conf.univ., dr. Râșcovoi", "10-129", "para", 4)
      ],

      "Joi": [
        E("Economia construcțiilor (sem)", "sem",
          "conf.univ., dr. Albu I.", "10-336", "impara", 1),
        E("Urbanism și sistematizarea teritoriului (curs)", "curs",
          "conf.univ., dr. Grozavu N.", "10-129", "para", 2),
        E("Geologie inginerească (curs)", "curs",
          "conf.univ., dr. Râșcovoi", "10-129", "impara", 3),
        E("Urbanism și sistematizarea teritoriului (sem)", "sem",
          "conf.univ., dr. Sîli A.", "10-231", "para", 3),
        E("Urbanism și sistematizarea teritoriului (sem)", "sem",
          "conf.univ., dr. Sîli A.", "10-231", "para", 4)
      ],

      "Vineri": [
        E("Geologia inginerească (sem)", "sem",
          "a.u. Platon I.", "9-P18", "impara", 2),
        E("Geologia inginerească (lab)", "lab",
          "l.u., dr. Ceban O.", "10-006", "para", 2)
      ]
    },

    // ==========================================================
    // IGC-2503
    // ==========================================================
    "IGC-2503": {

      "Luni": [
        E("Geodezie tridimensională (curs)", "curs",
          "conf.univ., dr. Ovdii M.", "10-113", "both", 1),
        E("Geodezie tridimensională (lab)", "lab",
          "a.u. Botnaru D.", "10-105", "both", 2),
        E("Clădiri civile (sem)", "sem",
          "Rudic O.", "10-231", "both", 3)
      ],

      "Marți": [
        E("Teoria erorilor și statistica matematică (sem)", "sem",
          "a.u. Cătărău N.", "10-108", "both", 1),
        E("Măsurători terestre (lab)", "lab",
          "a.u. Cătărău N.", "10-104", "both", 2),
        E("Bazele statului și dreptului (curs)", "curs",
          "conf.univ., dr. Ursu V.", "10-309", "both", 3),
        E("Clădiri civile (curs)", "curs",
          "conf.univ., dr. Ciobanu N.", "10-309", "both", 4),
        E("L. străină III", "", "",
          "10-113, 122A, 123, 124", "both", 5)
      ],

      "Miercuri": [
        E("Sisteme geoinformaționale (lab)", "lab",
          "a.u. Pantaz A.", "10-105", "both", 1),
        E("Sisteme geoinformaționale (sem)", "sem",
          "a.u. Pantaz A.", "10-105", "impara", 2),
        E("Măsurători terestre (sem)", "sem",
          "a.u. Cătărău N.", "10-112", "para", 2),
        E("Măsurători terestre (curs)", "curs",
          "conf.univ., dr. Vlasenco A.", "10-112", "both", 3),
        E("Teoria erorilor și statistica matematică (curs)", "curs",
          "conf.univ., dr. Vlasenco A.", "10-112", "both", 4)
      ],

      "Joi": [
        E("Urbanism și sistematizarea teritoriului (sem)", "sem",
          "conf.univ., dr. Sîli A.", "10-231", "both", 1),
        E("Urbanism și sistematizarea teritoriului (curs)", "curs",
          "conf.univ., dr. Grozavu N.", "10-129", "both", 2)
      ],

      "Vineri": [
        E("Sisteme geoinformaționale (curs)", "curs",
          "conf.univ. Sârbu R.", "10-129", "para", 2)
      ]
    },

    // ==========================================================
    // EDI-2504
    // ==========================================================
    "EDI-2504": {

      "Luni": [
        E("Sisteme geoinformaționale (lab)", "lab",
          "conf.univ., dr. Sîrbu R.", "10-101", "both", 1)
      ],

      "Marți": [
        E("Clădiri civile (sem)", "sem",
          "Rudic O.", "10-108", "both", 2),
        E("Bazele statului și dreptului (curs)", "curs",
          "conf.univ., dr. Ursu V.", "10-309", "both", 3),
        E("Clădiri civile (curs)", "curs",
          "conf.univ., dr. Ciobanu N.", "10-309", "both", 4),
        E("L. străină III", "", "",
          "10-113, 122A, 123, 124", "both", 5)
      ],

      "Miercuri": [
        E("Economia construcțiilor (curs)", "curs",
          "conf.univ., dr. Albu I.", "10-129", "both", 1),
        E("Economia construcțiilor (sem)", "sem",
          "conf.univ., dr. Albu I.", "10-336", "both", 2),
        E("Statistica în construcții și imobiliare (curs)", "curs",
          "conf.univ., dr. Albu D.C.", "10-335", "both", 3),
        E("Statistica în construcții și imobiliare (lab)", "lab",
          "conf.univ., dr. Albu D.C.", "10-230", "both", 4)
      ],

      "Joi": [
        E("Evaluarea terenului (sem)", "sem",
          "a.u. Bostan I.", "10-331", "both", 1),
        E("Urbanism și sistematizarea teritoriului (curs)", "curs",
          "conf.univ., dr. Grozavu N.", "10-129", "impara", 2),
        E("Urbanism și sistematizarea teritoriului (sem)", "sem",
          "conf.univ., dr. Sîli A.", "10-231", "impara", 3),
        E("Urbanism și sistematizarea teritoriului (sem)", "sem",
          "conf.univ., dr. Sîli A.", "10-231", "impara", 4)
      ],

      "Vineri": [
        E("Sisteme geoinformaționale (curs)", "curs",
          "conf.univ. Sârbu R.", "10-129", "impara", 2),
        E("Evaluarea terenului (curs)", "curs",
          "conf.univ., dr. Leșan A.", "10-336", "both", 3)
      ]
    },

    // ==========================================================
    // IAPC-2505
    // ==========================================================
    "IAPC-2505": {

      "Luni": [
        E("ME/RI (lab)", "lab",
          "a.u. Șaragov I.", "9-134", "both", 1),
        E("Mecanica aplicată a fluidelor RI (curs)", "curs",
          "conf.univ., dr. Chetrari N./Șaragov I./Leancă L.",
          "9-142", "both", 2),
        E("Mecanica aplicată a fluidelor RI (curs) / PCI", "curs",
          "conf.univ., dr. Chetrari N./Șaragov I./Leancă L.",
          "9-142", "both", 3),
        E("ME/RI (sem)", "sem",
          "conf.univ., dr. Chetrari N., Leancă L.",
          "9-142", "both", 4)
      ],

      "Marți": [
        E("Geologie inginerească (curs)", "curs",
          "conf.univ., dr. Râșcovoi A.", "10-129", "both", 2),
        E("Bazele statului și dreptului (curs)", "curs",
          "conf.univ., dr. Ursu V.", "10-309", "both", 3),
        E("Clădiri civile (curs)", "curs",
          "conf.univ., dr. Ciobanu N.", "10-309", "both", 4),
        E("L. străină III", "", "",
          "10-113, 122A, 123, 124", "both", 5)
      ],

      "Miercuri": [
        E("Economia construcțiilor (sem)", "sem",
          "conf.univ., dr. Albu I.", "10-336", "both", 2),
        E("Clădiri civile (sem)", "sem",
          "Rudic O.", "10-318", "both", 3)
      ],

      "Joi": [
        E("Geologie inginerească (curs)", "curs",
          "conf.univ., dr. Râșcovoi", "10-129", "impara", 3),
        E("Matematici speciale (curs)", "curs",
          "conf.univ., dr. Leah I.", "10-129", "both", 4),
        E("Matematici speciale (sem)", "sem",
          "Ciuhrii V.", "10-108", "para", 5)
      ],

      "Vineri": [
        E("Geologie inginerească și mecanica pământurilor (lab)", "lab",
          "l.u., dr. Ceban O.", "10-006", "both", 1),
        E("Geologia inginerească (sem)", "sem",
          "a.u. Platon I.", "9-P18", "para", 2)
      ]
    },

    // ==========================================================
    // CFDP-251
    // ==========================================================
    "CFDP-251": {

      "Luni": [
        E("CAD și BIM pentru infrastructuri rutiere, tehnologii GIS (sem)",
          "sem", "Andronic R.", "9-P14", "impara", 2),

        E("CAD și BIM pentru infrastructuri rutiere, tehnologii GIS (sem)",
          "sem", "Andronic R.", "10-104", "both", 3),

        E("Drumuri I (curs)", "curs",
          "conf.univ., dr. Pavăl F.-F.", "9-P14", "both", 4),

        E("Drumuri I (sem)", "sem",
          "conf.univ., dr. Pavăl F.-F.", "9-P14", "impara", 5),

        E("Proiect de an", "",
          "conf.univ., Pavăl F.-F.", "9-P14", "para", 5)
      ],

      "Marți": [
        E("Hidraulica (sem)", "sem",
          "conf.univ., dr. Șaragov I.", "9-134", "impara", 2),

        E("Hidraulica (lab)", "lab",
          "conf.univ., dr. Șaragov I.", "9-134", "para", 2),

        E("Hidraulica (curs)", "curs",
          "conf. univ., dr. Șaragov I.", "9-134", "both", 3),

        E("Matematici speciale (sem)", "sem",
          "Ciuhrii V.", "P-16", "impara", 4),

        E("Hidraulica (lab)", "lab",
          "conf.univ., dr. Șaragov I.", "9-134", "para", 4),

        E("L. străină III", "", "",
          "10-113, 122A, 123, 124", "both", 5)
      ],

      "Miercuri": [
        E("Rezistența materialelor (curs)", "curs",
          "conf.univ., dr. Balan V.", "10-129", "both", 2),

        E("Rezistența materialelor (sem)", "sem",
          "conf.univ., dr. Balan V.", "10-318", "both", 3),

        E("Inginereia mediului penteru infrastructuri (curs)", "curs",
          "l.u. Vîrlan L.", "9-P14", "para", 4),

        E("Inginereia mediului penteru infrastructuri (curs)", "curs",
          "l.u. Vîrlan L.", "9-P14", "para", 5)
      ],

      "Joi": [
        E("Bazele ingineriei infrastructurii transporturilor. Rețele de transport (curs)",
          "curs", "conf.univ., dr. Bricicaru I.", "9-P14", "both", 2),

        E("Bazele ingineriei infrastructurii transporturilor. Rețele de transport (sem)",
          "sem", "conf.univ., dr. Bricicaru I.", "9-P14", "both", 3),

        E("Matematici speciale (curs)", "curs",
          "conf.univ., dr. Leah I.", "10-129", "both", 4)
      ],

      "Vineri": [
        E("Rezistența materialelor (curs)", "curs",
          "conf.univ., dr. Balan V.", "10-113", "impara", 1),

        E("Rezistența materialelor (lab)", "lab",
          "conf.univ., dr. Balan V.", "10-113", "para", 1)
      ]
    },

    // ==========================================================
    // ISTGCC-251
    // ==========================================================
    "ISTGCC-251": {

      "Luni": [
        E("Electrotehnica aplicată (lab)", "lab",
          "Voinesco D./Grușac L.", "2-215", "both", 1),

        E("Termotehnica construcțiilor (sem)", "sem",
          "a.u. Colomieț T.", "9-242", "impara", 2),

        E("Termotehnica construcțiilor (sem)", "sem",
          "Colomieț T.", "9-242", "both", 3),

        E("Termotehnica construcțiilor (curs)", "curs",
          "conf.univ., dr. Begleț N.", "10-242", "both", 4)
      ],

      "Marți": [
        E("Electrotehnica aplicată (curs)", "curs",
          "conf.univ., dr. Chiciuc A.", "10-229", "both", 1),

        E("Hidraulica (sem)", "sem",
          "conf.univ., dr. Șaragov I.", "9-134", "impara", 2),

        E("Hidraulica (lab)", "lab",
          "conf.univ., dr. Șaragov I.", "9-134", "para", 2),

        E("Hidraulica (curs)", "curs",
          "conf. univ., dr. Șaragov I.", "9-134", "both", 3),

        E("Clădiri civile (curs)", "curs",
          "conf.univ., dr. Ciobanu N.", "10-309", "both", 4),

        E("L. străină III", "", "",
          "10-113, 122A, 123, 124", "both", 5)
      ],

      "Miercuri": [
        E("Rezistența materialelor (lab)", "lab",
          "conf.univ., dr. Balan V.", "10-124", "impara", 1),

        E("Clădiri civile (sem)", "sem",
          "a.u. Țurcanu I.", "10-123", "para", 1),

        E("Rezistența materialelor (curs)", "curs",
          "conf.univ., dr. Balan V.", "10-129", "both", 2),

        E("Materiale de construcții (lab)", "lab",
          "a.u. Naval D.", "9-P28", "impara", 4),

        E("Materiale de construcții (lab)", "lab",
          "a.u. Naval D.", "9-P28", "impara", 5)
      ],

      "Joi": [
        E("Matematici speciale (curs)", "curs",
          "conf.univ., dr. Leah I.", "10-129", "both", 4),

        E("Matematici speciale (sem)", "sem",
          "Ciuhrii V.", "10-108", "impara", 5)
      ],

      "Vineri": [
        E("Rezistența materialelor (curs)", "curs",
          "conf.univ., dr. Balan V.", "10-113", "impara", 1),

        E("Materiale de construcție (curs)", "curs",
          "conf. univ., dr. Proaspăt E.", "10-302", "both", 2)
      ]
    },

    // ==========================================================
    // ISTGCC-251 D
    // ==========================================================
    "ISTGCC-251 D": {

      "Luni": [
        E("Electrotehnica aplicată (lab)", "lab",
          "Voinesco D./Grușac L.", "2-215", "both", 1),

        E("Termotehnica construcțiilor (sem)", "sem",
          "a.u. Colomieț T.", "9-242", "para", 2),

        E("Sisteme de alimentare cu gaze I (curs)", "curs",
          "a.u. Haiducova M.", "9-322", "both", 3),

        E("Termotehnica construcțiilor (curs)", "curs",
          "conf.univ., dr. Begleț N.", "10-242", "both", 4)
      ],

      "Marți": [
        E("Electrotehnica aplicată (curs)", "curs",
          "conf.univ., dr. Chiciuc A.", "10-229", "both", 1),

        E("Hidraulica (sem)", "sem",
          "conf.univ., dr. Șaragov I.", "9-134", "impara", 2),

        E("Hidraulica (lab)", "lab",
          "conf.univ., dr. Șaragov I.", "9-134", "para", 2),

        E("Hidraulica (curs)", "curs",
          "conf. univ., dr. Șaragov I.", "9-134", "both", 3),

        E("Clădiri civile (curs)", "curs",
          "conf.univ., dr. Ciobanu N.", "10-309", "both", 4),

        E("L. străină III", "", "",
          "10-113, 122A, 123, 124", "both", 5)
      ],

      "Miercuri": [
        E("Rezistența materialelor (lab)", "lab",
          "conf.univ., dr. Balan V.", "10-124", "impara", 1),

        E("Clădiri civile (sem)", "sem",
          "a.u. Țurcanu I.", "10-123", "para", 1),

        E("Rezistența materialelor (curs)", "curs",
          "conf.univ., dr. Balan V.", "10-129", "both", 2),

        E("Sisteme de alimentare cu gaze I (sem)", "sem",
          "a.u. Haiducova M.", "9-322", "impara", 3),

        E("Sisteme de alimentare cu gaze I (lab)", "lab",
          "a.u. Haiducova M.", "9-322", "para", 3),

        E("Rezistența materialelor (lab)", "lab",
          "conf.univ., dr. Balan V.", "10-124", "para", 4)
      ],

      "Joi": [
        E("RAAC (sem)", "sem",
          "conf.univ., dr. Chetrari N.", "9-138", "impara", 2),

        E("RAAC (curs)", "curs",
          "conf.univ., dr. Chetrari N.", "9-138", "impara", 3),

        E("Matematici speciale (curs)", "curs",
          "conf.univ., dr. Leah I.", "10-129", "both", 4),

        E("Matematici speciale (sem)", "sem",
          "Ciuhrii V.", "10-108", "impara", 5)
      ],

      "Vineri": [
        E("Rezistența materialelor (curs)", "curs",
          "conf.univ., dr. Balan V.", "10-113", "impara", 1),

        E("Generatoare de căldură (curs)", "curs",
          "a.u. Andoni N.", "9-242", "both", 2),

        E("Generatoare de căldură (sem)", "sem",
          "a.u. Andoni N.", "9-242", "impara", 3)
      ]
    }
  }
};


// ============================================================
// FUNCȚIE DE CONSTRUIRE A UNEI ORE
// ============================================================

function E(subject, type, teacher, room, weeks, slot) {

  const times = {
    1: "08:00–09:30",
    2: "09:45–11:15",
    3: "11:30–13:00",
    4: "13:30–15:00",
    5: "15:15–16:45",
    6: "17:00–18:30",
    7: "18:45–20:15"
  };

  return {
    subject: subject,
    type: type,
    teacher: teacher,
    room: room,
    weeks: weeks,
    raw:
      subject +
      (teacher ? " — " + teacher : "") +
      (room ? " — " + room : ""),
    slot: slot,
    time: times[slot]
  };
}
