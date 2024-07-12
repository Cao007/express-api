/**
 * 自定义404错误类
 */
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}


/**
 * 请求成功响应
 */
function success(res, message, data = {}, code = 200) {
    return res.status(code).json({
        status: true,
        message,
        data
    })
}


/**
 * 请求失败响应
 */
function failure(res, error) {
    if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(item => item.message);
        return res.status(400).json({
            status: false,
            message: '请求参数校验失败',
            errors
        })
    } 

    if (error.name === 'NotFoundError') {
        return res.status(404).json({
            status: false,
            message: '资源未找到',
            errors: [error.message]
        })
    }

    return res.status(500).json({
        status: false,
        message: '服务器错误',
        errors: [error.message]
    })
}

module.exports = {
    NotFoundError,
    success,
    failure
}