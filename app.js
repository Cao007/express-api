const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config(); // 加载环境变量
const cors = require('cors')

// 中间件
const adminAuth = require('./middlewares/admin-auth');
const userAuth = require('./middlewares/user-auth');


// 前台路由文件
const indexRouter = require('./routes/front/home');
const categoriesRouter = require('./routes/front/categories');
const coursesRouter = require('./routes/front/courses');
const chaptersRouter = require('./routes/front/chapters');
const articlesRouter = require('./routes/front/articles');
const settingsRouter = require('./routes/front/settings');
const searchRouter = require('./routes/front/search');
const authRouter = require('./routes/front/auth');
const usersRouter = require('./routes/front/users');
const likesRouter = require('./routes/front/likes');

// 后台路由文件
const adminArticlesRouter = require('./routes/admin/articles');
const adminCatgoriesRouter = require('./routes/admin/categories');
const adminSettingsRouter = require('./routes/admin/settings');
const adminUsersRouter = require('./routes/admin/users');
const adminCoursesRouter = require('./routes/admin/courses');
const adminChaptersRouter = require('./routes/admin/chapters');
const adminChartsRouter = require('./routes/admin/charts');
const adminAuthRouter = require('./routes/admin/auth');
const adminAttachmentsRouter = require('./routes/admin/attachments');

// 公共路由文件
const uploadsRouter = require('./routes/common/uploads');
const captchaRouter = require('./routes/common/captcha');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// CORS 跨域配置
const corsOptions = {
  origin: [
    'https://clwy.cn',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
  ],
}
app.use(cors(corsOptions));

// 前台路由配置
app.use('/front/home', indexRouter);
app.use('/front/categories', categoriesRouter);
app.use('/front/courses', coursesRouter);
app.use('/front/chapters', chaptersRouter);
app.use('/front/articles', articlesRouter);
app.use('/front/settings', settingsRouter);
app.use('/front/search', searchRouter);
app.use('/front/auth', authRouter);
app.use('/front/users', userAuth, usersRouter);
app.use('/front/likes', userAuth, likesRouter);

// 后台路由配置
app.use('/admin/articles', adminAuth, adminArticlesRouter);
app.use('/admin/categories', adminAuth, adminCatgoriesRouter);
app.use('/admin/settings', adminAuth, adminSettingsRouter);
app.use('/admin/users', adminAuth, adminUsersRouter);
app.use('/admin/courses', adminAuth, adminCoursesRouter);
app.use('/admin/chapters', adminAuth, adminChaptersRouter);
app.use('/admin/charts', adminAuth, adminChartsRouter);
app.use('/admin/auth', adminAuthRouter);
app.use('/admin/attachments', adminAuth, adminAttachmentsRouter);

// 公共路由配置
app.use('/common/uploads', userAuth, uploadsRouter);
app.use('/common/captcha', captchaRouter);

module.exports = app;
