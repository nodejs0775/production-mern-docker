# Project 5 — Production MERN Docker Example

Goal: Learn production-oriented Docker patterns.

Architecture:

```text
Browser
  ↓
localhost:8080
  ↓
Nginx
  ├── React static files
  └── /api/* proxy
          ↓
       Node.js
          ↓
       MongoDB
          ↓
     Named Volume
```

## Run

```powershell
docker compose up --build
```

Open:

```text
http://localhost:8080
```

Health:

```text
http://localhost:8080/health
```

## Concepts

### 1. Multi-stage frontend build

Stage 1:

```text
Node + Vite + source
        ↓
npm run build
        ↓
dist/
```

Stage 2:

```text
Nginx + dist/
```

The production frontend image does not need the full build toolchain.

### 2. Backend is not publicly published

Backend uses:

```yaml
expose:
  - "3000"
```

It is reachable by other services in the Compose network, but there is no host port mapping.

The browser reaches it through Nginx.

### 3. MongoDB is internal

No MongoDB host port is published.

Only the backend talks to it over the Compose network.

### 4. Persistent MongoDB data

```yaml
mongo_data:/data/db
```

Deleting/recreating MongoDB containers does not automatically delete the named volume.

### 5. Non-root Node runtime

Backend Dockerfile uses:

```dockerfile
USER node
```

### 6. Health Checks

MongoDB and Node have health checks.

Compose waits for healthy dependencies where configured.

### 7. Graceful Shutdown

The Node app handles:

```text
SIGTERM
SIGINT
```

and closes the HTTP server and MongoDB connection.

## Useful Commands

```powershell
docker compose ps
docker compose logs -f
docker compose logs -f backend
docker compose exec backend sh
docker compose exec database mongosh docker_production
```

Stop:

```powershell
docker compose down
```

Delete database volume too:

```powershell
docker compose down -v
```

## Production Note

This project demonstrates production patterns locally. A real production environment would additionally use:

- HTTPS/TLS
- proper secrets management
- image scanning
- pinned/approved base images
- CI/CD
- backups
- observability
- resource limits
- centralized logging
- production database architecture
