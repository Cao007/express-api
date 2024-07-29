const express = require('express');
const router = express.Router();
const { Category, Course } = require('../../models');
const { Op } = require('sequelize');
const {
    NotFoundError,
    success,
    failure
} = require('../../utils/response');

/**
 * 查询分类列表 
 * GET /admin/categories
 */
router.get('/', async function (req, res, next) {
    try {
        // 获取查询参数（query参数）
        let { currentPage, pageSize, name } = req.query;

        // 分页查询
        // /admin/categories?currentPage=1&pageSize=10
        currentPage = Math.abs(Number(currentPage)) || 1;
        pageSize = Math.abs(Number(pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;
        const conditions = {
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: offset,
        };

        // 模糊查询
        // /admin/categories?name=xxx
        if (name) {
            conditions.where = {
                name: {
                    [Op.like]: `%${name}%`
                }
            }
        };

        // 操作数据库：查找所有分类
        const { count, rows } = await Category.findAndCountAll(conditions);

        // 成功响应
        success(res, '查询分类列表成功', {
            categories: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize,
            }
        })
    } catch (error) {
        // 错误响应
        failure(res, error);
    }
});


/**
 * 查询分类详情
 * GET /admin/categories/:id
 */
router.get('/:id', async function (req, res, next) {
    try {
        // 查询当前分类
        const category = await getCategoryByID(req)

        success(res, `查询分类详情成功`, { category })
    } catch (error) {
        failure(res, error);
    }
})


/**
 * 创建分类
 * POST /admin/categories
 */
router.post('/', async function (req, res, next) {
    try {
        // 获取body参数
        const body = filterBody(req);

        // 操作数据库： 创建分类
        const category = await Category.create(body);

        success(res, '创建分类成功', { category }, 201); // 201表示新建了资源
    } catch (error) {
        failure(res, error);
    }
})


/**
 * 删除分类
 * DELETE /admin/categories/:id
 */
router.delete('/:id', async function (req, res, next) {
    try {
        // 查询当前分类
        const category = await getCategoryByID(req)

        // 删除分类前，查询是否该分类下有课程
        const count = await Course.count({ where: { categoryId: req.params.id } });
        if (count > 0) {
            throw new Error('当前分类有课程，无法删除。');
        }

        // 操作数据库：删除分类
        await category.destroy();

        success(res, '删除分类成功')
    } catch (error) {
        failure(res, error);
    }
})


/**
 * 更新分类
 * PUT /admin/categories/:id
 */
router.put('/:id', async function (req, res, next) {
    try {
        // 查询当前分类
        const category = await getCategoryByID(req);

        // 获取body参数
        const body = filterBody(req);

        // 操作数据库： 更新分类
        await category.update(body);

        success(res, '更新分类成功', { category });
    } catch (error) {
        failure(res, error);
    }
})

/**
 * 公共方法：查询当前分类
 */
async function getCategoryByID(req) {
    // 获取params参数（path参数）
    const { id } = req.params;

    // 查询一个分类下的所有课程
    const condition = {
        include: [
            {
                model: Course,
                as: 'courses',
            },
        ]
    }

    // 操作数据库： 查询当前分类通过id
    const category = await Category.findByPk(id, condition);

    if (!category) {
        throw new NotFoundError(`ID: ${id}的分类未找到。`)
    }

    // 返回响应数据
    return category;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{name, rank: * (number|*|string)}}
 */
function filterBody(req) {
    // 返回白名单过滤后的body参数，忽略用户上传的非法字段
    return {
        name: req.body.name,
        rank: req.body.rank
    };
}

module.exports = router;