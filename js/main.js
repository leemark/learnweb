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
     * Theme Management (Dark/Light Mode)
     */
    const ThemeManager = {
        STORAGE_KEY: 'learnweb_theme',

        /**
         * Get the current theme
         */
        getTheme: function() {
            // Check localStorage first
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                return stored;
            }

            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }

            return 'light';
        },

        /**
         * Set the theme
         */
        setTheme: function(theme) {
            // Update HTML attribute
            document.documentElement.setAttribute('data-theme', theme);

            // Save to localStorage
            localStorage.setItem(this.STORAGE_KEY, theme);

            // Update toggle button
            this.updateToggleButton(theme);
        },

        /**
         * Toggle between light and dark themes
         */
        toggle: function() {
            const currentTheme = this.getTheme();
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        },

        /**
         * Update the toggle button icon and aria-label
         * Button shows what you'll switch TO, not current state
         */
        updateToggleButton: function(theme) {
            const toggleBtn = document.querySelector('.theme-toggle');
            const themeIcon = document.querySelector('.theme-icon');
            if (!toggleBtn || !themeIcon) return;

            if (theme === 'dark') {
                // Currently dark, show light mode option
                themeIcon.textContent = 'light_mode';
                toggleBtn.setAttribute('aria-label', 'Switch to light mode');
                toggleBtn.setAttribute('title', 'Switch to light mode');
            } else {
                // Currently light, show dark mode option
                themeIcon.textContent = 'dark_mode';
                toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
                toggleBtn.setAttribute('title', 'Switch to dark mode');
            }
        },

        /**
         * Initialize theme system
         */
        init: function() {
            // Set initial theme
            const theme = this.getTheme();
            this.setTheme(theme);

            // Add click listener to toggle button
            const toggleBtn = document.querySelector('.theme-toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => {
                    this.toggle();
                });
            }

            // Listen for system theme changes
            if (window.matchMedia) {
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                    // Only auto-switch if user hasn't manually set a preference
                    if (!localStorage.getItem(this.STORAGE_KEY)) {
                        this.setTheme(e.matches ? 'dark' : 'light');
                    }
                });
            }
        }
    };

    /**
     * Mobile Menu Management (Hamburger Menu)
     */
    const MobileMenu = {
        /**
         * Initialize mobile menu system
         */
        init: function() {
            const toggleBtn = document.querySelector('.mobile-menu-toggle');
            const menuList = document.querySelector('.nav-list');
            const menuIcon = document.querySelector('.menu-icon');

            if (!toggleBtn || !menuList) return;

            // Toggle menu on button click
            toggleBtn.addEventListener('click', () => {
                this.toggle();
            });

            // Close menu when clicking a link
            const menuLinks = menuList.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.close();
                });
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen()) {
                    this.close();
                    toggleBtn.focus();
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isOpen() &&
                    !toggleBtn.contains(e.target) &&
                    !menuList.contains(e.target)) {
                    this.close();
                }
            });

            // Close menu and reset on window resize to desktop size
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && this.isOpen()) {
                    this.close();
                }
            });
        },

        /**
         * Check if menu is open
         */
        isOpen: function() {
            const menuList = document.querySelector('.nav-list');
            return menuList && menuList.classList.contains('is-open');
        },

        /**
         * Toggle menu open/close
         */
        toggle: function() {
            if (this.isOpen()) {
                this.close();
            } else {
                this.open();
            }
        },

        /**
         * Open the menu
         */
        open: function() {
            const toggleBtn = document.querySelector('.mobile-menu-toggle');
            const menuList = document.querySelector('.nav-list');
            const menuIcon = document.querySelector('.menu-icon');

            if (!toggleBtn || !menuList || !menuIcon) return;

            menuList.classList.add('is-open');
            toggleBtn.setAttribute('aria-expanded', 'true');
            menuIcon.textContent = 'close';
        },

        /**
         * Close the menu
         */
        close: function() {
            const toggleBtn = document.querySelector('.mobile-menu-toggle');
            const menuList = document.querySelector('.nav-list');
            const menuIcon = document.querySelector('.menu-icon');

            if (!toggleBtn || !menuList || !menuIcon) return;

            menuList.classList.remove('is-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            menuIcon.textContent = 'menu';
        }
    };

    /**
     * Calculate Read Time for articles
     */
    function calculateReadTime() {
        // Find all elements with data-read-time attribute
        const readTimeElements = document.querySelectorAll('[data-read-time]');

        readTimeElements.forEach(element => {
            // Find the article body content
            const articleBody = document.querySelector('.article-body, .lesson-content');
            if (!articleBody) return;

            // Get text content and count words
            const text = articleBody.textContent || articleBody.innerText;
            const wordCount = text.trim().split(/\s+/).length;

            // Calculate reading time (average 200 words per minute)
            const wordsPerMinute = 200;
            const readingTime = Math.ceil(wordCount / wordsPerMinute);

            // Update the read time text
            const readTimeText = element.querySelector('.read-time-text');
            if (readTimeText) {
                readTimeText.textContent = `${readingTime} min read`;
            }
        });
    }

    /**
     * Apply course-specific colors dynamically
     * Updates CSS custom properties based on data-course-id attribute
     */
    function applyCourseColors() {
        // Check for course ID on lesson content or container
        const courseElement = document.querySelector('[data-course-id]');

        if (!courseElement) return;

        const courseId = courseElement.dataset.courseId;

        if (!courseId) return;

        // Map course ID to CSS variable prefix
        const courseColorMap = {
            'ux': 'ux',
            'accessibility': 'accessibility',
            'seo': 'seo',
            'ai': 'ai'
        };

        const colorPrefix = courseColorMap[courseId];

        if (!colorPrefix) return;

        // Update root CSS custom properties to use course-specific colors
        document.documentElement.style.setProperty('--brand-primary', `var(--course-${colorPrefix}-primary)`);
        document.documentElement.style.setProperty('--brand-primary-dark', `var(--course-${colorPrefix}-dark)`);
        document.documentElement.style.setProperty('--brand-primary-light', `var(--course-${colorPrefix}-light)`);
    }

    /**
     * Initialize all functionality when DOM is ready
     */
    function init() {
        ThemeManager.init();
        MobileMenu.init();
        applyCourseColors();
        updateNavigation();
        initSmoothScroll();
        initExternalLinks();
        initKeyboardNav();
        initAccessibilityStyles();
        initProgressTracking();
        calculateReadTime();
    }

    // Run initialization when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for use in course pages
    window.LearnWeb = {
        CourseProgress: CourseProgress,
        ThemeManager: ThemeManager,
        MobileMenu: MobileMenu
    };

})();
