import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis";
import "./styles/Contact.css";

gsap.registerPlugin(ScrollTrigger);

// ✅ FIX #1: Reactive isMobile detection (was frozen constant)
const Contact = () => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" && window.innerWidth < 1025
  );

  const contactBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Mobile pe GSAP animation nahi

    const contactEl = contactBoxRef.current;
    if (!contactEl) return;

    ScrollTrigger.create({
      trigger: contactEl,
      start: "top 50%",
      onEnter: () => {
        gsap.to(".contact-box", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
    };
  }, [isMobile]);

  return (
    <section className="contact-section" id="contact">
      {/* Desktop Layout */}
      <div className="contact-desktop">
        <h3>Let's connect</h3>
        <div className="contact-flex" ref={contactBoxRef}>
          <div className="contact-box">
            <h4>Got a Project?</h4>
            <h2>
              Let's work<span> together.</span>
            </h2>
            <h5>
              <span>📧</span> rajatworks1@gmail.com
            </h5>
            <p>
              I'm open to freelance opportunities and full-time roles. Whether
              you have an exciting project or want to discuss potential
              opportunities, feel free to reach out.
            </p>
            <a
              href="mailto:rajatworks1@gmail.com"
              className="contact-social"
              data-cursor="pointer"
            >
              ✉️
            </a>
          </div>
          <div className="contact-box">
            <h4>Social Links</h4>
            <h2>
              Connect <span>with me</span>
            </h2>
            <div
              style={{
                display: "flex",
                gap: "30px",
                marginTop: "30px",
                fontSize: "25px",
              }}
            >
              <a href="https://github.com/RajatWorks-ux" target="_blank">
                🐙
              </a>
              <a href="https://www.linkedin.com/in/rajat-kumar-dua/" target="_blank">
                💼
              </a>
              <a href="https://x.com" target="_blank">
                𝕏
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="contact-mobile">
        <div className="cm-glow" />
        <h2 className="cm-title">Let's Connect</h2>
        <p className="cm-subtitle">
          I'm open to freelance opportunities and full-time roles. Whether you
          have an exciting project or want to discuss potential opportunities,
          feel free to reach out.
        </p>

        <div className="cm-contact-item">
          <h4>Email</h4>
          <a href="mailto:rajatworks1@gmail.com" className="cm-link">
            rajatworks1@gmail.com
          </a>
        </div>

        <div className="cm-divider" />

        <div className="cm-social-section">
          <h4>Follow</h4>
          <div className="cm-social-links">
            <a
              href="https://github.com/RajatWorks-ux"
              target="_blank"
              rel="noopener noreferrer"
              className="cm-social-link"
              title="GitHub"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/rajat-kumar-dua/"
              target="_blank"
              rel="noopener noreferrer"
              className="cm-social-link"
              title="LinkedIn"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cm-social-link"
              title="Twitter / X"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.106-6.694L2.896 21.75H-1.25l7.73-8.835L-2.1 2.25h6.756l4.888 6.469L18.244 2.25zM17.15 19.75h1.83L5.71 4.1H3.75l13.4 15.65z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

