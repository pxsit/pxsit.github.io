document.addEventListener("DOMContentLoaded", function () {
    try {
        initNavigation();
        initAnimations();
        initScrollEffects();
        createParticles();
    } catch (error) {
        console.error("Init error", error);
    }
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
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll("section").forEach((section) => {
        section.classList.add("fade-in-section");
        observer.observe(section);
    });

    // Header background on scroll
    window.addEventListener(
        "scroll",
        throttle(() => {
            const header = document.querySelector(".header");
            if (header) {
                if (window.scrollY > 100) {
                    header.style.background = "rgba(5, 10, 25, 0.9)";
                    header.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
                } else {
                    header.style.background = "rgba(5, 10, 25, 0.7)";
                    header.style.boxShadow = "0 10px 30px rgba(0,0,0,0.25)";
                }
            }
        }, 100)
    );
}

// Create floating particles
function createParticles() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const particlesContainer = document.createElement("div");
    particlesContainer.className = "particles";
    hero.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 10 + "s";
        particle.style.animationDuration = Math.random() * 10 + 5 + "s";
        particlesContainer.appendChild(particle);
    }
}

// Error handling and user feedback
function showErrorMessage(message) {
    // Create a simple toast notification
    const toast = document.createElement("div");
    toast.className = "error-toast";
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease-out;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
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
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

window.addEventListener("error", (e) => {
    console.error("Application error:", e.error);
    showErrorMessage("เกิดข้อผิดพลาดในระบบ");
});

if ("performance" in window) {
    window.addEventListener("load", () => {
        setTimeout(() => {
            const navigation = performance.getEntriesByType("navigation")[0];
            if (navigation) {
                console.log(
                    "Page load time:",
                    navigation.loadEventEnd - navigation.loadEventStart,
                    "ms"
                );
            }
        }, 0);
    });
}