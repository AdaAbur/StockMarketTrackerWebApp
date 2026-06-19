const currentPrices = {
  AAPL: 192.45,
  TSLA: 251.30,
  NVDA: 487.20,
  MSFT: 379.05,
  AMZN: 244.35,
  META: 577.22,
  GOOGL: 367.99
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#holding-form");
  const feedback = document.querySelector("#form-feedback");
  const holdingsList = document.querySelector(".holdings-list");

  const getHoldings = () => JSON.parse(localStorage.getItem("holdings") || "[]");
  const saveHoldings = (list) => localStorage.setItem("holdings", JSON.stringify(list));

  const getCurrentPrice = (symbol, fallback) =>
    currentPrices[symbol] !== undefined ? currentPrices[symbol] : fallback;

  const renderHoldings = () => {
    const holdings = getHoldings();
    holdingsList.innerHTML = "";

    if (holdings.length === 0) {
      holdingsList.innerHTML = "<p>No holdings yet. Add one above.</p>";
      return;
    }

    holdings.forEach((holding) => {
      const currentPrice = getCurrentPrice(holding.symbol, holding.price);
      const currentValue = holding.shares * currentPrice;

      const card = document.createElement("div");
      card.className = "glass-card holding-card";
      card.innerHTML =
        '<div class="holding-top">' +
          '<span class="holding-symbol">' + holding.symbol + "</span>" +
          '<span class="holding-value">$' + currentValue.toFixed(2) + "</span>" +
        "</div>" +
        '<div class="holding-details">' +
          "<span>Shares: " + holding.shares + "</span>" +
          "<span>Buy: $" + holding.price.toFixed(2) + "</span>" +
          "<span>Now: $" + currentPrice.toFixed(2) + "</span>" +
        "</div>";

      holdingsList.appendChild(card);
    });
  };

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
    renderHoldings();
  });

  renderHoldings();
});