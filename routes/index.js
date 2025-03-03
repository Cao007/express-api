const express = require('express')
const router = express.Router()

// 路由中间件
const adminAuth = require('../middlewares/admin-auth')
const userAuth = require('../middlewares/user-auth')

// 前台路由文件
const indexRouter = require('./front/home')
const articlesRouter = require('./front/articles')
const searchRouter = require('./front/search')
const authRouter = require('./front/auth')
const usersRouter = require('./front/users')

// 后台路由文件
const adminArticlesRouter = require('./admin/articles')
const adminUsersRouter = require('./admin/users')
const adminChartsRouter = require('./admin/charts')
const adminAuthRouter = require('./admin/auth')
const adminLogsRouter = require('./admin/logs')

// 公共路由文件
const uploadsRouter = require('./common/uploads')
const captchaRouter = require('./common/captcha')

/**
 * 前台路由配置
 */
router.use('/front/home', indexRouter)
router.use('/front/articles', articlesRouter)
router.use('/front/search', searchRouter)
router.use('/front/auth', authRouter)
router.use('/front/users', userAuth, usersRouter)

/**
 * 后台路由配置
 */
router.use('/admin/articles', adminAuth, adminArticlesRouter)
router.use('/admin/users', adminAuth, adminUsersRouter)
router.use('/admin/charts', adminAuth, adminChartsRouter)
router.use('/admin/auth', adminAuthRouter)
router.use('/admin/logs', adminAuth, adminLogsRouter)

/**
 * 公共路由配置
 */
router.use('/common/uploads', userAuth, uploadsRouter)
router.use('/common/captcha', captchaRouter)

module.exports = router
