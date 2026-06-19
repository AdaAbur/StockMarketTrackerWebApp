const navLinks = [
  { label: "Dashboard", href: "dashboard.html" },
  { label: "Stock Search", href: "stock-details.html" },
  { label: "Watchlist", href: "#" },
  { label: "Portfolio", href: "portfolio.html" },
  { label: "Settings", href: "#" },
  { label: "Logout", href: "#" }
];

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
  document.body.insertAdjacentElement("afterbegin", createNavbar());
});