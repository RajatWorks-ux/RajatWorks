// ════════════════════════════════════════════════
// useInView.ts — Mobile scroll animation trigger
// Path: src/utils/useInView.ts
//
// Kaise use karo:
//   import { initInView } from "../utils/useInView";
//   useEffect(() => { initInView(); }, []);
// ════════════════════════════════════════════════

export function initInView() {
  // Mobile only
  if (window.innerWidth >= 1025) return;

  const targets = document.querySelectorAll(
    ".about-section, .career-section, .work-section, .contact-section, .techstack"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          // Ek baar trigger ho gaya — unobserve karo
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12, // 12% visible hote hi animation start
      rootMargin: "0px 0px -50px 0px",
    }
  );

  targets.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}

