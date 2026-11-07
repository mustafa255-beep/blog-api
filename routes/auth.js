const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "الإيميل موجود بالفعل",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id }, "secretkey", {
            expiresIn: "7d",
        });

        res.status(201).json({
            success: true,
            message: "تم التسجيل بنجاح",
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "خطأ في السيرفر",
            error: error.message,
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "الإيميل أو كلمة السر خطأ",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "الإيميل أو كلمة السر خطأ",
            });
        }

        const token = jwt.sign({ userId: user._id }, "secretkey", {
            expiresIn: "7d",
        });

        res.json({
            success: true,
            message: "تم تسجيل الدخول بنجاح",
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "خطأ في السيرفر",
            error: error.message,
        });
    }
});

module.exports = router;