# Riverstone Academy Website

## Description

A multi-page, responsive website for **Riverstone Academy**, a fictional CBSE-affiliated day school (Pre-Primary to Senior Secondary) in Green Valley. It presents the school the way a real school site would, so parents and students can learn about academics, facilities, teachers, admissions (2026-27), events and news, and find the contact details in one place.

It is a front-end demo/template: all school names, people, dates, phone numbers and e-mail addresses are sample content.

## Features

- 10 linked pages: Home, About, Academics, Admissions, Facilities, Teachers, Events, Gallery, News and Contact
- Responsive layout with a hamburger menu on small screens
- Light / dark theme toggle
- Sticky header with scroll-spy highlighting of the current section
- Animated typing headline and "count-up" statistics
- Scroll-reveal animations (respects the visitor's "reduce motion" setting)
- Gallery with category filters and a lightbox (previous / next, keyboard navigation)
- Auto-playing testimonial slider with dots and touch swipe
- FAQ accordion
- Contact form and newsletter form with inline validation and a success message (demo only, see below)
- Back-to-top button and preloader
- SEO meta tags, Open Graph / Twitter cards and Schema.org data

## Technologies Used

- HTML5
- CSS3 (custom properties, Flexbox / Grid, separate files for core styles, animations and responsive rules)
- Vanilla JavaScript (no frameworks or build tools)
- [Google Fonts](https://fonts.google.com/) (Poppins), loaded online
- Sample photos loaded online from [Wikimedia Commons](https://commons.wikimedia.org/)
- SVG illustrations and favicon stored locally

## Project Structure

```text
school-website/
├── assets/
│   ├── icons/
│   │   └── favicon.svg
│   └── images/          (59 SVG illustrations: heroes, teachers, news, events, etc.)
├── css/
│   ├── style.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── counter.js
│   ├── gallery.js
│   ├── slider.js
│   └── form.js
├── index.html
├── about.html
├── academics.html
├── admissions.html
├── facilities.html
├── teachers.html
├── events.html
├── gallery.html
├── news.html
├── contact.html
├── README.md
└── .gitignore
```

## How to Run

No installation is needed.

1. Download or clone this repository.
2. Open the `school-website` folder in [VS Code](https://code.visualstudio.com/).
3. Open `index.html` in your browser (double-click it), **or** right-click it in VS Code and choose **Open with Live Server** if you have the Live Server extension.

An internet connection is needed for the Google Fonts and the Wikimedia sample photos.

## Usage

- Use the top menu to move between pages.
- Click the moon/sun button to switch between light and dark themes.
- On the Gallery page, pick a category and click a photo to open it in the lightbox.
- Try the contact form: it checks the fields and shows a confirmation message.

## Screenshots

_No screenshots added yet._

## Live Demo

Live Demo: Not deployed yet

## Future Improvements

- Connect the contact and newsletter forms to a real backend or form service so messages are actually delivered
- Replace placeholder `#` links (social media, policies, "Read more") with real pages
- Add real school content, photos and descriptive alt text
- Add a simple online admission enquiry/application flow
- Host the site (for example GitHub Pages) and update the placeholder URLs in the page `<head>`

## Author

Created by Arshdeep Singh