document.addEventListener("DOMContentLoaded", () => {
  const profileName = document.querySelector("#profile-name");
  const profileEmail = document.querySelector("#profile-email");

  profileName.value = localStorage.getItem("userName") || "";
  profileEmail.value = localStorage.getItem("userEmail") || "";

  const logoutBtn = document.querySelector("#logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => logout());
  }

  const proFeedback = document.querySelector("#pro-feedback");
  const proBtn = document.querySelector("#pro-buy");
  const eliteBtn = document.querySelector("#elite-buy");

  const choosePlan = (plan) => {
    proFeedback.textContent = "Thanks for choosing " + plan + "! Checkout is coming soon.";
    proFeedback.className = "text-center mt-4 text-gain";
  };

  if (proBtn) proBtn.addEventListener("click", () => choosePlan("Pro"));
  if (eliteBtn) eliteBtn.addEventListener("click", () => choosePlan("Elite"));
});