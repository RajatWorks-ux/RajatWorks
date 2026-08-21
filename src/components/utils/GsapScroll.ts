import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Device detection (same 3-layer check everywhere) ─────────
const _ua         = navigator.userAgent;
const _mobileUA   = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(_ua);
const _hasFine    = window.matchMedia("(pointer: fine)").matches;
const _isVeryWide = window.innerWidth > 1024;
const isRealDesktop = !_mobileUA && (_isVeryWide || _hasFine);

// ── Track active timelines so we can kill them on resize ─────
let _activeTl1: gsap.core.Timeline | null = null;
let _activeTl2: gsap.core.Timeline | null = null;
let _activeTl3: gsap.core.Timeline | null = null;
let _activeCareer: gsap.core.Timeline | null = null;
let _intensityInterval: ReturnType<typeof setInterval> | null = null;

function killAllTimelines() {
  _activeTl1?.scrollTrigger?.kill(); _activeTl1?.kill(); _activeTl1 = null;
  _activeTl2?.scrollTrigger?.kill(); _activeTl2?.kill(); _activeTl2 = null;
  _activeTl3?.scrollTrigger?.kill(); _activeTl3?.kill(); _activeTl3 = null;
  _activeCareer?.scrollTrigger?.kill(); _activeCareer?.kill(); _activeCareer = null;
  if (_intensityInterval) { clearInterval(_intensityInterval); _intensityInterval = null; }
}

// ─────────────────────────────────────────────────────────────
export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  // Kill previous timelines before rebuilding (important on resize)
  killAllTimelines();

  let intensity = 0;
  _intensityInterval = setInterval(() => { intensity = Math.random(); }, 200);

  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  _activeTl1 = tl1;

  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  _activeTl2 = tl2;

  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  _activeTl3 = tl3;

  let screenLight: any, monitor: any;
  character?.children.forEach((object: any) => {
    if (object.name === "Plane004") {
      object.children.forEach((child: any) => {
        child.material.transparent = true;
        child.material.opacity = 0;
        if (child.material.name === "Material.027") {
          monitor = child;
          child.material.color.set("#FFFFFF");
        }
      });
    }
    if (object.name === "screenlight") {
      object.material.transparent = true;
      object.material.opacity = 0;
      object.material.emissive.set("#C8BFFF");
      gsap.timeline({ repeat: -1, repeatRefresh: true }).to(object.material, {
        emissiveIntensity: () => intensity * 8,
        duration: () => Math.random() * 0.6,
        delay: () => Math.random() * 0.1,
      });
      screenLight = object;
    }
  });

  let neckBone = character?.getObjectByName("spine005");

  if (isRealDesktop) {
    if (character) {
      // ── Ensure the character-model element has GPU layer promotion
      // so position:fixed + GSAP transform never causes a re-layout jank
      const modelEl = document.querySelector<HTMLElement>(".character-model");
      if (modelEl) {
        modelEl.style.willChange = "transform";
        modelEl.style.backfaceVisibility = "hidden";
      }

      tl1
        .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
        .to(camera.position, { z: 22 }, 0)
        .fromTo(".character-model", { x: 0 }, { x: "-25%", duration: 1 }, 0)
        .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
        .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
        .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

      tl2
        .to(camera.position, { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" }, 0)
        .to(".about-section", { y: "30%", duration: 6 }, 0)
        .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
        .fromTo(
          ".character-model",
          { pointerEvents: "inherit" },
          { pointerEvents: "none", x: "-12%", delay: 2, duration: 5 },
          0
        )
        .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0)
        .to(neckBone!.rotation, { x: 0.6, delay: 2, duration: 3 }, 0)
        .to(monitor.material, { opacity: 1, duration: 0.8, delay: 3.2 }, 0)
        .to(screenLight.material, { opacity: 1, duration: 0.8, delay: 4.5 }, 0)
        .fromTo(".what-box-in", { display: "none" }, { display: "flex", duration: 0.1, delay: 6 }, 0)
        .fromTo(monitor.position, { y: -10, z: 2 }, { y: 0, z: 0, delay: 1.5, duration: 3 }, 0)
        .fromTo(
          ".character-rim",
          { opacity: 1, scaleX: 1.4 },
          { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
          0.3
        );

      tl3
        .fromTo(
          ".character-model",
          // ── FIX: use transform3d so the browser keeps the element on
          //    its own GPU compositing layer. This prevents the fixed-position
          //    model from "jumping" when other sections (Bento Work, TechStack)
          //    cause layout reflows.
          { y: "0%", z: 0 },
          { y: "-100%", z: 0, duration: 4, ease: "none", delay: 1, force3D: true },
          0
        )
        .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
        .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);
    }
  } else {
    if (character) {
      const tM2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".what-box-in",
          start: "top 70%",
          end: "bottom top",
        },
      });
      tM2.to(".what-box-in", { display: "flex", duration: 0.1, delay: 0 }, 0);
    }
  }

  return { intensityInterval: _intensityInterval };
}

export function setAllTimeline() {
  // Kill previous career timeline
  _activeCareer?.scrollTrigger?.kill();
  _activeCareer?.kill();

  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 30%",
      end: "100% center",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  _activeCareer = careerTimeline;

  careerTimeline
    .fromTo(".career-timeline", { maxHeight: "10%" }, { maxHeight: "100%", duration: 0.5 }, 0)
    .fromTo(".career-timeline", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0)
    .fromTo(".career-info-box", { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.5 }, 0)
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      { animationIterationCount: "1", delay: 0.3, duration: 0.1 },
      0
    );

  if (isRealDesktop) {
    careerTimeline.fromTo(".career-section", { y: 0 }, { y: "20%", duration: 0.5, delay: 0.2 }, 0);
  } else {
    careerTimeline.fromTo(".career-section", { y: 0 }, { y: 0, duration: 0.5, delay: 0.2 }, 0);
  }
}


