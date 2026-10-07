# AroushTech website

Responsive multi-page website for AroushTech, with an API-backed course catalog, enquiry forms, and newsletter subscriptions. The content is based on information published at [aroushtech.in](https://aroushtech.in/), including the public course catalog, company details, team, testimonials, contact information, and training gallery.

## Run locally

Requires Node.js 22.5 or newer. The backend uses Node’s built-in SQLite module and has no third-party runtime dependencies.

```sh
npm start
```

Open `http://localhost:3000`. The server creates `data/aroushtech.sqlite` on first launch and seeds the published course catalog. Keep the `data/` directory on a persistent disk in production so saved enquiries and subscribers survive restarts. Set `PORT` and optionally `DATABASE_PATH` to configure the server.

## Site features

- Search, category filters, and price sorting for the course catalog
- 20 courses seeded from the published catalog, with listed descriptions and fees
- Enquiry submission persisted to SQLite
- Newsletter signups persisted to SQLite with duplicate email protection
- Token-protected lead and subscriber lookup for site operators
- Click-to-expand gallery viewer for training photos
- Responsive navigation, mobile layouts, and saved light/dark theme preference
- Published company information, mentor profiles, testimonials, course FAQs, certificates, and training photos

## API

- `GET /api/health` — service status
- `GET /api/courses` — current course catalog
- `POST /api/enquiries` — save a course, training, or contact enquiry
- `POST /api/newsletter` — subscribe an email address
- `GET /api/admin/enquiries` — list the latest enquiries and subscribers (requires `Authorization: Bearer <ADMIN_TOKEN>`)

The contact address, phone number, office locations, and course fees are reproduced from the published website and should be reconfirmed before launch. Course prices can change. The enquiry and subscription data are stored locally in SQLite; connect an email delivery provider and publish an approved privacy notice before collecting production customer data.

For operator access, set `ADMIN_TOKEN` to a unique secret of at least 32 characters. For example, query the latest 50 records with `curl -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:3000/api/admin/enquiries`. Keep both the token and database file private.
