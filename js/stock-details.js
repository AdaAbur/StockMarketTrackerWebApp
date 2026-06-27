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
    header.appendChild(createErrorMessage(error.message, () => window.location.reload()));
    return;
  }

  header.innerHTML = "";

  const logo = document.createElement("img");
  logo.className = "stock-detail-logo";
  logo.src = "https://financialmodelingprep.com/image-stock/" + stock.symbol + ".png";
  logo.alt = "";
  logo.addEventListener("error", () => {
    logo.style.display = "none";
  });

  const info = document.createElement("div");
  info.className = "stock-detail-info";

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

  info.appendChild(symbolEl);
  info.appendChild(nameEl);
  info.appendChild(priceEl);
  info.appendChild(changeEl);

  header.appendChild(logo);
  header.appendChild(info);

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

  const buyShares = document.querySelector("#buy-shares");
  const buyBtn = document.querySelector("#buy-btn");
  const buyFeedback = document.querySelector("#buy-feedback");
  const currencyChar = stock.price.charAt(0);
  const priceNumber = parseFloat(stock.price.replace(/[^0-9.]/g, ""));
  let awaitingConfirm = false;

  buyBtn.addEventListener("click", () => {
    if (localStorage.getItem("loggedIn") !== "true") {
      window.location.href = "login.html";
      return;
    }

    const shares = parseFloat(buyShares.value);

    if (isNaN(shares) || shares <= 0) {
      buyFeedback.textContent = "Please enter a number of shares greater than 0.";
      buyFeedback.className = "buy-feedback text-loss";
      awaitingConfirm = false;
      buyBtn.textContent = "Buy";
      return;
    }

    if (!awaitingConfirm) {
      const total = (shares * priceNumber).toFixed(2);
      buyFeedback.textContent =
        "Buy " + shares + " shares of " + stock.symbol + " at " + stock.price +
        " for " + currencyChar + total + "? Click Confirm.";
      buyFeedback.className = "buy-feedback";
      buyBtn.textContent = "Confirm";
      awaitingConfirm = true;
      return;
    }

    const holdings = JSON.parse(localStorage.getItem("holdings") || "[]");
    holdings.push({ symbol: stock.symbol, shares: shares, price: priceNumber });
    localStorage.setItem("holdings", JSON.stringify(holdings));

    buyFeedback.textContent = "Bought " + shares + " shares of " + stock.symbol + ".";
    buyFeedback.className = "buy-feedback text-gain";
    buyBtn.textContent = "Buy";
    buyShares.value = "";
    awaitingConfirm = false;
  });
});