const stock = {
  symbol: "AAPL",
  name: "Apple Inc.",
  price: "$192.45",
  change: "+1.24%",
  trend: "up"
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
});