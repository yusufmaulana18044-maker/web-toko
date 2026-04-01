export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: "🚀 Web Toko API di Vercel",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString()
  });
}
