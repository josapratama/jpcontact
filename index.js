let activeLabelFilter = "";

const searchInputElement = document.getElementById("search-input");
const contactsContainerElement = document.getElementById("contacts-container");
const countBadgeElement = document.getElementById("contact-count-badge");
const allCountElement = document.getElementById("badge-all-count");
const viewTitleElement = document.getElementById("view-title");
const filterIndicatorElement = document.getElementById("filter-indicator");
const importFileInput = document.getElementById("import-file-input");

function filterByLabel(label) {
  activeLabelFilter = label;
  if (viewTitleElement) {
    viewTitleElement.innerText = label ? `Kategori: ${label}` : "Daftar Kontak";
  }
  if (filterIndicatorElement) {
    if (label) {
      filterIndicatorElement.classList.remove("hidden");
    } else {
      filterIndicatorElement.classList.add("hidden");
    }
  }
  renderContacts();
}

function searchContacts(contacts, keyword) {
  let list = contacts;

  if (activeLabelFilter) {
    list = list.filter(
      (c) => c.label && c.label.toLowerCase() === activeLabelFilter.toLowerCase()
    );
  }

  if (keyword) {
    const lowerKeyword = keyword.toLowerCase().trim();
    list = list.filter(
      (contact) =>
        contact.fullName?.toLowerCase().includes(lowerKeyword) ||
        contact.email?.toLowerCase().includes(lowerKeyword) ||
        contact.phoneNumber?.includes(lowerKeyword) ||
        contact.label?.toLowerCase().includes(lowerKeyword)
    );
  }

  return list;
}

function renderContacts() {
  const allContacts = loadContactsFromLocalStorage();
  const keyword = searchInputElement ? searchInputElement.value : "";

  if (allCountElement) {
    allCountElement.innerText = allContacts.length;
  }

  const contactsToRender = searchContacts(allContacts, keyword);

  if (countBadgeElement) {
    countBadgeElement.innerText = `${contactsToRender.length} kontak`;
  }

  if (!contactsContainerElement) return;

  if (contactsToRender.length === 0) {
    contactsContainerElement.innerHTML = `
      <tr>
        <td colspan="6" class="py-12 text-center text-slate-400">
          <div class="text-3xl mb-2">🔍</div>
          <p class="font-medium text-slate-600">Tidak ada kontak yang cocok.</p>
          <p class="text-xs text-slate-400 mt-1">Coba kata kunci lain atau tambahkan kontak baru.</p>
        </td>
      </tr>
    `;
    return;
  }

  const contactItems = contactsToRender
    .map((contact) => {
      const avatarSrc = getInitialAvatar(contact.fullName);
      const labelColor =
        contact.label === "Work"
          ? "bg-blue-100 text-blue-700"
          : contact.label === "Family"
          ? "bg-green-100 text-green-700"
          : contact.label === "Friend"
          ? "bg-purple-100 text-purple-700"
          : "bg-slate-100 text-slate-700";

      return `
      <tr class="hover:bg-slate-50/80 transition group">
        <td class="py-3 px-4">
          <a href="/contact/?id=${contact.id}" class="flex items-center gap-3">
            <img src="${avatarSrc}" alt="${contact.fullName}" class="w-9 h-9 rounded-full shadow-sm" />
            <span class="font-semibold text-slate-800 hover:text-blue-600 transition">${contact.fullName}</span>
          </a>
        </td>
        <td class="py-3 px-4 text-slate-600">${contact.email || "-"}</td>
        <td class="py-3 px-4 font-mono text-slate-600 text-xs">${contact.phoneNumber || "-"}</td>
        <td class="py-3 px-4">
          <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full ${labelColor}">
            ${contact.label || "General"}
          </span>
        </td>
        <td class="py-3 px-4 text-slate-500 text-xs">${contact.birthDay || "-"}</td>
        <td class="py-3 px-4 text-right space-x-2">
          <a href="/contact/edit.html?id=${contact.id}" class="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline">
            Edit
          </a>
          <button onclick="handleQuickDelete(${contact.id}, '${contact.fullName}')" class="text-xs font-medium text-red-500 hover:text-red-700 hover:underline">
            Hapus
          </button>
        </td>
      </tr>
    `;
    })
    .join("");

  contactsContainerElement.innerHTML = contactItems;
}

function handleQuickDelete(id, name) {
  if (confirm(`Hapus kontak "${name}"?`)) {
    deleteContactById(id);
    renderContacts();
  }
}

if (searchInputElement) {
  searchInputElement.addEventListener("input", () => {
    renderContacts();
  });
}

if (importFileInput) {
  importFileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
      const result = importContactsFromJSON(evt.target.result);
      if (result.success) {
        alert(`Berhasil mengimpor ${result.count} kontak!`);
        renderContacts();
      } else {
        alert(`Gagal mengimpor: ${result.error}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  });
}

window.addEventListener("DOMContentLoaded", renderContacts);
