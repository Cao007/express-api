const { sequelize } = require('../models')

// 定义一个全局变量，用于保存当前 res 响应
// 定义客户端集合，保存每一个与浏览器建立 SSE 连接的响应对象（res）
const clients = new Set()

/**
 * 初始化每个月用户数量数据流
 * @param res
 * @param req
 */
function initUserStream(res, req) {
  // 设置 event-stream 响应头
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // 将当前客户端响应对象添加到集合中
  clients.add(res)

  // 停止响应
  req.on('close', () => {
    clients.delete(res)
  })
}

/**
 * 广播每个月用户数量
 * @returns {Promise<void>}
 */
async function broadUserCount() {
  const [results] = await sequelize.query(
    "SELECT DATE_FORMAT(`createdAt`, '%Y-%m') AS `month`, COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC"
  )

  // 处理数据为echarts格式
  const data = {
    months: [],
    values: []
  }
  results.forEach((item) => {
    data.months.push(item.month)
    data.values.push(item.value)
  })

  // 发送数据给所有客户端
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(data)}\n\n`)
  })
}

module.exports = { initUserStream, broadUserCount }
