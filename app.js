const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
// 后台路由文件
const adminArticlesRouter = require('./routes/admin/articles');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// 后台路由配置
app.use('/admin/articles', adminArticlesRouter);

module.exports = app;
