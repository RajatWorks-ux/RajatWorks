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

// ─────────────────────────────────────────────────────────────────────────────
// DEVICE DETECTION — 3-layer, same as App.tsx
// ─────────────────────────────────────────────────────────────────────────────
const isMobileOrTablet: boolean = (() => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const mobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isVeryWideScreen = window.innerWidth > 1400;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const isDesktop = !mobileUA && (isVeryWideScreen || hasFinePointer);
  return !isDesktop;
})();

// ─────────────────────────────────────────────────────────────────────────────
//  SHARED DATA
// ─────────────────────────────────────────────────────────────────────────────
const techItems = [
  { name: "React",      img: "/images/react2.webp"      },
  { name: "Next.js",    img: "/images/next2.webp"       },
  { name: "Node.js",    img: "/images/node2.webp"       },
  { name: "Express",    img: "/images/express.webp"     },
  { name: "MongoDB",    img: "/images/mongo.webp"       },
  { name: "MySQL",      img: "/images/mysql.webp"       },
  { name: "TypeScript", img: "/images/typescript.webp"  },
  { name: "JavaScript", img: "/images/javascript.webp"  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  MOBILE — 2-column grid with IntersectionObserver
// ─────────────────────────────────────────────────────────────────────────────
const MobileTechStack = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // ── Title reveal — low threshold so it triggers as soon as section scrolls into view ──
    const titleEl = titleRef.current;
    if (titleEl) {
      const titleObs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            titleEl.classList.add("ts-title-visible");
            titleObs.disconnect();
          }
        },
        { threshold: 0.1 }  // ✅ FIX: was 0.4 — title now triggers early so it's visible BEFORE cards
      );
      titleObs.observe(titleEl);
    }

    // ── Cards staggered reveal — add base delay so title always appears first ──
    const cards = sectionRef.current?.querySelectorAll<HTMLDivElement>(".tech-mobile-item");
    if (!cards?.length) return;

    const cardObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement;
            // ✅ FIX: base delay of 200ms + stagger so cards always appear AFTER title
            const delay = 200 + Number(card.dataset.delay ?? 0);
            setTimeout(() => {
              card.classList.add("tc-visible");
            }, delay);
            cardObs.unobserve(card);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );

    cards.forEach((card) => cardObs.observe(card));

    return () => {
      cardObs.disconnect();
    };
  }, []);

  return (
    <div className="techstack techstack-mobile" ref={sectionRef}>
      {/* Title is OUTSIDE the grid — no overlap possible */}
      <h2 className="ts-title" ref={titleRef}>
        My <span className="ts-title-accent">Techstack</span>
      </h2>

      <div className="tech-mobile-grid">
        {techItems.map((tech, i) => (
          <div
            key={tech.name}
            className="tech-mobile-item"
            data-delay={i * 80}
          >
            <div className="tmi-icon-wrap">
              <img src={tech.img} alt={tech.name} loading="lazy" />
              <span className="tmi-icon-glow" />
            </div>
            <span className="tmi-label">{tech.name}</span>
            <span className="tmi-tap-bg" />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  DESKTOP — 3D Physics Balls
//  Ball sizes increased: scale array was [0.7,1,0.8,1,1] → now [1.0,1.3,1.1,1.3,1.3]
// ─────────────────────────────────────────────────────────────────────────────
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

// ✅ BIGGER BALLS — scale values increased by ~30%
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
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);
  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(new THREE.Vector3(-50 * delta * scale, -150 * delta * scale, -50 * delta * scale));
    api.current?.applyImpulse(impulse, true);
  });
  return (
    <RigidBody linearDamping={0.75} angularDamping={0.15} friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]} ref={api} colliders={false}>
      <BallCollider args={[scale]} />
      <CylinderCollider rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]} />
      <mesh castShadow receiveShadow scale={scale} geometry={sphereGeometry}
        material={material} rotation={[0.3, 1, 1]} />
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3(), isActive }: { vec?: THREE.Vector3; isActive: boolean }) {
  const ref = useRef<RapierRigidBody>(null);
  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0), 0.2);
    ref.current?.setNextKinematicTranslation(targetVec);
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

  const materials = useMemo(() =>
    textures.map((texture) => new THREE.MeshPhysicalMaterial({
      map: texture, emissive: "#ffffff", emissiveMap: texture,
      emissiveIntensity: 0.3, metalness: 0.5, roughness: 1, clearcoat: 0.1,
    })), []);

  return (
    <div className="techstack techstack-desktop">
      <h2 className="ts-desktop-title">My Techstack</h2>
      <Canvas shadows
        gl={{ alpha: true, stencil: false, depth: false, antialias: true, powerPreference: "high-performance" }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas" style={{ position: "relative", zIndex: 2 }}>
        <ambientLight intensity={1} />
        <spotLight position={[20, 20, 25]} penumbra={1} angle={0.2} color="white"
          castShadow shadow-mapSize={[512, 512]} />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo key={i} {...props}
              material={materials[materialIndices[i]]}
              isActive={isActive} />
          ))}
        </Physics>
        <Environment files="/models/char_enviorment.hdr"
          environmentIntensity={0.5} environmentRotation={[0, 4, 2]} />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  ROOT EXPORT
// ─────────────────────────────────────────────────────────────────────────────
const TechStack = () => {
  if (isMobileOrTablet) return <MobileTechStack />;
  return <DesktopTechStack />;
};

export default TechStack;


