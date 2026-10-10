const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');

const authRoutes = require('./modules/auth/auth.routes');
const tenantRoutes = require('./modules/tenants/tenant.routes');
const taskRoutes = require('./modules/tasks/task.routes');

const app = express();

// Handle credentials header check before CORS
app.use(credentials);

// Apply CORS with whitelisted options
app.use(cors(corsOptions));

// Built-in body and cookie parsers
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/health', (req, res)=>{
    res.status(200).json({ status: 'OK', message: 'SaaS Multi-Tenant API is running.'});
});

app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes)
app.use('/api/tasks', taskRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({message: 'Route not found'});
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;