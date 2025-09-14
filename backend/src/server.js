import express from 'express';
import cors from 'cors';
import toolsRouter from './routes/toolRoutes.js';
import authRouter from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/tools', toolsRouter);

app.listen(PORT, () => {
  console.log(`Server has started on: ${PORT}`);
});
