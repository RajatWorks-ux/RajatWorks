<div align="center">

# ✦ RajatWorks — Portfolio v2

### Full Stack Developer · UI/UX Designer

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-rajatworks--ux.vercel.app-c2a4ff?style=for-the-badge&logo=vercel&logoColor=white)](https://rajatworks-ux.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-RajatWorks--ux-181717?style=for-the-badge&logo=github)](https://github.com/RajatWorks-ux)
[![Email](https://img.shields.io/badge/Email-rajatworks1@gmail.com-c2a4ff?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rajatworks1@gmail.com)

</div>

---

## ✨ About This Project

A cinematic, mobile-first portfolio website built with React + Vite. Features a scroll-driven frame sequence animation on mobile (77 JPEG frames), a 3D physics-based tech stack on desktop, and smooth section reveals throughout.

---

## 🚀 Features

- **Frame Sequence Hero** — 77 JPEG frames play as you scroll on mobile (Apple-style animation)
- **3D Physics Balls** — Interactive tech stack with Three.js + Rapier physics on desktop
- **Scroll-Locked Landing** — Hero animation must complete before user proceeds
- **Floating Pill Navbar** — Glassmorphism design, responsive across all devices
- **Section Animations** — IntersectionObserver-based reveals — no GSAP on mobile
- **Fully Responsive** — Desktop untouched, complete mobile redesign
- **Safe Area Support** — Notch/punch-hole phones handled

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| 3D / Animation | Three.js, @react-three/fiber, @react-three/rapier |
| Smooth Scroll | Lenis |
| Animation | GSAP (desktop), CSS + IntersectionObserver (mobile) |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Landing.tsx       # Hero with frame sequence
│   ├── About.tsx         # About + stats + tags
│   ├── WhatIDo.tsx       # Skills section
│   ├── Career.tsx        # Work experience timeline
│   ├── Work.tsx          # Projects showcase
│   ├── TechStack.tsx     # 3D balls (desktop) / grid (mobile)
│   ├── Contact.tsx       # Contact section
│   ├── Navbar.tsx        # Floating pill navbar
│   └── styles/           # Per-component CSS
├── config.ts             # All content — name, projects, experience
└── main.tsx
public/
├── frames/               # 77 JPEG frames for scroll animation
└── images/               # Tech stack icons + profile photo
```

---

## ⚙️ Getting Started

```bash
# Clone the repo
git clone https://github.com/RajatWorks-ux/RajatWorks.git
cd RajatWorks

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 🎨 Customization

All content is in one file — `src/config.ts`:
- Name, title, description
- Work experience
- Projects
- Social links

---

## 📱 Mobile Frame Sequence

The hero animation uses 77 JPEG frames extracted from a video:
- Frames stored in `public/frames/` as `ezgif-frame-001.jpg` → `ezgif-frame-077.jpg`
- Total size ~3.4MB (540×960px each, portrait cropped)
- Scroll-locked until animation completes, then transitions to About

---

## 📄 License

MIT © [Rajat Kumar Dua](https://github.com/RajatWorks-ux)

---

<div align="center">
  <sub>Designed & Built by <strong>Rajat Kumar Dua</strong></sub>
</div>

