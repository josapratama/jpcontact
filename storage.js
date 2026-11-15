const DEFAULT_CONTACTS = [
  {
    id: 1,
    avatar: "",
    fullName: "Budi Santoso",
    email: "budi.santoso@example.com",
    phoneNumber: "081234567890",
    label: "Work",
    birthDay: "1995-04-12"
  },
  {
    id: 2,
    avatar: "",
    fullName: "Siti Rahma",
    email: "siti.rahma@example.com",
    phoneNumber: "082198765432",
    label: "Friend",
    birthDay: "1998-09-23"
  },
  {
    id: 3,
    avatar: "",
    fullName: "Ahmad Fauzi",
    email: "ahmad.fauzi@example.com",
    phoneNumber: "085611223344",
    label: "Family",
    birthDay: "1993-11-05"
  }
];

const AVATAR_COLORS = [
  "#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a",
  "#0d9488", "#4f46e5", "#c026d3", "#0891b2", "#d97706"
];

function getInitialAvatar(name) {
  if (!name || typeof name !== "string") name = "?";
  const cleanName = name.trim();
  const parts = cleanName.split(" ").filter(Boolean);
  let initials = parts[0] ? parts[0][0].toUpperCase() : "?";
  if (parts.length > 1) {
    initials += parts[parts.length - 1][0].toUpperCase();
  }

  // Deterministic color pick based on name hash
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" rx="50" fill="${color}"/>
    <text x="50" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function saveContactsToLocalStorage(contacts) {
  try {
    localStorage.setItem("users", JSON.stringify(contacts));
  } catch (err) {
    console.error("Failed to save contacts to localStorage", err);
  }
}

function loadContactsFromLocalStorage() {
  try {
    const raw = localStorage.getItem("users");
    if (!raw) {
      saveContactsToLocalStorage(DEFAULT_CONTACTS);
      return DEFAULT_CONTACTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveContactsToLocalStorage(DEFAULT_CONTACTS);
      return DEFAULT_CONTACTS;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading localStorage, falling back to defaults", err);
    return DEFAULT_CONTACTS;
  }
}

function loadContactById(id) {
  const contacts = loadContactsFromLocalStorage();
  return contacts.find((c) => Number(c.id) === Number(id));
}

function exportContactsToJSON() {
  const contacts = loadContactsFromLocalStorage();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contacts, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `jpcontacts_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function exportContactsToCSV() {
  const contacts = loadContactsFromLocalStorage();
  const headers = ["id", "fullName", "email", "phoneNumber", "label", "birthDay"];
  const csvRows = [headers.join(",")];

  for (const c of contacts) {
    const row = [
      c.id,
      `"${(c.fullName || "").replace(/"/g, '""')}"`,
      `"${(c.email || "").replace(/"/g, '""')}"`,
      `"${(c.phoneNumber || "").replace(/"/g, '""')}"`,
      `"${(c.label || "").replace(/"/g, '""')}"`,
      `"${(c.birthDay || "").replace(/"/g, '""')}"`,
    ];
    csvRows.push(row.join(","));
  }

  const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", csvContent);
  downloadAnchor.setAttribute("download", `jpcontacts_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importContactsFromJSON(jsonText) {
  try {
    const parsed = JSON.parse(jsonText);
    if (!Array.isArray(parsed)) throw new Error("Format JSON harus berupa array objek kontak");
    const current = loadContactsFromLocalStorage();
    let maxId = current.length > 0 ? Math.max(...current.map((c) => c.id || 0)) : 0;

    for (const item of parsed) {
      if (item.fullName) {
        maxId++;
        current.push({
          id: maxId,
          avatar: item.avatar || "",
          fullName: item.fullName,
          email: item.email || "",
          phoneNumber: item.phoneNumber || item.phone || "",
          label: item.label || "General",
          birthDay: item.birthDay || "",
        });
      }
    }

    saveContactsToLocalStorage(current);
    return { success: true, count: parsed.length };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
