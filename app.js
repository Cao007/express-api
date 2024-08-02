const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config(); // 导入环境变量
const adminAuth = require('./middlewares/admin-auth');

// 导入后台路由文件
const adminArticlesRouter = require('./routes/admin/articles');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminSettingsRouter = require('./routes/admin/settings');
const adminUsersRouter = require('./routes/admin/users');
const adminCoursesRouter = require('./routes/admin/courses');
const adminChaptersRouter = require('./routes/admin/chapters');
const adminChartsRouter = require('./routes/admin/charts');
const adminAuthRouter = require('./routes/admin/auth');
// 导入前台路由文件
const frontHomeRouter = require('./routes/front/home');
const frontCategoriesRouter = require('./routes/front/categories');
const frontCoursesRouter = require('./routes/front/courses');
const frontChaptersRouter = require('./routes/front/chapters');
const frontArticlesRouter = require('./routes/front/articles');
const frontSettingsRouter = require('./routes/front/settings');
const frontSearchRouter = require('./routes/front/search');


const app = express();
// 常用中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 后台路由配置
app.use('/admin/articles', adminAuth, adminArticlesRouter);
app.use('/admin/categories', adminAuth, adminCategoriesRouter);
app.use('/admin/settings', adminAuth, adminSettingsRouter);
app.use('/admin/users', adminAuth, adminUsersRouter);
app.use('/admin/courses', adminAuth, adminCoursesRouter);
app.use('/admin/chapters', adminAuth, adminChaptersRouter);
app.use('/admin/charts', adminAuth, adminChartsRouter);
app.use('/admin/auth', adminAuthRouter);
// 前台路由配置
app.use('/front/home', frontHomeRouter);
app.use('/front/categories', frontCategoriesRouter);
app.use('/front/courses', frontCoursesRouter);
app.use('/front/chapters', frontChaptersRouter);
app.use('/front/articles', frontArticlesRouter);
app.use('/front/settings', frontSettingsRouter);
app.use('/front/search', frontSearchRouter);


module.exports = app;
