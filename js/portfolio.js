document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#holding-form");
  const feedback = document.querySelector("#form-feedback");

  const getHoldings = () => JSON.parse(localStorage.getItem("holdings") || "[]");
  const saveHoldings = (list) => localStorage.setItem("holdings", JSON.stringify(list));

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const symbol = document.querySelector("#symbol").value.trim().toUpperCase();
    const shares = parseFloat(document.querySelector("#shares").value);
    const price = parseFloat(document.querySelector("#price").value);

    if (!symbol || isNaN(shares) || isNaN(price) || shares <= 0 || price <= 0) {
      feedback.textContent = "Please enter a valid symbol, shares > 0 and price > 0.";
      feedback.className = "form-feedback text-loss";
      return;
    }

    const holdings = getHoldings();
    holdings.push({ symbol, shares, price });
    saveHoldings(holdings);

    feedback.textContent = symbol + " added to your portfolio.";
    feedback.className = "form-feedback text-gain";
    form.reset();
  });
});