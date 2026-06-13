# movie-vault

movie-vault is an AI-powered movie watchlist and recommendation API that allows users to track movies they’ve watched, manage personalized watchlists, and receive intelligent movie recommendations based on their viewing history and preferences. The recommendation engine is powered by OpenAI’s GPT-4o, which analyzes user watch history and liked movies to generate personalized suggestions with explanations. Built with Node.js, Express, PostgreSQL, and Prisma ORM, it features JWT authentication, request validation with Zod, and interactive Swagger documentation.

**Live Demo:** https://movie-watchlist-api-axno.onrender.com

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** PostgreSQL
- **ORM:** Prisma (with Prisma Accelerate)
- **Authentication:** JWT (JSON Web Tokens) via cookies and Bearer tokens
- **Validation:** Zod
- **Docs:** Swagger UI
- **AI Integration:** OpenAI GPT-4o (for personalized movie recommendations based on watch history and user preferences)

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database (local or hosted)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/movie-watchlist-api.git
   cd movie-watchlist-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   JWT_SECRET="your-jwt-secret"
   JWT_EXPIRES_IN="7d"
   CREATOR_ID="uuid-of-a-registered-user"
   PORT=5001
   NODE_ENV=development
   ```

4. Run Prisma migrations and generate the client:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. (Optional) Seed the database with sample movies:
   ```bash
   npm run seed:movies
   ```
   > **Note:** `CREATOR_ID` in your `.env` must be set to a valid, existing user's UUID before seeding.

6. Start the server:
   ```bash
   # Development (with hot reload)
   npm run dev

   # Production
   npm start
   ```

The server will be running at `http://localhost:5001`.

## API Documentation

Interactive Swagger docs are available at `/api-docs` when the server is running.

## API Endpoints

### Authentication

| Method | Endpoint           | Description         | Auth Required |
|--------|--------------------|---------------------|---------------|
| POST   | `/auth/register`   | Register a new user | No            |
| POST   | `/auth/login`      | Login               | No            |
| POST   | `/auth/logout`     | Logout              | No            |
| DELETE | `/auth/delete/:id` | Delete a user       | No            |

### Watchlist

All watchlist routes require a valid JWT token (via `Authorization: Bearer <token>` header or `jwt` cookie).

| Method | Endpoint         | Description                  | Auth Required |
|--------|------------------|------------------------------|---------------|
| POST   | `/watchlist`     | Add a movie to your watchlist | Yes           |
| PUT    | `/watchlist/:id` | Update a watchlist item       | Yes           |
| DELETE | `/watchlist/:id` | Remove from your watchlist    | Yes           |

### Request & Response Examples

**Register**
```bash
curl -X POST http://localhost:5001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com", "password": "secret123"}'
```

**Add to Watchlist**
```bash
curl -X POST http://localhost:5001/watchlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"movieId": "<movie-uuid>", "status": "PLANNED", "rating": 8, "notes": "Must watch!"}'
```

### Watchlist Statuses

| Status      | Description              |
|-------------|--------------------------|
| `PLANNED`   | Planning to watch        |
| `WATCHING`  | Currently watching       |
| `COMPLETED` | Finished watching        |
| `DROPPED`   | Stopped watching         |

## Project Structure

```
movie-watchlist-api/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.js              # Database seeder
├── src/
│   ├── config/
│   │   └── db.js            # Prisma client & connection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── watchListController.js
│   ├── middleware/
│   │   ├── authMiddleware.js # JWT verification
│   │   └── validateRequest.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── landingPage.js
│   │   └── watchListRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── validators/
│   │   ├── authValidators.js
│   │   ├── movieValidators.js
│   │   └── watchlistValidators.js
│   └── server.js            # App entry point
├── swagger.yaml
├── package.json
└── .env
```

## Scripts

| Script             | Command               | Description                          |
|--------------------|-----------------------|--------------------------------------|
| `npm run dev`      | `nodemon src/server.js` | Start dev server with hot reload   |
| `npm start`        | `node src/server.js`    | Start production server            |
| `npm run build`    | `prisma generate && prisma migrate deploy` | Generate client & run migrations |
| `npm run seed:movies` | `node prisma/seed.js` | Seed database with sample movies  |

## License

ISC
