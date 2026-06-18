function createStatCard({ label, value, trend }) {
  const card = document.createElement("div");
  card.className = "glass-card stat-card";

  const labelEl = document.createElement("p");
  labelEl.className = "stat-label";
  labelEl.textContent = label;

  const valueEl = document.createElement("p");
  valueEl.className = "stat-value";
  valueEl.textContent = value;
  if (trend === "up") valueEl.classList.add("text-gain");
  if (trend === "down") valueEl.classList.add("text-loss");

  card.appendChild(labelEl);
  card.appendChild(valueEl);
  return card;
}