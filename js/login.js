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

  form.addEventListener("submit", async (event) => {
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

    feedback.textContent = "Signing in...";

    try {
      const credential = await auth.signInWithEmailAndPassword(emailValue, passwordValue);
      const uid = credential.user.uid;
      const doc = await db.collection("users").doc(uid).get();
      const data = doc.exists ? doc.data() : {};
      const fullName = ((data.firstName || "") + " " + (data.surname || "")).trim();
      const watchlist = Array.isArray(data.watchlist)
        ? data.watchlist.map((item) => (typeof item === "string" ? item : item.symbol)).filter(Boolean)
        : [];

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", emailValue);
      localStorage.setItem("userName", fullName);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      localStorage.setItem("holdings", "[]");
      window.location.href = "dashboard.html";
    } catch (error) {
      feedback.textContent = error.message;
    }
  });
});