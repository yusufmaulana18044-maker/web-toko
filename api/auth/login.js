/**
 * Vercel Serverless Function - Auth Login
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_jwt";

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only POST method
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi"
      });
    }

    // Get user from Supabase
    const { data: users, error } = await supabase
      .from("users")
      .select("id, username, email, full_name, password, role, is_approved")
      .eq("username", username)
      .single();

    if (error || !users) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah"
      });
    }

    // Check password
    const passwordValid = await bcrypt.compare(password, users.password);
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: users.id,
        username: users.username,
        role: users.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return response
    res.status(200).json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id: users.id,
        username: users.username,
        email: users.email,
        full_name: users.full_name,
        role: users.role,
        is_approved: users.is_approved
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
}
