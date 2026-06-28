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