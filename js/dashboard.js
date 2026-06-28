const popularStocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"];

function createMarketCard(stock) {
  const card = document.createElement("a");
  card.className = "market-card glass-card";
  card.href = "stock-details.html?symbol=" + stock.symbol;

  const top = document.createElement("div");
  top.className = "market-card-top";

  const info = document.createElement("div");
  info.className = "market-card-info";

  const logo = document.createElement("img");
  logo.className = "market-logo";
  logo.src = "https://financialmodelingprep.com/image-stock/" + stock.symbol + ".png";
  logo.alt = "";
  logo.addEventListener("error", () => {
    logo.style.display = "none";
  });

  const text = document.createElement("div");
  text.className = "market-card-text";

  const symbolEl = document.createElement("span");
  symbolEl.className = "market-symbol";
  symbolEl.textContent = stock.symbol;

  const changeEl = document.createElement("span");
  changeEl.className = "market-change " + (stock.trend === "down" ? "text-loss" : "text-gain");
  changeEl.textContent = stock.change;

  text.appendChild(symbolEl);
  text.appendChild(changeEl);

  info.appendChild(logo);
  info.appendChild(text);

  const priceEl = document.createElement("span");
  priceEl.className = "market-price";
  priceEl.textContent = stock.price;

  top.appendChild(info);
  top.appendChild(priceEl);

  const chart = document.createElement("div");
  chart.className = "market-card-chart";
  chart.appendChild(createSparkline(stock.symbol, 260, 70));

  card.appendChild(top);
  card.appendChild(chart);
  return card;
}

async function loadMarketOverview(container) {
  container.innerHTML = "";
  const loading = document.createElement("p");
  loading.className = "watchlist-empty";
  loading.textContent = "Loading...";
  container.appendChild(loading);

  try {
    const overview = await fetchQuotes(popularStocks);
    container.innerHTML = "";
    overview.forEach((stock) => {
      container.appendChild(createMarketCard(stock));
    });
  } catch (error) {
    container.innerHTML = "";
    container.appendChild(createErrorMessage(error.message, () => loadMarketOverview(container)));
  }
}

async function loadDashboardNews(container) {
  container.innerHTML = "";
  const loading = document.createElement("p");
  loading.className = "watchlist-empty";
  loading.textContent = "Loading news...";
  container.appendChild(loading);

  try {
    const items = await fetchNews();
    container.innerHTML = "";
    items.slice(0, 6).forEach((item) => {
      const card = document.createElement("a");
      card.className = "dashboard-news-item";
      card.href = item.url;
      card.target = "_blank";
      card.rel = "noopener";

      if (item.image) {
        const thumb = document.createElement("img");
        thumb.className = "dashboard-news-thumb";
        thumb.src = item.image;
        thumb.alt = "";
        card.appendChild(thumb);
      }

      const body = document.createElement("div");
      body.className = "dashboard-news-body";

      const headline = document.createElement("p");
      headline.className = "dashboard-news-headline";
      headline.textContent = item.headline;

      const source = document.createElement("span");
      source.className = "dashboard-news-source";
      source.textContent = item.source;

      body.appendChild(headline);
      body.appendChild(source);
      card.appendChild(body);
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = "";
    container.appendChild(createErrorMessage(error.message, () => loadDashboardNews(container)));
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

function loadLocation() {
  const locationEl = document.querySelector("#dashboard-location");
  if (!locationEl) return;

  detectLocation((result) => {
    if (result && result.country) {
      const place = result.city ? result.city + ", " + result.country : result.country;
      locationEl.textContent = "Markets near you: " + place;
    } else {
      locationEl.textContent = "Location unavailable";
    }
  });
}

function loadGreeting() {
  const greeting = document.querySelector("#dashboard-greeting");
  if (!greeting) return;
  if (localStorage.getItem("loggedIn") === "true") {
    const name = localStorage.getItem("userName");
    greeting.textContent = name ? "Welcome Back, " + name : "Welcome Back";
  } else {
    greeting.textContent = "Welcome";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  sessionStorage.setItem("enteredApp", "true");

  const watchlistContainer = document.querySelector(".watchlist-preview");
  const marketContainer = document.querySelector(".market-overview");
  const newsContainer = document.querySelector(".dashboard-news");

  loadGreeting();
  loadLocation();
  renderWatchlist(watchlistContainer);
  loadMarketOverview(marketContainer);
  loadDashboardNews(newsContainer);
});