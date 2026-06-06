## ePlant — Phase 1: Storefront frontend

You're keeping your MERN backend separate. This project will be the **React frontend only**, using the existing TanStack Start template (TanStack Router stands in for React Router) and Tailwind. All product/cart/auth data is mocked in-memory so the UI is fully clickable and ready to wire to your Express/Mongo API later via an `axios` service layer.

### Design system (locked from chosen direction)
- Colors: `--leaf #1A3A32`, `--clay #D48166`, `--mist #F7F5F2`, `--ink #1C1C1C`, plus white. Added to `src/styles.css` as oklch tokens.
- Fonts: Playfair Display (serif headings, with italic) + Inter (sans body), loaded via `<link>` in `__root.tsx`.
- Tone: editorial, hero-image-led, clay accent for promos/badges, sticky translucent nav.

### Routes (file-based in `src/routes/`)
- `/` — Home: hero, category grid, best sellers, "why choose us" trust band, testimonials, newsletter (leaf section), footer
- `/shop` — product grid + left filter sidebar (category, price range, light level, indoor/outdoor, in-stock), sort dropdown, search input, pagination
- `/product/$slug` — image gallery w/ zoom-on-hover, description, rating stars, qty selector, Add to cart, Add to wishlist, related products
- `/cart` — line items (qty +/-, remove), coupon field, summary, "Proceed to checkout"
- `/checkout` — shipping form, address summary, payment method radio (Stripe / COD, UI only, disabled submit with "coming soon"), order summary
- `/auth/login`, `/auth/register`, `/auth/forgot-password` — forms (UI only, mock submit)
- `/account` — tabs: Orders, Wishlist, Profile, Addresses (mock data)
- Shared `__root.tsx` adds Navbar + Footer around `<Outlet />`

### State (frontend-only, ready to swap for API)
- `CartContext` — items, add/remove/update/clear, persisted to `localStorage`
- `WishlistContext` — same shape, `localStorage`
- `AuthContext` — mock user, login/logout no-ops (placeholder for JWT later)
- `src/services/api.ts` — axios instance with `VITE_API_URL` base; `src/services/products.ts`, `cart.ts`, `auth.ts` export functions that currently return mock data from `src/data/products.ts`. Swapping to your Express API later = flip the function bodies.

### Components
- `Navbar`, `Footer`, `ProductCard`, `CategoryCard`, `FilterSidebar`, `QuantityStepper`, `RatingStars`, `Testimonial`, `NewsletterSection`, `EmptyState`, `Skeleton` loaders, `Toast` (sonner already in shadcn)
- shadcn primitives reused: button, input, select, sheet (mobile filters), dialog, dropdown-menu, badge, separator, tabs

### Imagery
Generate ~8 plant images (hero monstera, 4 category, fiddle leaf fig, calathea, bird of paradise, snake plant) via `imagegen`, save to `src/assets/`.

### Out of scope (later phases)
- Express/Node API, MongoDB models, JWT
- Stripe checkout, Cloudinary uploads, Nodemailer
- Admin dashboard
- Blog, AI recs, care guide pages (links present, pages stub "Coming soon")

### Hand-off notes for your MERN backend
- `src/services/*` is the single integration seam; each function has a TODO comment with the expected REST shape (`GET /api/products`, etc.)
- Auth context exposes `token` so you can drop it into the axios `Authorization` header once JWT is live
- Env: add `VITE_API_URL` to `.env`

Approve and I'll build it out.