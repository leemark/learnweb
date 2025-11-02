# LearnWeb

A comprehensive collection of web development courses covering UX design, accessibility, and SEO. Built as a static website optimized for GitHub Pages.

## Features

- **Multiple Course Tracks**: Separate courses for UX, Accessibility, and SEO
- **WCAG AA Compliant**: All content meets accessibility standards
- **Modern Design System**: Clean, responsive design with CSS custom properties
- **Vanilla JavaScript**: No framework dependencies, lightweight and fast
- **GitHub Pages Ready**: Designed for easy hosting on GitHub Pages

## Project Structure

```
learnweb/
├── index.html              # Homepage with course listings
├── css/
│   └── main.css           # Main stylesheet with design system
├── js/
│   └── main.js            # Vanilla JavaScript for interactivity
├── ux/                    # UX Design course
│   ├── index.html
│   └── lesson-*.html
├── accessibility/         # Accessibility course
│   └── index.html
├── seo/                   # SEO course
│   └── index.html
└── assets/               # Images and other assets
```

## Technology Stack

- **HTML5**: Semantic, standards-compliant markup
- **CSS3**: Custom properties, Grid, Flexbox
- **Vanilla JavaScript**: No dependencies, modern ES6+
- **GitHub Pages**: Static site hosting

## Development

This is a static website - no build process required. Simply open the HTML files in a browser to view.

### Local Development

Open `index.html` in your browser, or use a simple HTTP server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server
```

Then visit `http://localhost:8000`

## Deployment to GitHub Pages

1. Push this repository to GitHub
2. Go to repository Settings > Pages
3. Set source to "main" branch, root directory
4. Save and wait for deployment

## Accessibility

All pages are designed to meet WCAG AA standards:

- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels where needed
- Keyboard navigation support
- Sufficient color contrast
- Skip links for screen readers
- Focus indicators
- Responsive text sizing

## License

This is an educational project. Feel free to use and adapt for your own learning purposes.
