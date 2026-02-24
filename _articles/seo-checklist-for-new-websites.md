---
title: "Complete SEO Checklist for New Websites"
description: "Launch your website with solid SEO foundations using this comprehensive checklist"
date: 2024-11-06
topic: "seo"
tags: [seo]
author: "Mark Lee"
readTime: "8 min"
---

Launching a new website without proper SEO is like opening a store with no signage. This checklist ensures your site is discoverable, crawlable, and optimized for search engines from day one.

## Pre-Launch: Technical Foundation

### 1. Domain and Hosting

- [ ] Choose a memorable, brandable domain name
- [ ] Use HTTPS (SSL certificate installed)
- [ ] Select fast, reliable hosting
- [ ] Consider CDN for faster global delivery
- [ ] Set up domain to redirect www to non-www (or vice versa) consistently

### 2. Site Structure and Navigation

- [ ] Create logical URL structure (`/category/page` not `/page?id=123`)
- [ ] Keep important pages 3 clicks or fewer from homepage
- [ ] Implement breadcrumb navigation
- [ ] Create user-friendly 404 error page
- [ ] Ensure consistent navigation across all pages

### 3. Technical Setup

**Robots.txt**
- [ ] Create `/robots.txt` file
- [ ] Don't block important pages
- [ ] Block admin, search results, and private pages
- [ ] Include link to sitemap

**Canonical & Indexing Control**
- [ ] Add `<link rel="canonical">` to every page pointing to its preferred URL (prevents duplicate content from URL parameters, sorting, or pagination)
- [ ] Add `<meta name="robots" content="noindex, follow">` to pages you don't want indexed: thank-you pages, login/account pages, filtered or sorted product listing pages

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /search/

Sitemap: https://yoursite.com/sitemap.xml
```

**XML Sitemap**
- [ ] Generate XML sitemap
- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Keep under 50,000 URLs (split if larger)
- [ ] Update when you add/remove significant pages

**Site Speed**
- [ ] Optimize images (compress, use WebP format)
- [ ] Minify CSS and JavaScript
- [ ] Enable browser caching
- [ ] Use lazy loading for images
- [ ] Achieve LCP under 2.5 seconds
- [ ] Achieve CLS under 0.1
- [ ] Test with Google PageSpeed Insights

## On-Page SEO Essentials

### 4. Page-Level Optimization

**Every Page Needs:**

- [ ] Unique, descriptive title tag (50-60 characters)
- [ ] Compelling meta description (150-160 characters)
- [ ] One H1 heading per page (includes target keyword)
- [ ] Logical heading hierarchy (H1 → H2 → H3, don't skip levels)
- [ ] Clean, descriptive URLs
- [ ] Internal links to related pages
- [ ] Image alt text for all images

**Example of Good On-Page SEO:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Unique title with keyword -->
  <title>Best Running Shoes for Beginners 2024 | YourBrand</title>

  <!-- Compelling meta description -->
  <meta name="description" content="Find the perfect running shoes for beginners. Compare top-rated models, read expert reviews, and get 20% off your first order. Free shipping.">

  <!-- Open Graph for social media -->
  <meta property="og:title" content="Best Running Shoes for Beginners 2024">
  <meta property="og:description" content="Expert guide to choosing your first running shoes">
  <meta property="og:image" content="/images/running-shoes-guide.jpg">

  <!-- Canonical URL -->
  <link rel="canonical" href="https://yoursite.com/running-shoes-beginners">
</head>
<body>
  <!-- One H1 per page -->
  <h1>Best Running Shoes for Beginners in 2024</h1>

  <!-- Logical heading structure -->
  <h2>How to Choose Your First Running Shoes</h2>
  <h3>Consider Your Foot Type</h3>
  <h3>Determine Your Budget</h3>

  <h2>Top 5 Running Shoes for Beginners</h2>
  <!-- content -->
</body>
</html>
```

### 5. Content Quality

