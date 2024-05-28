const express = require('express');
const router = express.Router();
const { Article } = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError, success, failure } = require('../../utils/response');

/**
 * 公共方法：白名单过滤
 */
function filterBody(req) {
    return {
        title: req.body.title,
        content: req.body.content
    }
}

/**
 * 公共方法：查询文章
 */
async function getArticle(req) {
    const { id } = req.params;
    const article = await Article.findByPk(id);
    if (!article) {
        throw new NotFoundError(`id为${id}的文章不存在`);
    }
    return article;
}


/**
 * 查询文章列表
 * GET /admin/articles
 */
router.get('/', async function (req, res, next) {
    try {
        const query = req.query;

        const currentPage = Math.abs(Number(query.currentPage) || 1);
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;

        const conditions = {
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: offset
        };

        if (query.title) {
            conditions.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
            }
        }

        const { count, rows } = await Article.findAndCountAll(conditions);

        success(res, '查询文章列表成功', {
            articles: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize
            }
        })
    } catch (error) {
        failure(res, error)
    }
});


/**
 * 查询文章详情
 * GET /admin/articles/:id
 */
router.get('/:id', async function (req, res, next) {
    try {
        const article = await getArticle(req);

        success(res, '查询文章详情成功', {
            article
        })
    } catch (error) {
        failure(res, error)
    }
})


/**
 * 创建文章
 * POST /admin/articles
 */
router.post('/', async function (req, res, next) {
    try {
        //  白名单过滤
        const body = filterBody(req)

        const article = await Article.create(body);

        // 201表示新建了资源
        success(res, '创建文章成功', {
            article
        }, 201)

    } catch (error) {
        failure(res, error)
    }
})


/**
 * 删除文章
 * DELETE /admin/articles/:id
 */
router.delete('/:id', async function (req, res, next) {
    try {
        const article = await getArticle(req);

        await article.destroy();

        success(res, '删除文章成功')
    } catch (error) {
        failure(res, error)
    }
})


/**
 * 更新文章
 * PUT /admin/articles/:id
 */
router.put('/:id', async function (req, res, next) {
    try {
        const article = await getArticle(req);
        const body = filterBody(req)

        await article.update(body);

        success(res, '更新文章成功', {
            article
        })

    } catch (error) {
        failure(res, error)
    }
})

module.exports = router;
