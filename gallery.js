(() => {
  const dialog = document.querySelector(".gallery-lightbox");
  if (!dialog) return;
  const largeImage = dialog.querySelector("img");
  const caption = dialog.querySelector("p");
  const closeButton = dialog.querySelector("button");
  document.querySelectorAll(".gallery-grid figure").forEach((figure) => {
    const image = figure.querySelector("img");
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `View larger image: ${image.alt}`);
    const open = () => {
      largeImage.src = image.src;
      largeImage.alt = image.alt;
      caption.textContent = figure.querySelector("figcaption")?.textContent || image.alt;
      dialog.showModal();
      closeButton.focus();
    };
    image.addEventListener("click", open);
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
