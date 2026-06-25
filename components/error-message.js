function createErrorMessage(text, onRetry) {
  const box = document.createElement("div");
  box.className = "error-message";

  const icon = document.createElement("span");
  icon.className = "error-icon";
  icon.textContent = "!";

  const content = document.createElement("div");
  content.className = "error-content";

  const message = document.createElement("p");
  message.className = "error-text";
  message.textContent = text;
  content.appendChild(message);

  if (onRetry) {
    const retry = document.createElement("button");
    retry.className = "error-retry";
    retry.textContent = "Try Again";
    retry.addEventListener("click", onRetry);
    content.appendChild(retry);
  }

  box.appendChild(icon);
  box.appendChild(content);
  return box;
}