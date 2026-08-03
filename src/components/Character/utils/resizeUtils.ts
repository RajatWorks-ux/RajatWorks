import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  if (!canvasDiv.current) return;
  let canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width;
  const height = canvas3d.height;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Kill all triggers EXCEPT the work pin — Work.tsx manages its own trigger.
  // We must NOT kill the work trigger here, because Work.tsx already set it up
  // with invalidateOnRefresh:true. Killing it here then NOT recreating it
  // would leave the work section with no trigger at all after resize.
  const workTrigger = ScrollTrigger.getById("work");
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger !== workTrigger) {
      trigger.kill();
    }
  });

  setCharTimeline(character, camera);
  setAllTimeline();

  // FIX: Call ScrollTrigger.refresh() AFTER rebuilding all timelines.
  // Without this, the work pin spacer (which uses invalidateOnRefresh:true
  // and a function-based `end`) never recalculates its translateX value
  // after a resize, so the Work section still overlaps TechStack on resize.
  // A small delay lets the DOM settle (fonts, images) before measuring.
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
}
