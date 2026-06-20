const stockList = [
  { symbol: "TSLA", name: "Tesla, Inc.", price: "$400.43", change: "+1.02%", trend: "up" },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: "$210.23", change: "+2.73%", trend: "up" },
  { symbol: "AAPL", name: "Apple Inc.", price: "$297.89", change: "+0.66%", trend: "up" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: "$379.05", change: "+0.04%", trend: "up" },
  { symbol: "AMZN", name: "Amazon.com, Inc.", price: "$244.35", change: "+2.89%", trend: "up" },
  { symbol: "META", name: "Meta Platforms Inc.", price: "$577.22", change: "+1.70%", trend: "up" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: "$367.99", change: "+1.15%", trend: "up" }
];

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#stock-search-input");
  const results = document.querySelector(".stock-results");

  const render = (list) => {
    results.innerHTML = "";
    if (list.length === 0) {
      results.innerHTML = "<p>No stocks found.</p>";
      return;
    }
    list.forEach((stock) => {
      results.appendChild(
        createStockRow({ ...stock, href: "stock-details.html?symbol=" + stock.symbol })
      );
    });
  };

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    const filtered = stockList.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query)
    );
    render(filtered);
  });

  render(stockList);
});