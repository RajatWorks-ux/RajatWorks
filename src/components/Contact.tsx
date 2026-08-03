import { MdArrowOutward, MdCopyright, MdEmail, MdLocationOn } from "react-icons/md";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import "./styles/Contact.css";
import { config } from "../config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

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

const Contact = () => {
  useEffect(() => {
    if (isMobileOrTablet) return; // Mobile pe GSAP animation nahi

    const contactTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 80%",
        end: "bottom center",
        toggleActions: "play none none none",
        onEnter: () => {
          gsap.set(".contact-section h3", { opacity: 1, y: 0 });
          gsap.set(".contact-box", { opacity: 1, y: 0 });
        },
      },
    });
    contactTimeline.fromTo(".contact-section h3",
      { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
    contactTimeline.fromTo(".contact-box",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" },
      "-=0.4"
    );
    return () => { contactTimeline.kill(); };
  }, []);

  return (
    <div className="contact-section section-container" id="contact">

      {/* ══════════════════════
          DESKTOP layout
      ══════════════════════ */}
      <div className="contact-container contact-desktop">
        <h3>{config.developer.fullName}</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p><a href={`mailto:${config.contact.email}`} data-cursor="disable">{config.contact.email}</a></p>
            <h4>Location</h4>
            <p><span>{config.social.location}</span></p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a href={config.contact.github}    target="_blank" rel="noopener noreferrer" data-cursor="disable" className="contact-social">Github    <MdArrowOutward /></a>
            <a href={config.contact.linkedin}  target="_blank" rel="noopener noreferrer" data-cursor="disable" className="contact-social">Linkedin  <MdArrowOutward /></a>
            <a href={config.contact.twitter}   target="_blank" rel="noopener noreferrer" data-cursor="disable" className="contact-social">Twitter   <MdArrowOutward /></a>
            <a href={config.contact.instagram} target="_blank" rel="noopener noreferrer" data-cursor="disable" className="contact-social">Instagram <MdArrowOutward /></a>
          </div>
          <div className="contact-box contact-box-credit">
            <h2>Designed and Developed <br /> by <span>{config.developer.fullName}</span></h2>
            <h5><MdCopyright /> {new Date().getFullYear()}</h5>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE layout — phone version perfect hai, NOT TOUCHED
      ══════════════════════════════════════ */}
      <div className="contact-mobile">

        {/* Top glow */}
        <div className="cm-glow" />

        {/* Headline */}
        <div className="cm-headline">
          <p className="cm-label">Get In Touch</p>
          <h2 className="cm-title">
            Let's Build<br />
            <span>Something</span><br />
            Together.
          </h2>
        </div>

        {/* Email CTA */}
        <a
          href={`mailto:${config.contact.email}`}
          className="cm-email-btn"
        >
          <MdEmail className="cm-email-icon" />
          <span>{config.contact.email}</span>
          <MdArrowOutward className="cm-email-arrow" />
        </a>

        {/* Location row */}
        <div className="cm-location">
          <MdLocationOn />
          <span>{config.social.location}</span>
        </div>

        {/* Divider */}
        <div className="cm-divider" />

        {/* Social icons */}
        <p className="cm-social-label">Find me on</p>
        <div className="cm-socials">
          <a href={config.contact.github}    target="_blank" rel="noopener noreferrer" className="cm-social-btn" aria-label="GitHub">
            <FaGithub />
            <span>GitHub</span>
          </a>
          <a href={config.contact.linkedin}  target="_blank" rel="noopener noreferrer" className="cm-social-btn" aria-label="LinkedIn">
            <FaLinkedin />
            <span>LinkedIn</span>
          </a>
          <a href={config.contact.twitter}   target="_blank" rel="noopener noreferrer" className="cm-social-btn" aria-label="Twitter">
            <FaTwitter />
            <span>Twitter</span>
          </a>
          <a href={config.contact.instagram} target="_blank" rel="noopener noreferrer" className="cm-social-btn" aria-label="Instagram">
            <FaInstagram />
            <span>Instagram</span>
          </a>
        </div>

        {/* Footer credit */}
        <div className="cm-footer">
          <span>Designed & built by <strong>{config.developer.fullName}</strong></span>
          <span className="cm-copy"><MdCopyright /> {new Date().getFullYear()}</span>
        </div>

      </div>
    </div>
  );
};

export default Contact;
                           
