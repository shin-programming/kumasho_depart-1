document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".nav-card");
  cards.forEach(card => {
    card.addEventListener("mouseover", () => {
      card.classList.add("hovering");
    });
    card.addEventListener("mouseout", () => {
      card.classList.remove("hovering");
    });
  });
});
