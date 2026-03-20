// ════════════════════════════════════════════════════════════
// useInView.ts — Mobile scroll animation trigger (FIXED)
//
// What changed:
//   • Added .whatIDO to observed targets
//   • Double-RAF ensures DOM is fully painted before observing
//   • Lower rootMargin for better trigger timing on small screens
// ════════════════════════════════════════════════════════════

export function initInView() {
  // Desktop: no-op
  if (window.innerWidth >= 1025) return;

  // Double requestAnimationFrame = guaranteed post-paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const targets = document.querySelectorAll(
        ".about-section, .whatIDO, .career-section, .work-section, .contact-section, .techstack"
      );

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target); // Fire once
            }
          });
        },
        {
          threshold: 0.08,                // Trigger when 8% visible
          rootMargin: "0px 0px -20px 0px", // Small negative bottom margin
        }
      );

      targets.forEach((el) => observer.observe(el));
    });
  });
}
