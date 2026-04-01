/**
 * Auth API Routes untuk Vercel Serverless
 * Entry point: /api/auth/*
 */

const express = require("express");
const router = express.Router();
require("dotenv").config();

// Import auth routes
const authSupabaseRoutes = require("../routes/auth-supabase");

// Middleware
router.use(express.json());

// Mount auth routes
router.use("/", authSupabaseRoutes);

module.exports = router;
