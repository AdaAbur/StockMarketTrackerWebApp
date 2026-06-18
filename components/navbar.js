function createNavbar() {
  const nav = document.createElement("nav");
  nav.className = "navbar";

  const brand = document.createElement("a");
  brand.className = "navbar-brand";
  brand.href = "dashboard.html";
  brand.innerHTML = 'trade<span class="navbar-dot"></span>on';

  const links = document.createElement("div");
  links.className = "navbar-links";

  nav.appendChild(brand);
  nav.appendChild(links);
  return nav;
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentElement("afterbegin", createNavbar());
});