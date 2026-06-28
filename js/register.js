document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#register-form");
  const name = document.querySelector("#name");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirm-password");

  const feedback = document.createElement("p");
  feedback.className = "auth-feedback";
  form.appendChild(feedback);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameValue = name.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const confirmValue = confirmPassword.value.trim();

    if (nameValue === "" || emailValue === "" || passwordValue === "" || confirmValue === "") {
      feedback.textContent = "Please fill in all fields.";
      return;
    }

    if (!isValidEmail(emailValue)) {
      feedback.textContent = "Please enter a valid email address.";
      return;
    }

    if (passwordValue !== confirmValue) {
      feedback.textContent = "Passwords do not match.";
      return;
    }

    const account = JSON.parse(localStorage.getItem("account_" + emailValue) || "{}");
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userName", nameValue);
    localStorage.setItem("userEmail", emailValue);
    localStorage.setItem("watchlist", JSON.stringify(account.watchlist || []));
    localStorage.setItem("holdings", JSON.stringify(account.holdings || []));
    localStorage.setItem("theme", account.theme || "dark");
    localStorage.setItem("currency", account.currency || "USD");
    localStorage.setItem("account_" + emailValue, JSON.stringify({
      name: nameValue,
      watchlist: account.watchlist || [],
      holdings: account.holdings || [],
      theme: account.theme || "dark",
      currency: account.currency || "USD"
    }));
    window.location.href = "dashboard.html";
  });
});