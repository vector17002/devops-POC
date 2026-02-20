# DevOps POC - Docker with Neon Integration

This repository is configured to use **Neon Database** with different setups for development and production.

## Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Neon Account](https://neon.tech/) (for both local proxy and cloud DB)

## Environment Setup

1. Copy `.env.example` to `.env.development` and `.env.production`.
2. Fill in the required variables in both files.

### Development (Neon Local)

In development, we use the `neondatabase/neon_local` proxy. This allows you to work with ephemeral branches and simulate the Neon Cloud environment locally.

**Variables needed in `.env.development`:**

- `NEON_API_KEY`: Your Neon API Key.
- `NEON_PROJECT_ID`: Your Neon Project ID.
- `DATABASE_URL`: `postgres://neon:npg@neon-local:5432/neondb?sslmode=require`

### Production (Neon Cloud)

In production, the app connects directly to the Neon Cloud database.

**Variables needed in `.env.production`:**

- `DATABASE_URL`: Your actual Neon Cloud connection string.

---

## Running the Application

### Development Mode

Run the following command to start the application and the Neon Local proxy:

```bash
docker compose -f docker-compose.dev.yml up --build
```

- The app will be available at `http://localhost:3000`.
- The database proxy will be available at `localhost:5432`.

### Production Mode

Run the following command to start the application in production mode:

```bash
docker compose -f docker-compose.prod.yml up --build
```

---

## Technical Details

- **Dockerfile**: Uses a multi-stage build to keep the production image small and secure (runs as a non-root `appuser`).
- **Networking**: Both setups use a custom Docker network `app-network` for secure communication between containers.
- **SSL**: The connection string includes `sslmode=require`. Ensure your application code is configured to allow self-signed certificates for Neon Local (e.g., `rejectUnauthorized: false`).
