import { TextSplitter } from "../../utils/textSplitter";
import gsap from "gsap";
import { lenis } from "../Navbar";

export function initialFX() {
  // Force scroll on — yahi main fix hai
  document.body.style.overflow  = "auto";
  document.body.style.overflowX = "hidden";
  document.body.style.backgroundColor = "#0b080c";

  if (lenis) lenis.start();

  document.getElementsByTagName("main")[0]?.classList.add("main-active");

  // Mobile pe desktop text animations skip
  if (window.innerWidth <= 1024) return;

  // ── Desktop animations (same as original) ──
  const selectors = [".landing-info h3", ".landing-intro h2", ".landing-intro h1"];
  const elements  = selectors.flatMap(s => Array.from(document.querySelectorAll(s)));

  const landingText = new TextSplitter(elements, { type: "chars,lines", linesClass: "split-line" });
  gsap.fromTo(landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    { opacity: 1, duration: 1.2, filter: "blur(0px)", ease: "power3.inOut", y: 0, stagger: 0.025, delay: 0.3 }
  );

  const TextProps = { type: "chars,lines", linesClass: "split-h2" };
  const lt2 = new TextSplitter(".landing-h2-info",   TextProps);
  const lt3 = new TextSplitter(".landing-h2-info-1", TextProps);
  const lt4 = new TextSplitter(".landing-h2-1",      TextProps);
  const lt5 = new TextSplitter(".landing-h2-2",      TextProps);

  gsap.fromTo(lt2.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    { opacity: 1, duration: 1.2, filter: "blur(0px)", ease: "power3.inOut", y: 0, stagger: 0.025, delay: 0.3 }
  );
  gsap.fromTo(".landing-info-h2",
    { opacity: 0, y: 30 },
    { opacity: 1, duration: 1.2, ease: "power1.inOut", y: 0, delay: 0.8 }
  );
  gsap.fromTo([".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    { opacity: 1, duration: 1.2, ease: "power1.inOut", delay: 0.1 }
  );

  LoopText(lt2, lt3);
  LoopText(lt4, lt5);
}

function LoopText(Text1: TextSplitter, Text2: TextSplitter) {
  const tl     = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay  = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(Text2.chars, { opacity: 0, y: 80 },
    { opacity: 1, duration: 1.2, ease: "power3.inOut", y: 0, stagger: 0.1, delay }, 0)
    .fromTo(Text1.chars, { y: 80 },
    { duration: 1.2, ease: "power3.inOut", y: 0, stagger: 0.1, delay: delay2 }, 1)
    .fromTo(Text1.chars, { y: 0 },
    { y: -80, duration: 1.2, ease: "power3.inOut", stagger: 0.1, delay }, 0)
    .to(Text2.chars,
    { y: -80, duration: 1.2, ease: "power3.inOut", stagger: 0.1, delay: delay2 }, 1);
}


