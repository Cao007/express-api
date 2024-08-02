const express = require('express');
const router = express.Router();
const { Setting } = require('../../models');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');


/**
 * 查询系统设置详情
 * GET /admin/categories/
 */
router.get('/', async function (req, res, next) {
    try {
        // 查询当前系统设置
        const setting = await getSettingByID(req)

        success(res, `查询系统设置详情成功`, { setting })
    } catch (error) {
        failure(res, error);
    }
})


/**
 * 更新系统设置
 * PUT /admin/categories/
 */
router.put('/', async function (req, res, next) {
    try {
        // 查询当前系统设置
        const setting = await getSettingByID(req);

        // 获取body参数
        const body = filterBody(req);

        // 操作数据库： 更新系统设置
        await setting.update(body);

        success(res, '更新系统设置成功', { setting });
    } catch (error) {
        failure(res, error);
    }
})

/**
 * 公共方法：查询当前系统设置
 */
async function getSettingByID(req) {
    // 操作数据库： 查询当前系统设置
    const setting = await Setting.findByPk(1);

    if (!setting) {
        throw new NotFoundError(`ID: ${id}的系统设置未找到。`)
    }

    // 返回响应数据
    return setting;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{copyright: (string|*), icp: (string|string|DocumentFragment|*), name}}
 */
function filterBody(req) {
    return {
        name: req.body.name,
        icp: req.body.icp,
        copyright: req.body.copyright
    };
}


module.exports = router;