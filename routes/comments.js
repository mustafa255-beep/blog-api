const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');   // ← اتعدل
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

router.post('/posts/:postId', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;
        const { postId } = req.params;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'نص التعليق مطلوب',
            });
        }

        const post = await Post.findById(postId);   // ← اتعدل
        if (!post) {
            return res.status(400).json({
                success: false,
                message: 'المقال غير موجود',
            });
        }

        const comment = new Comment({
            text,
            author: req.userId,
            post: postId
        });

        await comment.save();

        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'name email');

        res.status(201).json({
            success: true,
            message: 'تم تسجيل التعليق بنجاح',
            comment: populatedComment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في اضافة التعليق',
            error: error.message
        });
    }
});
router.get('/posts/:postId',async(req,res) => {
    try {
       const {postId} = req.params;
       const comments = await Comment.find({post : postId})
       .populate('author','name email');
       res.json({
        success : true,
        count : comments.length,
        comments
       });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : 'خطأ في جلب التعليقات',
            error : error.message
        });
    }
});
router.delete('/:id',authMiddleware,async(req,res)=>{
    try {
        const comment = await Comment.findById(req.params.id);
        if(!comment){
            return res.status(404).json({
                success : false,
                message : 'التعليق غير موجود'
            });
        }
        if(comment.author.toString() !== req.userId){
            return res.status(403).json({
                success : false,
                message : 'غير مصرح .انت مش صاحب التعليق'

            })
        }
        await comment.deleteOne();
        res.json({
             success: true,
            message: 'تم حذف التعليق بنجاح'
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : 'تم حذف التعليق',
            error : error.message
        });
    }
});
router.put('/:id',authMiddleware,async(req,res)=>{
    try {
        const {text} = req.body;
        if(!text){
            return res.status(400).json({
                success : false,
                message : 'نص التعليق مطلوب'
            });
        }
         const comment = await Comment.findById(req.params.id);
        if(comment.author.toString() !== req.userId){
            res.status(403).json({
                success : false,
                message : 'غير مصرح .انت مش صاحب التعليق'
            });
        }
     comment.text = text;
     await comment.save();
     const updatedComment = await Comment.findById(comment._id)
     .populate('author', 'name email');
     res.json({
        success : true,
        message : 'تم تحديث التعليق بنجاح',
        comment : updatedComment
     });


    } catch (error) {
       res.status(500).json({
        success : false,
        message :'خطأ في تحديث التعليق',
        error : error.message
       });
    }
});

module.exports = router;