const express = require('express');
const router = express.Router();

// 路由中间件
const adminAuth = require('../middlewares/admin-auth');
const userAuth = require('../middlewares/user-auth');

// 前台路由文件
const indexRouter = require('../routes/front/home');
const categoriesRouter = require('../routes/front/categories');
const coursesRouter = require('../routes/front/courses');
const chaptersRouter = require('../routes/front/chapters');
const articlesRouter = require('../routes/front/articles');
const settingsRouter = require('../routes/front/settings');
const searchRouter = require('../routes/front/search');
const authRouter = require('../routes/front/auth');
const usersRouter = require('../routes/front/users');
const likesRouter = require('../routes/front/likes');

// 后台路由文件
const adminArticlesRouter = require('../routes/admin/articles');
const adminCatgoriesRouter = require('../routes/admin/categories');
const adminSettingsRouter = require('../routes/admin/settings');
const adminUsersRouter = require('../routes/admin/users');
const adminCoursesRouter = require('../routes/admin/courses');
const adminChaptersRouter = require('../routes/admin/chapters');
const adminChartsRouter = require('../routes/admin/charts');
const adminAuthRouter = require('../routes/admin/auth');
const adminAttachmentsRouter = require('../routes/admin/attachments');
const adminLogsRouter = require('../routes/admin/logs');

// 公共路由文件
const uploadsRouter = require('../routes/common/uploads');
const captchaRouter = require('../routes/common/captcha');

// 前台路由配置
router.use('/front/home', indexRouter);
router.use('/front/categories', categoriesRouter);
router.use('/front/courses', coursesRouter);
router.use('/front/chapters', chaptersRouter);
router.use('/front/articles', articlesRouter);
router.use('/front/settings', settingsRouter);
router.use('/front/search', searchRouter);
router.use('/front/auth', authRouter);
router.use('/front/users', userAuth, usersRouter);
router.use('/front/likes', userAuth, likesRouter);

// 后台路由配置
router.use('/admin/articles', adminAuth, adminArticlesRouter);
router.use('/admin/categories', adminAuth, adminCatgoriesRouter);
router.use('/admin/settings', adminAuth, adminSettingsRouter);
router.use('/admin/users', adminAuth, adminUsersRouter);
router.use('/admin/courses', adminAuth, adminCoursesRouter);
router.use('/admin/chapters', adminAuth, adminChaptersRouter);
router.use('/admin/charts', adminAuth, adminChartsRouter);
router.use('/admin/auth', adminAuthRouter);
router.use('/admin/attachments', adminAuth, adminAttachmentsRouter);
router.use('/admin/logs', adminAuth, adminLogsRouter);

// 公共路由配置
router.use('/common/uploads', userAuth, uploadsRouter);
router.use('/common/captcha', captchaRouter);

module.exports = router;
