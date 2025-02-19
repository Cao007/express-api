const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

// 加载环境变量
require('dotenv').config()

// 启动邮件消费者
const { mailConsumer } = require('./utils/rabbit-mq')
;(async () => {
  await mailConsumer()
})()

// 使用中间件
const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
const corsOptions = {
  // 跨域配置
  origin: ['https://clwy.cn', 'http://localhost:5500', 'http://127.0.0.1:5500']
}
app.use(cors(corsOptions))

// 路由
const routes = require('./routes/index')
app.use(routes)

module.exports = app
