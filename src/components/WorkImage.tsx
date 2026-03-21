import { useState, useEffect } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  images: string[];
  alt?: string;
  link?: string;
}

// ─── Lightbox ───────────────────────────────────────────────
const Lightbox = ({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) => {
  const [current, setCurrent] = useState(startIndex);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.15)",
          color: "#fff",
          fontSize: 18,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ✕
      </button>

      {/* Counter */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.7)",
          fontSize: 13,
          background: "rgba(0,0,0,0.4)",
          padding: "3px 12px",
          borderRadius: 20,
        }}
      >
        {current + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            fontSize: 28,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ‹
        </button>
      )}

      {/* Image */}
      <img
        key={current}
        src={images[current]}
        alt={`Photo ${current + 1}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          objectFit: "contain",
          borderRadius: 12,
          boxShadow: "0 0 60px rgba(0,0,0,0.8)",
        }}
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            fontSize: 28,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ›
        </button>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              style={{
                width: i === current ? 16 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                background: i === current ? "#fff" : "rgba(255,255,255,0.35)",
                cursor: "pointer",
                transition: "all 0.2s",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Polaroid Stack ──────────────────────────────────────────
const WorkImage = ({ images, alt, link }: Props) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Show max 3 in stack
  const stackImages = images.slice(0, Math.min(3, images.length));
  const rotations = [3, -2.5, 5];
  const offsets = [
    { x: 6, y: 0 },
    { x: -5, y: 4 },
    { x: 9, y: 8 },
  ];

  return (
    <div className="work-image">
      {/* Stack container */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 220,
          width: "100%",
          cursor: "pointer",
        }}
        onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
        data-cursor="disable"
      >
        {/* Render back-to-front */}
        {[...stackImages].reverse().map((img, ri) => {
          const i = stackImages.length - 1 - ri;
          const isTop = i === 0;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                transform: `rotate(${rotations[i]}deg) translate(${offsets[i].x}px, ${offsets[i].y}px)`,
                zIndex: i + 1,
                background: "#fff",
                padding: "6px 6px 20px 6px",
                borderRadius: 4,
                boxShadow: isTop
                  ? "0 8px 32px rgba(0,0,0,0.55)"
                  : "0 4px 16px rgba(0,0,0,0.35)",
                transition: "transform 0.25s ease",
              }}
              className={isTop ? "work-stack-top" : ""}
            >
              <img
                src={img}
                alt={`${alt} ${i + 1}`}
                loading="lazy"
                style={{
                  width: 170,
                  height: 150,
                  objectFit: "contain",
                  background: "#f8f8f8",
                  display: "block",
                  borderRadius: 2,
                }}
              />
              {/* Count badge on top card */}
              {isTop && images.length > 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "rgba(0,0,0,0.65)",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: 10,
                    letterSpacing: "0.3px",
                  }}
                >
                  1/{images.length}
                </div>
              )}
            </div>
          );
        })}

        {/* Tap hint */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 11,
            color: "rgba(173,172,172,0.7)",
            background: "rgba(30,30,30,0.8)",
            padding: "3px 10px",
            borderRadius: 12,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          Tap to view {images.length} photo{images.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Live link button */}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="work-live-btn"
          data-cursor="disable"
          onClick={(e) => e.stopPropagation()}
        >
          <MdArrowOutward />
          <span>Visit Live</span>
        </a>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};

export default WorkImage;
            
