# Multi-Tenant B2B SaaS Platform Engine

A production-grade, modular multi-tenant B2B SaaS backend platform built with **Node.js**, **Express**, and **MongoDB**, featuring dual-token authentication (JWT), secure HttpOnly cookie management, workspace-level data isolation, and a monorepo architecture configured for a **React / Next.js** frontend integration.

---

##  Key Features & Highlights

- **Modular Vertical-Slice Architecture:** Code organized by domain features (`src/modules/` containing models, services, controllers, and routes) rather than monolithic layers.
- **Dual-Token Authentication (JWT):** Short-lived Access Tokens (15m) paired with long-lived Refresh Tokens (7d) managed via HttpOnly, SameSite cookies with multi-device array tracking and automatic rotation.
- **Strict Tenant Data Isolation:** All entity queries are scoped directly to `tenantId` resolved through middleware (`verifyTenant`), enforcing strict security boundaries between workspaces.
- **CORS & Preflight Handling:** Configured credentials middleware (`credentials.js`) ensuring seamless cross-origin HttpOnly cookie sharing between frontend and backend.
- **Production-Ready Indexes:** Compound database indexing on `tenantId` and query fields (`createdAt`, `status`) in MongoDB using Mongoose.

---

##  Repository Structure

```text
project/
├── .gitignore                   # Root gitignore ignoring backend/frontend build artifacts & secrets
├── README.md                    # Project documentation
├── backend/
│   └── server/                  # Node.js / Express API Root
│       ├── package.json
│       ├── server.js            # Database connection & server listener
│       ├── .env                 # Environment secrets
│       └── src/
│           ├── app.js           # Express app setup, CORS & global middleware
│           ├── config/
│           │   ├── db.js                # MongoDB connection instance
│           │   ├── allowedOrigins.js    # Trusted frontend domains
│           │   └── corsOptions.js       # Express CORS configuration
│           ├── middleware/
│           │   ├── credentials.js       # Preflight Access-Control-Allow-Credentials header
│           │   └── verifyJWT.js         # JWT Access Token authentication middleware
│           └── modules/
│               ├── auth/                # Register, Login, Refresh, Logout logic
│               ├── tenants/             # Workspace creation, membership & tenant middleware
│               └── tasks/               # Workspace-scoped task CRUD operations
└── frontend/                    # Next.js / React Web Client (Upcoming)
    ├── package.json
    └── src/
