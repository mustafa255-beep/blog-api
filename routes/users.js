const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
router.get('/profile',authMiddleware,async(req, res) =>{
    try {
        const userId = req.userId;
        const user =  await User.findById(userId).select('password');
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'المستخدم غير موجود'}
            );
        }
        res.json({
            success: true,
            user
        });
    } catch (error) {
       res.status(404).json({
          success: false,
            message: 'خطأ في السيرفر',
            error: error.message
       }); 
    }
});
module.exports = router;      