document.addEventListener("DOMContentLoaded", () => {
  const holdingsList = document.querySelector(".holdings-list");
  const summary = document.querySelector(".portfolio-summary");

  const getHoldings = () => JSON.parse(localStorage.getItem("holdings") || "[]");
  const saveHoldings = (list) => localStorage.setItem("holdings", JSON.stringify(list));
  const parsePrice = (text) => parseFloat(String(text).replace(/[^0-9.]/g, ""));

  const renderSummary = (total) => {
    summary.innerHTML =
      '<p class="summary-label">Total Portfolio Value</p>' +
      '<p class="summary-total">' + currencySymbol() + total.toFixed(2) + "</p>";
  };

  const render = async () => {
    const holdings = getHoldings();

    if (holdings.length === 0) {
      renderSummary(0);
      holdingsList.innerHTML = "<p>No holdings yet. Buy stocks from their detail page.</p>";
      return;
    }

    holdingsList.innerHTML = "<p>Loading...</p>";

    const prices = {};
    try {
      const quotes = await fetchQuotes(holdings.map((h) => h.symbol));
      quotes.forEach((q) => {
        prices[q.symbol] = parsePrice(q.price);
      });
    } catch (error) {}

    let total = 0;
    holdingsList.innerHTML = "";
    const sym = currencySymbol();

    holdings.forEach((holding, index) => {
      const now = prices[holding.symbol] !== undefined ? prices[holding.symbol] : holding.price;
      const value = holding.shares * now;
      const profitLoss = (now - holding.price) * holding.shares;
      total += value;
      const plClass = profitLoss >= 0 ? "text-gain" : "text-loss";
      const plSign = profitLoss >= 0 ? "+" : "";

      const card = document.createElement("div");
      card.className = "glass-card holding-card";
      card.innerHTML =
        '<div class="holding-top">' +
          '<span class="holding-symbol">' + holding.symbol + "</span>" +
          '<span class="holding-value">' + sym + value.toFixed(2) + "</span>" +
        "</div>" +
        '<div class="holding-details">' +
          "<span>Shares: " + holding.shares + "</span>" +
          "<span>Buy: " + sym + holding.price.toFixed(2) + "</span>" +
          "<span>Now: " + sym + now.toFixed(2) + "</span>" +
          '<span class="' + plClass + '">P/L: ' + plSign + sym + profitLoss.toFixed(2) + "</span>" +
        "</div>";

      const actions = document.createElement("div");
      actions.className = "holding-actions";

      const detailsBtn = document.createElement("a");
      detailsBtn.className = "glass-btn details-btn";
      detailsBtn.href = "stock-details.html?symbol=" + holding.symbol;
      detailsBtn.textContent = "Details";

      const sellBtn = document.createElement("button");
      sellBtn.className = "glass-btn sell-btn";
      sellBtn.textContent = "Sell";
      sellBtn.addEventListener("click", () => {
        const list = getHoldings();
        list.splice(index, 1);
        saveHoldings(list);
        render();
      });

      actions.appendChild(detailsBtn);
      actions.appendChild(sellBtn);
      card.appendChild(actions);

      holdingsList.appendChild(card);
    });

    renderSummary(total);
  };

  render();
});