const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, Postman, or server-to-server calls)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS: Origin not allowed.'));
        }
    },
    credentials: true, // Essential for sending/receiving HttpOnly refresh token cookies
    optionsSuccessStatus: 200
};

module.exports = corsOptions;