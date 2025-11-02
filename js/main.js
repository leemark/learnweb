/**
 * LearnWeb - Main JavaScript
 * Vanilla JavaScript for enhanced interactivity and accessibility
 */

(function() {
    'use strict';

    /**
     * Update navigation current page indicator
     */
    function updateNavigation() {
        const navLinks = document.querySelectorAll('nav a');
        const currentPath = window.location.pathname;

        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;

            if (linkPath === currentPath ||
                (currentPath.startsWith(linkPath) && linkPath !== '/')) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Skip if href is just "#"
                if (href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    // Use scrollIntoView with smooth behavior
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Set focus to target for accessibility
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        });
    }

    /**
     * Initialize external link indicators (accessibility)
     */
    function initExternalLinks() {
        const links = document.querySelectorAll('a[href^="http"]');
        const currentDomain = window.location.hostname;

        links.forEach(link => {
            const linkDomain = new URL(link.href).hostname;

            if (linkDomain !== currentDomain) {
                // Add visual indicator and screen reader text
                const srText = document.createElement('span');
                srText.className = 'sr-only';
                srText.textContent = ' (opens in new tab)';
                link.appendChild(srText);

                // Open in new tab
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    /**
     * Keyboard navigation enhancements
     */
    function initKeyboardNav() {
        // Handle escape key to close modals or return focus
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Future: Close any open modals
                // For now, just ensure we can always return to main content
                const mainContent = document.getElementById('main-content');
                if (mainContent && document.activeElement) {
                    mainContent.focus();
                }
            }
        });
    }

    /**
     * Add screen reader only class styles
     */
    function initAccessibilityStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Progress tracking for courses (stored in localStorage)
     */
    const CourseProgress = {
        get: function(courseId, lessonId) {
            const key = `learnweb_progress_${courseId}`;
            const data = localStorage.getItem(key);

            if (!data) return false;

            try {
                const progress = JSON.parse(data);
                return progress.lessons && progress.lessons.includes(lessonId);
            } catch (e) {
                return false;
            }
        },

        set: function(courseId, lessonId) {
            const key = `learnweb_progress_${courseId}`;
            let progress = { lessons: [] };

            const existing = localStorage.getItem(key);
            if (existing) {
                try {
                    progress = JSON.parse(existing);
                } catch (e) {
                    // Use default
                }
            }

            if (!progress.lessons.includes(lessonId)) {
                progress.lessons.push(lessonId);
                localStorage.setItem(key, JSON.stringify(progress));
            }
        },

        getAll: function(courseId) {
            const key = `learnweb_progress_${courseId}`;
            const data = localStorage.getItem(key);

            if (!data) return [];

            try {
                const progress = JSON.parse(data);
                return progress.lessons || [];
            } catch (e) {
                return [];
            }
        }
    };

    /**
     * Mark current lesson as completed
     */
    function initProgressTracking() {
        const lessonContent = document.querySelector('.lesson-content');

        if (lessonContent) {
            const courseId = lessonContent.dataset.courseId;
            const lessonId = lessonContent.dataset.lessonId;

            if (courseId && lessonId) {
                // Mark as viewed when user scrolls to bottom
                let marked = false;

                window.addEventListener('scroll', function() {
                    if (marked) return;

                    const scrollPosition = window.scrollY + window.innerHeight;
                    const pageHeight = document.documentElement.scrollHeight;

                    // If scrolled to bottom (with 100px threshold)
                    if (scrollPosition >= pageHeight - 100) {
                        CourseProgress.set(courseId, lessonId);
                        marked = true;
                    }
                });
            }
        }
    }

    /**
     * Initialize all functionality when DOM is ready
     */
    function init() {
        updateNavigation();
        initSmoothScroll();
        initExternalLinks();
        initKeyboardNav();
        initAccessibilityStyles();
        initProgressTracking();
    }

    // Run initialization when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export CourseProgress for use in course pages
    window.LearnWeb = {
        CourseProgress: CourseProgress
    };

})();
