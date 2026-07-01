import express from 'express';
import { connectdb, disconnectdb} from "./config/db.js";
import { config } from "dotenv";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "yaml";

const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = yaml.parse(file);

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import watchListRoutes from "./routes/watchListRoutes.js";
import landingPage from "./routes/landingPage.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

config();
connectdb();

const app =  express();

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use("/", landingPage);
app.use("/auth", authRoutes);
app.use("/watchlist", watchListRoutes);
app.use("/recommendations", recommendationRoutes);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// Handle unhandled promise rejections e.g Database connection errors

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection: ", err);
    server.close(async () => {
         await disconnectdb();
         process.exit(1);
    });
});

process.on("uncaughtException", async (err) => {
    console.log("Uncaught Exception: ", err);
    await disconnectdb();
    process.exit(1);
});

process.on("SIGTERM", async() => {
    console.error("SIGTERM received, shutting down gracefully");
    server.close(async () => {
         await disconnectdb();
         process.exit(0);
    });
});

