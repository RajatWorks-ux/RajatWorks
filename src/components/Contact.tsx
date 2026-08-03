import { MdArrowOutward, MdCopyright, MdEmail, MdLocationOn } from "react-icons/md";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import "./styles/Contact.css";
import { config } from "../config";

// ─────────────────────────────────────────────────────────────────────────────
// Contact — same beautiful layout on ALL screen sizes (phone + laptop).
// Animation is driven by .contact-section.in-view class added by useInView.ts
// ─────────────────────────────────────────────────────────────────────────────

const Contact = () => {
  return (
    <div className="contact-section" id="contact">
      <div className="contact-mobile">

        {/* Ambient glow */}
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

        {/* Social label */}
        <p className="cm-social-label">Find me on</p>

        {/* Social buttons */}
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

