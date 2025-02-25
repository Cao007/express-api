const express = require('express')
const router = express.Router()

// 路由中间件
const adminAuth = require('../middlewares/admin-auth')
const userAuth = require('../middlewares/user-auth')

// 前台路由文件
const indexRouter = require('./front/home')
const categoriesRouter = require('./front/categories')
const coursesRouter = require('./front/courses')
const chaptersRouter = require('./front/chapters')
const articlesRouter = require('./front/articles')
const settingsRouter = require('./front/settings')
const searchRouter = require('./front/search')
const authRouter = require('./front/auth')
const usersRouter = require('./front/users')
const likesRouter = require('./front/likes')
const membershipsRouter = require('./front/memberships')

// 后台路由文件
const adminArticlesRouter = require('./admin/articles')
const adminCatgoriesRouter = require('./admin/categories')
const adminSettingsRouter = require('./admin/settings')
const adminUsersRouter = require('./admin/users')
const adminCoursesRouter = require('./admin/courses')
const adminChaptersRouter = require('./admin/chapters')
const adminChartsRouter = require('./admin/charts')
const adminAuthRouter = require('./admin/auth')
const adminAttachmentsRouter = require('./admin/attachments')
const adminLogsRouter = require('./admin/logs')
const adminMembershipsRouter = require('./admin/memberships')

// 公共路由文件
const uploadsRouter = require('./common/uploads')
const captchaRouter = require('./common/captcha')

// 前台路由配置
router.use('/front/home', indexRouter)
router.use('/front/categories', categoriesRouter)
router.use('/front/courses', coursesRouter)
router.use('/front/chapters', userAuth, chaptersRouter)
router.use('/front/articles', articlesRouter)
router.use('/front/settings', settingsRouter)
router.use('/front/search', searchRouter)
router.use('/front/auth', authRouter)
router.use('/front/users', userAuth, usersRouter)
router.use('/front/likes', userAuth, likesRouter)
router.use('/front/memberships', membershipsRouter)

// 后台路由配置
router.use('/admin/articles', adminAuth, adminArticlesRouter)
router.use('/admin/categories', adminAuth, adminCatgoriesRouter)
router.use('/admin/settings', adminAuth, adminSettingsRouter)
router.use('/admin/users', adminAuth, adminUsersRouter)
router.use('/admin/courses', adminAuth, adminCoursesRouter)
router.use('/admin/chapters', adminAuth, adminChaptersRouter)
router.use('/admin/charts', adminAuth, adminChartsRouter)
router.use('/admin/auth', adminAuthRouter)
router.use('/admin/attachments', adminAuth, adminAttachmentsRouter)
router.use('/admin/logs', adminAuth, adminLogsRouter)
router.use('/admin/memberships', adminAuth, adminMembershipsRouter)

// 公共路由配置
router.use('/common/uploads', userAuth, uploadsRouter)
router.use('/common/captcha', captchaRouter)

module.exports = router
