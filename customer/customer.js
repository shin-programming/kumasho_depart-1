document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-link");
  links.forEach(link => {
    link.addEventListener("mouseenter", () => link.classList.add("hovering"));
    link.addEventListener("mouseleave", () => link.classList.remove("hovering"));
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const fadeEls = document.querySelectorAll('.fade-in');

  const showOnScroll = () => {
    const trigger = window.innerHeight * 0.85;
    fadeEls.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < trigger) {
        el.classList.add('visible');
      }
    });
  };

  window.addEventListener('scroll', showOnScroll);
  showOnScroll(); // 初期実行
});

