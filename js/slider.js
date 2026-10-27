export function initSlider() {
  const slider = document.getElementById("slider");
  if (!slider) return; // this page has no slider, so do nothing

  const track = document.getElementById("slides");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const dots = document.querySelectorAll("[data-dot]");
  const total = track.children.length;

  let index = 0;
  let timer;

  // Show the slide at position i
  function goTo(i) {
    index = (i + total) % total; // wraps around: after the last comes the first
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((dot, d) => {
      const active = d === index;
      dot.classList.toggle("w-8", active);
      dot.classList.toggle("bg-white", active);
      dot.classList.toggle("w-2.5", !active);
      dot.classList.toggle("bg-white/50", !active);
    });
  }

  // Auto-slide every 4 seconds
  function startAuto() {
    stopAuto();
    timer = setInterval(() => goTo(index + 1), 4000);
  }

  function stopAuto() {
    clearInterval(timer);
  }

  // Arrow buttons
  nextBtn.addEventListener("click", () => {
    goTo(index + 1);
    startAuto();
  });

  prevBtn.addEventListener("click", () => {
    goTo(index - 1);
    startAuto();
  });

  // Dots
  dots.forEach((dot, d) => {
    dot.addEventListener("click", () => {
      goTo(d);
      startAuto();
    });
  });

  // Pause while the mouse is over the slider
  slider.addEventListener("mouseenter", stopAuto);
  slider.addEventListener("mouseleave", startAuto);

  // Swipe on touch screens
  let startX = 0;

  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) {
      goTo(diff < 0 ? index + 1 : index - 1);
      startAuto();
    }
  });

  startAuto();
}