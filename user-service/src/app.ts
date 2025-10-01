import express from 'express';
import cors from 'cors';
import { router as authRoutes } from './routes/auth';

const app = express();

const PORT = process.env.APP_PORT || 3002;

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.info(`User service running on port ${PORT}`);
})