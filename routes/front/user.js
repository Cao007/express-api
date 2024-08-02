const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const { success, failure } = require('../../utils/responses');
const { BadRequestError, NotFoundError } = require("../../utils/errors");
const bcrypt = require('bcryptjs');

/**
 * 查询当前登录用户详情
 * GET /front/user/me
 */
router.get('/me', async function (req, res) {
    try {
        const user = await getUser(req);
        success(res, '查询当前用户信息成功。', { user });
    } catch (error) {
        failure(res, error);
    }
});


/**
 * 更新用户信息
 * PUT /front/user/info
 */
router.put('/info', async function (req, res) {
    try {
        const body = {
            nickname: req.body.nickname,
            sex: req.body.sex,
            company: req.body.company,
            introduce: req.body.introduce,
            avatar: req.body.avatar
        };

        const user = await getUser(req);
        await user.update(body);
        success(res, '更新用户信息成功。', { user });
    } catch (error) {
        failure(res, error);
    }
});


/**
 * 更新账户信息
 * PUT /front/user/account
 */
router.put('/account', async function (req, res) {
    try {
        const body = {
            email: req.body.email,
            username: req.body.username,
            current_password: req.body.current_password,
            password: req.body.password,
            confirm_password: req.body.confirm_password
        };

        if (!body.current_password) {
            throw new BadRequestError('当前密码必须填写。');
        }

        if (body.password !== body.confirm_password) {
            throw new BadRequestError('两次输入的密码不一致。');
        }

        // 加上 true 参数，可以查询到加密后的密码
        const user = await getUser(req, true);

        // 验证当前密码是否正确
        const isPasswordValid = bcrypt.compareSync(body.current_password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestError('当前密码不正确。');
        }

        await user.update(body);

        // 删除密码
        delete user.dataValues.password;
        success(res, '更新账户信息成功。', { user });
    } catch (error) {
        failure(res, error);
    }
});


/**
 * 公共方法：查询当前用户
 * @param req
 * @param showPassword
 * @returns {Promise<Model<any, TModelAttributes>>}
 */
async function getUser(req, showPassword = false) {
    // userId，不是从req.params中取了，要从req中取得userId，存的当前登录用户的ID
    const id = req.userId;

    let condition = {};
    if (!showPassword) {
        condition = {
            attributes: { exclude: ['password'] },
        };
    }

    const user = await User.findByPk(id, condition);
    if (!user) {
        throw new NotFoundError(`ID: ${id}的用户未找到。`)
    }

    return user;
}


module.exports = router;
