// Main JavaScript functionality - Fixed Version
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded, initializing application...");

    try {
        initNavigation();
        initAnimations();
        initBodyLayers();
        initModal();
        initScrollEffects();
        createParticles();
        console.log("Application initialized successfully");
    } catch (error) {
        console.error("Error initializing application:", error);
    }
});

// Navigation functionality
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
        ".hero-title, .hero-subtitle, .hero-description, .cta-button, .human-body-container"
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

// Body layers functionality - FIXED VERSION with better debugging
function initBodyLayers() {
    const layers = document.querySelectorAll(".layer");
    const systemCards = document.querySelectorAll(".system-card");

    console.log("Initializing body layers - Found layers:", layers.length);

    if (layers.length === 0) {
        console.warn("No body layers found");
        return;
    }

    // Test image loading for each layer
    const imageTests = {
        skin: "images/skin-diagram.svg",
        muscles: "images/muscles-diagram.svg",
        bones: "images/bones-diagram.svg",
        organs: "images/organs-diagram.svg",
        circulatory: "images/circulatory-diagram.svg",
    };

    // Test if images can be loaded
    Object.entries(imageTests).forEach(([system, imagePath]) => {
        const img = new Image();
        img.onload = () =>
            console.log(`✅ Image loaded successfully: ${imagePath}`);
        img.onerror = () =>
            console.error(`❌ Failed to load image: ${imagePath}`);
        img.src = imagePath;
    });

    // Initialize all layers to be visible
    layers.forEach((layer, index) => {
        // Set initial styles
        layer.style.opacity = "0.6";
        layer.style.pointerEvents = "auto";
        layer.style.zIndex = layers.length - index; // Stack from back to front
        layer.classList.add("active"); // Ensure active class

        // Add debug border to make layers visible
        layer.style.border = "2px solid rgba(255, 255, 255, 0.3)";
        layer.style.borderRadius = "10px";

        // Add a center indicator for debugging
        if (!layer.querySelector(".center-indicator")) {
            const indicator = document.createElement("div");
            indicator.className = "center-indicator";
            indicator.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 20px;
                height: 20px;
                background: rgba(44, 90, 160, 0.7);
                border-radius: 50%;
                pointer-events: none;
                transition: all 0.3s ease;
            `;
            layer.appendChild(indicator);
        }

        console.log(
            `Initialized layer ${index} (${layer.dataset.system}): opacity=0.6, zIndex=${layer.style.zIndex}`
        );
    });

    // Add hover interactions for system cards
    systemCards.forEach((card, index) => {
        const systemType = card.dataset.system;
        const correspondingLayer = document.querySelector(
            `[data-system="${systemType}"]`
        );

        if (!correspondingLayer) {
            console.warn(
                `No corresponding layer found for system: ${systemType}`
            );
            return;
        }

        card.addEventListener("mouseenter", () => {
            console.log(`Hovering over ${systemType} card`);

            // Fade all layers except the hovered one
            layers.forEach((layer) => {
                const indicator = layer.querySelector(".center-indicator");
                if (layer.dataset.system === systemType) {
                    layer.style.opacity = "1";
                    layer.style.zIndex = "100"; // Bring to front
                    layer.style.transform = "scale(1.02)";
                    layer.style.border = "3px solid #2c5aa0"; // Highlight border
                    if (indicator)
                        indicator.style.background = "rgba(255, 107, 107, 0.9)";
                } else {
                    layer.style.opacity = "0.2";
                    layer.style.border = "2px solid rgba(255, 255, 255, 0.1)";
                    if (indicator)
                        indicator.style.background = "rgba(128, 128, 128, 0.5)";
                }
            });
        });

        card.addEventListener("mouseleave", () => {
            console.log(`Stopped hovering over ${systemType} card`);

            // Restore all layers to default state
            layers.forEach((layer, layerIndex) => {
                const indicator = layer.querySelector(".center-indicator");
                layer.style.opacity = "0.6";
                layer.style.zIndex = layers.length - layerIndex;
                layer.style.transform = "scale(1)";
                layer.style.border = "2px solid rgba(255, 255, 255, 0.3)";
                if (indicator)
                    indicator.style.background = "rgba(44, 90, 160, 0.7)";
            });
        });
    });

    // Add click interactions for layers
    layers.forEach((layer) => {
        layer.addEventListener("click", () => {
            const systemType = layer.dataset.system;
            console.log(`Clicked on layer: ${systemType}`);
            openSystemModal(systemType);
        });

        // Add hover effect for layers themselves
        layer.addEventListener("mouseenter", () => {
            if (!layer.style.transform.includes("scale")) {
                layer.style.transform = "scale(1.02)";
                layer.style.opacity = "1";
                layer.style.border = "3px solid #2c5aa0";
                const indicator = layer.querySelector(".center-indicator");
                if (indicator)
                    indicator.style.background = "rgba(255, 107, 107, 0.9)";
            }
        });

        layer.addEventListener("mouseleave", () => {
            if (!document.querySelector(".system-card:hover")) {
                layer.style.transform = "scale(1)";
                layer.style.opacity = "0.6";
                layer.style.border = "2px solid rgba(255, 255, 255, 0.3)";
                const indicator = layer.querySelector(".center-indicator");
                if (indicator)
                    indicator.style.background = "rgba(44, 90, 160, 0.7)";
            }
        });
    });
}

// Modal functionality - FIXED VERSION
function initModal() {
    const modal = document.getElementById("systemModal");

    if (!modal) {
        console.error("Modal element not found during initialization!");
        return;
    }

    // Use event delegation for close button
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
        if (e.key === "Escape" && modal.classList.contains("show")) {
            closeModal();
        }
    });

    console.log("Modal initialized successfully");
}

// Helper function to close modal
function closeModal() {
    const modal = document.getElementById("systemModal");
    if (modal) {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
        console.log("Modal closed");
    }
}

// System modal functionality - FIXED VERSION
window.openSystemModal = function (systemType) {
    console.log(`Opening system modal for: ${systemType}`);

    const modal = document.getElementById("systemModal");
    const modalContent = document.getElementById("modalContent");

    if (!modal || !modalContent) {
        console.error("Modal elements not found!");
        showErrorMessage("ไม่สามารถเปิดหน้าต่างได้ กรุณาลองใหม่อีกครั้ง");
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
        try {
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
                throw new Error("getSystemContent function not found");
            }
        } catch (error) {
            console.error("Error loading system content:", error);
            modalContent.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>เกิดข้อผิดพลาด</h3>
                    <p>ไม่สามารถโหลดข้อมูลระบบได้ กรุณาลองใหม่อีกครั้ง</p>
                    <button class="retry-button" onclick="openSystemModal('${systemType}')">
                        <i class="fas fa-redo"></i> ลองใหม่
                    </button>
                </div>
            `;
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
    window.addEventListener(
        "scroll",
        throttle(() => {
            const header = document.querySelector(".header");
            if (header) {
                if (window.scrollY > 100) {
                    header.style.background = "rgba(255, 255, 255, 0.98)";
                    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.15)";
                } else {
                    header.style.background = "rgba(255, 255, 255, 0.95)";
                    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
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

// Scroll to systems section
function scrollToSystems() {
    const systemsSection = document.getElementById("systems");
    if (systemsSection) {
        systemsSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
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

// Error handling
window.addEventListener("error", (e) => {
    console.error("Application error:", e.error);
    showErrorMessage("เกิดข้อผิดพลาดในระบบ");
});

// Performance monitoring
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

// Make functions globally available
window.closeModal = closeModal;
window.scrollToSystems = scrollToSystems;
