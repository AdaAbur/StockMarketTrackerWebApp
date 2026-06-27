function createStockRow({ symbol, name, price, change, trend, href }) {
  const row = document.createElement(href ? "a" : "div");
  row.className = "stock-row";
  if (href) row.href = href;

  const left = document.createElement("span");
  left.className = "stock-row-left";

  const logo = document.createElement("img");
  logo.className = "stock-logo";
  logo.src = "https://financialmodelingprep.com/image-stock/" + symbol + ".png";
  logo.alt = "";
  logo.addEventListener("error", () => {
    logo.style.display = "none";
  });

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

  left.appendChild(logo);
  left.appendChild(main);

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

  row.appendChild(left);
  row.appendChild(end);
  return row;
}