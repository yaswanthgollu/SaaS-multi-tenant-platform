const allowedOrigins = [
    'http://localhost:3000',      // Next.js / React local dev server
    'http://127.0.0.1:5500',      // Live Server / local testing
    'https://your-production-app.vercel.app' // deployed production frontend
];

module.exports = allowedOrigins;