- [ ] Write comprehensive, original content (1,000+ words for main pages)
- [ ] Include target keyword naturally in:
  - [ ] Title tag
  - [ ] H1 heading
  - [ ] First 100 words
  - [ ] At least one H2
  - [ ] Image alt text
  - [ ] URL
- [ ] Use semantic keywords (synonyms, related terms)
- [ ] Write for humans first, search engines second
- [ ] Update publication date when you refresh content
- [ ] Cite sources and link to authoritative sites

### 6. Images

- [ ] Descriptive file names (`red-running-shoes.jpg` not `IMG_1234.jpg`)
- [ ] Alt text for all images (describe what you see)
- [ ] Compress images (aim for under 100KB each)
- [ ] Use WebP format when possible
- [ ] Implement lazy loading
- [ ] Include images in your sitemap

## Mobile Optimization

### 7. Mobile-Friendly Design

- [ ] Use responsive design (not separate mobile site)
- [ ] Test on multiple devices and screen sizes
- [ ] Ensure tap targets are at least 48x48 pixels
- [ ] Use readable font sizes (16px minimum for body text)
- [ ] Avoid intrusive interstitials (pop-ups that cover content)
- [ ] Test with Google Mobile-Friendly Test
- [ ] Check mobile usability in Search Console

## Local SEO (If Applicable)

### 8. Local Business Setup

- [ ] Create Google Business Profile
- [ ] Verify your business
- [ ] Add complete business information (hours, phone, address)
- [ ] Choose appropriate business categories
- [ ] Upload high-quality photos
- [ ] Encourage and respond to customer reviews
- [ ] Add location keywords to title tags and content
- [ ] Create location-specific pages for each location
- [ ] Include structured data (LocalBusiness schema)

## Schema Markup

### 9. Structured Data

Implement appropriate schema types:

- [ ] Organization schema (for your business)
- [ ] WebSite schema (for your site)
- [ ] Article schema (for blog posts)
- [ ] Product schema (for e-commerce)
- [ ] LocalBusiness schema (if applicable)
- [ ] FAQPage schema (for FAQ sections)
- [ ] BreadcrumbList schema (for breadcrumbs)
- [ ] Validate with Google's Rich Results Test

