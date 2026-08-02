import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import "./styles/TechStack.css";

// ─────────────────────────────────────────────
//  SHARED DATA
// ─────────────────────────────────────────────
const techItems = [
  { name: "React",      img: "/images/react2.webp" },
  { name: "Next.js",   img: "/images/next2.webp"  },
  { name: "Node.js",   img: "/images/node2.webp"  },
  { name: "Express",   img: "/images/express.webp" },
  { name: "MongoDB",   img: "/images/mongo.webp"  },
  { name: "MySQL",     img: "/images/mysql.webp"  },
  { name: "TypeScript",img: "/images/typescript.webp" },
  { name: "JavaScript",img: "/images/javascript.webp" },
];

// ─────────────────────────────────────────────
//  MOBILE — Clean Grid
// ─────────────────────────────────────────────
const MobileTechStack = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("ts-in-view");
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="techstack ts-mobile" ref={sectionRef}>
      {/* ✅ h2 is in normal flow — NOT position: absolute */}
      <h2 className="ts-mobile-title">
        My <span>TechStack</span>
      </h2>
      <div className="ts-grid">
        {techItems.map((item, idx) => (
          <div key={idx} className="ts-card" style={{ "--i": idx } as React.CSSProperties}>
            <div className="ts-card-icon">
              <img src={item.img} alt={item.name} loading="lazy" />
            </div>
            <span className="ts-card-name">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  DESKTOP — 3D Physics Balls (UNTOUCHED)
// ─────────────────────────────────────────────
const BallComponent = ({ position }: { position: [number, number, number] }) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshRef      = useRef<THREE.Mesh>(null);

  const ballTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#7f40ff"; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#c2a4ff"; ctx.font = "bold 80px Arial";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("T", 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(() => {
    if (rigidBodyRef.current) {
      const vel = rigidBodyRef.current.linvel();
      if (Math.abs(vel.x) > 20 || Math.abs(vel.y) > 20 || Math.abs(vel.z) > 20) {
        rigidBodyRef.current.setLinvel({
          x: Math.max(-15, Math.min(15, vel.x)),
          y: Math.max(-15, Math.min(15, vel.y)),
          z: Math.max(-15, Math.min(15, vel.z)),
        }, true);
      }
    }
  });

  return (
    <RigidBody ref={rigidBodyRef} colliders="ball" position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial map={ballTexture} />
      </mesh>
    </RigidBody>
  );
};

const PhysicsCanvas = () => (
  <Canvas camera={{ position: [0, 0, 8] }}>
    <Environment preset="night" />
    <EffectComposer><N8AO aoRadius={0.5} intensity={0.5} /></EffectComposer>
    <Physics gravity={[0, -20, 0]}>
      <RigidBody type="fixed"><CylinderCollider args={[5, 5]} /></RigidBody>
      {techItems.map((_, idx) => (
        <BallComponent key={idx} position={[
          Math.random() * 4 - 2,
          Math.random() * 4 + 2,
          Math.random() * 2 - 1,
        ]} />
      ))}
    </Physics>
  </Canvas>
);

// ─────────────────────────────────────────────
//  MAIN — Switches between mobile / desktop
// ─────────────────────────────────────────────
const TechStack = () => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 1025 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1025);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Mobile: clean grid
  if (isMobile) return <MobileTechStack />;

  // Desktop: unchanged 3D physics
  return (
    <div className="techstack">
      <h2>My TechStack</h2>
      <PhysicsCanvas />
    </div>
  );
};

export default TechStack;

