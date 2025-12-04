// Strip tracking parameters from URL
(async function () {
    try {
        if (typeof window === "undefined" || typeof URL === "undefined") return;
        const url = new URL(window.location.href);

        // Load trackers from JSON
        const response = await fetch("data/trackers.json");
        const TRACKERS = await response.json();

        // Build list of all tracking params
        const paramsToStrip = [];
        for (const [prefix, suffixes] of Object.entries(TRACKERS)) {
            for (const suffix of suffixes) {
                paramsToStrip.push(prefix + suffix);
            }
        }

        let changed = false;
        for (const p of paramsToStrip) {
            if (url.searchParams.has(p)) {
                url.searchParams.delete(p);
                changed = true;
            }
        }
        if (changed) {
            const newRelative =
                url.pathname + (url.search || "") + (url.hash || "");
            window.history.replaceState(null, "", newRelative);
        }
    } catch (_) {}
})();

document.addEventListener("DOMContentLoaded", function () {
    const initFunctions = [
        ["Navigation", initNavigation],
        ["Animations", initAnimations],
        ["ScrollEffects", initScrollEffects],
        ["Particles", createParticles],
        ["HeroVideo", initHeroVideo],
    ];

    initFunctions.forEach(([name, fn]) => {
        try {
            fn();
        } catch (error) {
            console.error(`Init ${name} error:`, error);
        }
    });
});

function initNavigation() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!hamburger || !navMenu) {
        console.warn("Navigation elements not found");
        return;
    }

    // Toggle mobile menu
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Close menu when link is clicked
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });

    // Smooth, reliable scrolling for hash navigation links; allow normal links
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (!href || !href.startsWith("#")) {
                // Non-hash link (e.g., separate page) → allow default navigation
                return;
            }
            e.preventDefault();

            const targetSection = document.querySelector(href);

            // Toggle visibility first (so layout is correct before scrolling)
            if (typeof window.show === "function") {
                if (href === "#home") window.show("home");
                else if (href === "#menu") window.show("menu");
                // Leave other sections (e.g., #about) as-is
            }

            // Close mobile menu immediately
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");

            // Scroll after layout updates
            if (
                targetSection &&
                typeof targetSection.scrollIntoView === "function"
            ) {
                requestAnimationFrame(() => {
                    targetSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                });
            }

            // Update hash for accessibility/history without triggering default jump
            if (history && history.pushState) {
                history.pushState(null, "", href);
            } else if (typeof location !== "undefined") {
                location.hash = href;
            }
        });
    });
}

// Initialize animations
function initAnimations() {
    // Check if GSAP is loaded
    if (typeof gsap === "undefined") {
        console.warn("GSAP is not loaded, using fallback animations");
        initFallbackAnimations();
        return;
    }

    try {
        // Animate hero elements
        gsap.timeline()
            .from(".hero-title", {
                duration: 1,
                y: 50,
                opacity: 0,
                ease: "power3.out",
            })
            .from(
                ".hero-subtitle",
                { duration: 0.8, y: 30, opacity: 0, ease: "power3.out" },
                "-=0.5"
            )
            .from(
                ".hero-description",
                { duration: 0.8, y: 30, opacity: 0, ease: "power3.out" },
                "-=0.4"
            )
            .from(
                ".cta-button",
                { duration: 0.8, y: 30, opacity: 0, ease: "power3.out" },
                "-=0.5"
            );

        // Register ScrollTrigger plugin if available
        if (gsap.registerPlugin && typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);

            // Animate menu cards on scroll
            gsap.from(".menu-card", {
                scrollTrigger: {
                    trigger: ".menu-grid",
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse",
                },
                duration: 0.8,
                y: 40,
                opacity: 0,
                stagger: 0.15,
                ease: "power3.out",
            });
        } else {
            console.warn("ScrollTrigger plugin not available");
        }
    } catch (error) {
        console.error("GSAP animation error:", error);
        initFallbackAnimations();
    }
}

