const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');

// ==========================================
// 1) CRUD cho ROLE & USER (Xoá mềm)
// ==========================================

// --- ROLE CRUD ---
// Create Role
router.post('/roles', async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Get All Roles (Chỉ lấy chưa bị xoá mềm)
router.get('/roles', async (req, res) => {
    const roles = await Role.find({ isDeleted: false });
    res.json(roles);
});

// Get Role by ID
router.get('/roles/:id', async (req, res) => {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
});

// Update Role
router.put('/roles/:id', async (req, res) => {
    const role = await Role.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true });
    res.json(role);
});

// Soft Delete Role (Cập nhật isDeleted = true)
router.delete('/roles/:id', async (req, res) => {
    await Role.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "Role deleted successfully (Soft delete)" });
});

// --- USER CRUD ---
// Create User
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Get All Users (populate thêm thông tin Role)
router.get('/users', async (req, res) => {
    const users = await User.find({ isDeleted: false }).populate('role', 'name description');
    res.json(users);
});

// Get User by ID
router.get('/users/:id', async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role', 'name description');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

// Update User
router.put('/users/:id', async (req, res) => {
    const user = await User.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true });
    res.json(user);
});

// Soft Delete User
router.delete('/users/:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "User deleted successfully (Soft delete)" });
});


// ==========================================
// 2 & 3) API ENABLE / DISABLE USER
// ==========================================

// Enable User
router.post('/enable', async (req, res) => {
    const { email, username } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true } // Trả về document sau khi update
        );
        if (!user) return res.status(404).json({ message: "Sai thông tin hoặc User không tồn tại!" });
        res.json({ message: "User enabled", user });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Disable User
router.post('/disable', async (req, res) => {
    const { email, username } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "Sai thông tin hoặc User không tồn tại!" });
        res.json({ message: "User disabled", user });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


// ==========================================
// 4) LẤY TẤT CẢ USER THEO ROLE ID
// ==========================================

router.get('/roles/:id/users', async (req, res) => {
    try {
        const roleId = req.params.id;
        // Tìm tất cả users có role khớp với ID truyền vào và chưa bị xoá
        const users = await User.find({ role: roleId, isDeleted: false }).populate('role', 'name');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;