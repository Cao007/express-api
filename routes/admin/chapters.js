const express = require('express');
const router = express.Router();
const { Chapter, Course } = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');


/**
 * 查询章节列表 
 * GET /admin/chapters
 */
router.get('/', async function (req, res, next) {
    try {
        // 获取查询参数（query参数）
        let { currentPage, pageSize, title, courseId } = req.query;

        // 章节是不能脱离课程存在,如果没有传课程courseId过来，直接提示错误
        if (!courseId) throw new NotFoundError('课程ID不能为空');

        // 分页查询
        // /admin/chapters?currentPage=1&pageSize=10
        currentPage = Math.abs(Number(currentPage)) || 1;
        pageSize = Math.abs(Number(pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;
        const conditions = {
            ...getCondition(),
            // 先按照rank字段，从小到大排序。如果出现了两个相同的rank值，再用id来从小到大来排序
            order: [
                ['rank', 'ASC'],
                ['id', 'ASC']
            ],
            limit: pageSize,
            offset: offset,
        };

        conditions.where = {
            courseId: {
                [Op.eq]: courseId
            }
        };

        // 模糊查询
        // /admin/chapters?title=xxx
        if (title) {
            conditions.where = {
                title: {
                    [Op.like]: `%${title}%`
                }
            }
        };

        // 操作数据库：查找所有章节
        const { count, rows } = await Chapter.findAndCountAll(conditions);

        // 成功响应
        success(res, '查询章节列表成功', {
            chapters: rows,
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
 * 查询章节详情
 * GET /admin/chapters/:id
 */
router.get('/:id', async function (req, res, next) {
    try {
        // 查询当前章节
        const chapter = await getChapterByID(req)

        success(res, `查询章节详情成功`, { chapter })
    } catch (error) {
        failure(res, error);
    }
})


/**
 * 创建章节
 * POST /admin/chapters
 */
router.post('/', async function (req, res, next) {
    try {
        // 获取body参数
        const body = filterBody(req);

        // 操作数据库： 创建章节
        const chapter = await Chapter.create(body);

        success(res, '创建章节成功', { chapter }, 201); // 201表示新建了资源
    } catch (error) {
        failure(res, error);
    }
})


/**
 * 删除章节
 * DELETE /admin/chapters/:id
 */
router.delete('/:id', async function (req, res, next) {
    try {
        // 查询当前章节
        const chapter = await getChapterByID(req)

        // 操作数据库：删除章节
        await chapter.destroy();

        success(res, '删除章节成功')
    } catch (error) {
        failure(res, error);
    }
})


/**
 * 更新章节
 * PUT /admin/chapters/:id
 */
router.put('/:id', async function (req, res, next) {
    try {
        // 查询当前章节
        const chapter = await getChapterByID(req);

        // 获取body参数
        const body = filterBody(req);

        // 操作数据库： 更新章节
        await chapter.update(body);

        success(res, '更新章节成功', { chapter });
    } catch (error) {
        failure(res, error);
    }
})

/**
 * 公共方法：查询当前章节
 */
async function getChapterByID(req) {
    // 获取params参数（path参数）
    const { id } = req.params;

    // 添加查询条件
    const condition = getCondition();

    // 操作数据库： 查询当前章节通过id
    const chapter = await Chapter.findByPk(id, condition);

    if (!chapter) {
        throw new NotFoundError(`ID: ${id}的章节未找到。`)
    }

    // 返回响应数据
    return chapter;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{rank: (number|*), video: (string|boolean|MediaTrackConstraints|VideoConfiguration|*), title, courseId: (number|*), content}}
 */
function filterBody(req) {
    return {
        courseId: req.body.courseId,
        title: req.body.title,
        content: req.body.content,
        video: req.body.video,
        rank: req.body.rank
    };
}

/**
 * 公共方法：关联课程数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
    return {
        attributes: { exclude: ['CourseId'] },
        include: [
            {
                model: Course,
                as: 'course',
                attributes: ['id', 'name']
            }
        ]
    }
}

module.exports = router;