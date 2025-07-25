// Animation controller for enhanced user experience
class AnimationController {
    constructor() {
        this.isInitialized = false;
        this.animations = new Map();
        this.observedElements = new Set();
        this.init();
    }

    init() {
        if (this.isInitialized) return;

        this.setupScrollTrigger();
        this.setupIntersectionObserver();
        this.setupMouseFollower();
        this.setupPageTransitions();
        this.isInitialized = true;
    }

    setupScrollTrigger() {
        // Register ScrollTrigger plugin if GSAP is available
        if (typeof gsap !== "undefined" && gsap.registerPlugin) {
            gsap.registerPlugin(ScrollTrigger);
            this.initScrollAnimations();
        }
    }

    initScrollAnimations() {
        // Hero section animations
        this.createHeroAnimation();

        // Systems section animations
        this.createSystemsAnimation();

        // About section animations
        this.createAboutAnimation();

        // Parallax effects
        this.createParallaxEffects();
    }

    createHeroAnimation() {
        const tl = gsap.timeline();

        tl.from(".hero-title", {
            duration: 1.2,
            y: 80,
            opacity: 0,
            ease: "power4.out",
        })
            .from(
                ".hero-subtitle",
                {
                    duration: 1,
                    y: 60,
                    opacity: 0,
                    ease: "power4.out",
                },
                "-=0.8"
            )
            .from(
                ".hero-description",
                {
                    duration: 1,
                    y: 40,
                    opacity: 0,
                    ease: "power4.out",
                },
                "-=0.6"
            )
            .from(
                ".cta-button",
                {
                    duration: 0.8,
                    scale: 0.8,
                    opacity: 0,
                    ease: "back.out(1.7)",
                },
                "-=0.4"
            )
            .from(
                ".human-body-container",
                {
                    duration: 1.5,
                    scale: 0.6,
                    rotation: 10,
                    opacity: 0,
                    ease: "back.out(1.2)",
                },
                "-=1"
            );

        // Floating animation for the body
        gsap.to(".human-body-container", {
            y: -20,
            duration: 3,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
        });
    }

    createSystemsAnimation() {
        // Animate system cards
        gsap.from(".system-card", {
            scrollTrigger: {
                trigger: ".systems-grid",
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
            },
            duration: 0.8,
            y: 80,
            opacity: 0,
            stagger: {
                amount: 0.6,
                from: "start",
            },
            ease: "power3.out",
        });

        // Add hover animations for cards
        this.addCardHoverEffects();
    }

    addCardHoverEffects() {
        document.querySelectorAll(".system-card").forEach((card) => {
            card.addEventListener("mouseenter", () => {
                gsap.to(card, {
                    y: -15,
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out",
                });

                gsap.to(card.querySelector(".card-icon"), {
                    scale: 1.1,
                    rotation: 5,
                    duration: 0.3,
                    ease: "back.out(1.7)",
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out",
                });

                gsap.to(card.querySelector(".card-icon"), {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: "back.out(1.7)",
                });
            });
        });
    }

    createAboutAnimation() {
        gsap.from(".about-content > div", {
            scrollTrigger: {
                trigger: ".about-section",
                start: "top 70%",
                end: "bottom 30%",
                toggleActions: "play none none reverse",
            },
            duration: 1,
            x: (index) => (index % 2 === 0 ? -80 : 80),
            opacity: 0,
            stagger: 0.3,
            ease: "power3.out",
        });
    }

    createParallaxEffects() {
        // Background parallax
        gsap.to(".hero::before", {
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1,
            },
            y: -100,
            ease: "none",
        });

