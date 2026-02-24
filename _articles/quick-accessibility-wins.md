---
title: "7 Quick Accessibility Wins for Your Website"
description: "Improve your site's accessibility with these simple, high-impact changes you can implement today"
date: 2024-11-07
topic: "accessibility"
tags: [accessibility]
author: "Mark Lee"
readTime: "5 min"
---

Making your website accessible doesn't require a complete redesign. These seven quick wins can significantly improve accessibility for users with disabilities—and many of them also improve the experience for everyone.

## 1. Add Alt Text to All Images

**Why it matters:** Screen reader users can't see images. Alt text describes what's in the image.

**How to do it:**

```html
<!-- Bad: No alt text -->
<img src="product.jpg">

<!-- Good: Descriptive alt text -->
<img src="product.jpg" alt="Red wireless headphones with noise cancellation">

<!-- Decorative images: Empty alt -->
<img src="divider.png" alt="" role="presentation">
```

**Quick tips:**
- Describe what the image shows, not what it is
- For decorative images, use `alt=""` (empty, not missing)
- Don't start with "Image of..." or "Picture of..."
- Keep it under 125 characters when possible

**Time to implement:** 5-10 minutes per page

## 2. Ensure Sufficient Color Contrast

**Why it matters:** Low-vision users and people with color blindness struggle with low-contrast text.

**WCAG AA Requirements:**
- Normal text: At least 4.5:1 contrast ratio
- Large text (18pt+ or 14pt+ bold): At least 3:1

