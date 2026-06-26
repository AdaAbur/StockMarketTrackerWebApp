document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.querySelector("#profile-form");
  const profileName = document.querySelector("#profile-name");
  const profileEmail = document.querySelector("#profile-email");
  const profileFeedback = document.querySelector("#profile-feedback");

  profileName.value = localStorage.getItem("userName") || "";
  profileEmail.value = localStorage.getItem("userEmail") || "";

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = profileName.value.trim();
    const email = profileEmail.value.trim();
    if (name === "" || email === "") {
      profileFeedback.textContent = "Please fill in all fields.";
      profileFeedback.className = "settings-feedback text-loss";
      return;
    }
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    profileFeedback.textContent = "Profile saved.";
    profileFeedback.className = "settings-feedback text-gain";
  });

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
    await loadCurrencyRates();
    currencyFeedback.textContent = "Currency updated. Prices will show in " + currencySelect.value + ".";
    currencyFeedback.className = "settings-feedback text-gain";
  });

  const themeSelect = document.querySelector("#theme-select");
  themeSelect.value = localStorage.getItem("theme") || "dark";
  themeSelect.addEventListener("change", () => {
    localStorage.setItem("theme", themeSelect.value);
    applyTheme(themeSelect.value);
  });
});