// Fallback animations for when GSAP is not available
function initFallbackAnimations() {
    const heroElements = document.querySelectorAll(
        ".hero-title, .hero-subtitle, .hero-description, .cta-button"
    );

    heroElements.forEach((element, index) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";

        setTimeout(() => {
            element.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        }, index * 200);
    });
}

// Remove legacy body layers and modal code (replaced by lesson flow)

// Scroll effects
function initScrollEffects() {
    // Fade in sections on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                // Unobserve after animation to save resources
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll("section").forEach((section) => {
        section.classList.add("fade-in-section");
        observer.observe(section);
    });

    // Header background on scroll - cache header element
    const header = document.querySelector(".header");
    if (!header) return;

    const handleScroll = throttle(() => {
        const isScrolled = window.scrollY > 100;
        header.style.background = isScrolled
            ? "rgba(5, 10, 25, 0.9)"
            : "rgba(5, 10, 25, 0.7)";
        header.style.boxShadow = isScrolled
            ? "0 10px 30px rgba(0,0,0,0.35)"
            : "0 10px 30px rgba(0,0,0,0.25)";
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
}

// Create floating particles
function createParticles() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const particlesContainer = document.createElement("div");
    particlesContainer.className = "particles";

    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    const PARTICLE_COUNT = 50;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.cssText = `
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 10}s;
            animation-duration: ${5 + Math.random() * 10}s;
        `;
        fragment.appendChild(particle);
    }

    particlesContainer.appendChild(fragment);
    hero.appendChild(particlesContainer);
}

// Initialize hero video with fade-to-black loop
function initHeroVideo() {
    const video = document.getElementById("hero-video");
    const fade = document.getElementById("hero-video-fade");
    const fallback = document.querySelector(".fallback-visual");
    if (!video || !fade) return;

    // Try to play muted inline
    const startPlayback = () => {
        const p = video.play();
        if (p && typeof p.catch === "function") {
            p.catch((err) => {
                console.warn(
                    "Autoplay failed, will show controls fallback",
                    err
                );
                video.setAttribute("controls", "controls");
            });
        }
    };

    // If metadata ready, attempt autoplay
    if (video.readyState >= 1) startPlayback();
    else
        video.addEventListener("loadedmetadata", startPlayback, { once: true });

    // Fade to black at end, then restart
    video.addEventListener("ended", () => {
        fade.classList.add("show");
        // Small delay to ensure fade is visible
        setTimeout(() => {
            try {
                video.currentTime = 0;
            } catch (_) {}
            // After resetting, wait a moment then fade out and play again
            setTimeout(() => {
                fade.classList.remove("show");
                startPlayback();
            }, 250);
        }, 150);
    });

    // On error, reveal fallback visuals and hide video wrapper
    const showFallback = () => {
        if (fallback) fallback.style.display = "block";
        const wrap = document.querySelector(".hero-video-wrap");
        if (wrap) wrap.style.display = "none";
    };
    video.addEventListener("error", showFallback);
    video.addEventListener("stalled", () => {
        // If stalled at the beginning, fallback quickly
        if (video.currentTime === 0) showFallback();
    });
}

// Error handling and user feedback
function showErrorMessage(message) {
    // Remove existing toasts to prevent stacking
    document.querySelectorAll(".error-toast").forEach((t) => t.remove());

    const toast = document.createElement("div");
    toast.className = "error-toast";
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease-out;
        cursor: pointer;
    `;
    toast.textContent = message;
    toast.setAttribute("role", "alert");

    // Allow click to dismiss
    toast.addEventListener("click", () => toast.remove());
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = "slideInRight 0.3s ease-out reverse";
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

window.addEventListener("error", (e) => {
    console.error("Application error:", e.error);
    showErrorMessage("เกิดข้อผิดพลาดในระบบ");
});
