function createStockRow({ symbol, name, price, change, trend, href }) {
  const row = document.createElement(href ? "a" : "div");
  row.className = "stock-row";
  if (href) row.href = href;

  const main = document.createElement("span");
  main.className = "stock-row-main";

  const symbolEl = document.createElement("span");
  symbolEl.className = "stock-symbol";
  symbolEl.textContent = symbol;

  const nameEl = document.createElement("span");
  nameEl.className = "stock-name";
  nameEl.textContent = name;

  main.appendChild(symbolEl);
  main.appendChild(nameEl);

  const end = document.createElement("span");
  end.className = "stock-row-end";

  const priceEl = document.createElement("span");
  priceEl.className = "stock-price";
  priceEl.textContent = price;
  end.appendChild(priceEl);

  if (change) {
    const changeEl = document.createElement("span");
    changeEl.className = "stock-change " + (trend === "down" ? "text-loss" : "text-gain");
    changeEl.textContent = change;
    end.appendChild(changeEl);
  }

  row.appendChild(main);
  row.appendChild(end);
  return row;
}