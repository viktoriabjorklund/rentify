import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import toolRoutes from './routes/toolRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/requests', requestRoutes)

app.listen(PORT, () => {
  console.log(`Server has started on: ${PORT}`);
});
