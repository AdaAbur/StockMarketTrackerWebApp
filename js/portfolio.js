document.addEventListener("DOMContentLoaded", () => {
  const summary = document.querySelector(".portfolio-summary");
  const tableBody = document.querySelector("#holdings-body");
  let chart = null;

  loadCurrencyRates();

  const renderSummary = (cash, holdingsValue, pl) => {
    const total = cash + holdingsValue;
    const plClass = pl > 0 ? "text-gain" : (pl < 0 ? "text-loss" : "");
    const plSign = pl > 0 ? "+" : "";
    summary.innerHTML =
      '<div class="summary-grid">' +
        '<div><p class="summary-label">Total Value</p><p class="summary-total">' + formatMoney(total) + "</p></div>" +
        '<div><p class="summary-label">Cash</p><p class="summary-sub">' + formatMoney(cash) + "</p></div>" +
        '<div><p class="summary-label">Holdings</p><p class="summary-sub">' + formatMoney(holdingsValue) + "</p></div>" +
        '<div><p class="summary-label">Total P/L</p><p class="summary-sub ' + plClass + '">' + plSign + formatMoney(pl) + "</p></div>" +
      "</div>";
  };

  const renderChart = (labels, values) => {
    const canvas = document.querySelector("#alloc-chart");
    if (chart) {
      chart.destroy();
      chart = null;
    }
    if (!labels.length) {
      return;
    }
    const colors = ["#0080FF", "#34C759", "#FF9500", "#AF52DE", "#FF3B30", "#5AC8FA", "#FFCC00", "#FF2D55"];
    const legendColor = document.body.classList.contains("light") ? "#243044" : "#D9D9D9";
    chart = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: labels.map((label, index) => colors[index % colors.length]),
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { color: legendColor } }
        }
      }
    });
  };

  const render = async (uid) => {
    tableBody.innerHTML = '<tr><td colspan="8" class="holdings-empty">Loading...</td></tr>';

    let holdings;
    let userData;
    let transactions;
    try {
      [holdings, userData, transactions] = await Promise.all([
        fsGetHoldings(uid),
        fsGetUserData(uid),
        fsGetTransactions(uid)
      ]);
    } catch (error) {
      tableBody.innerHTML = '<tr><td colspan="8" class="holdings-empty">' + error.message + "</td></tr>";
      return;
    }

    const cash = userData && typeof userData.cashBalance === "number" ? userData.cashBalance : 0;

    const buyDates = {};
    transactions.forEach((tx) => {
      if (tx.type === "buy" && tx.createdAt) {
        const date = tx.createdAt.toDate ? tx.createdAt.toDate() : new Date(tx.createdAt);
        if (!buyDates[tx.symbol] || date > buyDates[tx.symbol]) {
          buyDates[tx.symbol] = date;
        }
      }
    });

    if (holdings.length === 0) {
      renderSummary(cash, 0, 0);
      renderChart([], []);
      tableBody.innerHTML = '<tr><td colspan="8" class="holdings-empty">No holdings yet. Buy stocks from their detail page.</td></tr>';
      return;
    }

    const prices = {};
    try {
      const quotes = await fetchQuotes(holdings.map((h) => h.symbol));
      quotes.forEach((q) => {
        prices[q.symbol] = q.priceRaw;
      });
    } catch (error) {}

    let holdingsValue = 0;
    let totalCost = 0;
    const allocLabels = [];
    const allocValues = [];
    tableBody.innerHTML = "";

    holdings.forEach((holding) => {
      const current = prices[holding.symbol] !== undefined ? prices[holding.symbol] : holding.averageBuyPrice;
      const value = holding.quantity * current;
      const cost = holding.quantity * holding.averageBuyPrice;
      const pl = value - cost;
      holdingsValue += value;
      totalCost += cost;
      allocLabels.push(holding.symbol);
      allocValues.push(value);

      const dateStr = buyDates[holding.symbol] ? buyDates[holding.symbol].toLocaleDateString() : "-";
      const currentClass = current > holding.averageBuyPrice ? "text-gain" : (current < holding.averageBuyPrice ? "text-loss" : "");
      const plClass = pl > 0 ? "text-gain" : (pl < 0 ? "text-loss" : "");
      const plSign = pl > 0 ? "+" : "";

      const row = document.createElement("tr");
      row.innerHTML =
        '<td class="h-symbol">' + holding.symbol + "</td>" +
        "<td>" + holding.quantity + "</td>" +
        "<td>" + formatMoney(holding.averageBuyPrice) + "</td>" +
        '<td class="' + currentClass + '">' + formatMoney(current) + "</td>" +
        "<td>" + formatMoney(value) + "</td>" +
        '<td class="' + plClass + '">' + plSign + formatMoney(pl) + "</td>" +
        "<td>" + dateStr + "</td>" +
        '<td><a class="details-link" href="stock-details.html?symbol=' + holding.symbol + '">Details</a></td>';
      tableBody.appendChild(row);
    });

    renderSummary(cash, holdingsValue, holdingsValue - totalCost);
    renderChart(allocLabels, allocValues);
  };

  auth.onAuthStateChanged((user) => {
    if (!user || !isLoggedIn()) {
      window.location.href = "login.html";
      return;
    }
    render(user.uid);
  });
});