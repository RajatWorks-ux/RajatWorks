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

  const canvas3d = canvasDiv.current.getBoundingClientRect();
  const width  = canvas3d.width;
  const height = canvas3d.height;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // ── Kill ALL scroll triggers (GsapScroll.ts now tracks & kills its own)
  // Then rebuild everything fresh so positions are correct at new viewport size.
  // We do NOT selectively spare the "work" trigger — Work.tsx no longer uses
  // GSAP pin (Bento Grid), so there's nothing to preserve.
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  // Rebuild char + career timelines — GsapScroll.ts kills its previous
  // instances internally before creating new ones.
  setCharTimeline(character, camera);
  setAllTimeline();

  // Refresh AFTER rebuild so all trigger positions are recalculated
  // against the new viewport dimensions.
  setTimeout(() => ScrollTrigger.refresh(), 120);
}
