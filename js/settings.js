function saveSettingToAccount(key, value) {
  if (localStorage.getItem("loggedIn") !== "true") return;
  const email = localStorage.getItem("userEmail");
  if (!email) return;
  const account = JSON.parse(localStorage.getItem("account_" + email) || "{}");
  account[key] = value;
  localStorage.setItem("account_" + email, JSON.stringify(account));
}

function buildDropdown(toggle, menu, options, current, onSelect) {
  const selected = options.find((option) => option.value === current) || options[0];
  toggle.textContent = selected.label;

  options.forEach((option) => {
    const item = document.createElement("div");
    item.className = "settings-option";
    if (option.value === current) item.classList.add("settings-option-active");
    item.textContent = option.label;
    item.addEventListener("click", () => {
      menu.querySelectorAll(".settings-option").forEach((el) => el.classList.remove("settings-option-active"));
      item.classList.add("settings-option-active");
      toggle.textContent = option.label;
      menu.classList.remove("open");
      onSelect(option.value);
    });
    menu.appendChild(item);
  });

  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const loggedIn = localStorage.getItem("loggedIn") === "true";

  const passwordSection = document.querySelector("#password-section");
  if (!loggedIn && passwordSection) {
    passwordSection.style.display = "none";
  }

  const passwordForm = document.querySelector("#password-form");
  const currentPassword = document.querySelector("#current-password");
  const newPassword = document.querySelector("#new-password");
  const confirmNewPassword = document.querySelector("#confirm-new-password");
  const passwordFeedback = document.querySelector("#password-feedback");

  passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const current = currentPassword.value.trim();
    const next = newPassword.value.trim();
    const confirm = confirmNewPassword.value.trim();

    if (current === "" || next === "" || confirm === "") {
      passwordFeedback.textContent = "Please fill in all fields.";
      passwordFeedback.className = "settings-feedback text-loss";
      return;
    }
    if (next !== confirm) {
      passwordFeedback.textContent = "New passwords do not match.";
      passwordFeedback.className = "settings-feedback text-loss";
      return;
    }
    passwordForm.reset();
    passwordFeedback.textContent = "Password updated.";
    passwordFeedback.className = "settings-feedback text-gain";
  });

  const currencyToggle = document.querySelector("#currency-toggle");
  const currencyMenu = document.querySelector("#currency-menu");
  const currencyFeedback = document.querySelector("#currency-feedback");
  const currencyOptions = [
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "TRY", label: "TRY (₺)" }
  ];
  loadCurrencyRates();
  buildDropdown(currencyToggle, currencyMenu, currencyOptions, getCurrency(), async (value) => {
    setCurrency(value);
    saveSettingToAccount("currency", value);
    await loadCurrencyRates();
    currencyFeedback.textContent = "Currency updated. Prices will show in " + value + ".";
    currencyFeedback.className = "settings-feedback text-gain";
  });

  const themeToggle = document.querySelector("#theme-toggle");
  const themeMenu = document.querySelector("#theme-menu");
  const themeOptions = [
    { value: "dark", label: "Dark" },
    { value: "light", label: "Light" }
  ];
  buildDropdown(themeToggle, themeMenu, themeOptions, localStorage.getItem("theme") || "dark", (value) => {
    localStorage.setItem("theme", value);
    saveSettingToAccount("theme", value);
    applyTheme(value);
  });

  document.addEventListener("click", (event) => {
    document.querySelectorAll(".settings-dropdown").forEach((dropdown) => {
      if (!dropdown.contains(event.target)) {
        dropdown.querySelector(".settings-menu").classList.remove("open");
      }
    });
  });
});