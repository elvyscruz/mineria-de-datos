// ===== ANIMATION CONTROLLER =====

class AnimationController {
    constructor() {
        this.animations = new Map();
        this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        if (!this.isReduced) {
            this.initScrollAnimations();
            this.initIntersectionObserver();
            this.initParallaxEffects();
            this.initCountUpAnimations();
        }
    }

    // ===== INTERSECTION OBSERVER =====
    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(el => this.observer.observe(el));
    }

    triggerAnimation(element) {
        const animationType = element.dataset.animate;
        const duration = element.dataset.duration || '600ms';
        const delay = element.dataset.delay || '0ms';

        element.style.animationDuration = duration;
        element.style.animationDelay = delay;
        element.classList.add(animationType);

        // Remove from observer after animation
        setTimeout(() => {
            this.observer.unobserve(element);
        }, parseFloat(duration) + parseFloat(delay));
    }

    // ===== SCROLL ANIMATIONS =====
    initScrollAnimations() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Animate progress bars on scroll
        this.animateProgressBars(scrolled);
    }

    // ===== PARALLAX EFFECTS =====
    initParallaxEffects() {
        const parallaxSections = document.querySelectorAll('.parallax-section');

        parallaxSections.forEach(section => {
            const image = section.querySelector('img') || section.querySelector('[data-parallax-image]');
            if (image) {
                section.dataset.parallax = '0.5';
                image.dataset.parallax = '0.3';
            }
        });
    }

    // ===== COUNT UP ANIMATIONS =====
    initCountUpAnimations() {
        const countElements = document.querySelectorAll('[data-count]');

        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCount(entry.target);
                    countObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        countElements.forEach(el => countObserver.observe(el));
    }

    animateCount(element) {
        const target = parseInt(element.dataset.count);
        const duration = parseInt(element.dataset.duration) || 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            element.textContent = Math.floor(current).toLocaleString();

            // Add suffix if specified
            if (element.dataset.suffix) {
                element.textContent += element.dataset.suffix;
            }
        }, 16);
    }

    // ===== PROGRESS BAR ANIMATIONS =====
    animateProgressBars(scrollY) {
        const progressBars = document.querySelectorAll('[data-progress]');

        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisible && !bar.classList.contains('animated')) {
                const target = parseInt(bar.dataset.progress);
                this.animateProgressBar(bar, target);
                bar.classList.add('animated');
            }
        });
    }

    animateProgressBar(element, target) {
        let current = 0;
        const increment = target / 60;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            element.style.width = `${current}%`;
            element.setAttribute('aria-valuenow', Math.floor(current));

            // Update text if available
            const text = element.querySelector('.progress-text');
            if (text) {
                text.textContent = `${Math.floor(current)}%`;
            }
        }, 16);
    }

    // ===== TYPING ANIMATION =====
    typeText(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';

        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                element.classList.add('typing-complete');
            }
        }, speed);

        return timer;
    }

    // ===== FLOATING ANIMATION =====
    initFloatingAnimation() {
        const floatingElements = document.querySelectorAll('.floating');

        floatingElements.forEach(element => {
            const amplitude = element.dataset.amplitude || 10;
            const frequency = element.dataset.frequency || 0.01;
            const phase = Math.random() * Math.PI * 2;

            this.animateFloating(element, amplitude, frequency, phase);
        });
    }

    animateFloating(element, amplitude, frequency, phase) {
        let start = Date.now();

        const animate = () => {
            const elapsed = Date.now() - start;
            const y = Math.sin(elapsed * frequency + phase) * amplitude;

            element.style.transform = `translateY(${y}px)`;

            requestAnimationFrame(animate);
        };

        animate();
    }

    // ===== STAGGER ANIMATIONS =====
    staggerAnimation(elements, animationClass, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, index * delay);
        });
    }

    // ===== MORPHING ANIMATION =====
    morphPath(pathElement, newPath, duration = 1000) {
        const originalPath = pathElement.getAttribute('d');

        pathElement.style.transition = `d ${duration}ms ease-in-out`;
        pathElement.setAttribute('d', newPath);

        setTimeout(() => {
            pathElement.style.transition = '';
        }, duration);

        return {
            reverse: () => this.morphPath(pathElement, originalPath, duration)
        };
    }

    // ===== LOADING STATES =====
    showLoadingState(element, type = 'spinner') {
        const loadingHTML = this.getLoadingHTML(type);
        element.innerHTML = loadingHTML;
        element.classList.add('loading');
    }

    hideLoadingState(element, content) {
        element.classList.remove('loading');
        element.innerHTML = content;
    }

    getLoadingHTML(type) {
        const loadingTypes = {
            spinner: '<div class="spinner"></div>',
            dots: '<div class="dots-loader"><span></span><span></span><span></span></div>',
            skeleton: '<div class="skeleton-loader"></div>',
            pulse: '<div class="pulse-loader"></div>'
        };

        return loadingTypes[type] || loadingTypes.spinner;
    }

    // ===== NOTIFICATION ANIMATIONS =====
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto hide
        const timer = setTimeout(() => {
            this.hideNotification(notification);
        }, duration);

        // Manual close
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(timer);
            this.hideNotification(notification);
        });

        return notification;
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        return icons[type] || icons.info;
    }

    // ===== DESTROY =====
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();

    // Initialize floating animations
    window.animationController.initFloatingAnimation();

    // Add custom animations as needed
    initCustomAnimations();
});

function initCustomAnimations() {
    // Add any custom animation logic here

    // Example: Animate timeline items on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('timeline-animate');
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });

    timelineItems.forEach(item => timelineObserver.observe(item));

    // Example: Animate skill bars
    const skillBars = document.querySelectorAll('.skill-bar');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const skill = bar.dataset.skill;
                const level = bar.dataset.level;

                bar.style.setProperty('--skill-level', `${level}%`);
                bar.classList.add('animate-skill');
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));
}

// ===== EXPORT FOR GLOBAL USE =====
window.AnimationController = AnimationController;

// Utility functions for common animations
window.animateOnScroll = (elements, animationClass) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
};

window.createTypingEffect = (element, text, speed = 50) => {
    return window.animationController.typeText(element, text, speed);
};

window.showNotification = (message, type, duration) => {
    return window.animationController.showNotification(message, type, duration);
};