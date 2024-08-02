const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');


/**
 * 查询用户列表 
 * GET /admin/users
 */
router.get('/', async function (req, res, next) {
    try {
        // 获取查询参数（query参数）
        let { currentPage, pageSize, email, username, nickname, role } = req.query;

        // 分页查询
        // /admin/users?currentPage=1&pageSize=10
        currentPage = Math.abs(Number(currentPage)) || 1;
        pageSize = Math.abs(Number(pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;
        const conditions = {
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: offset,
        };

        // 模糊查询
        // /admin/users?nickname=xxx
        if (email) {
            conditions.where = {
                email: {
                    [Op.eq]: email
                }
            };
        }

        if (username) {
            conditions.where = {
                username: {
                    [Op.eq]: username
                }
            };
        }

        if (nickname) {
            conditions.where = {
                nickname: {
                    [Op.like]: `%${nickname}%`
                }
            };
        }

        if (role) {
            conditions.where = {
                role: {
                    [Op.eq]: role
                }
            };
        }


        // 操作数据库：查找所有用户
        const { count, rows } = await User.findAndCountAll(conditions);

        // 成功响应
        success(res, '查询用户列表成功', {
            users: rows,
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
 * 查询用户详情
 * GET /admin/users/:id
 */
router.get('/:id', async function (req, res, next) {
    try {
        // 查询当前用户
        const user = await getUserByID(req)

        success(res, `查询用户详情成功`, { user })
    } catch (error) {
        failure(res, error);
    }
})


/**
 * 创建用户
 * POST /admin/users
 */
router.post('/', async function (req, res, next) {
    try {
        // 获取body参数
        const body = filterBody(req);

        // 操作数据库： 创建用户
        const user = await User.create(body);

        success(res, '创建用户成功', { user }, 201); // 201表示新建了资源
    } catch (error) {
        failure(res, error);
    }
})


/**
 * 更新用户
 * PUT /admin/users/:id
 */
router.put('/:id', async function (req, res, next) {
    try {
        // 查询当前用户
        const user = await getUserByID(req);

        // 获取body参数
        const body = filterBody(req);

        // 操作数据库： 更新用户
        await user.update(body);

        success(res, '更新用户成功', { user });
    } catch (error) {
        failure(res, error);
    }
})

/**
 * 公共方法：查询当前用户
 */
async function getUserByID(req) {
    // 获取params参数（path参数）
    const { id } = req.params;

    // 操作数据库： 查询当前用户通过id
    const user = await User.findByPk(id);

    if (!user) {
        throw new NotFoundError(`ID: ${id}的用户未找到。`)
    }

    // 返回响应数据
    return user;
}


/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{password, role: (number|string|*), introduce: ({type: *}|*), sex: ({allowNull: boolean, type: *, validate: {notNull: {msg: string}, notEmpty: {msg: string}, isIn: {args: [number[]], msg: string}}}|{defaultValue: number, allowNull: boolean, type: *}|*), nickname: (string|*), company: ({type: *}|*), avatar: ({type: *, validate: {isUrl: {msg: string}}}|*), email: (string|*), username}}
 */
function filterBody(req) {
    return {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        sex: req.body.sex,
        company: req.body.company,
        introduce: req.body.introduce,
        role: req.body.role,
        avatar: req.body.avatar
    };
}

module.exports = router;