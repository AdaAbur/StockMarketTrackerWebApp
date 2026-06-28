document.addEventListener("DOMContentLoaded", async () => {
  const guestBtn = document.querySelector("#guest-btn");
  if (guestBtn) {
    guestBtn.addEventListener("click", () => {
      const email = localStorage.getItem("userEmail");
      if (email) {
        const data = {
          watchlist: JSON.parse(localStorage.getItem("watchlist") || "[]"),
          holdings: JSON.parse(localStorage.getItem("holdings") || "[]"),
          name: localStorage.getItem("userName") || ""
        };
        localStorage.setItem("account_" + email, JSON.stringify(data));
      }
      localStorage.removeItem("watchlist");
      localStorage.removeItem("holdings");
      localStorage.removeItem("userName");
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("userEmail");
    });
  }

  const container = document.querySelector(".welcome-news-list");
  if (!container) return;

  const message = document.createElement("p");
  message.className = "welcome-news-message";
  message.textContent = "Loading news...";
  container.appendChild(message);

  try {
    const items = await fetchNews();
    container.innerHTML = "";
    items.slice(0, 10).forEach((item) => {
      const card = document.createElement("a");
      card.className = "welcome-news-item";
      card.href = item.url;
      card.target = "_blank";
      card.rel = "noopener";

      if (item.image) {
        const thumb = document.createElement("img");
        thumb.className = "welcome-news-thumb";
        thumb.src = item.image;
        thumb.alt = "";
        card.appendChild(thumb);
      }

      const body = document.createElement("div");
      body.className = "welcome-news-body";

      const headline = document.createElement("p");
      headline.className = "welcome-news-headline";
      headline.textContent = item.headline;

      const source = document.createElement("span");
      source.className = "welcome-news-source";
      source.textContent = item.source;

      body.appendChild(headline);
      body.appendChild(source);
      card.appendChild(body);
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