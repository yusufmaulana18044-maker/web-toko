/**
 * Main API Entry Point untuk Vercel Serverless
 * Handler untuk root path /
 */

import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5000",
    process.env.CORS_ORIGIN || "*"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Web Toko API di Vercel",
    mode: process.env.NODE_ENV || "production"
  });
});

export default app;
