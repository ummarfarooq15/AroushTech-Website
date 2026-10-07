# Aroush Solutions Website

Responsive multi-page static website for Aroush Solutions, built with HTML5, CSS, and vanilla JavaScript. No framework, build step, or package installation is required.

## Pages

- `index.html` — Home
- `services.html` — Services overview
- `cloud.html`, `cybersecurity.html`, `automation.html`, `advisory.html` — Individual service pages
- `training.html` — Corporate training
- `courses.html` — Course catalog and listed prices
- `gallery.html` — Training gallery
- `case-studies.html` — Illustrative project scenarios
- `about.html` — About Aroush Solutions
- `insights.html` — Technology insights
- `contact.html` — Contact form
- `consultation.html` — Consultation request form

## Run locally

Open `index.html` in a browser, or serve this directory with any static web server. For example:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Interactions

- Responsive navigation with a mobile drawer
- Direct navigation between the home page, services overview, individual service pages, and company pages
- On the home page: interactive service tabs, persistent theme preference, and dismissible announcement
- Case study category filters and native FAQ accordions
- Required field and email validation on enquiry and consultation forms
- Form submission opens a prefilled email to `taj@aroushtech.in`

## Before publishing

The enquiry form currently uses the visitor's default email app (`mailto:`). It does not send or store enquiries on its own. Connect it to a form provider or a server endpoint to guarantee delivery and enable submission tracking. Course descriptions, listed prices, contact details, and company claims are based on the live site and should be reconfirmed before launch. The course page clearly labels listed prices as subject to confirmation. Case study cards are illustrative examples, not verified client results. Privacy and terms links currently open email requests; replace them with approved policy pages before launch.
