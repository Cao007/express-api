const express = require('express');
const router = express.Router();
const { Course, Category, Chapter, User } = require('../../models');
const { success, failure } = require('../../utils/responses');
const { NotFoundError } = require("../../utils/errors");

/**
 * 查询章节详情
 * GET /chapters/:id
 */
router.get('/:id', async function (req, res) {
  try {
    const { id } = req.params;
    const condition = {
      attributes: { exclude: ['CourseId'] },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'nickname', 'avatar', 'company'],
            }
          ]
        }
      ]
    };

    const chapter = await Chapter.findByPk(id, condition);
    if (!chapter) {
      throw new NotFoundError(`ID: ${id}的章节未找到。`)
    }

    // 同属一个课程的所有章节
    const chapters = await Chapter.findAll({
      attributes: { exclude: ['CourseId', 'content'] },
      where: { courseId: chapter.courseId },
      order: [['rank', 'ASC'], ['id', 'DESC']]
    });

    success(res, '查询章节成功。', { chapter, chapters });
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;
