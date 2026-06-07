# ePlant Backend (Node + Express + MongoDB)

REST API that powers the ePlant storefront and admin dashboard.

## Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT auth (access tokens, bcrypt password hashing)
- CORS, Helmet, Morgan

## Setup

```bash
cd server
cp .env.example .env       # fill MONGO_URI + JWT_SECRET
npm install
npm run seed               # optional — loads demo products + admin
npm run dev                # http://localhost:5000
```

Then in the frontend `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

The frontend service layer (`src/services/*`) is already shaped to call
these endpoints — flip the mock function bodies to real `api.get/post`
calls and you're live.

## Endpoints

### Auth — `/api/auth`
| Method | Path                 | Body                       | Auth |
| ------ | -------------------- | -------------------------- | ---- |
| POST   | `/register`          | `{ name, email, password }`| —    |
| POST   | `/login`             | `{ email, password }`      | —    |
| POST   | `/forgot-password`   | `{ email }`                | —    |
| GET    | `/me`                | —                          | user |

### Products — `/api/products`
| Method | Path                  | Auth   |
| ------ | --------------------- | ------ |
| GET    | `/`                   | —      |
| GET    | `/:slug`              | —      |
| POST   | `/`                   | admin  |
| PUT    | `/:id`                | admin  |
| DELETE | `/:id`                | admin  |

### Cart — `/api/cart`
| Method | Path           | Body                      | Auth |
| ------ | -------------- | ------------------------- | ---- |
| GET    | `/`            | —                         | user |
| POST   | `/`            | `{ productId, quantity }` | user |
| PUT    | `/:productId`  | `{ quantity }`            | user |
| DELETE | `/:productId`  | —                         | user |
| DELETE | `/`            | —                         | user |

### Orders — `/api/orders`
| Method | Path            | Body                        | Auth   |
| ------ | --------------- | --------------------------- | ------ |
| POST   | `/`             | `{ items, shipping, total }`| user   |
| GET    | `/mine`         | —                           | user   |
| GET    | `/`             | —                           | admin  |
| PUT    | `/:id/status`   | `{ status }`                | admin  |

### Users — `/api/users` (admin)
| Method | Path  |
| ------ | ----- |
| GET    | `/`   |

Demo admin (after `npm run seed`):  
`admin@eplant.dev` / `admin123`
