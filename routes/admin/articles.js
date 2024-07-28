const express = require('express');
const router = express.Router();
const { Article } = require('../../models');
const { Op } = require('sequelize');

/**
 * 查询文章列表
 * GET /admin/articles
 */
router.get('/', async function (req, res, next) {
    try {
        // 获取查询参数（query参数）
        let { currentPage, pageSize, title } = req.query;

        // 如果没有传递这两个参数，就使用默认值
        // /admin/articles?currentPage=1&pageSize=10
        currentPage = Math.abs(Number(currentPage)) || 1;
        pageSize = Math.abs(Number(pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;

        const conditions = {
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: offset,
        };

        // 如果有查询参数title，则添加模糊查询条件
        // /admin/articles?title=xxx
        if (title) {
            conditions.where = {
                title: {
                    [Op.like]: `%${title}%`
                }
            }
        };

        const { count, rows } = await Article.findAndCountAll(conditions);

        res.json({
            status: true,
            message: '查询文章列表成功',
            data: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize,
            }
        })
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({
                status: false,
                message: '参数验证失败',
                errors
            })
        } else {
            res.status(500).json({
                status: false,
                message: '查询文章列表失败',
                data: {
                    errors: [error.message]
                }
            })
        }
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
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({
                status: false,
                message: '参数验证失败',
                errors
            })
        } else {
            res.status(500).json({
                status: false,
                message: '查询文章详情失败',
                data: {
                    errors: [error.message]
                }
            })
        }
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
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({
                status: false,
                message: '参数验证失败',
                errors
            })
        } else {
            res.status(500).json({
                status: false,
                message: '创建文章失败',
                data: {
                    errors: [error.message]
                }
            })
        }
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
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({
                status: false,
                message: '参数验证失败',
                errors
            })
        } else {
            res.status(500).json({
                status: false,
                message: '删除文章失败',
                data: {
                    errors: [error.message]
                }
            })
        }
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
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({
                status: false,
                message: '参数验证失败',
                errors
            })
        } else {
            res.status(500).json({
                status: false,
                message: '更新文章失败',
                data: {
                    errors: [error.message]
                }
            })
        }
    }
})

module.exports = router;