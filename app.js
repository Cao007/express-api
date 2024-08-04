const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config(); // 导入环境变量
const adminAuth = require('./middlewares/admin-auth');
const userAuth = require('./middlewares/user-auth');
const cors = require('cors')
const app = express();

// CORS 跨域配置
const corsOptions = {
    origin: [
        'superblog.top',
        'http://127.0.0.1:5500'
    ],
}
app.use(cors(corsOptions));


// 导入后台路由文件
const adminAuthRouter = require('./routes/admin/auth');
const adminUsersRouter = require('./routes/admin/users');
// 导入前台路由文件
const frontAuthRouter = require('./routes/front/auth');
const frontUserRouter = require('./routes/front/user');


// 常用中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 后台路由配置
app.use('/admin/auth', adminAuthRouter);
app.use('/admin/users', adminAuth, adminUsersRouter);
// 前台路由配置
app.use('/front/auth', frontAuthRouter);
app.use('/front/user', userAuth, frontUserRouter);


module.exports = app;
