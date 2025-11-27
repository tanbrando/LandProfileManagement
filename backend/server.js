const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config(); 


const app = express();
const userRoutes = require('./routes/userRoutes');
const landRoutes = require('./routes/landRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');


app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/users', userRoutes);
app.use('/lands', landRoutes);
app.use('/transactions', transactionRoutes);
app.use('/reports', reportRoutes);
app.use('/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Error handler
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});