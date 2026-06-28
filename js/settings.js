function saveSettingToAccount(key, value) {
  if (localStorage.getItem("loggedIn") !== "true") return;
  const email = localStorage.getItem("userEmail");
  if (!email) return;
  const account = JSON.parse(localStorage.getItem("account_" + email) || "{}");
  account[key] = value;
  localStorage.setItem("account_" + email, JSON.stringify(account));
}

document.addEventListener("DOMContentLoaded", () => {
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

  const currencySelect = document.querySelector("#currency-select");
  const currencyFeedback = document.querySelector("#currency-feedback");
  currencySelect.value = getCurrency();
  loadCurrencyRates();

  currencySelect.addEventListener("change", async () => {
    setCurrency(currencySelect.value);
    saveSettingToAccount("currency", currencySelect.value);
    await loadCurrencyRates();
    currencyFeedback.textContent = "Currency updated. Prices will show in " + currencySelect.value + ".";
    currencyFeedback.className = "settings-feedback text-gain";
  });

  const themeSelect = document.querySelector("#theme-select");
  themeSelect.value = localStorage.getItem("theme") || "dark";
  themeSelect.addEventListener("change", () => {
    localStorage.setItem("theme", themeSelect.value);
    saveSettingToAccount("theme", themeSelect.value);
    applyTheme(themeSelect.value);
  });
});