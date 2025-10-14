import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import toolRoutes from './routes/toolRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import dotenv from 'dotenv'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

dotenv.config();

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
  "https://rentify-frontend-ge6g.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed from this origin"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.use('/api/users', userRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/requests', requestRoutes)
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.send('Rentify backend is running!');
});

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;