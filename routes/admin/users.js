const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const { Op } = require('sequelize');
const {
  NotFoundError,
  success,
  failure
} = require('../../utils/response');

/**
 * 查询用户列表
 * GET /admin/users
 */
router.get('/', async function (req, res) {
  try {
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    const condition = {
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset
    };

    if (query.email) {
      condition.where = {
        email: {
          [Op.eq]: query.email
        }
      };
    }

    if (query.username) {
      condition.where = {
        username: {
          [Op.eq]: query.username
        }
      };
    }

    if (query.nickname) {
      condition.where = {
        nickname: {
          [Op.like]: `%${query.nickname}%`
        }
      };
    }

    if (query.role) {
      condition.where = {
        role: {
          [Op.eq]: query.role
        }
      };
    }

    const { count, rows } = await User.findAndCountAll(condition);
    success(res, '查询用户列表成功。', {
      users: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      }
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 查询用户详情
 * GET /admin/users/:id
 */
router.get('/:id', async function (req, res) {
  try {
    const user = await getUser(req);
    success(res, '查询用户成功。', { user });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 创建用户
 * POST /admin/users
 */
router.post('/', async function (req, res) {
  try {
    const body = filterBody(req);

    const user = await User.create(body);
    success(res, '创建用户成功。', { user }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新用户
 * PUT /admin/users/:id
 */
router.put('/:id', async function (req, res) {
  try {
    const user = await getUser(req);
    const body = filterBody(req);

    await user.update(body);
    success(res, '更新用户成功。', { user });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：查询当前用户
 */
async function getUser(req) {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    throw new NotFoundError(`ID: ${id}的用户未找到。`)
  }

  return user;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @return {{email: *, username: *, password: *, nickname: *, gender: *, company: *, introduce: *, role: *, avatar: *}}
 */
function filterBody(req) {
  return {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    gender: req.body.gender,
    company: req.body.company,
    introduce: req.body.introduce,
    role: req.body.role,
    avatar: req.body.avatar
  };
}

module.exports = router;
