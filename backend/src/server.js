import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import toolRoutes from './routes/toolRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/requests', requestRoutes)
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Rentify backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server has started on: ${PORT}`);
});
