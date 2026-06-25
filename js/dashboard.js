const popularStocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"];

function renderSummary(container, overview) {
  const holdings = JSON.parse(localStorage.getItem("holdings") || "[]");
  const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");

  let topValue = "-";
  let topTrend = "up";
  if (overview.length > 0) {
    const best = overview.reduce((a, b) =>
      parseFloat(b.change) > parseFloat(a.change) ? b : a
    );
    topValue = best.symbol + " " + best.change;
    topTrend = best.trend;
  }

  container.innerHTML = "";
  container.appendChild(createStatCard({ label: "Holdings", value: String(holdings.length) }));
  container.appendChild(createStatCard({ label: "Watchlist", value: String(watchlist.length) }));
  container.appendChild(createStatCard({ label: "Top Performer", value: topValue, trend: topTrend }));
}

async function loadOverview(container, summaryContainer) {
  container.innerHTML = "";
  const loading = document.createElement("p");
  loading.className = "watchlist-empty";
  loading.textContent = "Loading...";
  container.appendChild(loading);

  try {
    const overview = await fetchQuotes(popularStocks);
    container.innerHTML = "";
    overview.forEach((stock) => {
      container.appendChild(
        createStockRow({ ...stock, href: "stock-details.html?symbol=" + stock.symbol })
      );
    });
    renderSummary(summaryContainer, overview);
  } catch (error) {
    container.innerHTML = "";
    container.appendChild(
      createErrorMessage(error.message, () => loadOverview(container, summaryContainer))
    );
    renderSummary(summaryContainer, []);
  }
}

async function renderWatchlist(container) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
  container.innerHTML = "";

  if (watchlist.length === 0) {
    const message = document.createElement("p");
    message.className = "watchlist-empty";
    message.textContent = "Your watchlist is empty.";
    container.appendChild(message);

    const link = document.createElement("a");
    link.href = "stock-search.html";
    link.className = "watchlist-link";
    link.textContent = "Find stocks";
    container.appendChild(link);
    return;
  }

  const loading = document.createElement("p");
  loading.className = "watchlist-empty";
  loading.textContent = "Loading...";
  container.appendChild(loading);

  try {
    const stocks = await fetchQuotes(watchlist.slice(0, 5));
    container.innerHTML = "";
    stocks.forEach((stock) => {
      container.appendChild(
        createStockRow({ ...stock, href: "stock-details.html?symbol=" + stock.symbol })
      );
    });

    const seeAll = document.createElement("a");
    seeAll.href = "watchlist.html";
    seeAll.className = "watchlist-link";
    seeAll.textContent = "See all";
    container.appendChild(seeAll);
  } catch (error) {
    container.innerHTML = "";
    container.appendChild(createErrorMessage(error.message, () => renderWatchlist(container)));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const summaryContainer = document.querySelector(".summary-cards");
  const watchlistContainer = document.querySelector(".watchlist-preview");
  const overviewContainer = document.querySelector(".stock-overview");

  loadOverview(overviewContainer, summaryContainer);
  renderWatchlist(watchlistContainer);
});