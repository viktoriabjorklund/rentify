import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import toolRoutes from './routes/toolRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// För att kunna access filer från uploads-mappen
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/requests', requestRoutes);

app.listen(PORT, () => {
  console.log(`Server has started on: ${PORT}`);
});

