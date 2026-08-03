// ════════════════════════════════════════════════════════════
// useInView.ts — Scroll animation trigger
//
// Runs on ALL screen sizes now because Contact uses .in-view
// animations on both mobile and desktop.
// ════════════════════════════════════════════════════════════

export function initInView() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const targets = document.querySelectorAll(
        ".about-section, .whatIDO, .career-section, .work-section, .contact-section, .techstack-mobile"
      );

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -20px 0px",
        }
      );

      targets.forEach((el) => observer.observe(el));
    });
  });
}

