# 🚗 AutoHub — Car Dealership Inventory System

A full-stack car dealership inventory application built with a **test-driven** REST API and a modern, responsive **React single-page app**. Customers can browse, search and purchase vehicles; admins can manage the inventory (add, edit, delete and restock cars).

> Built as a TDD kata: the backend was developed test-first (Red → Green → Refactor), and every AI-assisted commit credits the AI as a co-author.

---

## ✨ Features

**Customers**
- Register / log in with secure JWT authentication
- Browse all available vehicles on a visual dashboard
- Search & filter by make, model, category and price range
- One-click purchase (button disabled when a car is out of stock)

**Admins**
- Everything customers can do, plus:
- Add new vehicles
- Edit vehicle details
- Delete vehicles
- Restock inventory

**Engineering**
- Test-driven development with 35 automated tests
- Role-based access control (user vs admin)
- Centralized error handling and input validation
- Clean, layered architecture (routes → controllers → models)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios, lucide-react |
| Backend | Node.js, Express (ESM) |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens (JWT) + bcrypt password hashing |
| Testing | Vitest, Supertest, mongodb-memory-server |

---

## 📸 Screenshots

> Add your own screenshots to `docs/screenshots/` and they will show up here.

| Landing page | Dashboard (browse & search) |
|---|---|
| ![Home](docs/screenshots/home.png) | ![Dashboard](docs/screenshots/dashboard.png) |

| Login | Admin management |
|---|---|
| ![Login](docs/screenshots/login.png) | ![Admin](docs/screenshots/admin.png) |

---

## 📁 Project Structure

```
car-dealership/
├── server/                     # Backend REST API
│   ├── app.js                  # Express app (routes + middleware) — importable by tests
│   ├── server.js               # Boot: connect DB + listen
│   ├── lib/db.js               # MongoDB connection
│   ├── models/                 # Mongoose schemas (User, Vehicle)
│   ├── controllers/            # Request handlers (auth, vehicle)
│   ├── routes/                 # Route definitions
│   ├── middleware/             # protect / adminOnly / error handling
│   ├── utils/token.js          # JWT helper
│   ├── scripts/seed.js         # Demo data seeder
│   └── tests/                  # Vitest + Supertest specs
└── client/                     # React single-page app
    └── src/
        ├── pages/              # Home, Login, Register, Dashboard
        ├── components/         # Navbar, VehicleCard, Filters, Modal, forms
        ├── context/            # AuthContext, ToastContext
        └── lib/api.js          # Axios instance
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (built and tested on Node 24)
- A **MongoDB** database — either a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local MongoDB server

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd car-dealership
```

### 2. Backend setup
```bash
cd server
npm install

# Create your environment file
cp .env.example .env
```

Edit `server/.env`:
```env
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net
PORT=5000
JWT_SECRET=replace-with-a-long-random-secret
```

Seed demo data (an admin, a customer, and 8 sample vehicles):
```bash
npm run seed
```

Start the API:
```bash
npm run dev      # http://localhost:5000
```

### 3. Frontend setup
Open a **second terminal**:
```bash
cd client
npm install
cp .env.example .env   # defaults to VITE_API_URL=/api (proxied to the backend)
npm run dev            # http://localhost:5173
```

Open **http://localhost:5173** and log in with a demo account below.

### 🔑 Demo accounts (created by the seed script)
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@dealership.com` | `admin123` |
| Customer | `user@dealership.com` | `user123` |

---

## 📡 API Endpoints

All `/api/vehicles` routes require a valid JWT (`Authorization: Bearer <token>`).

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in, receive a JWT |
| GET | `/api/vehicles` | User | List all vehicles |
| GET | `/api/vehicles/search` | User | Search by make, model, category, price range |
| POST | `/api/vehicles` | Admin | Add a vehicle |
| PUT | `/api/vehicles/:id` | Admin | Update a vehicle |
| DELETE | `/api/vehicles/:id` | Admin | Delete a vehicle |
| POST | `/api/vehicles/:id/purchase` | User | Purchase a vehicle (decreases stock) |
| POST | `/api/vehicles/:id/restock` | Admin | Restock a vehicle (increases stock) |

---

## 🧪 Testing

The backend follows **Test-Driven Development**. Tests use an in-memory MongoDB
(`mongodb-memory-server`) so they run in isolation without touching your real
database.

```bash
cd server
npm test               # run all tests once
npm run test:watch     # watch mode
npm run test:coverage  # with a coverage report
```

### ✅ Test Report

```
 Test Files  5 passed (5)
      Tests  35 passed (35)

 % Coverage report from v8
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   82.73 |    82.35 |   94.11 |   82.57 |
 controllers       |   81.98 |    80.28 |     100 |   80.95 |
 middleware        |   83.33 |      100 |      75 |   83.33 |
 models            |   87.50 |    50.00 |     100 |     100 |
-------------------|---------|----------|---------|---------|
```

**Coverage by feature:** authentication (register/login, hashing, validation),
vehicle CRUD (with role rules), search/filtering, and inventory
(purchase/restock with stock guards).

---

## 🔴🟢 TDD Approach

Each backend feature was built test-first, which is visible in the commit history:

1. **Red** — write a failing test that describes the desired behaviour.
2. **Green** — write the minimum code to make it pass.
3. **Refactor** — clean up while keeping tests green.

For example: the auth specs were committed first (all failing), then the
register/login implementation was added to turn them green.

---

## 🤖 My AI Usage

I used **Claude (Anthropic)** — specifically **Claude Code** (the CLI agent, running Claude Opus) — as my AI pair-programmer throughout this project. I was transparent about it: **every AI-assisted commit adds Claude as a `Co-authored-by` trailer.**

**How I used it:**
- **Planning & architecture** — I described the kata requirements and asked Claude to propose a clean, testable project structure (splitting the Express `app` from the server bootstrap so it could be imported by tests, choosing Vitest + Supertest + an in-memory Mongo for TDD).
- **Test-first development** — for each feature (auth, vehicle CRUD, search, inventory) I had Claude write the failing tests first, then implement the code to make them pass, following Red → Green → Refactor.
- **Boilerplate generation** — Mongoose models, Express controllers/routes, JWT middleware, and the seed script were generated with Claude and then reviewed by me.
- **Frontend build** — I asked Claude to build the React + Tailwind UI to a "premium" design brief; it produced the design system, pages and components, which I reviewed and tweaked.
- **Simplification & readability** — when the first draft felt too advanced to explain, I asked Claude to simplify it (plain `try/catch` and inline validation instead of heavier abstractions) so I fully understand and can defend every line.
- **Debugging** — Claude helped diagnose environment issues (e.g. pointing the in-memory MongoDB at a locally installed `mongod` binary to skip a large download).

**Reflection:**
AI dramatically sped up the boilerplate and let me focus on understanding the
*why* behind each decision. The most valuable part was using it to work
**test-first** — I could see behaviour defined before implementation, which made
the resulting code more reliable. I made a point of asking for simpler code I
could explain, and I reviewed every change rather than accepting it blindly.

> A complete log of the prompts I used is in [PROMPTS.md](PROMPTS.md).

---

## 📦 Available Scripts

**Server** (`/server`)
| Script | Description |
|--------|-------------|
| `npm run dev` | Start API with auto-reload (nodemon) |
| `npm start` | Start API |
| `npm run seed` | Reset & seed demo data |
| `npm test` | Run the test suite |
| `npm run test:coverage` | Tests with coverage |

**Client** (`/client`)
| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |

---

## 📄 License

Created for an educational placement assignment.