**How to check:**
- **Chrome DevTools**: click any text element → open the Accessibility panel (in the Elements sidebar) → look for "Contrast" — it shows the ratio with a pass/fail badge for both AA and AAA standards. No extra tools needed.
- Online tools: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/), [Colorable](https://colorable.jxnblk.com)
- Browser extensions: "Accessibility Insights" (Microsoft) or "axe DevTools" (Deque)

**Quick fixes:**
- Darken light gray text on white backgrounds
- Use dark text on light backgrounds, or vice versa
- Avoid gray text smaller than 18pt
- Test link colors against their backgrounds

**Time to implement:** 10-15 minutes

## 3. Make Your Site Keyboard-Navigable

**Why it matters:** Many users navigate without a mouse—keyboard users, screen reader users, and people with motor disabilities.

**What to test:**
1. Can you reach everything with Tab key?
2. Can you see where focus is (visible focus indicator)?
3. Can you activate buttons/links with Enter/Space?
4. Can you escape modals and menus with Esc?

**Quick fixes:**

```css
/* Don't remove focus outlines without replacing them! */
/* Bad */
* { outline: none; }

/* Good - enhanced focus indicator */
a:focus, button:focus {
  outline: 3px solid #4A90E2;
  outline-offset: 2px;
}

/* Even better - use :focus-visible for modern browsers */
a:focus-visible, button:focus-visible {
  outline: 3px solid #4A90E2;
  outline-offset: 2px;
}
```

**Common issues:**
- Dropdown menus that only open on hover
- Modals you can't escape from
- Skip navigation links missing
- Tab order that doesn't follow visual order

**Time to implement:** 15-30 minutes

## 4. Use Semantic HTML Elements

**Why it matters:** Screen reader users don't scroll visually — they navigate by landmarks, headings, and element types. A screen reader can jump directly to the next `<h2>` on a page, skip to `<main>` content, or list all `<nav>` regions — but only if you use real semantic elements. A `<div class="header">` is invisible to this navigation system; a `<header>` is not. Semantic HTML is the single highest-leverage accessibility change for a non-semantic codebase.

**Quick wins:**

```html
<!-- Bad: Divs for everything -->
<div class="header">...</div>
<div class="nav">...</div>
<div class="main">...</div>

<!-- Good: Semantic HTML -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<footer>...</footer>

<!-- Bad: Div button -->
<div onclick="submit()" class="button">Submit</div>

<!-- Good: Real button -->
<button type="submit">Submit</button>

<!-- Bad: No heading structure -->
<p class="big-text">Section Title</p>

<!-- Good: Proper headings -->
<h2>Section Title</h2>
```

**Use semantic elements:**
- `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
- `<article>`, `<section>`
- `<button>` for buttons, `<a>` for links
- `<h1>` through `<h6>` for headings (don't skip levels)

**Time to implement:** 20-40 minutes

## 5. Add ARIA Labels Where Needed

**Why it matters:** Some elements need extra context for screen readers.

**Common cases:**

```html
<!-- Icon-only buttons need labels -->
<button aria-label="Close dialog">
  <svg>...</svg>
</button>

<!-- Search inputs -->
<label for="search">Search</label>
<input id="search" type="search" aria-label="Search articles">

<!-- Link purpose not clear from text -->
<a href="/learn-more" aria-label="Learn more about our pricing plans">
  Learn More
</a>

<!-- Current page in navigation -->
<nav>
  <a href="/">Home</a>
  <a href="/about" aria-current="page">About</a>
  <a href="/contact">Contact</a>
</nav>

<!-- Form validation -->
<input
  type="email"
  required
  aria-invalid="true"
  aria-describedby="email-error"
>
<span id="email-error">Please enter a valid email</span>
```

> **Prefer native HTML over ARIA when a native equivalent exists.** For example, use the `required` attribute instead of `aria-required="true"` — they convey the same information to assistive technology, but `required` also triggers built-in browser validation. For invalid state, combine `:invalid` CSS with `aria-invalid` (set via JavaScript after the user attempts to submit) and always point to a visible error message with `aria-describedby`. The rule of thumb: if HTML can express it, use HTML.

**Time to implement:** 10-20 minutes

## 6. Ensure Forms Are Accessible

**Why it matters:** Inaccessible forms prevent users from signing up, making purchases, or contacting you.

**Quick checklist:**

```html
<!-- Always use labels -->
<label for="email">Email Address</label>
<input id="email" type="email" required>

<!-- Group related fields -->
<fieldset>
  <legend>Shipping Address</legend>
  <!-- form fields -->
</fieldset>

<!-- Provide helpful error messages -->
<input
  id="password"
  type="password"
  aria-describedby="password-requirements"
  aria-invalid="false"
>
<div id="password-requirements">
  Password must be at least 8 characters with one number
</div>

<!-- Mark required fields -->
<label for="name">
  Name <span aria-label="required">*</span>
</label>
<input id="name" required>
```

**Key points:**
- Every input needs a `<label>` (or `aria-label`)
- Use `type="email"`, `type="tel"`, etc. for appropriate keyboards
- Show password requirements before user types, not after
- Provide clear error messages near the field
- Don't rely solely on placeholder text

**Time to implement:** 15-25 minutes per form

## 7. Test with an Actual Screen Reader

**Why it matters:** You can't know how screen readers experience your site without using one.

**Free screen readers:**
- **NVDA** (Windows) - Free, popular
- **JAWS** (Windows) - Industry standard (free demo)
- **VoiceOver** (Mac/iOS) - Built into Apple devices
- **TalkBack** (Android) - Built into Android

**Quick test:**
1. Turn on screen reader
2. Navigate your site without looking at the screen
3. Can you understand the content?
4. Can you complete key tasks (sign up, purchase, etc.)?
5. Does the reading order make sense?

**Common issues you'll find:**
- Images without alt text (announced as "image")
- Vague link text ("Click here" instead of descriptive text)
- Poor heading structure
- Form inputs without labels
- Content not in logical reading order

**Time to implement:** 30-60 minutes for testing + fixes

## Bonus: Use Skip Navigation Links

**Why it matters:** Keyboard users shouldn't have to tab through your entire navigation on every page.

**Implementation:**

```html
<body>
  <!-- Skip link (hidden until focused) -->
  <a href="#main-content" class="skip-link">
    Skip to main content
  </a>

  <header>
    <nav>...</nav>
  </header>

  <main id="main-content">
    <!-- Page content -->
  </main>
</body>

<style>
/* Hide skip link until focused */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
</style>
```

**Time to implement:** 5 minutes

## Quick Wins Summary

| Fix | Impact | Time | Difficulty |
|-----|--------|------|------------|
| Alt text | High | 5-10 min | Easy |
| Color contrast | High | 10-15 min | Easy |
| Keyboard navigation | High | 15-30 min | Medium |
| Semantic HTML | Medium | 20-40 min | Easy |
| ARIA labels | Medium | 10-20 min | Easy |
| Accessible forms | High | 15-25 min | Medium |
| Screen reader testing | High | 30-60 min | Medium |

## The Bottom Line

You don't need to fix everything at once. Start with these seven quick wins, and you'll make your site significantly more accessible for millions of users with disabilities.

Even better: These improvements often help **everyone**, not just users with disabilities. Better contrast helps people in bright sunlight. Keyboard navigation helps power users. Clear form labels reduce errors for all users.

**Next step:** Pick one item from this list and implement it today. Then come back and tackle the next one. Progress over perfection.

**Want to learn more?** Check out our comprehensive [Web Accessibility Guide](/accessibility) for in-depth coverage of WCAG 2.2 guidelines.
