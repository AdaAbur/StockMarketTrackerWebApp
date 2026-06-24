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
    const message = document.createElement("p");
    message.className = "watchlist-empty";
    message.textContent = error.message;
    container.appendChild(message);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const summaryContainer = document.querySelector(".summary-cards");
  const watchlistContainer = document.querySelector(".watchlist-preview");
  const overviewContainer = document.querySelector(".stock-overview");

  const loading = document.createElement("p");
  loading.className = "watchlist-empty";
  loading.textContent = "Loading...";
  overviewContainer.appendChild(loading);

  let overview = [];
  try {
    overview = await fetchQuotes(popularStocks);
    overviewContainer.innerHTML = "";
    overview.forEach((stock) => {
      overviewContainer.appendChild(
        createStockRow({ ...stock, href: "stock-details.html?symbol=" + stock.symbol })
      );
    });
  } catch (error) {
    overviewContainer.innerHTML = "";
    const message = document.createElement("p");
    message.className = "watchlist-empty";
    message.textContent = error.message;
    overviewContainer.appendChild(message);
  }

  renderSummary(summaryContainer, overview);
  renderWatchlist(watchlistContainer);
});