const stocks = {
  AAPL: { symbol: "AAPL", name: "Apple Inc.", price: "$297.89", change: "+0.66%", trend: "up",
    company: { Sector: "Technology", Industry: "Consumer Electronics", CEO: "Tim Cook", Headquarters: "Cupertino, CA", Employees: "164,000", "Market Cap": "$3.01T" } },
  TSLA: { symbol: "TSLA", name: "Tesla, Inc.", price: "$400.43", change: "+1.02%", trend: "up",
    company: { Sector: "Automotive", Industry: "Electric Vehicles", CEO: "Elon Musk", Headquarters: "Austin, TX", Employees: "140,000", "Market Cap": "$1.27T" } },
  NVDA: { symbol: "NVDA", name: "NVIDIA Corporation", price: "$210.23", change: "+2.73%", trend: "up",
    company: { Sector: "Technology", Industry: "Semiconductors", CEO: "Jensen Huang", Headquarters: "Santa Clara, CA", Employees: "29,600", "Market Cap": "$2.10T" } },
  MSFT: { symbol: "MSFT", name: "Microsoft Corp.", price: "$379.05", change: "+0.04%", trend: "up",
    company: { Sector: "Technology", Industry: "Software", CEO: "Satya Nadella", Headquarters: "Redmond, WA", Employees: "221,000", "Market Cap": "$2.82T" } },
  AMZN: { symbol: "AMZN", name: "Amazon.com, Inc.", price: "$244.35", change: "+2.89%", trend: "up",
    company: { Sector: "Consumer Cyclical", Industry: "E-Commerce", CEO: "Andy Jassy", Headquarters: "Seattle, WA", Employees: "1,525,000", "Market Cap": "$2.49T" } },
  META: { symbol: "META", name: "Meta Platforms Inc.", price: "$577.22", change: "+1.70%", trend: "up",
    company: { Sector: "Technology", Industry: "Social Media", CEO: "Mark Zuckerberg", Headquarters: "Menlo Park, CA", Employees: "67,000", "Market Cap": "$1.47T" } },
  GOOGL: { symbol: "GOOGL", name: "Alphabet Inc.", price: "$367.99", change: "+1.15%", trend: "up",
    company: { Sector: "Communication Services", Industry: "Internet Content", CEO: "Sundar Pichai", Headquarters: "Mountain View, CA", Employees: "182,000", "Market Cap": "$1.86T" } }
};

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const symbol = params.get("symbol");
  const stock = stocks[symbol] || stocks.AAPL;

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