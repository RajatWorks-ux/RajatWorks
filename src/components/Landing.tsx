import { PropsWithChildren, useEffect, useRef, useState } from "react";
import "./styles/Landing.css";
import { config } from "../config";
import * as THREE from "three";

// ════════════════════════════════════════════════════════════════
//  MOBILE HERO — "THE FORGE"
//  Three.js prism + orbiting dots with point lights
//  + CanvasTexture cycling project images on prism face
//  + Touch torque impulse
//  + Skill sprites orbiting at larger radius
// ════════════════════════════════════════════════════════════════

const SKILL_LABELS = ["React", "Three.js", "TypeScript", "Next.js", "Supabase", "GSAP", "React Native", "Groq"];

function buildLabelCanvas(text: string): HTMLCanvasElement {
  const dpr = Math.min(window.devicePixelRatio, 2);
  const w = 160 * dpr, h = 40 * dpr;
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d")!;
  ctx.scale(dpr, dpr);
  ctx.fillStyle = "rgba(234,229,236,0.72)";
  ctx.font = "600 11px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 80, 20);
  return cv;
}

const ForgeHero: React.FC<{ projects: typeof config.projects }> = ({ projects }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  // expose touch handler to parent via DOM event
  const stateRef = useRef({
    torqueY: 0,
    torqueX: 0,
    rotY: 0.2,
    rotX: 0.12,
    imgIndex: 0,
    imgProgress: 0,
    touchX: 0,
    touchY: 0,
    lastTouchX: 0,
    lastTouchY: 0,
    orbAngles: [0, Math.PI * 2 / 3, Math.PI * 4 / 3], // 3 orbit dots
    skillAngles: SKILL_LABELS.map((_, i) => (i / SKILL_LABELS.length) * Math.PI * 2),
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ── Scene ──
    const scene = new THREE.Scene();

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 0, 8);

    // ── Ambient ──
    const ambient = new THREE.AmbientLight(0xffffff, 0.08);
    scene.add(ambient);

    // ── The Prism — IcosahedronGeometry (low detail = sharp facets) ──
    const prismGeo = new THREE.IcosahedronGeometry(1.7, 1);
    const prismMat = new THREE.MeshStandardMaterial({
      color: 0x181420,
      metalness: 0.72,
      roughness: 0.28,
      envMapIntensity: 1.2,
    });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.castShadow = true;
    prism.position.set(0.3, 0, 0);
    scene.add(prism);

    // Edge wireframe for sharp outline
    const edgesGeo = new THREE.EdgesGeometry(prismGeo);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x2a2035, transparent: true, opacity: 0.55 });
    const edges = new THREE.LineSegments(edgesGeo, edgesMat);
    prism.add(edges);

    // ── Project image canvas texture on one face ──
    const texCanvas = document.createElement("canvas");
    texCanvas.width = 512; texCanvas.height = 512;
    const texCtx = texCanvas.getContext("2d")!;
    const canvasTex = new THREE.CanvasTexture(texCanvas);

    // Extra face plane glued to prism front face
    const facePlaneGeo = new THREE.PlaneGeometry(1.4, 1.4);
    const facePlaneMat = new THREE.MeshBasicMaterial({ map: canvasTex, transparent: true, opacity: 0.88, depthWrite: false });
    const facePlane = new THREE.Mesh(facePlaneGeo, facePlaneMat);
    facePlane.position.set(0, 0, 1.68);
    prism.add(facePlane);

    // Load project images
    const imgs: HTMLImageElement[] = projects.map((p) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = p.images[0];
      return img;
    });
    const drawTexture = (idx: number) => {
      texCtx.clearRect(0, 0, 512, 512);
      const img = imgs[idx];
      if (img.complete && img.naturalWidth > 0) {
        texCtx.drawImage(img, 0, 0, 512, 512);
        // Dark vignette
        const vignette = texCtx.createRadialGradient(256, 256, 80, 256, 256, 280);
        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(1, "rgba(0,0,0,0.6)");
        texCtx.fillStyle = vignette;
        texCtx.fillRect(0, 0, 512, 512);
      }
      canvasTex.needsUpdate = true;
    };
    imgs[0].onload = () => drawTexture(0);

    // ── 3 Orbit tubes ──
    const ORBIT_TILTS = [0.3, -0.5, 0.7];
    const ORBIT_RADII = [2.8, 3.1, 2.6];
    const orbitObjects: THREE.Object3D[] = [];
    const dotLights: THREE.PointLight[] = [];

    ORBIT_TILTS.forEach((tilt, i) => {
      // Orbit tube
      const curve = new THREE.EllipseCurve(0, 0, ORBIT_RADII[i], ORBIT_RADII[i] * 0.62, 0, Math.PI * 2, false, 0);
      const points = curve.getPoints(80);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p.x, p.y, 0)));
      const orbitMat = new THREE.LineBasicMaterial({ color: 0x2a1e3a, transparent: true, opacity: 0.28 });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.rotation.x = tilt;
      orbitLine.rotation.y = i * 0.6;
      scene.add(orbitLine);
      orbitObjects.push(orbitLine);

      // Dot on the orbit
      const dotGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xd4c4a8 });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      scene.add(dot);

      // Point light on dot — casts warm amber on prism
      const ptLight = new THREE.PointLight(0xc8b89a, 2.2, 6);
      dot.add(ptLight);
      dotLights.push(ptLight);
    });

    // ── Skill sprites at larger orbit ──
    const skillSprites: THREE.Sprite[] = [];
    SKILL_LABELS.forEach((label) => {
      const cv = buildLabelCanvas(label);
      const tex = new THREE.CanvasTexture(cv);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      const sprite = new THREE.Sprite(mat);
      const aspect = 160 / 40;
      sprite.scale.set(aspect * 0.38, 0.38, 1);
      scene.add(sprite);
      skillSprites.push(sprite);
    });

    // ── Touch handlers ──
    const onTouchStart = (e: TouchEvent) => {
      stateRef.current.lastTouchX = e.touches[0].clientX;
      stateRef.current.lastTouchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - stateRef.current.lastTouchX;
      const dy = e.touches[0].clientY - stateRef.current.lastTouchY;
      stateRef.current.torqueY += dx * 0.012;
      stateRef.current.torqueX += dy * 0.008;
      stateRef.current.lastTouchX = e.touches[0].clientX;
      stateRef.current.lastTouchY = e.touches[0].clientY;

      // Scatter skill sprites impulse
      stateRef.current.skillAngles = stateRef.current.skillAngles.map((a) => a + dx * 0.003);
    };
    renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: true });
    renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: true });

    // ── Animation ──
    const clock = new THREE.Clock();
    let imgTimer = 0;

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05);
      imgTimer += dt;

      // Cycle project images every 4 seconds
      if (imgTimer > 4) {
        imgTimer = 0;
        stateRef.current.imgIndex = (stateRef.current.imgIndex + 1) % projects.length;
        drawTexture(stateRef.current.imgIndex);
      }

      // Prism idle rotation + touch torque
      stateRef.current.torqueY *= 0.94;
      stateRef.current.torqueX *= 0.94;
      stateRef.current.rotY += 0.004 + stateRef.current.torqueY;
      stateRef.current.rotX += 0.001 + stateRef.current.torqueX;
      prism.rotation.y = stateRef.current.rotY;
      prism.rotation.x = stateRef.current.rotX * 0.4;

      // Slight float
      prism.position.y = Math.sin(t * 0.5) * 0.08;

      // Orbit dot positions
      stateRef.current.orbAngles = stateRef.current.orbAngles.map((a) => a + 0.008);
      ORBIT_TILTS.forEach((tilt, i) => {
        const angle = stateRef.current.orbAngles[i];
        const r = ORBIT_RADII[i];
        const dot = dotLights[i].parent as THREE.Mesh;
        if (!dot) return;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r * 0.62 * Math.cos(tilt);
        const z = Math.sin(angle) * r * 0.62 * Math.sin(tilt);
        dot.position.set(x + prism.position.x, y, z);
      });

      // Skill sprites slow orbit
      stateRef.current.skillAngles = stateRef.current.skillAngles.map((a) => a + 0.0025);
      skillSprites.forEach((sprite, i) => {
        const angle = stateRef.current.skillAngles[i];
        const r = 3.8;
        const y = Math.sin(t * 0.4 + i * 0.7) * 0.5;
        sprite.position.set(Math.cos(angle) * r + 0.3, y, Math.sin(angle) * r * 0.5);
        const dist = sprite.position.distanceTo(camera.position);
        (sprite.material as THREE.SpriteMaterial).opacity = dist < 10 ? 0.75 : 0.3;
      });

      // Slow camera drift
      camera.position.x = Math.sin(t * 0.08) * 0.25;
      camera.position.y = Math.cos(t * 0.06) * 0.15;
      camera.lookAt(prism.position);

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ──
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      renderer.domElement.removeEventListener("touchstart", onTouchStart);
      renderer.domElement.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [projects]);

  return <div ref={mountRef} className="forge-canvas-mount" aria-hidden="true" />;
};

