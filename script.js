// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.bindEvents();
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.header = document.getElementById('header');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Handle scroll for header background
        window.addEventListener('scroll', () => this.handleScroll());

        // Smooth scroll for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.smoothScroll(e));
        });
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        const icon = this.navToggle.querySelector('i');
        if (this.navMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        const icon = this.navToggle.querySelector('i');
        icon.className = 'fas fa-bars';
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }

    smoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = this.header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);
        
        // Initialize animations
        this.initHeroAnimations();
        this.initScrollAnimations();
        this.initIntersectionObserver();
    }

    initHeroAnimations() {
        // Hero text animations
        gsap.fromTo('.hero-text', 
            { 
                opacity: 0, 
                y: 100 
            },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1, 
                stagger: 0.2, 
                ease: 'power3.out' 
            }
        );

        // Hero buttons animation
        gsap.fromTo('.hero-buttons', 
            { 
                opacity: 0, 
                scale: 0.8 
            },
            { 
                opacity: 1, 
                scale: 1, 
                duration: 0.8, 
                delay: 0.8, 
                ease: 'back.out(1.7)' 
            }
        );

        // Hero social animation
        gsap.fromTo('.hero-social', 
            { 
                opacity: 0, 
                y: 30 
            },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                delay: 1.2, 
                ease: 'power3.out' 
            }
        );
    }

    initScrollAnimations() {
        // Fade in animations for sections
        gsap.utils.toArray('.fade-in').forEach(element => {
            gsap.fromTo(element,
                {
                    opacity: 0,
                    y: 50
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Card hover animations
        gsap.utils.toArray('.card, .about-card, .skill-category, .project-card, .cert-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -8,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    initIntersectionObserver() {
        // Fallback for browsers that don't support GSAP ScrollTrigger
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }
}

// Contact Form Manager
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.toast = document.getElementById('toast');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual API call)
            await this.simulateFormSubmission(data);
            
            // Show success message
            this.showToast('Message sent successfully!', 'success');
            
            // Reset form
            this.form.reset();
            
        } catch (error) {
            // Show error message
            this.showToast('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulateFormSubmission(data) {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve();
            }, 1000);
        });
    }

    showToast(message, type = 'success') {
        if (!this.toast) return;

        const toastMessage = this.toast.querySelector('.toast-message');
        const toastIcon = this.toast.querySelector('i');
        
        // Update message
        toastMessage.textContent = message;
        
        // Update icon and color based on type
        if (type === 'success') {
            toastIcon.className = 'fas fa-check-circle';
            this.toast.style.backgroundColor = '#10b981';
        } else {
            toastIcon.className = 'fas fa-exclamation-circle';
            this.toast.style.backgroundColor = '#ef4444';
        }
        
        // Show toast
        this.toast.classList.add('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

// Utility Functions
class Utils {
    static updateCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    static initSmoothScrolling() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    static initParallaxEffect() {
        // Simple parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new ThemeManager();
    new NavigationManager();
    new AnimationManager();
    new ContactFormManager();
    
    // Initialize utilities
    Utils.updateCurrentYear();
    Utils.initSmoothScrolling();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Refresh animations when page becomes visible
        ScrollTrigger.refresh();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Refresh ScrollTrigger on resize
    ScrollTrigger.refresh();
});
