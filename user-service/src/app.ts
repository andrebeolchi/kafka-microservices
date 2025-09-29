import express from 'express';
import { router as authRoutes } from './routes/auth';

const app = express();

const PORT = process.env.APP_PORT || 3002;

app.use(express.json());

app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
})