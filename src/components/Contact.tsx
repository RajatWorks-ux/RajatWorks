import { useEffect, useState } from "react";
import "./styles/Contact.css";

const Contact = () => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" && window.innerWidth < 1025
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1025);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section className="contact-section" id="contact">

      {/* ══ DESKTOP LAYOUT — unchanged ══ */}
      <div className="contact-desktop">
        <h3>Let's connect</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Got a Project?</h4>
            <h2>Let's work<span> together.</span></h2>
            <h5><span>📧</span> rajatworks1@gmail.com</h5>
            <p>I'm open to freelance opportunities and full-time roles. Whether
            you have an exciting project or want to discuss potential
            opportunities, feel free to reach out.</p>
            <a href="mailto:rajatworks1@gmail.com" className="contact-social" data-cursor="pointer">✉️</a>
          </div>
          <div className="contact-box">
            <h4>Social Links</h4>
            <h2>Connect <span>with me</span></h2>
            <div style={{ display:"flex", gap:"30px", marginTop:"30px", fontSize:"25px" }}>
              <a href="https://github.com/RajatWorks-ux" target="_blank">🐙</a>
              <a href="https://www.linkedin.com/in/rajat-kumar-dua/" target="_blank">💼</a>
              <a href="https://x.com" target="_blank">𝕏</a>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MOBILE LAYOUT — rich design ══ */}
      <div className="contact-mobile">

        {/* Hero band */}
        <div className="cm-hero">
          <p className="cm-eyebrow">Available for work</p>
          <h2 className="cm-headline">
            Let's build<br />something <span>great.</span>
          </h2>
          <p className="cm-desc">
            Open to freelance projects and full-time roles.
            Drop a message — I respond within 24 hours.
          </p>
        </div>

        {/* Email CTA card */}
        <a href="mailto:rajatworks1@gmail.com" className="cm-email-card">
          <span className="cm-email-label">✉ Email me</span>
          <span className="cm-email-address">rajatworks1@gmail.com</span>
          <span className="cm-email-cta">
            Send message
            <span className="cm-email-arrow">→</span>
          </span>
        </a>

        {/* Divider */}
        <div className="cm-divider" />

        {/* Social section */}
        <div className="cm-social-header">
          <h4>Find me online</h4>
        </div>

        <div className="cm-social-list">

          {/* GitHub */}
          <a
            href="https://github.com/RajatWorks-ux"
            target="_blank"
            rel="noopener noreferrer"
            className="cm-social-row"
          >
            <div className="cm-social-left">
              <div className="cm-social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.05.14 3.01.4 2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </div>
              <div className="cm-social-info">
                <span className="cm-social-platform">GitHub</span>
                <span className="cm-social-handle">@RajatWorks-ux</span>
              </div>
            </div>
            <span className="cm-social-arrow">↗</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/rajat-kumar-dua/"
            target="_blank"
            rel="noopener noreferrer"
            className="cm-social-row"
          >
            <div className="cm-social-left">
              <div className="cm-social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.44-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
                </svg>
              </div>
              <div className="cm-social-info">
                <span className="cm-social-platform">LinkedIn</span>
                <span className="cm-social-handle">Rajat Kumar Dua</span>
              </div>
            </div>
            <span className="cm-social-arrow">↗</span>
          </a>

          {/* X / Twitter */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="cm-social-row"
          >
            <div className="cm-social-left">
              <div className="cm-social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.24 2.25h3.31L14.32 10.5l8.5 11.25h-6.6l-5.1-6.69-5.84 6.69H1.95l7.73-8.84L1.9 2.25h6.76l4.89 6.47 4.69-6.47zM17.15 19.75h1.84L6.71 4.1H4.75l12.4 15.65z"/>
                </svg>
              </div>
              <div className="cm-social-info">
                <span className="cm-social-platform">X (Twitter)</span>
                <span className="cm-social-handle">@rajatworks</span>
              </div>
            </div>
            <span className="cm-social-arrow">↗</span>
          </a>

        </div>

        {/* Footer bar */}
        <div className="cm-footer">
          <span className="cm-footer-brand">
            Rajat<span>Works</span>
          </span>
          <span className="cm-footer-year">© 2025</span>
        </div>

      </div>
    </section>
  );
};

export default Contact;