**Example Organization Schema:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company Name",
  "url": "https://yoursite.com",
  "logo": "https://yoursite.com/logo.png",
  "sameAs": [
    "https://facebook.com/yourcompany",
    "https://twitter.com/yourcompany",
    "https://linkedin.com/company/yourcompany"
  ]
}
</script>
```

## Search Console & Analytics

### 10. Monitoring Setup

**Google Search Console:**
- [ ] Add and verify your property
- [ ] Submit XML sitemap
- [ ] Check for crawl errors
- [ ] Monitor search performance
- [ ] Set up email alerts for issues

**Google Analytics (or alternative):**
- [ ] Install tracking code on all pages
- [ ] Set up conversion goals
- [ ] Create custom reports for organic traffic
- [ ] Link to Search Console
- [ ] Set up monthly reports

### 11. Competitor Analysis

- [ ] Identify top 5-10 competitors
- [ ] Analyze their keyword targets — use [Ahrefs Site Explorer](https://ahrefs.com/site-explorer) or the free [Ubersuggest](https://neilpatel.com/ubersuggest/): enter a competitor's domain, go to their "Top Pages" report, and filter results to keywords where KD is below your current domain authority. These are the realistic ranking opportunities.
- [ ] Review their backlink profiles
- [ ] Identify content gaps (topics they haven't covered)
- [ ] Study their site structure and navigation
- [ ] Note what works well and what doesn't

## Content Strategy

### 12. Keyword Research

- [ ] Identify 20-50 target keywords
- [ ] Focus on long-tail keywords for new sites
- [ ] Map keywords to specific pages
- [ ] Create content calendar
- [ ] Prioritize by search volume vs. competition
- [ ] Group keywords into topic clusters

### 13. Content Plan

- [ ] Create pillar page for main topic
- [ ] Plan cluster content (supporting articles)
- [ ] Set up internal linking strategy
- [ ] Schedule regular content publication (weekly/monthly)
- [ ] Plan content updates for existing pages

## Off-Page SEO

### 14. Backlinks

- [ ] Create high-quality, link-worthy content
- [ ] Submit to relevant online directories (if appropriate)
- [ ] Reach out to industry blogs for guest posting
- [ ] Build relationships with influencers in your niche
- [ ] Create shareable resources (infographics, tools, research)
- [ ] Monitor mentions of your brand (earn links from existing mentions)

### 15. Social Media

- [ ] Set up business profiles on relevant platforms
- [ ] Add social sharing buttons to content
- [ ] Share new content on social media
- [ ] Engage with your audience
- [ ] Include links to your site in profiles

## Post-Launch Monitoring

### 16. Weekly Tasks

- [ ] Check Google Search Console for errors
- [ ] Monitor site speed (PageSpeed Insights)
- [ ] Review new backlinks
- [ ] Check keyword rankings
- [ ] Respond to any reviews or comments

### 17. Monthly Tasks

- [ ] Review analytics (traffic, conversions, top pages)
- [ ] Update old content with new information
- [ ] Create and publish new content
- [ ] Check for broken links
- [ ] Review and improve low-performing pages
- [ ] Analyze competitor movements

## Red Flags to Avoid

**Never do these:**

- ❌ Keyword stuffing (using keywords unnaturally)
- ❌ Buying links or participating in link schemes
- ❌ Duplicating content from other sites
- ❌ Hiding text or links (white text on white background)
- ❌ Cloaking (showing different content to search engines vs. users)
- ❌ Creating doorway pages (low-quality pages targeting keywords)
- ❌ Using black hat tactics (they'll get you penalized)

## Priority Quick Wins

If you're short on time, focus on these high-impact items first:

1. **HTTPS** - Absolutely essential
2. **Mobile-friendly design** - Google uses mobile-first indexing
3. **Fast page speed** - Core Web Vitals matter
4. **Unique title tags and meta descriptions** - On all pages
5. **XML sitemap** - Submit to Search Console
6. **Google Business Profile** - If you're a local business
7. **Quality content** - At least 10 solid pages to start
8. **Internal linking** - Connect your pages logically

## 30-Day Launch Plan

The 30-day plan below covers the setup work that must happen before and immediately after launch. Organic traction from that work typically shows in **3–6 months** — search engines need time to crawl, index, and evaluate your site's authority relative to what's already ranking. Don't measure SEO success in weeks.

**Week 1: Technical Setup**
- Set up HTTPS, Search Console, Analytics
- Create XML sitemap and robots.txt
- Implement schema markup

**Week 2: On-Page Optimization**
- Optimize all title tags and meta descriptions
- Ensure proper heading hierarchy
- Add alt text to images
- Optimize site speed

**Week 3: Content & Mobile**
- Create or optimize 5-10 core pages
- Test mobile-friendliness
- Set up internal linking

**Week 4: Off-Page & Monitoring**
- Set up social profiles
- Reach out for initial backlinks
- Set up monitoring and reporting
- Create content calendar for next 3 months

## Tools to Help

**Free Tools:**
- Google Search Console
- Google Analytics
- Google PageSpeed Insights
- Google Mobile-Friendly Test
- Google Rich Results Test
- Bing Webmaster Tools

**Paid Tools (Optional):**
- Ahrefs (keyword research, backlinks, competitor analysis)
- SEMrush (comprehensive SEO toolkit)
- Moz Pro (keyword research, rank tracking)
- Screaming Frog (technical audits)

## The Bottom Line

SEO is a long-term investment. Don't expect immediate results—it typically takes 3-6 months to see meaningful traffic from search engines.

Focus on:
1. **Technical excellence** - Fast, secure, mobile-friendly
2. **Quality content** - Comprehensive, helpful, original
3. **User experience** - Easy to navigate, valuable to visitors

Get these fundamentals right at launch, and you'll build a solid foundation for long-term SEO success.

**Want to dive deeper?** Check out our comprehensive [SEO & GEO Guide](/seo) for advanced strategies and techniques.
