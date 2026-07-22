# AI Prompts Log

This file documents how I used AI (**Claude — Claude Code, running Claude Opus**)
while building the Car Dealership Inventory System, as required by the
assignment. It lists the prompts I gave, in order, and what the AI produced at
each step. I reviewed and adjusted the output throughout, and every AI-assisted
commit credits Claude with a `Co-authored-by` trailer.

---

## Phase 0 — Planning

**Prompt:**
> "Here is the TDD kata for a Car Dealership Inventory System [full requirements].
> I have to give this project in my college placement, so build it accordingly.
> We have to commit step by step, in sequence."

**AI did:** Inspected the existing scaffold, proposed the tech stack (Express +
MongoDB + JWT, Vitest/Supertest for TDD, React + Tailwind frontend), and laid
out a feature-by-feature plan with Red → Green → Refactor commits.

**Prompt (workflow correction):**
> "We have to push to GitHub frequently, so let's do it one functionality at a
> time — I will push and commit."

**AI did:** Switched to building a single feature at a time and pausing after
each so I could commit/push, always suggesting a commit message with the AI
co-author trailer.

---

## Phase 1 — Backend test infrastructure

**Prompt:**
> "What is the next function? I think we should make the schema, module, route
> and add it in the server."

**AI did:** Split the Express `app` from the `server` bootstrap so the app is
importable by tests, fixed the MongoDB connection, added centralized error
handling, and set up Vitest + Supertest + `mongodb-memory-server` with a passing
health-check test. It also configured the tests to reuse a locally installed
`mongod` to avoid a large binary download.

---

## Phase 2 — Authentication (TDD)

**Prompt:** > "go" (proceed with the auth implementation after committing the failing tests)

**AI did:** Wrote failing tests for register/login (the **Red** step), then
implemented the User model (bcrypt hashing), JWT issuance, validation, duplicate
handling, and login — turning all 7 specs **Green**.

**Prompt (readability):**
> "I think this is very high-level code. For a student, let's simplify it so I
> can explain it."

**AI did:** Refactored auth to plain `try/catch` with inline validation, removed
`express-validator` and the `asyncHandler` abstraction, and returned an explicit
"public user" object instead of Mongoose `toJSON` transforms — while keeping all
tests green.

**Prompt (concept question):**
> "Is auth.test.js required for production?"

**AI did:** Explained that test files are dev-only (never imported by the running
server, test libraries are in `devDependencies`), but should stay in the repo as
a required TDD deliverable and regression safety net.

---

## Phase 3 — Vehicles CRUD + Search + Inventory (TDD)

**Prompts:** > "next", "go, do only green", "do only the green commits"

**AI did:**
- **Vehicle CRUD** — Vehicle model, `protect` + `adminOnly` middleware, and
  add/list/update/delete with role rules (10 specs).
- **Search** — `GET /api/vehicles/search` filtering by make, model, category and
  price range (7 specs).
- **Inventory** — `purchase` (decrements stock, blocks when out of stock) and
  admin-only `restock` (9 specs).

After the first couple of features I asked it to skip the separate "red" commit
and deliver each feature as one green commit (tests + implementation together).

**Prompt:**
> "seed"

**AI did:** Wrote a seed script creating an admin, a demo customer, and 8 sample
vehicles (one out of stock to demo the disabled purchase button).

---

## Phase 4 — Frontend

**Prompt (design guidance):**
> "What's the best way to get an advanced, user-friendly, responsive, good-looking
> design? I have no design knowledge and can only use free AI — I only have a
> Claude subscription. Any suggestions?"

**AI did:** Explained the principles behind good-looking UIs and recommended a
stack (React + Vite + Tailwind + lucide icons + Inter font). Offered visual
style directions.

**Prompt:**
> "I want a website my interviewers will like very, very much."

**AI did:** Built a **modern dark premium** design — a design system
(`.btn`, `.card`, `.input`), a hero landing page, and then, feature by feature:
- API client + JWT auth context + login/register pages + protected routes
- Vehicle dashboard with search/filter, purchase flow, toasts, loading & empty states
- Admin UI (add / edit / delete / restock) gated by user role

Each frontend feature was verified with a production build, and the auth and
purchase flows were tested end-to-end against the running backend.

---

## Phase 5 — Documentation

**Prompt:**
> "next" (write the docs)

**AI did:** Generated this `PROMPTS.md` and the `README.md` (project overview,
setup instructions, API reference, the test report with coverage, and the
"My AI Usage" section).

---

## Reflection

Using Claude let me move fast on boilerplate and, more importantly, work
**test-first** — I could see each behaviour specified before it was implemented.
I deliberately asked for **simpler, explainable code** and reviewed every change
rather than accepting output blindly, so I can confidently explain and defend
the whole codebase.
