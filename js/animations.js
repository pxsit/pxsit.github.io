// Animation controller for enhanced user experience - Fixed Version
class AnimationController {
    constructor() {
        this.isInitialized = false;
        this.animations = new Map();
        this.observedElements = new Set();
        this.init();
    }

    init() {
        if (this.isInitialized) return;

        try {
            this.setupScrollTrigger();
            this.setupIntersectionObserver();
            this.setupPageTransitions();
            this.isInitialized = true;
            console.log("AnimationController initialized successfully");
        } catch (error) {
            console.error("Error initializing AnimationController:", error);
        }
    }

    setupScrollTrigger() {
        // Only setup GSAP ScrollTrigger if available
        if (
            typeof gsap !== "undefined" &&
            gsap.registerPlugin &&
            typeof ScrollTrigger !== "undefined"
        ) {
            try {
                gsap.registerPlugin(ScrollTrigger);
                this.initScrollAnimations();
            } catch (error) {
                console.error("Error setting up ScrollTrigger:", error);
            }
        } else {
            console.warn(
                "GSAP or ScrollTrigger not available, using fallback animations"
            );
            this.initFallbackScrollAnimations();
        }
    }

    initScrollAnimations() {
        try {
            // Hero section animations
            this.createHeroAnimation();

            // Systems section animations
            this.createSystemsAnimation();

            // About section animations
            this.createAboutAnimation();

            // Parallax effects
            this.createParallaxEffects();
        } catch (error) {
            console.error("Error initializing scroll animations:", error);
        }
    }

    initFallbackScrollAnimations() {
        // Fallback animations without GSAP
        const observeElements = document.querySelectorAll(
            ".system-card, .about-content > div"
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                    }
                });
            },
            { threshold: 0.1 }
        );

        observeElements.forEach((el) => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            observer.observe(el);
        });
    }

    createHeroAnimation() {
        if (typeof gsap === "undefined") return;

        try {
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
        } catch (error) {
            console.error("Error creating hero animation:", error);
        }
    }

    createSystemsAnimation() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
            return;

        try {
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
        } catch (error) {
            console.error("Error creating systems animation:", error);
        }
    }

    addCardHoverEffects() {
        if (typeof gsap === "undefined") return;

        try {
            document.querySelectorAll(".system-card").forEach((card) => {
                card.addEventListener("mouseenter", () => {
                    gsap.to(card, {
                        y: -15,
                        scale: 1.02,
                        duration: 0.3,
                        ease: "power2.out",
                    });

                    const icon = card.querySelector(".card-icon");
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1.1,
                            rotation: 5,
                            duration: 0.3,
                            ease: "back.out(1.7)",
                        });
                    }
                });

                card.addEventListener("mouseleave", () => {
                    gsap.to(card, {
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out",
                    });

                    const icon = card.querySelector(".card-icon");
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1,
                            rotation: 0,
                            duration: 0.3,
                            ease: "back.out(1.7)",
                        });
                    }
                });
            });
        } catch (error) {
            console.error("Error adding card hover effects:", error);
        }
    }

    createAboutAnimation() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
            return;

        try {
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
        } catch (error) {
            console.error("Error creating about animation:", error);
        }
    }

    createParallaxEffects() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
            return;

        try {
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
        } catch (error) {
            console.error("Error creating parallax effects:", error);
        }
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
        if (typeof gsap === "undefined") {
            // Fallback animation
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
            return;
        }

        try {
            gsap.from(card, {
                duration: 0.8,
                y: 50,
                opacity: 0,
                scale: 0.9,
                ease: "back.out(1.7)",
            });
        } catch (error) {
            console.error("Error animating system card:", error);
        }
    }

    animateInfoItem(item) {
        if (typeof gsap === "undefined") {
            // Fallback animation
            item.style.opacity = "1";
            item.style.transform = "translateX(0)";
            return;
        }

        try {
            gsap.from(item, {
                duration: 0.6,
                x: -30,
                opacity: 0,
                ease: "power2.out",
            });
        } catch (error) {
            console.error("Error animating info item:", error);
        }
    }

    setupPageTransitions() {
        this.addSmoothScrolling();
    }

    addSmoothScrolling() {
        // Enhanced smooth scroll behavior for navigation links
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", (e) => {
                e.preventDefault();
                const target = document.querySelector(
                    anchor.getAttribute("href")
                );

                if (target) {
                    if (typeof gsap !== "undefined") {
                        try {
                            gsap.to(window, {
                                duration: 1.5,
                                scrollTo: {
                                    y: target,
                                    offsetY: 80,
                                },
                                ease: "power2.inOut",
                            });
                        } catch (error) {
                            // Fallback to native smooth scroll
                            target.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            });
                        }
                    } else {
                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                    }
                }
            });
        });
    }

    // Modal animations
    animateModalOpen(modal) {
        if (typeof gsap === "undefined") {
            // Fallback animation
            modal.style.display = "flex";
            modal.classList.add("show");
            return;
        }

        try {
            gsap.set(modal, { display: "flex" });

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
        } catch (error) {
            console.error("Error animating modal open:", error);
            modal.style.display = "flex";
            modal.classList.add("show");
        }
    }

    animateModalClose(modal) {
        if (typeof gsap === "undefined") {
            // Fallback animation
            modal.classList.remove("show");
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
            return;
        }

        try {
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
        } catch (error) {
            console.error("Error animating modal close:", error);
            modal.classList.remove("show");
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
        }
    }

    // System-specific animations
    animateSystemContent(systemType) {
        const elements = document.querySelectorAll(
            ".system-section, .system-visual, .quiz-container"
        );

        if (typeof gsap === "undefined") {
            // Fallback animation
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0)";
                }, index * 200);
            });
            return;
        }

        try {
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
        } catch (error) {
            console.error("Error animating system content:", error);
        }
    }

    // Quiz animations
    animateQuizFeedback(feedbackElement, isCorrect) {
        if (!feedbackElement) return;

        if (typeof gsap === "undefined") {
            // Fallback animation
            feedbackElement.style.opacity = "1";
            return;
        }

        try {
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
        } catch (error) {
            console.error("Error animating quiz feedback:", error);
            feedbackElement.style.opacity = "1";
        }
    }

    // Utility methods
    addPulseEffect(element) {
        if (!element || typeof gsap === "undefined") return;

        try {
            gsap.to(element, {
                scale: 1.05,
                duration: 1,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
            });
        } catch (error) {
            console.error("Error adding pulse effect:", error);
        }
    }

    removePulseEffect(element) {
        if (!element || typeof gsap === "undefined") return;

        try {
            gsap.killTweensOf(element);
            gsap.set(element, { scale: 1 });
        } catch (error) {
            console.error("Error removing pulse effect:", error);
        }
    }

    // Clean up
    destroy() {
        try {
            if (this.observer) {
                this.observer.disconnect();
            }
            this.animations.clear();
            this.observedElements.clear();

            if (typeof gsap !== "undefined") {
                gsap.killTweensOf("*");
            }
        } catch (error) {
            console.error("Error destroying AnimationController:", error);
        }
    }
}

// Initialize AnimationController when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    try {
        // Ensure the systems section is visible by default
        const systemsSection = document.querySelector(".systems-section");
        if (systemsSection) {
            systemsSection.style.opacity = "1";
            systemsSection.style.transform = "translateY(0)";
        }

        // Initialize animation controller
        window.animationController = new AnimationController();

        console.log("Animations initialized successfully");
    } catch (error) {
        console.error("Error initializing animations:", error);
    }
});

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
    module.exports = AnimationController;
}
