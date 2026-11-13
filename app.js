const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3002;
app.use('/users', require('./routes/users'));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/auth', require('./routes/auth'));
app.use('/posts', require('./routes/posts'));
app.use('/posts', require('./routes/comments'));
app.use('/comments', require('./routes/comments'));
mongoose.connect('mongodb://localhost:27017/blogdb')
    .then(() => console.log('✅ تم الاتصال بقاعدة البيانات'))
    .catch(err => console.log('❌ خطأ في الاتصال:', err));

const User = require('./models/User');
console.log('✅ User Model جاهز');

app.get('/', (req, res) => {
    res.send('🚀 السيرفر شغال!');
});
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 السيرفر شغال على http://localhost:${PORT}`);
    });
}

module.exports = app;