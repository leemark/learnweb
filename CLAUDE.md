# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LearnWeb is a static website hosting multiple web development courses (UX, Accessibility, SEO). It's designed for GitHub Pages deployment and uses only standards-compliant HTML, CSS, and vanilla JavaScript with strict WCAG AA compliance requirements.

## Architecture

### Design System

The entire site uses a centralized design system defined in `css/main.css` via CSS custom properties (`:root`):

- **Color palette**: All colors meet WCAG AA contrast ratios (4.5:1 for text, 3:1 for UI components)
- **Typography scale**: Responsive font sizing with system font stack
- **Spacing system**: Consistent spacing scale from `--spacing-xs` to `--spacing-3xl`
- **Layout**: Container-based layout with max-width of 1200px

### HTML Structure Pattern

All pages follow this semantic structure:

1. Skip link (accessibility)
2. `<header role="banner">` - Site/course title
3. `<nav role="navigation">` - Sticky navigation with aria-labels
4. `<main id="main-content" role="main">` - Primary content
5. `<footer role="contentinfo">` - Footer information

### JavaScript Architecture

`js/main.js` uses an IIFE pattern with these modules:

- **Navigation**: Auto-updates `aria-current` based on URL path
- **Smooth scroll**: Accessible anchor link handling
- **External links**: Auto-detects and marks external links
- **Course progress**: localStorage-based progress tracking via `window.LearnWeb.CourseProgress`
- **Accessibility enhancements**: Keyboard nav, focus management

### Course Structure

Each course lives in its own directory (`/ux/`, `/accessibility/`, `/seo/`):

- `index.html` - Course overview and lesson list
- `lesson-N.html` - Individual lessons with:
  - `data-course-id` and `data-lesson-id` attributes on `.lesson-content`
  - `.lesson-navigation` for prev/next links
  - Proper heading hierarchy (h2 → h3, never skip levels)

## Key Constraints

### Technology Stack

- **HTML only**: No templating engines, no build process
- **CSS only**: No preprocessors (Sass/Less), no PostCSS
- **Vanilla JS only**: No frameworks, no npm dependencies
- **GitHub Pages compatible**: Must work as static files

### Accessibility Requirements (WCAG AA)

All new content must include:

1. **Semantic HTML**: Proper elements (`<nav>`, `<main>`, `<article>`, etc.)
2. **ARIA labels**: `role` attributes and `aria-` attributes where needed
3. **Keyboard navigation**: All interactive elements accessible via keyboard
4. **Focus indicators**: Visible focus states (2px solid outline)
5. **Color contrast**: Minimum 4.5:1 for text, 3:1 for UI components
6. **Alternative text**: All images need descriptive `alt` attributes
7. **Heading hierarchy**: Logical order, no skipped levels
8. **Skip links**: `<a href="#main-content" class="skip-link">`

### Design Patterns

When adding new pages or courses:

1. **Copy existing templates**: Use `ux/lesson-1.html` as a base for lessons
2. **Reuse CSS classes**: Defined in `css/main.css` (`.course-card`, `.btn`, `.lesson-content`, etc.)
3. **Update navigation**: Ensure all pages include the main nav with correct `aria-current`
4. **Mobile-first**: Test responsive design at mobile breakpoints

## Common Tasks

### Adding a New Course

1. Create directory: `mkdir coursename/`
2. Copy structure from `/ux/` (index.html, lesson files)
3. Update navigation in all existing pages to include new course link
4. Update homepage (`index.html`) course grid with new course card

### Adding a New Lesson

1. Copy `ux/lesson-1.html` as template
2. Update `data-lesson-id` attribute
3. Update lesson navigation (prev/next links)
4. Add lesson link to course `index.html` in `.lesson-list`

### Testing Accessibility

Use these tools before committing:

- Browser DevTools Accessibility Inspector
- WAVE browser extension
- Lighthouse accessibility audit
- Manual keyboard navigation test (Tab, Shift+Tab, Enter, Escape)
- Screen reader test (NVDA/JAWS on Windows, VoiceOver on macOS)

### Deployment

```bash
# No build step needed - just commit and push
git add .
git commit -m "Update content"
git push origin main
```

GitHub Pages automatically deploys from the main branch root directory.

## File Organization

- **`/css/main.css`**: Single stylesheet - all styles go here, organized by sections
- **`/js/main.js`**: Single JavaScript file - all interactions here
- **`/assets/`**: Images and media files
- **`/.nojekyll`**: Required for GitHub Pages (prevents Jekyll processing)
- **Course directories** (`/ux/`, `/accessibility/`, `/seo/`): Self-contained course content

## Important Notes

- **No frameworks**: Do not add React, Vue, jQuery, or any JavaScript libraries
- **No build tools**: Do not add webpack, Vite, npm scripts, etc.
- **Preserve accessibility**: Never remove ARIA attributes, skip links, or focus indicators
- **Maintain consistency**: Use existing CSS classes rather than creating new ones
- **Test on mobile**: All designs must be responsive and mobile-friendly
