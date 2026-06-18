function createSectionTitle(text) {
  const heading = document.createElement("h2");
  heading.className = "section-title";
  heading.textContent = text;
  return heading;
}