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

// ── Shared data ───────────────────────────────────────────────
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

// ── Mobile grid ───────────────────────────────────────────────
const matrixSystems = [
  { id: "interface", number: "01", label: "Interface", summary: "The experience layer", tech: ["React", "Next.js", "TypeScript", "JavaScript"], note: "Components, responsive UI and interaction design." },
  { id: "services", number: "02", label: "Services", summary: "The application layer", tech: ["Node.js", "Express"], note: "Routing, server logic and API integration." },
  { id: "data", number: "03", label: "Data", summary: "The persistence layer", tech: ["MongoDB", "MySQL", "Supabase"], note: "Structured data, persistence and application state." },
  { id: "delivery", number: "04", label: "Delivery", summary: "The product layer", tech: ["Vercel", "Cloudflare", "AI APIs"], note: "Deployment and integrations used across shipped projects." },
];

const MobileTechStack = () => {
  const [active, setActive] = useState("interface");
  const activeSystem = matrixSystems.find((system) => system.id === active) ?? matrixSystems[0];
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add("matrix-is-visible");
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="techstack techstack-mobile engineering-matrix" ref={sectionRef} aria-labelledby="engineering-matrix-title">
      <div className="matrix-eyebrow"><span>SYSTEM / 01</span><span>CAPABILITIES MAP</span></div>
      <h2 id="engineering-matrix-title" className="matrix-title">The <em>Engineering</em><br />Matrix<span className="matrix-period">.</span></h2>
      <p className="matrix-intro">A product is more than a stack. Explore the layers that bring an idea to life.</p>

      <div className="matrix-architecture" aria-label="Application architecture">
        <div className="matrix-architecture-glow" />
        <div className="matrix-connection matrix-connection-one" />
        <div className="matrix-connection matrix-connection-two" />
        <div className="matrix-connection matrix-connection-three" />
        <div className="matrix-node matrix-node-ui"><span>UI</span><small>INTERFACE</small></div>
        <div className="matrix-node matrix-node-api"><span>API</span><small>LOGIC</small></div>
        <div className="matrix-node matrix-node-db"><span>DB</span><small>DATA</small></div>
        <div className="matrix-architecture-label">SYSTEM FLOW <b>01 — 03</b></div>
      </div>

      <div className="matrix-system-list" role="tablist" aria-label="Technology layers">
        {matrixSystems.map((system) => (
          <button
            type="button"
            key={system.id}
            role="tab"
            aria-selected={active === system.id}
            aria-controls="matrix-system-detail"
            className={`matrix-system-tab ${active === system.id ? "is-active" : ""}`}
            onClick={() => setActive(system.id)}
          >
            <span className="matrix-tab-number">{system.number}</span>
            <span className="matrix-tab-copy"><strong>{system.label}</strong><small>{system.summary}</small></span>
            <span className="matrix-tab-arrow">{active === system.id ? "−" : "+"}</span>
          </button>
        ))}
      </div>

      <div className="matrix-detail" id="matrix-system-detail" role="tabpanel">
        <div className="matrix-detail-head"><span>ACTIVE LAYER / {activeSystem.number}</span><span className="matrix-live-dot" /> </div>
        <h3>{activeSystem.label}<span> layer</span></h3>
        <p>{activeSystem.note}</p>
        <div className="matrix-tech-chips">
          {activeSystem.tech.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
      <div className="matrix-footer"><span>BUILT TO CONNECT</span><span>NOT JUST A LIST ↗</span></div>
    </section>
  );
};

// ── Desktop — 3D Physics Balls ────────────────────────────────
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

    // Center-pull impulse — keeps balls in canvas center
    const pos = api.current.translation();
    const distSq = pos.x * pos.x + pos.y * pos.y;

    // If ball has drifted too far from center, apply stronger pull back
    const strength = distSq > 25 ? -80 : -50;

    const impulse = _vec
      .copy(api.current.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(strength * delta * scale, strength * 1.5 * delta * scale, strength * delta * scale)
      );
    api.current.applyImpulse(impulse, true);

    // Hard clamp — if ball escapes far, teleport it back near center
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
      // Spawn near center (was r(20) which caused side drift)
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
        dpr={Math.min(window.devicePixelRatio, 1.5)}  /* cap at 1.5 — less GPU, smoother */
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
        
