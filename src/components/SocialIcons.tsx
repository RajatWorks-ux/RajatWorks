import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  useEffect(() => {
    // ── Magnetic hover effect ──────────────────────────────────────────────
    const social = document.getElementById("social") as HTMLElement;

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);
      updatePosition();

      return () => {
        elem.removeEventListener("mousemove", onMouseMove);
      };
    });

    // ── FIX: Hide social icons + resume button when Contact section enters view ──
    // Without this, the fixed icons permanently float over the Contact
    // section's own social buttons (z-index 999 vs z-index 1).
    const iconsSection = document.querySelector(".icons-section") as HTMLElement | null;
    const contactSection = document.getElementById("contact");

    if (!iconsSection || !contactSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Contact is visible — hide the fixed icons with a smooth fade
          iconsSection.classList.add("icons-hidden");
        } else {
          // Contact scrolled out of view — bring icons back
          iconsSection.classList.remove("icons-hidden");
        }
      },
      {
        // Trigger as soon as the top of Contact enters the viewport
        threshold: 0,
        rootMargin: "0px 0px 0px 0px",
      }
    );

    observer.observe(contactSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="https://github.com" target="_blank">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href="https://www.linkedin.com" target="_blank">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href="https://x.com" target="_blank">
            <FaXTwitter />
          </a>
        </span>
        <span>
          <a href="https://www.instagram.com" target="_blank">
            <FaInstagram />
          </a>
        </span>
      </div>
      <a className="resume-button" href="#">
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;

