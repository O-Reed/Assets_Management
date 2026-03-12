import express from 'express';
import cors from 'cors';
import { initDb, seedDb } from './db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import itemRoutes from './routes/items.js';
import assetRoutes from './routes/assets.js';

const PORT = Number(process.env.PORT) || 3001;

async function main() {
  await initDb();
  seedDb();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/items', itemRoutes);
  app.use('/api/assets', assetRoutes);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch(console.error);
