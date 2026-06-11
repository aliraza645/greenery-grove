# Backend integration — verification checklist

The React storefront and admin panel now call the Express/Mongo API in
`server/` for every REST endpoint. When the API is unreachable, services
silently fall back to local seed data so the preview keeps rendering — so
to actually verify the wiring you must start the API and confirm the
network calls succeed.

## 1. Start the stack

```bash
# terminal 1 — MongoDB (any local mongod / Docker / Atlas URI works)

# terminal 2 — API
cd server
cp .env.example .env          # set MONGO_URI + JWT_SECRET
npm install
npm run seed                  # creates admin@eplant.dev / admin123 + 9 products
npm run dev                   # http://localhost:5000

# terminal 3 — frontend
cp .env.example .env          # sets VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

If your dev server is on a different port than `5173` / `8080`, add it to
`server/.env`'s `CLIENT_ORIGIN`.

## 2. Endpoint-by-endpoint verification

Open DevTools → Network, filter on `/api`. Every row below is a single
endpoint you can exercise from the UI.

### Auth — `/api/auth`
| Action in UI | Hits |
| --- | --- |
| `/auth/register` form submit | `POST /auth/register` |
| `/auth/login` form submit | `POST /auth/login` |
| `/auth/forgot-password` submit | `POST /auth/forgot-password` |
| Any page load while signed in | `GET /auth/me` (revalidates session) |
| Account → Sign out | clears local token (no request) |

### Products — `/api/products`
| Action in UI | Hits |
| --- | --- |
| Visit `/` or `/shop` | `GET /products?limit=100` |
| Open `/product/:slug` | `GET /products/:slug` |
| Admin → Products → "New product" → Save | `POST /products` (admin token) |
| Admin → Products → edit row → Save | `PUT /products/:id` |
| Admin → Products → trash icon | `DELETE /products/:id` |

### Orders — `/api/orders`
| Action in UI | Hits |
| --- | --- |
| Sign in, add to bag, complete checkout | `POST /orders` |
| Account → Orders tab | `GET /orders/mine` |
| Admin → Orders | `GET /orders` |
| Admin → Orders → change status dropdown | `PUT /orders/:id/status` |

### Users — `/api/users`
| Action in UI | Hits |
| --- | --- |
| Sign in as admin → Admin → Customers | `GET /users` |

### Cart — `/api/cart`
The cart endpoints are intentionally *not* called by the storefront on
every click — the cart lives in `localStorage` for a snappy UX. You can
verify the server endpoints directly with curl, or hook in the helpers in
`src/services/cart.ts` (`addServerCart` / `updateServerCart` / etc.) where
your product flow needs server-side persistence.

```bash
TOKEN=...  # paste from /api/auth/login response
PID=...    # _id of a real product

curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/cart
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"productId\":\"$PID\",\"quantity\":2}" http://localhost:5000/api/cart
curl -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"quantity":5}' http://localhost:5000/api/cart/$PID
curl -X DELETE -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/cart/$PID
curl -X DELETE -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/cart
```

## 3. Notes

- **Seed-id collision.** If you load the storefront with no API running and
  add items to the bag, the cart contains local seed ids (`"1"`, `"2"`,
  …). Those will be rejected by `POST /orders` because they're not Mongo
  ObjectIds. Clear the bag and re-shop once the API is up to get real ids.
- **Admin gate.** Admin pages render for any signed-in user, but the API
  requires `role: "admin"`. Sign in with `admin@eplant.dev / admin123`
  after seeding.
- **CORS.** If you get a CORS error, add your frontend origin to
  `CLIENT_ORIGIN` in `server/.env` and restart the API.
