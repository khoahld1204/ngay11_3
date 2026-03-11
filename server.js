const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware để parse JSON body
app.use(express.json());

// Kết nối MongoDB (Đổi đường dẫn nếu bạn dùng MongoDB Atlas)
mongoose.connect('mongodb://localhost:27017/my_database')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Định tuyến API
app.use('/api', apiRoutes);

// Khởi chạy server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});