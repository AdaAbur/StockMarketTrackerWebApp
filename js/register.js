document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#register-form");
  const name = document.querySelector("#name");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirm-password");

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

  form.addEventListener("submit", async (event) => {
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

    feedback.textContent = "Creating account...";

    try {
      const credential = await auth.createUserWithEmailAndPassword(emailValue, passwordValue);
      const uid = credential.user.uid;
      const parts = nameValue.split(" ");
      const firstName = parts.shift();
      const surname = parts.join(" ");

      await db.collection("users").doc(uid).set({
        firstName: firstName,
        surname: surname,
        email: emailValue,
        cashBalance: 10000,
        selectedCountry: "US",
        watchlist: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", emailValue);
      localStorage.setItem("userName", nameValue);
      localStorage.setItem("watchlist", "[]");
      localStorage.setItem("holdings", "[]");
      window.location.href = "dashboard.html";
    } catch (error) {
      feedback.textContent = error.message;
    }
  });
});