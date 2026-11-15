const searchInputElement = document.getElementById("search-input");
const contactsContainerElement = document.getElementById("contacts-container");
const countIndicatorElement = document.querySelector("main h2 sub");

function searchContacts(contacts, keyword) {
  if (!keyword) return contacts;
  const lowerKeyword = keyword.toLowerCase().trim();
  return contacts.filter(
    (contact) =>
      contact.fullName?.toLowerCase().includes(lowerKeyword) ||
      contact.email?.toLowerCase().includes(lowerKeyword) ||
      contact.phoneNumber?.includes(lowerKeyword) ||
      contact.label?.toLowerCase().includes(lowerKeyword)
  );
}

function renderContacts() {
  const contacts = loadContactsFromLocalStorage();
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const keyword = params.get("q") || (searchInputElement ? searchInputElement.value : "");

  if (searchInputElement && keyword && !searchInputElement.value) {
    searchInputElement.value = keyword;
  }

  const contactsToRender = searchContacts(contacts, keyword);

  if (countIndicatorElement) {
    countIndicatorElement.innerText = `(${contactsToRender.length})`;
  }

  if (contactsToRender.length === 0) {
    contactsContainerElement.innerHTML = `
      <tr>
        <td colspan="5" class="py-8 text-center text-gray-500">
          Tidak ada kontak yang ditemukan.
        </td>
      </tr>
    `;
    return;
  }

  const contactItems = contactsToRender
    .map(
      (contact) => `
    <tr class="border-b hover:bg-slate-50 transition cursor-pointer" onclick="window.location.href='/contact/?id=${contact.id}'">
      <td class="py-3">
        <div class="flex items-center">
          <img src="${contact.avatar || '/img/user.svg'}" alt="${contact.fullName}" class="w-10 h-10 rounded-full" />
          <span class="ml-4 font-semibold text-slate-800">${contact.fullName}</span>
        </div>
      </td>
      <td class="py-3 text-slate-600">${contact.email || '-'}</td>
      <td class="py-3 text-slate-600">${contact.phoneNumber || '-'}</td>
      <td class="py-3">
        <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
          ${contact.label || 'General'}
        </span>
      </td>
      <td class="py-3 text-slate-600">${contact.birthDay || '-'}</td>
    </tr>
  `
    )
    .join("");

  contactsContainerElement.innerHTML = contactItems;
}

if (searchInputElement) {
  searchInputElement.addEventListener("input", (e) => {
    renderContacts();
  });
}

window.addEventListener("DOMContentLoaded", renderContacts);
