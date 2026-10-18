import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import "./styles/TechStack.css";
import "./styles/TechStackMobile.css";
import "./styles/MobileExperience.css";

// ── Device detection ──────────────────────────────────────────
const isMobileOrTablet: boolean = (() => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const mobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isVeryWideScreen = window.innerWidth > 1400;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const isDesktop = !mobileUA && (isVeryWideScreen || hasFinePointer);
  return !isDesktop;
})();

// ════════════════════════════════════════════════════════════════
//  MOBILE — "LIVE SYSTEM": Three.js force-directed skill web
// ════════════════════════════════════════════════════════════════

const LAYERS = [
  {
    id: "interface",
    label: "Interface",
    techs: ["React", "Next.js", "TypeScript", "JavaScript", "GSAP", "Three.js"],
  },
  {
    id: "services",
    label: "Services",
    techs: ["Node.js", "Express", "REST API", "Groq AI", "NVIDIA NIM"],
  },
  {
    id: "data",
    label: "Data",
    techs: ["Supabase", "MongoDB", "MySQL", "Appwrite"],
  },
  {
    id: "delivery",
    label: "Delivery",
    techs: ["Vercel", "Cloudflare", "Vite", "Expo"],
  },
];

const ALL_TECHS = LAYERS.flatMap((l) => l.techs.map((t) => ({ tech: t, layerId: l.id })));

// ── Force node class ──
interface ForceNode {
  tech: string;
  layerId: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  phase: number;
  size: number;
}

