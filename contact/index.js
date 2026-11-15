function getContactId() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  return Number(params.get("id"));
}

function initDetailPage() {
  const id = getContactId();
  if (!id) return;

  const contact = loadContactById(id);
  if (!contact) {
    alert("Kontak tidak ditemukan!");
    window.location.replace("/");
    return;
  }

  const fullNameElement = document.getElementById("full-name");
  const emailElement = document.getElementById("email");
  const numberPhoneElement = document.getElementById("number-phone");
  const birthDayElement = document.getElementById("birth-day");
  const buttonEdit = document.getElementById("button-edit");
  const buttonDelete = document.getElementById("button-delete");

  if (fullNameElement) fullNameElement.innerText = contact.fullName || "-";
  if (emailElement) emailElement.innerText = contact.email || "-";
  if (numberPhoneElement) numberPhoneElement.innerText = contact.phoneNumber || "-";
  if (birthDayElement) birthDayElement.innerText = contact.birthDay || "-";

  if (buttonEdit) {
    buttonEdit.setAttribute("href", `/contact/edit.html?id=${id}`);
  }

  if (buttonDelete) {
    buttonDelete.onclick = function () {
      if (confirm(`Apakah Anda yakin ingin menghapus kontak "${contact.fullName}"?`)) {
        deleteContactById(id);
      }
    };
  }
}

function initAddPage() {
  const addForm = document.getElementById("add-contact-form");
  if (!addForm) return;

  addForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(addForm);
    const contacts = loadContactsFromLocalStorage();
    const newId = contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 1;

    const newContact = {
      id: newId,
      avatar: "/img/user.svg",
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phoneNumber: formData.get("phoneNumber"),
      label: "General",
      birthDay: formData.get("birthDay"),
    };

    contacts.push(newContact);
    saveContactsToLocalStorage(contacts);
    window.location.replace("/");
  });
}

function initEditPage() {
  const editForm = document.getElementById("edit-contact-form");
  if (!editForm) return;

  const id = getContactId();
  if (!id) {
    window.location.replace("/");
    return;
  }

  const contact = loadContactById(id);
  if (!contact) {
    alert("Kontak tidak ditemukan!");
    window.location.replace("/");
    return;
  }

  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phoneNumber");
  const birthdayInput = document.getElementById("birthDay");

  if (fullNameInput) fullNameInput.value = contact.fullName || "";
  if (emailInput) emailInput.value = contact.email || "";
  if (phoneInput) phoneInput.value = contact.phoneNumber || "";
  if (birthdayInput) birthdayInput.value = contact.birthDay || "";

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(editForm);
    const contacts = loadContactsFromLocalStorage();

    const updated = contacts.map((c) => {
      if (Number(c.id) === Number(id)) {
        return {
          ...c,
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          phoneNumber: formData.get("phoneNumber"),
          birthDay: formData.get("birthDay"),
        };
      }
      return c;
    });

    saveContactsToLocalStorage(updated);
    window.location.replace(`/contact/?id=${id}`);
  });
}

function deleteContactById(id) {
  const contacts = loadContactsFromLocalStorage();
  const updatedContacts = contacts.filter((c) => Number(c.id) !== Number(id));
  saveContactsToLocalStorage(updatedContacts);
  window.location.replace("/");
}

window.addEventListener("DOMContentLoaded", function () {
  initDetailPage();
  initAddPage();
  initEditPage();
});
