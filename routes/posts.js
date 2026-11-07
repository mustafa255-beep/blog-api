const express = require("express");
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require("../middleware/auth");
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name email");
    res.json({
      success: true,
      const: Post.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطأ في جلب المقالات",
      error: error.message,
    });
  }
});
router.post('/',authMiddleware,async(req,res) =>{
  try {
    const {title,content} = req.body;
   if(!title || !content){
    res.status(400).json({
      success : false,
      message: 'العنوان والمحتوى مطلوبان'


    });
   }
  const post = new Post({
    title,
    content,
    author: req.userId
});
   await post.save();
   const populatedPost = await Post.findById(post._id)
   .populate('author','name email');
  
   res.status(201).json({
success : true,
message : 'تم اضافة المقال بنجاح',
post : populatedPost
   });

  } catch (error) {
    res.status(500).json({
      success : false,
      message : 'خطأ في اضافة المقال',
      error : error.message
    });
  }
  

});
router.get('/:id',async(req,res) =>{
  try {
    const post = await Post.findById(req.params.id)
    .populate('author','name email');
    if(!post){
      return res.status(404).json({
         success: false,
        message: 'المقال غير موجود'
      });
    }
    res.json({
     success : true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success : false,
      message :'خطأ في المقال',
      error : error.message
    });
    
  }
});
router.put('/:id',authMiddleware,async(req,res)=>{
  try {
    const{title,content} = req.body;
    if(!title || !content){
      return res.status(400).json({
        success : false,
        message : 'العنوان والمحتوى مطلوبان'
      })
    }
     const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'المقال غير موجود'
            });
        }

        // 3. التأكد إن المستخدم هو صاحب المقال
        if (post.author.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'غير مصرح، أنت مش صاحب المقال'
            });
        }
   post.title = title;
   post.content = content;
   await post.save();
   const updatedPost = await Post.findById(post._id)
   .populate('author','name email');
   res.json({
    success : true,
    message : 'تم تعديل المقال بنجاح',
    post : updatedPost
   })
  } catch (error) {
    res.status(500).json({
      success : false,
      message : 'خطأ في تعديل المقال',
      error : error.message
    });
  }
});
router.delete('/:id',authMiddleware,async(req,res)=>{
try {
 const post = await Post.findById(req.params.id);
 if(!post){
 return res.status(404).json({
  success : false,
  message : 'المقال غير موجود',
 });
 }
 if(post.author.toString() !== req.userId){
  return res.status(403).json({
   success: false,
   message: 'غير مصرح، أنت مش صاحب المقال'
  });
 }
 await post.deleteOne();
 res.json({
  success : true,
  message : 'تم حذف المقال بنجاح',
 });
} catch (error) {
  res.status(500).json({
    success : false,
    messsage : 'خطأ في حذف المقال ',
    error : error.message
  });
}
});
module.exports = router;
