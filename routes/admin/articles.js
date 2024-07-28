const express = require('express');
const router = express.Router();
const { Article } = require('../../models');

/**
 * 查询文章列表
 * GET /admin/articles
 */
router.get('/', async function (req, res, next) {
    try {
        const conditions = {
            order: [['id', 'DESC']],
        };

        const articles = await Article.findAll(conditions);

        res.json({
            status: true,
            message: '查询文章列表成功',
            data: articles
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '查询文章列表失败',
            data: {
                errors: [error.message]
            }
        })
    }
});


/**
 * 查询文章详情
 * GET /admin/articles/:id
 */
router.get('/:id', async function (req, res, next) {
    try {
        const { id } = req.params;

        const article = await Article.findByPk(id);

        if (article) {
            return res.json({
                status: true,
                message: '查询文章详情成功',
                data: article
            })
        } else {
            return res.status(404).json({
                status: false,
                message: '文章不存在',
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '查询文章详情失败',
            data: {
                errors: [error.message]
            }
        })
    }
})


/**
 * 创建文章
 * POST /admin/articles
 */
router.post('/', async function (req, res, next) {
    try {
        const { title, content } = req.body;

        const article = await Article.create({
            title,
            content
        });

        // 201表示新建了资源
        res.status(201).json({
            status: true,
            message: '创建文章成功',
            data: article
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: '创建文章失败',
            data: {
                errors: [error.message]
            }
        })
    }
})


/**
 * 删除文章
 * DELETE /admin/articles/:id
 */
router.delete('/:id', async function (req, res, next) {
    try {
        const { id } = req.params;

        const article = await Article.findByPk(id);

        if (article) {
            await article.destroy();

            res.json({
                status: true,
                message: '删除文章成功',
            })

        } else
            res.status(404).json({
                status: false,
                message: '文章不存在',
            })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '删除文章失败',
            data: {
                errors: [error.message]
            }
        })
    }
})


/**
 * 更新文章
 * PUT /admin/articles/:id
 */
router.put('/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const article = await Article.findByPk(id);

        if (article) {
            await article.update({
                title,
                content
            });

            res.json({
                status: true,
                message: '更新文章成功',
                data: article
            })
        } else
            res.status(404).json({
                status: false,
                message: '文章不存在',
            })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: '更新文章失败',
            data: {
                errors: [error.message]
            }
        })
    }
})
module.exports = router;