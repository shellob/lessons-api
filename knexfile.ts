import dotenv from 'dotenv';
dotenv.config();

export default {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'lessons'
  },
  pool: { min: 2, max: 10 }
};
