const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const { success, failure } = require('../../utils/responses');
const { NotFound, BadRequest, Unauthorized } = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
const validateCaptcha = require('../../middlewares/validate-captcha');
const { delKey } = require('../../utils/redis');
const sendMail = require('../../utils/mail');


/**
 * 用户注册
 * POST /front/auth/sign_up
 */
router.post('/sign_up', validateCaptcha, async function (req, res) {
  try {
    const body = {
      email: req.body.email,
      username: req.body.username,
      nickname: req.body.nickname,
      password: req.body.password,
      gender: req.body.gender,
      role: 0
    }

    const user = await User.create(body);
    delete user.dataValues.password; // 删除密码字段

    // 请求成功，删除验证码，防止在有效期内重复使用
    await delKey(req.body.captchaKey);

    // 发送邮件
    const html = `
      您好，<span style="color: red">${user.nickname}。</span><br><br>
      恭喜，您已成功注册会员！<br><br>
      `;
    await sendMail(user.email, 'express-api 注册成功', html);
        
    success(res, '创建用户成功。', { user }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 用户登录
 * POST /front/auth/sign_in
 */
router.post('/sign_in', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login) {
      throw new BadRequest('邮箱/用户名必须填写。');
    }

    if (!password) {
      throw new BadRequest('密码必须填写。');
    }

    const condition = {
      where: {
        [Op.or]: [
          { email: login },
          { username: login }
        ]
      }
    };

    // 通过email或username，查询用户是否存在
    const user = await User.findOne(condition);
    if (!user) {
      throw new NotFound('用户不存在，无法登录。');
    }

    // 验证密码
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new Unauthorized('密码错误。');
    }

    // 生成身份验证令牌
    const token = jwt.sign({
      userId: user.id
    }, process.env.SECRET, { expiresIn: '30d' }
    );
    success(res, '登录成功。', { token });
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;
