# 🚀 Ziddi Founder Website - Starter Template & Blueprint

Welcome to the **Ziddi Founder Website Template**! This is a high-performance, dark-theme, responsive web template designed for founder systems coaching, advisory services, diagnostic tools, and digital portfolios.

---

## 📁 Directory & File Architecture

```
ziddifounder-template/
├── index.html            # Main Landing Page Structure & Content
├── style.css             # Complete Cyber Dark Design System & Responsive Rules
├── main.js               # Interactive JS Engine (Mobile Nav, Modal, Quotes, Animations)
├── admin.html            # Admin Dashboard for Managing Leads & Razorpay Links
├── quotes.json           # Quotation Engine Data Source
├── episodes.json         # Spotify / Article Reader Data Source
├── images/               # Media & Gallery Poster Assets
│   └── quote-achievement.jpg
├── six-sigma-quiz/       # Interactive Diagnostic Quiz Application
│   ├── index.html
│   └── app.js
└── README.md             # Customization & Deployment Guide
```

---

## 🎨 Theme & Color System (`style.css`)

The design uses standard CSS Variables defined at the top of `style.css`:
- **Background Tint**: `var(--bg-ink)` (`#070B11`)
- **Primary Accent Amber**: `var(--accent-amber)` (`#F59E0B`)
- **Accent Glow**: `var(--accent-amber-glow)` (`rgba(245, 158, 11, 0.15)`)
- **Text Main**: `var(--text-main)` (`#F3F4F6`)
- **Text Muted**: `var(--text-muted)` (`#9CA3AF`)

### How to Change Primary Accent Color
To change the theme from Amber to Cyan, Emerald, or Purple, edit lines 10–25 in `style.css`:
```css
:root {
  --accent-amber: #38BDF8; /* Change to Cyan or any color */
  --accent-amber-glow: rgba(56, 189, 248, 0.15);
}
```

---

## ⚙️ Key Features Built-In

1. **Responsive Mobile Navigation Drawer**: Hamburger toggle menu with smooth glassmorphism drop-down.
2. **Interactive Quotes Engine**: Auto-rotating quotes slider with copy-to-clipboard functionality.
3. **Mindset Gallery Grid**: Responsive visual cards grid for posters and media.
4. **90-Min Advisory Modal & Paywall**: Pre-qualification questionnaire integrated with Razorpay redirect.
5. **Admin Dashboard (`admin.html`)**: Local lead tracking and payment URL manager.
6. **Bilingual Diagnostic Quiz (`six-sigma-quiz/`)**: Gamified assessment tool.

---

## 🛠️ How to Customize for a New Project

1. **Branding & Logo**: Open `index.html` and edit `.logo` text in `<header>`.
2. **Navigation Links**: Edit `<a>` items inside `#navLinks`.
3. **Hero & Headlines**: Update content inside `<section class="hero">`.
4. **Advisory / Booking Link**: In `main.js`, update `RAZORPAY_PAYMENT_URL` or configure it via `admin.html`.
5. **Publishing**: Upload all files to **GitHub Pages**, **Netlify**, **Vercel**, or any static web host!
