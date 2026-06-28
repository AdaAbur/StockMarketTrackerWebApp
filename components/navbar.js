const navLinks = [
  { label: "Dashboard", href: "dashboard.html" },
  { label: "Stock Search", href: "stock-search.html" },
  { label: "News", href: "news.html" },
  { label: "Watchlist", href: "watchlist.html" },
  { label: "Portfolio", href: "portfolio.html" },
  { label: "Profile", href: "profile.html" },
  { label: "Settings", href: "settings.html" }
];

const protectedPages = ["watchlist.html", "portfolio.html", "profile.html"];

function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
}

function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}

function logout() {
  const email = localStorage.getItem("userEmail");
  if (email) {
    const data = {
      watchlist: JSON.parse(localStorage.getItem("watchlist") || "[]"),
      holdings: JSON.parse(localStorage.getItem("holdings") || "[]"),
      name: localStorage.getItem("userName") || "",
      theme: localStorage.getItem("theme") || "dark",
      currency: localStorage.getItem("currency") || "USD"
    };
    localStorage.setItem("account_" + email, JSON.stringify(data));
  }
  localStorage.removeItem("watchlist");
  localStorage.removeItem("holdings");
  localStorage.removeItem("userName");
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("theme");
  localStorage.removeItem("currency");
  sessionStorage.removeItem("enteredApp");
  window.location.href = "../index.html";
}

function createNavbar() {
  const nav = document.createElement("nav");
  nav.className = "navbar";

  const brand = document.createElement("a");
  brand.className = "navbar-brand";
  brand.href = "dashboard.html";
  brand.innerHTML = 'trade<span class="navbar-dot"></span>on';

  const toggle = document.createElement("button");
  toggle.className = "navbar-toggle";
  toggle.setAttribute("aria-label", "Toggle menu");
  toggle.innerHTML = "<span></span><span></span><span></span>";

  const links = document.createElement("div");
  links.className = "navbar-links";

  const currentPage = window.location.pathname.split("/").pop();

  navLinks.forEach((item) => {
    const link = document.createElement("a");
    link.className = "navbar-link";
    link.href = item.href;
    link.textContent = item.label;

    if (protectedPages.includes(item.href)) {
      link.addEventListener("click", (event) => {
        if (!isLoggedIn()) {
          event.preventDefault();
          window.location.href = "login.html";
        }
      });
    }

    if (item.href === currentPage) {
      link.classList.add("navbar-link-active");
    }
    links.appendChild(link);
  });

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  nav.appendChild(brand);
  nav.appendChild(toggle);
  nav.appendChild(links);
  return nav;
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(localStorage.getItem("theme") || "dark");
  document.body.insertAdjacentElement("afterbegin", createNavbar());
});