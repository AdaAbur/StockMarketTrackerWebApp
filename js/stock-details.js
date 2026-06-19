const stock = {
  symbol: "AAPL",
  name: "Apple Inc.",
  price: "$192.45",
  change: "+1.24%",
  trend: "up",
  company: {
    Sector: "Technology",
    Industry: "Consumer Electronics",
    CEO: "Tim Cook",
    Headquarters: "Cupertino, CA",
    Employees: "164,000",
    "Market Cap": "$3.01T"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".stock-header");

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

  const companyContainer = document.querySelector(".company-info");
  if (companyContainer && stock.company) {
    Object.entries(stock.company).forEach(([label, value]) => {
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