// ── Letter-drop animation ──
const DroppingName: React.FC<{ text: string; className: string; delay?: number }> = ({ text, className, delay = 0 }) => {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="forge-letter"
          style={{ animationDelay: `${delay + i * 55}ms` }}
          aria-hidden="true"
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
};

// ── Mobile hero root ──
const ForgeHeroSection: React.FC = () => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={`forge-section${ready ? " forge-ready" : ""}`} aria-label="Introduction">
      {/* Full-bleed Three.js scene */}
      <ForgeHero projects={config.projects} />

      {/* Text layer */}
      <div className="forge-text-layer">
        {/* Top-left brand mark */}
        <div className="forge-brand">
          <span className="forge-brand-rw">RW</span>
          <span className="forge-brand-est">EST. 2020</span>
        </div>

        {/* Name — center-left */}
        <div className="forge-name-block">
          <DroppingName text={firstName.toUpperCase()} className="forge-firstname" delay={300} />
          <DroppingName text={lastName.toUpperCase()} className="forge-lastname" delay={500} />
        </div>

        {/* Bottom-left meta */}
        <div className="forge-meta">
          <span className="forge-meta-role">FULL STACK&nbsp;&nbsp;·&nbsp;&nbsp;UI / UX&nbsp;&nbsp;·&nbsp;&nbsp;INDIA</span>
        </div>

        {/* Bottom-right scroll hint */}
        <div className="forge-scroll-hint" aria-hidden="true">
          <span className="forge-scroll-text">SCROLL TO EXPLORE</span>
        </div>
      </div>
    </section>
  );
};

// ════════════════════════════════════════════════════════════════
//  ROOT LANDING — mobile hero + desktop hero (untouched)
// ════════════════════════════════════════════════════════════════
const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <>
      {/* ── Mobile Forge hero ── */}
      <ForgeHeroSection />

      {/* ── Desktop hero — completely original ── */}
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              {firstName.toUpperCase()}
              <br />
              {lastName && <span>{lastName.toUpperCase()}</span>}
            </h1>
          </div>
          <div className="landing-info">
            <h3>A Creative</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Designer</div>
              <div className="landing-h2-2">Developer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Developer</div>
              <div className="landing-h2-info-1">Designer</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
