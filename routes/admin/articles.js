const express = require('express');
const router = express.Router();
const { Article } = require('../../models');
const { Op, where } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');


/**
 * 查询文章列表 
 * GET /admin/articles
 */
router.get('/', async function (req, res, next) {
    try {
        // 使用req对象中挂载的user对象
        // return res.json({ currentUser: req.user })

        // 获取查询参数（query参数）
        let { currentPage, pageSize, title } = req.query;

        // 分页查询
        // /admin/articles?currentPage=1&pageSize=10
        currentPage = Math.abs(Number(currentPage)) || 1;
        pageSize = Math.abs(Number(pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;
        const conditions = {
            where: {},
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: offset,
        };

        // 模糊查询
        // /admin/articles?title=xxx
        if (title) {
            conditions.where.title = {
                [Op.like]: `%${title}%`
            }
        };

        // 操作数据库：查找所有文章
        const { count, rows } = await Article.findAndCountAll(conditions);

        // 成功响应
        success(res, '查询文章列表成功', {
            articles: rows,
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
 * 查询文章详情
 * GET /admin/articles/:id
 */
router.get('/:id', async function (req, res, next) {
    try {
        // 查询当前文章
        const article = await getArticleByID(req)

        success(res, `查询文章详情成功`, { article })
    } catch (error) {
        failure(res, error);
    }
})


/**
 * 创建文章
 * POST /admin/articles
 */
router.post('/', async function (req, res, next) {
    try {
        // 获取body参数
        const body = filterBody(req);

        // 操作数据库： 创建文章
        const article = await Article.create(body);

        success(res, '创建文章成功', { article }, 201); // 201表示新建了资源
    } catch (error) {
        failure(res, error);
    }
})


/**
 * 删除文章
 * DELETE /admin/articles/:id
 */
router.delete('/:id', async function (req, res, next) {
    try {
        // 查询当前文章
        const article = await getArticleByID(req)

        // 操作数据库：删除文章
        await article.destroy();

        success(res, '删除文章成功')
    } catch (error) {
        failure(res, error);
    }
})


/**
 * 更新文章
 * PUT /admin/articles/:id
 */
router.put('/:id', async function (req, res, next) {
    try {
        // 查询当前文章
        const article = await getArticleByID(req);

        // 获取body参数
        const body = filterBody(req);

        // 操作数据库： 更新文章
        await article.update(body);

        success(res, '更新文章成功', { article });
    } catch (error) {
        failure(res, error);
    }
})

/**
 * 公共方法：查询当前文章
 */
async function getArticleByID(req) {
    // 获取params参数（path参数）
    const { id } = req.params;

    // 操作数据库： 查询当前文章通过id
    const article = await Article.findByPk(id);

    if (!article) {
        throw new NotFoundError(`ID: ${id}的文章未找到。`)
    }

    // 返回响应数据
    return article;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{title, content: (string|string|DocumentFragment|*)}}
 */
function filterBody(req) {
    // 返回白名单过滤后的body参数，忽略用户上传的非法字段
    return {
        title: req.body.title,
        content: req.body.content
    };
}

module.exports = router;