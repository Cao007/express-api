const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const adminAuth = require('./middlewares/admin-auth');
const userAuth = require('./middlewares/user-auth');
require('dotenv').config();

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

// 后台路由文件
const adminArticlesRouter = require('./routes/admin/articles');
const adminCatgoriesRouter = require('./routes/admin/categories');
const adminSettingsRouter = require('./routes/admin/settings');
const adminUsersRouter = require('./routes/admin/users');
const adminCoursesRouter = require('./routes/admin/courses');
const adminChaptersRouter = require('./routes/admin/chapters');
const adminChartsRouter = require('./routes/admin/charts');
const adminAuthRouter = require('./routes/admin/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

// 后台路由配置
app.use('/admin/articles', adminAuth, adminArticlesRouter);
app.use('/admin/categories', adminAuth, adminCatgoriesRouter);
app.use('/admin/settings', adminAuth, adminSettingsRouter);
app.use('/admin/users', adminAuth, adminUsersRouter);
app.use('/admin/courses', adminAuth, adminCoursesRouter);
app.use('/admin/chapters', adminAuth, adminChaptersRouter);
app.use('/admin/charts', adminAuth, adminChartsRouter);
app.use('/admin/auth', adminAuthRouter);

module.exports = app;