        // Floating particles parallax
        gsap.to(".particle", {
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 2,
            },
            y: -200,
            ease: "none",
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.handleElementVisible(entry.target);
                } else {
                    this.handleElementHidden(entry.target);
                }
            });
        }, options);

        // Observe sections
        document
            .querySelectorAll("section, .system-card, .info-item")
            .forEach((el) => {
                this.observer.observe(el);
            });
    }

    handleElementVisible(element) {
        element.classList.add("is-visible");

        // Add specific animations based on element type
        if (element.classList.contains("system-card")) {
            this.animateSystemCard(element);
        } else if (element.classList.contains("info-item")) {
            this.animateInfoItem(element);
        }
    }

    handleElementHidden(element) {
        // Only remove visibility for certain elements
        if (element.classList.contains("system-card")) {
            element.classList.remove("is-visible");
        }
    }

    animateSystemCard(card) {
        gsap.from(card, {
            duration: 0.8,
            y: 50,
            opacity: 0,
            scale: 0.9,
            ease: "back.out(1.7)",
        });
    }

    animateInfoItem(item) {
        gsap.from(item, {
            duration: 0.6,
            x: -30,
            opacity: 0,
            ease: "power2.out",
        });
    }

    setupMouseFollower() {
        // Create a cursor follower effect
        const cursor = document.createElement("div");
        cursor.className = "custom-cursor";
        cursor.innerHTML =
            '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
        document.body.appendChild(cursor);

        let mouseX = 0,
            mouseY = 0;
        let cursorX = 0,
            cursorY = 0;

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;

            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Add hover effects
        document
            .querySelectorAll("button, .system-card, .nav-link")
            .forEach((el) => {
                el.addEventListener("mouseenter", () => {
                    cursor.classList.add("cursor-hover");
                });
                el.addEventListener("mouseleave", () => {
                    cursor.classList.remove("cursor-hover");
                });
            });
    }

    setupPageTransitions() {
        // Page transition effects
        this.addPageLoadAnimation();
        this.addSmoothScrolling();
    }

    addPageLoadAnimation() {
        // Create loading overlay
        const loadingOverlay = document.createElement("div");
        loadingOverlay.className = "loading-overlay";
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-logo">Outside In</div>
                <div class="loading-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
                <div class="loading-text">กำลังโหลด...</div>
            </div>
        `;
        document.body.appendChild(loadingOverlay);

        // Animate loading
        const tl = gsap.timeline();
        tl.to(".progress-fill", {
            width: "100%",
            duration: 2,
            ease: "power2.inOut",
        })
            .to(".loading-overlay", {
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
            })
            .call(() => {
                loadingOverlay.remove();
            });
    }

    addSmoothScrolling() {
        // Smooth scroll behavior for navigation links
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", (e) => {
                e.preventDefault();
                const target = document.querySelector(
                    anchor.getAttribute("href")
                );

                if (target) {
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: {
                            y: target,
                            offsetY: 80,
                        },
                        ease: "power2.inOut",
                    });
                }
            });
        });
    }

    // Modal animations
    animateModalOpen(modal) {
        gsap.set(modal, { display: "block" });

        const tl = gsap.timeline();
        tl.from(modal, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
        }).from(
            ".modal-content",
            {
                scale: 0.8,
                y: 50,
                opacity: 0,
                duration: 0.4,
                ease: "back.out(1.7)",
            },
            "-=0.2"
        );

        modal.classList.add("show");
        return tl;
    }

    animateModalClose(modal) {
        const tl = gsap.timeline();
        tl.to(".modal-content", {
            scale: 0.8,
            y: -50,
            opacity: 0,
            duration: 0.3,
            ease: "back.in(1.7)",
        })
            .to(
                modal,
                {
                    opacity: 0,
                    duration: 0.2,
                    ease: "power2.in",
                },
                "-=0.1"
            )
            .call(() => {
                modal.style.display = "none";
                modal.classList.remove("show");
            });

        return tl;
    }

    // System-specific animations
    animateSystemContent(systemType) {
        const elements = document.querySelectorAll(
            ".system-section, .system-visual, .quiz-container"
        );

        gsap.from(elements, {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: "power3.out",
        });

        // Animate diagram
        const diagram = document.querySelector(".system-diagram img");
        if (diagram) {
            gsap.from(diagram, {
                duration: 1,
                scale: 0.8,
                rotation: 5,
                opacity: 0,
                ease: "back.out(1.7)",
                delay: 0.5,
            });
        }
    }

    // Quiz animations
    animateQuizFeedback(feedbackElement, isCorrect) {
        feedbackElement.style.opacity = "0";
        feedbackElement.style.transform = "translateY(10px)";

        gsap.to(feedbackElement, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
        });

        if (isCorrect) {
            gsap.to(feedbackElement, {
                scale: 1.1,
                duration: 0.2,
                ease: "power2.out",
                yoyo: true,
                repeat: 1,
            });
        }
    }

    // Utility methods
    createTimelineAnimation(elements, animations) {
        const tl = gsap.timeline();

        elements.forEach((element, index) => {
            const animation = animations[index] || animations[0];
            tl.from(element, animation, index === 0 ? 0 : "-=0.3");
        });

        return tl;
    }

    addPulseEffect(element) {
        gsap.to(element, {
            scale: 1.05,
            duration: 1,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
        });
    }

    removePulseEffect(element) {
        gsap.killTweensOf(element);
        gsap.set(element, { scale: 1 });
    }

    // Clean up
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.animations.clear();
        this.observedElements.clear();
        gsap.killTweensOf("*");
    }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
    module.exports = AnimationController;
}

document.addEventListener("DOMContentLoaded", () => {
    // Ensure the systems section is visible by default
    const systemsSection = document.querySelector(".systems-section");
    if (systemsSection) {
        systemsSection.style.opacity = "1";
        systemsSection.style.transform = "translateY(0)";
    }

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);
    const controller = new AnimationController();
});
