document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".welcome-news-list");
  if (!container) return;

  const message = document.createElement("p");
  message.className = "welcome-news-message";
  message.textContent = "Loading news...";
  container.appendChild(message);

  try {
    const items = await fetchNews();
    container.innerHTML = "";
    items.slice(0, 5).forEach((item) => {
      const card = document.createElement("a");
      card.className = "welcome-news-item";
      card.href = item.url;
      card.target = "_blank";
      card.rel = "noopener";

      const headline = document.createElement("p");
      headline.className = "welcome-news-headline";
      headline.textContent = item.headline;

      const source = document.createElement("span");
      source.className = "welcome-news-source";
      source.textContent = item.source;

      card.appendChild(headline);
      card.appendChild(source);
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = "";
    const err = document.createElement("p");
    err.className = "welcome-news-message";
    err.textContent = error.message;
    container.appendChild(err);
  }
});