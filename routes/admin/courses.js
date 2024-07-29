const express = require('express');
const router = express.Router();
const { Course, Category, User, Chapter } = require('../../models');
const { Op } = require('sequelize');
const {
    NotFoundError,
    success,
    failure
} = require('../../utils/response');

/**
 * 查询课程列表 
 * GET /admin/courses
 */
router.get('/', async function (req, res, next) {
    try {
        // 获取查询参数（query参数）
        let { currentPage, pageSize, categoryId, userId, name, recommended, introductory } = req.query;

        // 分页查询
        // /admin/courses?currentPage=1&pageSize=10
        currentPage = Math.abs(Number(currentPage)) || 1;
        pageSize = Math.abs(Number(pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;
        const conditions = {
            ...getCondition(),
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: offset,
        };

        // 模糊查询
        // /admin/courses?title=xxx
        if (categoryId) {
            conditions.where = {
                categoryId: {
                    [Op.eq]: categoryId
                }
            };
        }

        if (userId) {
            conditions.where = {
                userId: {
                    [Op.eq]: userId
                }
            };
        }

        if (name) {
            conditions.where = {
                name: {
                    [Op.like]: `%${name}%`
                }
            };
        }

        if (recommended) {
            conditions.where = {
                recommended: {
                    // 需要转布尔值
                    [Op.eq]: recommended === 'true'
                }
            };
        }

        if (introductory) {
            conditions.where = {
                introductory: {
                    [Op.eq]: introductory === 'true'
                }
            };
        }

        // 操作数据库：查找所有课程
        const { count, rows } = await Course.findAndCountAll(conditions);

        // 成功响应
        success(res, '查询课程列表成功', {
            courses: rows,
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
 * 查询课程详情
 * GET /admin/courses/:id
 */
router.get('/:id', async function (req, res, next) {
    try {
        // 查询当前课程
        const course = await getCourseByID(req)

        success(res, `查询课程详情成功`, { course })
    } catch (error) {
        failure(res, error);
    }
})


/**
 * 创建课程
 * POST /admin/courses
 */
router.post('/', async function (req, res, next) {
    try {
        // 获取body参数
        const body = filterBody(req);

        // 操作数据库： 创建课程
        const course = await Course.create(body);

        success(res, '创建课程成功', { course }, 201); // 201表示新建了资源
    } catch (error) {
        failure(res, error);
    }
})


/**
 * 删除课程
 * DELETE /admin/courses/:id
 */
router.delete('/:id', async function (req, res, next) {
    try {
        // 查询当前课程
        const course = await getCourseByID(req)

        // 查询当前课程是否有章节，有则无法删除
        const count = await Chapter.count({ where: { courseId: req.params.id } });
        if (count > 0) {
            throw new Error('当前课程有章节，无法删除。');
        }

        // 操作数据库：删除课程
        await course.destroy();

        success(res, '删除课程成功')
    } catch (error) {
        failure(res, error);
    }
})


/**
 * 更新课程
 * PUT /admin/courses/:id
 */
router.put('/:id', async function (req, res, next) {
    try {
        // 查询当前课程
        const course = await getCourseByID(req);

        // 获取body参数
        const body = filterBody(req);

        // 操作数据库： 更新课程
        await course.update(body);

        success(res, '更新课程成功', { course });
    } catch (error) {
        failure(res, error);
    }
})

/**
 * 公共方法：查询当前课程
 */
async function getCourseByID(req) {
    // 获取params参数（path参数）
    const { id } = req.params;

    // 添加查询条件
    const condition = getCondition();

    // 操作数据库： 查询当前课程通过id
    const course = await Course.findByPk(id, condition);

    if (!course) {
        throw new NotFoundError(`ID: ${id}的课程未找到。`)
    }

    // 返回响应数据
    return course;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{image: *, name, introductory: (boolean|*), userId: (number|*), categoryId: (number|*), content, recommended: (boolean|*)}}
 */
function filterBody(req) {
    return {
        categoryId: req.body.categoryId,
        userId: req.body.userId,
        name: req.body.name,
        image: req.body.image,
        recommended: req.body.recommended,
        introductory: req.body.introductory,
        content: req.body.content
    };
}

/**
 * 公共方法：关联分类、用户数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
    return {
        attributes: { exclude: ['CategoryId', 'UserId'] },
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
            }
        ]
    }
}

module.exports = router;