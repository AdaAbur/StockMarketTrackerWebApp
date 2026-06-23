document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#login-form");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");

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

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", emailValue);
    window.location.href = "dashboard.html";
  });
});