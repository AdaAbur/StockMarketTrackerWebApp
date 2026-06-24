document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const symbol = params.get("symbol") || "AAPL";

  const header = document.querySelector(".stock-header");
  const companyContainer = document.querySelector(".company-info");

  const loading = document.createElement("p");
  loading.className = "stock-detail-name";
  loading.textContent = "Loading " + symbol + "...";
  header.appendChild(loading);

  let stock;
  try {
    stock = await fetchQuote(symbol);
  } catch (error) {
    header.innerHTML = "";
    const errorEl = document.createElement("p");
    errorEl.className = "stock-detail-name";
    errorEl.textContent = error.message;
    header.appendChild(errorEl);
    return;
  }

  header.innerHTML = "";

  const symbolEl = document.createElement("p");
  symbolEl.className = "stock-detail-symbol";
  symbolEl.textContent = stock.symbol;

  const nameEl = document.createElement("p");
  nameEl.className = "stock-detail-name";
  nameEl.textContent = stock.name;

  const priceEl = document.createElement("p");
  priceEl.className = "stock-detail-price";
  priceEl.textContent = stock.price;

  const changeEl = document.createElement("span");
  changeEl.className =
    "stock-detail-change " + (stock.trend === "down" ? "text-loss" : "text-gain");
  changeEl.textContent = stock.change;

  header.appendChild(symbolEl);
  header.appendChild(nameEl);
  header.appendChild(priceEl);
  header.appendChild(changeEl);

  if (companyContainer && stock.details) {
    Object.entries(stock.details).forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "company-row";

      const labelEl = document.createElement("span");
      labelEl.className = "company-label";
      labelEl.textContent = label;

      const valueEl = document.createElement("span");
      valueEl.className = "company-value";
      valueEl.textContent = value;

      row.appendChild(labelEl);
      row.appendChild(valueEl);
      companyContainer.appendChild(row);
    });
  }

  const watchlistBtn = document.querySelector("#watchlist-btn");
  if (watchlistBtn) {
    const getWatchlist = () =>
      JSON.parse(localStorage.getItem("watchlist") || "[]");

    const updateButton = () => {
      const saved = getWatchlist().includes(stock.symbol);
      watchlistBtn.textContent = saved ? "Remove from Watchlist" : "Add to Watchlist";
    };

    updateButton();

    watchlistBtn.addEventListener("click", () => {
      let list = getWatchlist();
      if (list.includes(stock.symbol)) {
        list = list.filter((item) => item !== stock.symbol);
      } else {
        list.push(stock.symbol);
      }
      localStorage.setItem("watchlist", JSON.stringify(list));
      updateButton();
    });
  }
});