const makeLabel = (text: string, size: number, active: boolean): HTMLCanvasElement => {
  const dpr = Math.min(window.devicePixelRatio, 2);
  const w = 220 * dpr;
  const h = 64 * dpr;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  ctx.scale(dpr, dpr);

  const fontSize = size > 0.18 ? 13 : 11;
  const alpha = active ? 0.95 : 0.5;

  // Dark disc bg
  ctx.fillStyle = `rgba(14, 11, 18, ${active ? 0.92 : 0.7})`;
  roundRect(ctx, 0, 0, 220, 64, 6);
  ctx.fill();

  // Border
  ctx.strokeStyle = `rgba(234, 229, 236, ${active ? 0.45 : 0.15})`;
  ctx.lineWidth = 1;
  roundRect(ctx, 0.5, 0.5, 219, 63, 6);
  ctx.stroke();

  // Text
  ctx.fillStyle = `rgba(234, 229, 236, ${alpha})`;
  ctx.font = `${active ? 600 : 400} ${fontSize}px 'Inter', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 110, 32);

  return cv;
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ── Main Three.js scene ──
const LiveSystemScene: React.FC<{ activeLayer: string }> = ({ activeLayer }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<ForceNode[]>([]);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const spritesRef = useRef<THREE.Sprite[]>([]);
  const linesRef = useRef<THREE.Line[]>([]);
  const touchRef = useRef({ x: 0, y: 0, active: false });

  // Initialise nodes in a circle layout grouped by layer
  const initNodes = (): ForceNode[] => {
    const total = ALL_TECHS.length;
    return ALL_TECHS.map(({ tech, layerId }, i) => {
      const angle = (i / total) * Math.PI * 2;
      const layerIdx = LAYERS.findIndex((l) => l.id === layerId);
      const r = 2.2 + (layerIdx % 2) * 0.8;
      const isLarge = layerIdx === 0;
      return {
        tech,
        layerId,
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        vx: 0,
        vy: 0,
        baseX: Math.cos(angle) * r,
        baseY: Math.sin(angle) * r,
        phase: Math.random() * Math.PI * 2,
        size: isLarge ? 0.22 : 0.16,
      };
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    rendererRef.current = renderer;

    // ── Scene & Camera ──
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 9);
    cameraRef.current = camera;

    // ── Ambient light ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // ── Nodes ──
    nodesRef.current = initNodes();
    const sprites: THREE.Sprite[] = [];

    nodesRef.current.forEach((node) => {
      const cv = makeLabel(node.tech, node.size, node.layerId === activeLayer);
      const tex = new THREE.CanvasTexture(cv);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      const sprite = new THREE.Sprite(mat);
      const aspect = 220 / 64;
      const h = node.size * 1.8;
      sprite.scale.set(h * aspect, h, 1);
      sprite.position.set(node.x, node.y, 0);
      scene.add(sprite);
      sprites.push(sprite);
    });
    spritesRef.current = sprites;

    // ── Edges (lines between same-layer nodes) ──
    const lines: THREE.Line[] = [];
    LAYERS.forEach((layer) => {
      const layerNodes = nodesRef.current.filter((n) => n.layerId === layer.id);
      for (let i = 0; i < layerNodes.length; i++) {
        for (let j = i + 1; j < layerNodes.length; j++) {
          const geo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(layerNodes[i].x, layerNodes[i].y, -0.1),
            new THREE.Vector3(layerNodes[j].x, layerNodes[j].y, -0.1),
          ]);
          const mat = new THREE.LineBasicMaterial({ color: 0xeae5ec, transparent: true, opacity: 0.07 });
          const line = new THREE.Line(geo, mat);
          scene.add(line);
          lines.push(line);
        }
      }
    });
    linesRef.current = lines;

    // ── Touch repulsion ──
    const handleTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const tx = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      const ty = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
      // Convert NDC to world
      const vec = new THREE.Vector3(tx, ty, 0).unproject(camera);
      touchRef.current = { x: vec.x, y: vec.y, active: true };

      // Apply repulsion impulse to nearby nodes
      nodesRef.current.forEach((node) => {
        const dx = node.x - vec.x;
        const dy = node.y - vec.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 2.5 && dist > 0.01) {
          const force = (2.5 - dist) / 2.5;
          node.vx += (dx / dist) * force * 4;
          node.vy += (dy / dist) * force * 4;
        }
      });
    };
    canvas.addEventListener("touchstart", handleTouch, { passive: true });
    canvas.addEventListener("touchmove", handleTouch, { passive: true });
    canvas.addEventListener("touchend", () => { touchRef.current.active = false; });

    // ── Animation loop ──
    let lineIdx = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Physics update — spring back to base + sine breathe on Z
      nodesRef.current.forEach((node, i) => {
        // Spring toward base position
        const springX = (node.baseX - node.x) * 0.04;
        const springY = (node.baseY - node.y) * 0.04;
        node.vx += springX;
        node.vy += springY;

        // Damping
        node.vx *= 0.88;
        node.vy *= 0.88;

        node.x += node.vx;
        node.y += node.vy;

        // Z breathe
        const z = Math.sin(t * 0.6 + node.phase) * 0.18;

        const sprite = spritesRef.current[i];
        if (sprite) {
          sprite.position.set(node.x, node.y, z);
        }
      });

      // Update edges — rebuild positions from nodes
      lineIdx = 0;
      LAYERS.forEach((layer) => {
        const layerNodes = nodesRef.current.filter((n) => n.layerId === layer.id);
        for (let i = 0; i < layerNodes.length; i++) {
          for (let j = i + 1; j < layerNodes.length; j++) {
            const line = linesRef.current[lineIdx];
            if (line) {
              const pts = [
                new THREE.Vector3(layerNodes[i].x, layerNodes[i].y, -0.1),
                new THREE.Vector3(layerNodes[j].x, layerNodes[j].y, -0.1),
              ];
              (line.geometry as THREE.BufferGeometry).setFromPoints(pts);
              // Highlight active layer edges
              const mat = line.material as THREE.LineBasicMaterial;
              mat.opacity = layer.id === activeLayer ? 0.22 : 0.06;
            }
            lineIdx++;
          }
        }
      });

      // Slow camera orbit
      camera.position.x = Math.sin(t * 0.07) * 0.4;
      camera.position.y = Math.cos(t * 0.05) * 0.25;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ──
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("touchstart", handleTouch);
      canvas.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  // When active layer changes — rebuild sprite textures
  useEffect(() => {
    nodesRef.current.forEach((node, i) => {
      const sprite = spritesRef.current[i];
      if (!sprite) return;
      const cv = makeLabel(node.tech, node.size, node.layerId === activeLayer);
      const oldTex = (sprite.material as THREE.SpriteMaterial).map;
      oldTex?.dispose();
      (sprite.material as THREE.SpriteMaterial).map = new THREE.CanvasTexture(cv);
      (sprite.material as THREE.SpriteMaterial).needsUpdate = true;
    });
  }, [activeLayer]);

  return (
    <canvas
      ref={canvasRef}
      className="ls-canvas"
      style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
    />
  );
};

// ── Mobile TechStack root ──
const MobileTechStack = () => {
  const [activeLayer, setActiveLayer] = useState("interface");
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("ls-visible"); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const activeTechs = LAYERS.find((l) => l.id === activeLayer)?.techs ?? [];

  return (
    <section ref={sectionRef} className="techstack techstack-mobile ls-section" aria-labelledby="ls-title">
      {/* Header */}
      <div className="ls-header">
        <h2 id="ls-title" className="ls-title">TECH<br />STACK</h2>
        <p className="ls-sub">What I actually build with.</p>
      </div>

      {/* Three.js canvas */}
      <div className="ls-canvas-wrap">
        <LiveSystemScene activeLayer={activeLayer} />
      </div>

      {/* Layer tabs */}
      <div className="ls-tabs" role="tablist">
        {LAYERS.map((layer, i) => (
          <button
            key={layer.id}
            role="tab"
            aria-selected={activeLayer === layer.id}
            className={`ls-tab${activeLayer === layer.id ? " ls-tab--active" : ""}`}
            onClick={() => setActiveLayer(layer.id)}
          >
            {layer.label}
            {i < LAYERS.length - 1 && <span className="ls-tab-sep" aria-hidden="true" />}
          </button>
        ))}
      </div>

      {/* Active layer tech chips */}
      <div className="ls-chips">
        {activeTechs.map((tech) => (
          <span key={tech} className="ls-chip">{tech}</span>
        ))}
      </div>
    </section>
  );
};

// ════════════════════════════════════════════════════════════════
//  DESKTOP — completely untouched from original
// ════════════════════════════════════════════════════════════════
const textureLoader = new THREE.TextureLoader();
const imageUrls = [
  "/images/react2.webp",
  "/images/next2.webp",
  "/images/node2.webp",
  "/images/express.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
];
const textures = imageUrls.map((url) => textureLoader.load(url));
const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(30)].map(() => ({
  scale: [1.0, 1.3, 1.1, 1.3, 1.3][Math.floor(Math.random() * 5)],
}));
const materialIndices = spheres.map(() => Math.floor(Math.random() * imageUrls.length));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec: _vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;
    delta = Math.min(0.1, delta);
    const pos = api.current.translation();
    const distSq = pos.x * pos.x + pos.y * pos.y;
    const strength = distSq > 25 ? -80 : -50;
    const impulse = _vec
      .copy(api.current.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(strength * delta * scale, strength * 1.5 * delta * scale, strength * delta * scale)
      );
    api.current.applyImpulse(impulse, true);
    if (Math.abs(pos.x) > 12 || Math.abs(pos.y) > 12) {
      api.current.setTranslation({ x: r(4), y: r(4), z: r(2) }, true);
      api.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  return (
    <RigidBody
      linearDamping={0.9}
      angularDamping={0.4}
      friction={0.2}
      position={[r(8), r(8) - 4, r(4)]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh castShadow receiveShadow scale={scale} geometry={sphereGeometry} material={material} rotation={[0.3, 1, 1]} />
    </RigidBody>
  );
}

function Pointer({ vec: _vec = new THREE.Vector3(), isActive }: { vec?: THREE.Vector3; isActive: boolean }) {
  const ref = useRef<RapierRigidBody>(null);
  useFrame(({ pointer, viewport }) => {
    if (!isActive || !ref.current) return;
    const targetVec = _vec.lerp(
      new THREE.Vector3((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0),
      0.2
    );
    ref.current.setNextKinematicTranslation(targetVec);
  });
  return (
    <RigidBody position={[100, 100, 100]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const DesktopTechStack = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const workElement = document.getElementById("work");
      if (workElement) setIsActive(workElement.getBoundingClientRect().top < 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const materials = useMemo(
    () =>
      textures.map(
        (texture) =>
          new THREE.MeshPhysicalMaterial({
            map: texture,
            emissive: "#ffffff",
            emissiveMap: texture,
            emissiveIntensity: 0.3,
            metalness: 0.5,
            roughness: 1,
            clearcoat: 0.1,
          })
      ),
    []
  );

  return (
    <div className="techstack techstack-desktop">
      <h2 className="ts-desktop-title">My Techstack</h2>
      <Canvas
        shadows
        gl={{
          alpha: true, stencil: false, depth: false, antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
        style={{ position: "relative", zIndex: 2 }}
      >
        <ambientLight intensity={1} />
        <spotLight position={[20, 20, 25]} penumbra={1} angle={0.2} color="white"
          castShadow shadow-mapSize={[512, 512]} />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]} timeStep="vary">
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              {...props}
              material={materials[materialIndices[i]]}
              isActive={isActive}
            />
          ))}
        </Physics>
        <Environment files="/models/char_enviorment.hdr" environmentIntensity={0.5} environmentRotation={[0, 4, 2]} />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

// ── Root export ───────────────────────────────────────────────
const TechStack = () => {
  if (isMobileOrTablet) return <MobileTechStack />;
  return <DesktopTechStack />;
};

export default TechStack;
