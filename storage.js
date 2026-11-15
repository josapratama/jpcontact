const DEFAULT_CONTACTS = [
  {
    id: 1,
    avatar: "/img/user.svg",
    fullName: "Budi Santoso",
    email: "budi.santoso@example.com",
    phoneNumber: "081234567890",
    label: "Work",
    birthDay: "1995-04-12"
  },
  {
    id: 2,
    avatar: "/img/user.svg",
    fullName: "Siti Rahma",
    email: "siti.rahma@example.com",
    phoneNumber: "082198765432",
    label: "Friend",
    birthDay: "1998-09-23"
  },
  {
    id: 3,
    avatar: "/img/user.svg",
    fullName: "Ahmad Fauzi",
    email: "ahmad.fauzi@example.com",
    phoneNumber: "085611223344",
    label: "Family",
    birthDay: "1993-11-05"
  }
];

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
