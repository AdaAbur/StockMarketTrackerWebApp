document.addEventListener("DOMContentLoaded", () => {
  const feedback = document.querySelector("#pro-feedback");
  const proBtn = document.querySelector("#pro-buy");
  const eliteBtn = document.querySelector("#elite-buy");

  const choosePlan = (plan) => {
    feedback.textContent = "Thanks for choosing " + plan + "! Checkout is coming soon.";
    feedback.className = "text-center mt-4 text-gain";
  };

  if (proBtn) proBtn.addEventListener("click", () => choosePlan("Pro"));
  if (eliteBtn) eliteBtn.addEventListener("click", () => choosePlan("Elite"));
});