document.addEventListener("DOMContentLoaded", () => {
  const summaryContainer = document.querySelector(".summary-cards");
  summaryCards.forEach((item) => {
    summaryContainer.appendChild(createStatCard(item));
  });

  const watchlistContainer = document.querySelector(".watchlist-preview");
  watchlistStocks.forEach((stock) => {
    watchlistContainer.appendChild(
      createStockRow({ ...stock, href: "stock-details.html" })
    );
  });
  const seeAll = document.createElement("a");
  seeAll.href = "#";
  seeAll.className = "watchlist-link";
  seeAll.textContent = "See all";
  watchlistContainer.appendChild(seeAll);

  const overviewContainer = document.querySelector(".stock-overview");
  marketIndexes.forEach((index) => {
    overviewContainer.appendChild(createStockRow(index));
  });
});