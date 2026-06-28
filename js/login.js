document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#login-form");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");

  const back = document.querySelector("#auth-back");
  if (back) {
    back.addEventListener("click", (event) => {
      event.preventDefault();
      if (sessionStorage.getItem("enteredApp") === "true") {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "../index.html";
      }
    });
  }

  const feedback = document.createElement("p");
  feedback.className = "auth-feedback";
  form.appendChild(feedback);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (emailValue === "" || passwordValue === "") {
      feedback.textContent = "Please fill in all fields.";
      return;
    }

    if (!isValidEmail(emailValue)) {
      feedback.textContent = "Please enter a valid email address.";
      return;
    }

    const account = JSON.parse(localStorage.getItem("account_" + emailValue) || "{}");
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", emailValue);
    localStorage.setItem("userName", account.name || "");
    localStorage.setItem("watchlist", JSON.stringify(account.watchlist || []));
    localStorage.setItem("holdings", JSON.stringify(account.holdings || []));
    window.location.href = "dashboard.html";
  });
});