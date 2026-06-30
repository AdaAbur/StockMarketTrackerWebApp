function authErrorMessage(error) {
  const code = error && error.code ? error.code : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "No account found with this email and password.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    default:
      return error && error.message ? error.message : "Sign in failed.";
  }
}

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
      feedback.textContent = authErrorMessage(error);
    }
  });
});