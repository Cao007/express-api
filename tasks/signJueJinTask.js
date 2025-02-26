const schedule = require('node-schedule')
const axios = require('axios')

const config = {
  url: 'https://juejin.cn',
  check_url: 'https://api.juejin.cn/growth_api/v1/check_in?aid=2608&uuid=7462061791562090021',
  status_url:
    'https://api.juejin.cn/growth_api/v2/get_today_status?aid=2608&uuid=7462061791562090021',
  cookie: '8f2a45f6788b9748e08a29f4117ba78c'
}

let job = null // 存储定时任务的对象

function signJueJinTask() {
  schedule.scheduleJob('*/5 * * * * *', async () => {
    try {
      // 先检查今日是否已签到
      const statusRes = await axios.get(config.status_url, {
        headers: {
          Referer: config.url,
          Cookie: config.cookie
        }
      })

      console.log('签到状态:', statusRes.data)

      if (statusRes.data.data.check_in_done) {
        console.log('今天已经签到过了，停止定时任务')
      }

      // 执行签到
      const response = await axios.post(
        config.check_url,
        {},
        {
          headers: {
            Referer: config.url,
            Cookie: config.cookie
          }
        }
      )

      console.log('签到结果:', response.data)

      // 如果签到成功，取消定时任务
      if (response.data.err_no === 0) {
        console.log('签到成功，停止定时任务')
      }
    } catch (error) {
      console.error('请求失败:', error.response ? error.response.status : error.message)
      console.error('错误详情:', error.response ? error.response.data : '无数据')
    }
  })
}

module.exports = signJueJinTask
