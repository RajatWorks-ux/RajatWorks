export const config = {
    developer: {
        name: "Rajat",
        fullName: "Rajat Kumar Dua",
        title: "Full Stack Developer",
        description: "Full-stack builder creating digital experiences that respect humans and scale with clarity. Accessibility is my north star."
    },
    social: {
        github: "https://github.com/RajatWorks-ux",
        email: "rajatworks1@gmail.com",
        location: "India"
    },
    about: {
        title: "About Me",
        description: "Full-stack builder creating digital experiences that respect humans and scale with clarity. Accessibility is my north star. I specialize in building modern web applications with React, Node.js, and cutting-edge technologies."
    },

    // ─────────────────────────────────────────────────────────────────
    //  CAREER TIMELINE
    //  type: "learning" → 📖 grey badge
    //  type: "freelance" → ⚡ purple badge
    //  era: used to render the section divider between the two phases
    // ─────────────────────────────────────────────────────────────────
    experiences: [
        // ── LEARNING ERA ─────────────────────────────────────────────
        {
            type: "learning",
            era: "learning",
            position: "First Line of Code",
            company: "Self-Taught",
            period: "2020",
            description: "Opened a text editor, typed <h1>Hello World</h1>, and watched it render in a browser. That moment changed everything. Spent months obsessing over HTML structure and CSS layouts — building ugly pages and loving every pixel of it.",
        },
        {
            type: "learning",
            era: "learning",
            position: "JavaScript & the DOM",
            company: "Self-Taught",
            period: "2021",
            description: "JavaScript clicked — and the web became alive. Learned to manipulate the DOM, handle events, and write logic that actually did things. Built my first interactive projects: calculators, to-do lists, small games. Messy code, big lessons.",
        },
        {
            type: "learning",
            era: "learning",
            position: "React & Component Thinking",
            company: "Self-Taught",
            period: "2022",
            description: "Discovered React and everything changed again. Components, state, props, hooks — a completely different way of thinking about UI. Rebuilt everything I had made before. Cleaner, faster, more intentional. This was where craft started to matter.",
        },
        {
            type: "learning",
            era: "learning",
            position: "Full Stack Unlocked",
            company: "Self-Taught",
            period: "2023",
            description: "Backend finally made sense. Node.js, Express, MongoDB, REST APIs — I could now build both sides of a product from scratch. The gap between idea and shipped product collapsed. Everything became possible.",
        },

        // ── BUILDER ERA ───────────────────────────────────────────────
        {
            type: "freelance",
            era: "freelance",
            position: "First Real Products",
            company: "Independent Builder",
            period: "2023",
            description: "Shipped Phone Shop and ANON — two fully deployed e-commerce platforms with real UX, security headers, CDN delivery, and Google integrations. First time strangers used something I built without me explaining anything to them.",
        },
        {
            type: "freelance",
            era: "freelance",
            position: "Entering AI",
            company: "Independent Builder",
            period: "2024",
            description: "Built Voltri — an AI-powered image-to-3D model converter. Integrated Microsoft Trellis API, Supabase auth, a credit system, and geo-based pricing (INR & USD). Designed it to feel like a product someone would actually pay for. Because they can.",
        },
        {
            type: "freelance",
            era: "freelance",
            position: "Production-Grade Architecture",
            company: "Independent Builder",
            period: "2025",
            description: "Launched MIRA — a multi-model AI chat agent with user authentication, persistent chat history, and a clean interface built for scale. Not a side project. A real product, built and deployed solo from zero.",
        },
        {
            type: "freelance",
            era: "freelance",
            position: "Still Building",
            company: "Open to Opportunities",
            period: "2026",
            description: "Four years in. Eight projects shipped. Zero shortcuts taken. I build things that work, look good, and respect the people using them. If you're looking for someone who cares about the craft — let's talk.",
        },
    ],

    projects: [
        // ─────────────────────────────────────────────────────────────────
        //  PROJECT 1 — KNOCKOUT GYM
        //  Images: place 5 screenshots in your repo at:
        //    public/images/knockout-1.jpg  (hero / homepage)
        //    public/images/knockout-2.jpg  (owner panel dashboard)
        //    public/images/knockout-3.jpg  (members management tab)
        //    public/images/knockout-4.jpg  (results / transformations page)
        //    public/images/knockout-5.jpg  (gallery or contact page)
        // ─────────────────────────────────────────────────────────────────
        {
            id: 1,
            title: "Knockout Gym",
            subtitle: "Full-Stack Gym Website & CMS",
            category: "Full Stack",
            technologies: "React, React Router, Supabase, GSAP, Lenis, Vite",
            link: "https://knockoutgym.vercel.app/",
            images: [
                "https://raw.githubusercontent.com/RajatWorks-ux/RajatWorks/main/public/images/knockout-1.jpg",
                "https://raw.githubusercontent.com/RajatWorks-ux/RajatWorks/main/public/images/knockout-2.jpg",
                "https://raw.githubusercontent.com/RajatWorks-ux/RajatWorks/main/public/images/knockout-3.jpg",
                "https://raw.githubusercontent.com/RajatWorks-ux/RajatWorks/main/public/images/knockout-4.jpg",
                "https://raw.githubusercontent.com/RajatWorks-ux/RajatWorks/main/public/images/knockout-5.jpg",
            ],
            description: "Knockout Gym is a production-ready full-stack website built for a real gym in Zirakpur, Punjab. The entire site content — hero text, about section, membership plans, gallery, transformation results, and brand color — is editable live through a hidden Owner Panel, making it a complete CMS built from scratch.\n\nThe Owner Panel at a secret URL gives the gym owner full control: manage members with join dates and plan tracking, read and delete contact enquiries, update every page section, swap the brand color, and configure SEO meta tags — all without touching a line of code. Powered by Supabase with RLS security ensuring member data is never exposed to visitors.",
            warning: "",
        },
        // ─────────────────────────────────────────────────────────────────
        //  PROJECT 2 — VAKILR
        //  Images: place in public/images/ as vakilr-1.jpg through vakilr-5.jpg
        // ─────────────────────────────────────────────────────────────────
        {
            id: 2,
            title: "Vakilr",
            subtitle: "AI-Powered Legal Marketplace",
            category: "Frontend",
            technologies: "HTML, CSS, JavaScript, Responsive Design, Animation",
            link: "https://vakilr.vercel.app/",
            images: [
                "https://raw.githubusercontent.com/RajatWorks-ux/RajatWorks/main/public/images/vakilr-1.jpg",
                "https://raw.githubusercontent.com/RajatWorks-ux/RajatWorks/main/public/images/vakilr-2.jpg",
                "https://raw.githubusercontent.com/RajatWorks-ux/RajatWorks/main/public/images/vakilr-3.jpg",
                "https://raw.githubusercontent.com/RajatWorks-ux/RajatWorks/main/public/images/vakilr-4.jpg",
                "https://raw.githubusercontent.com/RajatWorks-ux/RajatWorks/main/public/images/vakilr-5.jpg",
            ],
            description: "Vakilr is a premium legal marketplace concept designed to showcase a modern, elegant, and technology-driven approach to connecting clients with lawyers. Built with a luxurious dark theme, cinematic background videos, smooth animations, and carefully crafted UI components, the project focuses on creating a professional and trustworthy digital experience.\n\nThe website demonstrates how users could discover verified lawyers, browse professional profiles, explore legal services, and connect with law firms through a clean and intuitive interface. Every element was designed with attention to detail — from premium typography and glassmorphism-inspired cards to responsive layouts and elegant color combinations.",
            warning: "Vakilr is a concept prototype created for portfolio purposes. It is not a real legal marketplace — the lawyers, testimonials, ratings, and statistics displayed are for demonstration only.",
        },
        // ─────────────────────────────────────────────────────────────────
        //  PROJECT 3 — PHONE SHOP
        // ─────────────────────────────────────────────────────────────────
        {
            id: 3,
            title: "Phone Shop",
            subtitle: "Mobile Devices E-Commerce",
            category: "Full Stack",
            technologies: "Vercel, Cloudflare, Google API, AOS",
            link: "https://rajatworks-teck.vercel.app/",
            images: [
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_224631_felxid.jpg",
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_224720_qwcqyo.jpg",
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_224643_dtorqt.jpg",
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_224652_z3twqi.jpg",
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_224709_kb4vk4.jpg",
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_224737_xlkctz.jpg",
            ],
            description: "Phone Shop is a modern e-commerce web application specialized in mobile devices, built with performance, animations, and user experience as top priorities. The platform is fully mobile-optimized and secured with industry-standard protocols.\n\nPhone Shop demonstrates strong attention to performance optimization, visual polish, and security best practices in a real-world e-commerce context.",
            warning: "",
        },
        // ─────────────────────────────────────────────────────────────────
        //  PROJECT 4 — ANON
        // ─────────────────────────────────────────────────────────────────
        {
            id: 4,
            title: "ANON",
            subtitle: "E-Commerce Platform",
            category: "Full Stack",
            technologies: "Vue.js, Element UI, Vercel, Google API",
            link: "https://rajatworks-anon.vercel.app/",
            images: [
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_224520_k13pig.jpg",
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_224618_t6ysmm.jpg",
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_224601_caidle.jpg",
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_224529_x3rjju.jpg",
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_224544_ytby66.jpg",
            ],
            description: "ANON is a modern, fully responsive e-commerce web application designed to deliver a smooth and secure online shopping experience. Built with performance and user experience at its core, the platform combines a clean UI with robust backend services.\n\nANON reflects a strong understanding of modern web architecture — from frontend design systems to deployment pipelines and security best practices.",
            warning: "",
        },
        // ─────────────────────────────────────────────────────────────────
        //  PROJECT 5 — MIRA
        // ─────────────────────────────────────────────────────────────────
        {
            id: 5,
            title: "MIRA",
            subtitle: "AI-Powered Chat Agent",
            category: "Full Stack",
            technologies: "React, Next.js, Node.js, Vercel",
            link: "https://rajatworks-mira.vercel.app/",
            images: [
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_223953_fk41hb.jpg",
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_223929_vdwboh.jpg",
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_223914_fjpbk3.jpg",
            ],
            description: "MIRA is a full-stack AI-powered chat agent designed to deliver a seamless and intelligent conversational experience. Built with a modern tech stack, it supports multiple AI models working together to handle a wide range of tasks — from answering questions to maintaining context-aware conversations.\n\nThe platform features user authentication, chat history, and a clean responsive interface — all architected for performance and scalability.",
            warning: "Live API integrations are currently paused. Core features including authentication, chat history, and multi-model routing are fully implemented and functional in the complete version.",
        },
        // ─────────────────────────────────────────────────────────────────
        //  PROJECT 6 — VOLTRI
        // ─────────────────────────────────────────────────────────────────
        {
            id: 6,
            title: "Voltri",
            subtitle: "AI Image to 3D Model Converter",
            category: "Full Stack",
            technologies: "React, Vite, Tailwind CSS, Supabase, Microsoft Trellis API",
            link: "https://voltri.vercel.app/",
            images: [
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_224914_iag0wb.jpg",
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_224944_dbhmyy.jpg",
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_224955_cqbzkj.jpg",
                "https://res.cloudinary.com/dbshw2jxv/image/upload/IMG_20260222_224934_txdsx7.jpg",
            ],
            description: "Voltri is a cutting-edge web application that transforms ordinary 2D images into fully interactive 3D models using artificial intelligence. Designed with a clean, intuitive interface, Voltri makes professional-grade 3D generation accessible to everyone — no technical knowledge required.\n\nThe platform features a complete user ecosystem including Google authentication, email sign-up, forgot password flow, a credit-based usage system, and both Indian (₹) and international ($) subscription plans with auto location detection.",
            warning: "3D model generation is temporarily paused due to API integration adjustments. All other features including authentication, credit system, and subscription management are fully functional.",
        },
    ],

    contact: {
        email: "rajatworks1@gmail.com",
        github: "https://github.com/RajatWorks-ux",
        linkedin: "https://www.linkedin.com",
        twitter: "https://x.com",
        instagram: "https://www.instagram.com/rajatworks0?igsh=MTNsYWx4NnBrdTFuZg==",
    },

    skills: {
        develop: {
            title: "DEVELOP",
            description: "Full-stack development with modern web technologies",
            details: "Building scalable web applications using React, Node.js, and cutting-edge frameworks. Specializing in creating responsive, performant, and accessible user interfaces.",
            tools: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express.js", "MongoDB", "TailwindCSS", "Framer Motion", "Three.js"]
        },
        design: {
            title: "DESIGN",
            description: "UI/UX design and modern web interfaces",
            details: "Creating beautiful and intuitive user experiences with focus on accessibility and user-centered design principles.",
            tools: ["UI Design", "UX Design", "Figma", "Photoshop", "Motion Design", "Responsive Design", "Accessibility", "Prototyping"]
        }
    }
};

