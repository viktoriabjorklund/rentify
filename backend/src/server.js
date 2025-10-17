import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import toolRoutes from "./routes/toolRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config({ path: ".env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3004",
  "https://rentify-psi-roan.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server and local dev on any localhost port
      const isLocalhost =
        typeof origin === "string" && origin.startsWith("http://localhost:");
      if (!origin || isLocalhost || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed from this origin"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.use("/api/users", userRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Rentify backend is running!");
});

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;