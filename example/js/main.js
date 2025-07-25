// Main JavaScript functionality
document.addEventListener("DOMContentLoaded", function () {
    initNavigation();
    initAnimations();
    initBodyLayers();
    initModal();
    initScrollEffects();
    createParticles();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

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

    // Smooth scrolling for navigation links
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });
}

// Initialize animations
function initAnimations() {
    // Check if GSAP is loaded
    if (typeof gsap === "undefined") {
        console.error("GSAP is not loaded!");
        return;
    }

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
            "-=0.3"
        )
        .from(
            ".human-body-container",
            { duration: 1, scale: 0.8, opacity: 0, ease: "back.out(1.7)" },
            "-=0.5"
        );

    // Register ScrollTrigger plugin if available
    if (gsap.registerPlugin && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // Animate system cards on scroll
        gsap.from(".system-card", {
            scrollTrigger: {
                trigger: ".systems-grid",
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
            },
            duration: 0.8,
            y: 50,
            opacity: 0,
            stagger: 0.2,
            ease: "power3.out",
        });
    } else {
        console.warn(
            "ScrollTrigger plugin not available, skipping scroll animations"
        );
    }
}

// Body layers functionality
function initBodyLayers() {
    const layers = document.querySelectorAll(".layer");
    const systemCards = document.querySelectorAll(".system-card");

    console.log("Found layers:", layers.length);

    // Force all layers to be visible with proper stacking
    layers.forEach((layer, index) => {
        layer.classList.add("active"); // Ensure all have active class
        layer.style.opacity = "0.7"; // Make all visible
        layer.style.zIndex = layers.length - index; // Stack from back to front
        layer.style.pointerEvents = "auto"; // Ensure they're clickable
        console.log(
            `Layer ${index} (${layer.dataset.system}): opacity=${layer.style.opacity}, zIndex=${layer.style.zIndex}`
        );
    });

    // Hover interactions - highlight the hovered system
    systemCards.forEach((card, index) => {
        card.addEventListener("mouseenter", () => {
            console.log(`Hovering over card ${index}`);
            // Fade all layers
            layers.forEach((layer, layerIndex) => {
                if (layerIndex === index) {
                    // Highlight the hovered layer
                    layer.style.opacity = "1";
                    layer.style.zIndex = "100"; // Bring to front
                } else {
                    // Fade other layers
                    layer.style.opacity = "0.2";
                }
            });
        });

        card.addEventListener("mouseleave", () => {
            console.log(`Stopped hovering over card ${index}`);
            // Restore all layers to default visibility
            layers.forEach((layer, layerIndex) => {
                layer.style.opacity = "0.7";
                layer.style.zIndex = layers.length - layerIndex; // Reset stacking order
            });
        });
    });

    // Click interactions for layers
    layers.forEach((layer, index) => {
        layer.addEventListener("click", () => {
            const systemType = layer.dataset.system;
            console.log(`Clicked on layer: ${systemType}`);
            openSystem(systemType);
        });
    });
}

// Modal functionality
function initModal() {
    const modal = document.getElementById("systemModal");

    if (!modal) {
        console.error("Modal element not found during initialization!");
        return;
    }

    // Use event delegation for close button - this will work even when content is dynamically loaded
    modal.addEventListener("click", (e) => {
        if (e.target.classList.contains("close-modal")) {
            closeModal();
        }
    });

    // Close modal when clicking outside content
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Escape key to close modal
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "flex") {
            closeModal();
        }
    });
}

// Helper function to close modal
function closeModal() {
    const modal = document.getElementById("systemModal");
    if (modal) {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }
}

// System modal functionality
window.openSystem = function (systemType) {
    const modal = document.getElementById("systemModal");
    const modalContent = document.getElementById("modalContent");

    if (!modal || !modalContent) {
        console.error("Modal elements not found!");
        return;
    }

    // Show loading state
    modalContent.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>กำลังโหลดข้อมูลระบบ...</p>
        </div>
    `;

    // Open modal first
    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("show");
    }, 10);

    // Load content with animation
    setTimeout(() => {
        if (typeof getSystemContent === "function") {
            const content = getSystemContent(systemType);
            modalContent.innerHTML = content;

            // Initialize system-specific interactions
            if (typeof initSystemInteractions === "function") {
                initSystemInteractions(systemType);
            }

            // Trigger animations
            const animatedElements = modalContent.querySelectorAll(
                '[class*="animate-"]'
            );
            animatedElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add("animate-active");
                }, index * 100);
            });
        } else {
            modalContent.innerHTML =
                "<p>ขออภัย เกิดข้อผิดพลาดในการโหลดข้อมูล</p>";
        }
    }, 500);
};

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
    window.addEventListener("scroll", () => {
        const header = document.querySelector(".header");
        if (window.scrollY > 100) {
            header.style.background = "rgba(255, 255, 255, 0.98)";
            header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.15)";
        } else {
            header.style.background = "rgba(255, 255, 255, 0.95)";
            header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
        }
    });
}

// Create floating particles
function createParticles() {
    const hero = document.querySelector(".hero");
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

// Scroll to systems section
function scrollToSystems() {
    document.getElementById("systems").scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
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

// Error handling
window.addEventListener("error", (e) => {
    console.error("Application error:", e.error);
});

// Performance monitoring
if ("performance" in window) {
    window.addEventListener("load", () => {
        setTimeout(() => {
            const navigation = performance.getEntriesByType("navigation")[0];
            console.log(
                "Page load time:",
                navigation.loadEventEnd - navigation.loadEventStart,
                "ms"
            );
        }, 0);
    });
}
