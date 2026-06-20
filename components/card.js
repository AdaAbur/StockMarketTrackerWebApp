function createCard({ title = "", body = "", selected = false } = {}) {
  const card = document.createElement("div");
  card.className = selected ? "glass-card glass-card-selected" : "glass-card";

  if (title) {
    const heading = document.createElement("h3");
    heading.textContent = title;
    card.appendChild(heading);
  }

  if (body) {
    const text = document.createElement("p");
    text.textContent = body;
    card.appendChild(text);
  }

  return card;
}