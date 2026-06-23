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

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userName", nameValue);
    localStorage.setItem("userEmail", emailValue);
    window.location.href = "dashboard.html";
  });
});