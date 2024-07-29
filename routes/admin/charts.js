const express = require('express');
const router = express.Router();
const { sequelize, User } = require('../../models');
const { Op } = require('sequelize');
const {
    NotFoundError,
    success,
    failure
} = require('../../utils/response');

/**
 * 统计用户性别
 * GET /admin/charts/sex
 */
router.get('/sex', async function (req, res, next) {
    try {
        // 查询用户性别
        const male = await User.count({ where: { sex: 0 } });
        const female = await User.count({ where: { sex: 1 } });
        const unknown = await User.count({ where: { sex: 2 } });

        // 构造数据
        const data = [
            { value: male, name: '男性' },
            { value: female, name: '女性' },
            { value: unknown, name: '未选择' }
        ];

        // 成功响应
        success(res, '统计用户性别数量成功', { data });
    } catch (error) {
        // 错误响应
        failure(res, error);
    }
});


/**
 * 统计每个月注册的用户数量
 * GET /admin/charts/user
 */
router.get('/user', async (req, res) => {
    try {
        const [results] = await sequelize.query("SELECT DATE_FORMAT(`createdAt`, '%Y-%m') AS `month`, COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC");

        const data = {
            months: [],
            values: [],
        };

        results.forEach(item => {
            data.months.push(item.month);
            data.values.push(item.value);
        });

        success(res, '统计每个月注册的用户数量成功', { data });

    } catch (error) {
        failure(res, error);
    }
});


module.exports = router;