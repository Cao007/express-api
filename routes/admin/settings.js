const express = require('express');
const router = express.Router();
const { Setting } = require('../../models');
const { NotFound } = require('http-errors');
const { success, failure } = require('../../utils/responses');
const { delKey } = require('../../utils/redis');


/**
 * 查询系统设置详情
 * GET /admin/settings
 */
router.get('/', async function (req, res) {
  try {
    const setting = await getSetting();
    success(res, '查询系统设置成功。', { setting });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新系统设置
 * PUT /admin/settings
 */
router.put('/', async function (req, res) {
  try {
    const setting = await getSetting();
    const body = filterBody(req);

    await setting.update(body);

    // 删除缓存
    await delKey('setting');

    success(res, '更新系统设置成功。', { setting });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：查询当前系统设置
 */
async function getSetting() {
  const setting = await Setting.findOne();
  if (!setting) {
    throw new NotFound('初始系统设置未找到，请运行种子文件。')
  }

  return setting;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @return {{name: *, icp: *, copyright: *}}
 */
function filterBody(req) {
  return {
    name: req.body.name,
    icp: req.body.icp,
    copyright: req.body.copyright
  };
}

module.exports = router;
