/**
 * LearnWeb - Main JavaScript
 * Vanilla JavaScript for enhanced interactivity and accessibility
 */

(function () {
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
            link.addEventListener('click', function (e) {
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
        document.addEventListener('keydown', function (e) {
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
        get: function (courseId, lessonId) {
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

        set: function (courseId, lessonId) {
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

        unset: function (courseId, lessonId) {
            const key = `learnweb_progress_${courseId}`;
            const existing = localStorage.getItem(key);

            if (!existing) return;

            try {
                const progress = JSON.parse(existing);
                progress.lessons = progress.lessons.filter(id => id !== lessonId);
                localStorage.setItem(key, JSON.stringify(progress));
            } catch (e) {
                // Ignore errors
            }
        },

        getAll: function (courseId) {
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

                window.addEventListener('scroll', function () {
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
        getTheme: function () {
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
        setTheme: function (theme) {
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
        toggle: function () {
            const currentTheme = this.getTheme();
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        },

        /**
         * Update the toggle button icon and aria-label
         * Button shows what you'll switch TO, not current state
         */
        updateToggleButton: function (theme) {
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
        init: function () {
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
        init: function () {
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
        isOpen: function () {
            const menuList = document.querySelector('.nav-list');
            return menuList && menuList.classList.contains('is-open');
        },

        /**
         * Toggle menu open/close
         */
        toggle: function () {
            if (this.isOpen()) {
                this.close();
            } else {
                this.open();
            }
        },

        /**
         * Open the menu
         */
        open: function () {
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
        close: function () {
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
     * Lesson Table of Contents Toggle (Mobile)
     */
    const LessonTOC = {
        /**
         * Initialize lesson TOC system
         */
        init: function () {
            const toggleBtn = document.querySelector('.lesson-toc-toggle');
            const tocList = document.querySelector('.lesson-toc-list');

            if (!toggleBtn || !tocList) return;

            // Toggle TOC on button click
            toggleBtn.addEventListener('click', () => {
                this.toggle();
            });

            // Close TOC on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen()) {
                    this.close();
                    toggleBtn.focus();
                }
            });

            // On desktop, always keep TOC open
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    // Remove mobile-specific classes on desktop
                    tocList.classList.remove('is-open');
                    toggleBtn.setAttribute('aria-expanded', 'false');
                }
            });
        },

        /**
         * Check if TOC is open
         */
        isOpen: function () {
            const tocList = document.querySelector('.lesson-toc-list');
            return tocList && tocList.classList.contains('is-open');
        },

        /**
         * Toggle TOC open/close
         */
        toggle: function () {
            if (this.isOpen()) {
                this.close();
            } else {
                this.open();
            }
        },

        /**
         * Open the TOC
         */
        open: function () {
            const toggleBtn = document.querySelector('.lesson-toc-toggle');
            const tocList = document.querySelector('.lesson-toc-list');

            if (!toggleBtn || !tocList) return;

            tocList.classList.add('is-open');
            toggleBtn.setAttribute('aria-expanded', 'true');
        },

        /**
         * Close the TOC
         */
        close: function () {
            const toggleBtn = document.querySelector('.lesson-toc-toggle');
            const tocList = document.querySelector('.lesson-toc-list');

            if (!toggleBtn || !tocList) return;

            tocList.classList.remove('is-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
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
        document.documentElement.style.setProperty('--color-accent', `var(--course-${colorPrefix}-primary)`);
        document.documentElement.style.setProperty('--color-accent-hover', `var(--course-${colorPrefix}-primary)`);
    }

    /**
     * Reading Progress Bar (top of page)
     */
    function initReadingProgress() {
        const lessonContent = document.querySelector('.lesson-content');
        if (!lessonContent) return;

        // Create progress bar elements
        const progressContainer = document.createElement('div');
        progressContainer.className = 'reading-progress';
        progressContainer.setAttribute('role', 'progressbar');
        progressContainer.setAttribute('aria-label', 'Reading progress');
        progressContainer.setAttribute('aria-valuemin', '0');
        progressContainer.setAttribute('aria-valuemax', '100');

        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-bar';
        progressContainer.appendChild(progressBar);

        document.body.appendChild(progressContainer);

        // Update progress on scroll
        function updateProgress() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;

            progressBar.style.width = Math.min(progress, 100) + '%';
            progressContainer.setAttribute('aria-valuenow', Math.min(Math.round(progress), 100));
        }

        window.addEventListener('scroll', updateProgress);
        updateProgress();
    }

    /**
     * Back to Top Button
     */
    function initBackToTop() {
        // Create button
        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.setAttribute('aria-label', 'Back to top');
        button.innerHTML = '<span class="material-symbols-outlined">arrow_upward</span>';

        document.body.appendChild(button);

        // Show/hide based on scroll position
        function toggleButton() {
            if (window.scrollY > 300) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', toggleButton);
        toggleButton();

        // Scroll to top on click
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Mark as Complete Functionality
     */
    function initMarkComplete() {
        const lessonContent = document.querySelector('.lesson-content');
        if (!lessonContent) return;

        const courseId = lessonContent.dataset.courseId;
        const lessonId = lessonContent.dataset.lessonId;

        if (!courseId || !lessonId) return;

        // Check if already completed
        const isComplete = CourseProgress.get(courseId, lessonId);

        // Find the checkbox elements
        const completionContainer = document.querySelector('.lesson-completion');
        const completionLabel = document.querySelector('.lesson-completion-label');

        if (!completionContainer || !completionLabel) return;

        // Set initial state
        if (isComplete) {
            completionContainer.classList.add('is-complete');
        }

        // Handle click
        completionLabel.addEventListener('click', () => {
            const wasComplete = completionContainer.classList.contains('is-complete');

            if (wasComplete) {
                // Unmark as complete
                completionContainer.classList.remove('is-complete');
                CourseProgress.unset(courseId, lessonId);
            } else {
                // Mark as complete
                completionContainer.classList.add('is-complete');
                CourseProgress.set(courseId, lessonId);

                // Show celebration
                showCompletionCelebration();
            }

            // Update UI
            updateCourseProgressUI(courseId);
        });
    }

    /**
     * Show Completion Celebration
     */
    function showCompletionCelebration() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'completion-overlay';

        // Create celebration modal
        const celebration = document.createElement('div');
        celebration.className = 'completion-celebration';
        celebration.innerHTML = `
            <div class="completion-celebration-icon">🎉</div>
            <h3>Lesson Complete!</h3>
            <p>Great job! You've completed this lesson.</p>
            <button class="btn">Continue Learning</button>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(celebration);

        // Show with animation
        setTimeout(() => {
            overlay.classList.add('show');
            celebration.classList.add('show');
        }, 10);

        // Close on button click or overlay click
        function close() {
            overlay.classList.remove('show');
            celebration.classList.remove('show');

            setTimeout(() => {
                overlay.remove();
                celebration.remove();
            }, 300);
        }

        celebration.querySelector('.btn').addEventListener('click', close);
        overlay.addEventListener('click', close);

        // Auto-close after 3 seconds
        setTimeout(close, 3000);
    }

    /**
     * Update Course Progress UI
     */
    function updateCourseProgressUI(courseId) {
        if (!courseId) return;

        // Update progress bars
        const progressBars = document.querySelectorAll(`[data-course="${courseId}"] .progress-bar`);
        const progressTexts = document.querySelectorAll(`[data-course="${courseId}"] .progress-text`);

        // Get all lesson elements (TOC items or list items)
        // Matches both sidebar TOC (.lesson-toc-item) and home page list items (li[data-lesson-id])
        const lessonElements = document.querySelectorAll(`[data-course="${courseId}"] [data-lesson-id]`);
        const totalLessons = lessonElements.length;

        if (totalLessons === 0) return;

        const completedLessons = CourseProgress.getAll(courseId);

        // Calculate percentage
        const percentage = Math.round((completedLessons.length / totalLessons) * 100);

        progressBars.forEach(bar => {
            bar.style.width = percentage + '%';
            bar.setAttribute('aria-valuenow', percentage);
        });

        progressTexts.forEach(text => {
            text.textContent = `${completedLessons.length} of ${totalLessons} completed`;
        });

        // Update checkmarks
        lessonElements.forEach(element => {
            const lessonId = element.dataset.lessonId;
            const isComplete = completedLessons.includes(lessonId);
            const checkmark = element.querySelector('.lesson-complete');

            if (isComplete) {
                if (!checkmark) {
                    const newCheckmark = document.createElement('span');
                    newCheckmark.className = 'lesson-complete';
                    newCheckmark.innerHTML = '<span class="material-symbols-outlined">check</span>';
                    element.appendChild(newCheckmark);
                    element.classList.add('is-complete');
                }
            } else {
                if (checkmark) {
                    checkmark.remove();
                    element.classList.remove('is-complete');
                }
            }
        });
    }

    /**
     * Initialize Course Progress UI on load
     */
    function initCourseProgressUI() {
        // Try to find course ID from container or other elements
        const courseElement = document.querySelector('[data-course-id], [data-course]');
        if (courseElement) {
            const courseId = courseElement.dataset.courseId || courseElement.dataset.course;
            updateCourseProgressUI(courseId);
        }
    }

    /**
     * Display Reading Time Estimates
     */
    function displayReadingTime() {
        const lessonContent = document.querySelector('.lesson-content');
        if (!lessonContent) return;

        const lessonMeta = document.querySelector('.lesson-meta');
        if (!lessonMeta) return;

        // Get text content and count words
        const text = lessonContent.textContent || lessonContent.innerText;
        const wordCount = text.trim().split(/\s+/).length;

        // Calculate reading time (average 200 words per minute)
        const wordsPerMinute = 200;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);

        // Find or create reading time element
        let readingTimeEl = lessonMeta.querySelector('[data-reading-time]');

        if (!readingTimeEl) {
            readingTimeEl = document.createElement('div');
            readingTimeEl.className = 'lesson-meta-item';
            readingTimeEl.setAttribute('data-reading-time', '');
            readingTimeEl.innerHTML = `
                <span class="material-symbols-outlined">schedule</span>
                <span>${readingTime} min read</span>
            `;
            lessonMeta.appendChild(readingTimeEl);
        } else {
            readingTimeEl.querySelector('span:last-child').textContent = `${readingTime} min read`;
        }
    }

    /**
     * Initialize all functionality when DOM is ready
     */
    function init() {
        ThemeManager.init();
        MobileMenu.init();
        applyCourseColors();
        LessonTOC.init();
        updateNavigation();
        initSmoothScroll();
        initExternalLinks();
        initKeyboardNav();
        initAccessibilityStyles();
        initProgressTracking();
        calculateReadTime();

        // Phase 1 UX Features
        initReadingProgress();
        initBackToTop();
        initMarkComplete();
        initCourseProgressUI();
        displayReadingTime();
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
        MobileMenu: MobileMenu,
        LessonTOC: LessonTOC
    };

})();
