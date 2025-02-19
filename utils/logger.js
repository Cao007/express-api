const { createLogger, format, transports } = require('winston');
const MySQLTransport = require('winston-mysql');

// 读取 config/config.json 数据库配置文件
// 根据环境变量 NODE_ENV 来选择对应数据库配置
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const options = {
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database,
  table: 'Logs'
};

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.errors({ stack: true }),    // 添加错误堆栈信息
    format.json()
  ),
  defaultMeta: { service: 'express-api' },
  transports: [
    // 将 `error` 或 更高级别的错误写入日志文件：`error.log`
    // new transports.File({ filename: 'error.log', level: 'error' }),

    //  将 `info` 或 更高级别的错误写入日志文件：`combined.log`
    // new transports.File({ filename: 'combined.log' }),

    // 将日志写入数据库
    new MySQLTransport(options),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),                    // 终端中输出彩色的日志信息
      format.simple()
    )
  }));
}

module.exports = logger;
