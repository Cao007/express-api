const express = require('express');
const router = express.Router();
const { success, failure } = require('../utils/responses');
const qiniu = require('qiniu');

/**
 * 获取七牛云上传信息
 * GET /uploads/qiniu
 */
router.get('/qiniu', async function (req, res) {
    try {
        const accessKey = process.env.QINIU_ACCESS_KEY;
        const secretKey = process.env.QINIU_SECRET_KEY;
        const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

        const options = {
            scope: process.env.QINIU_BUCKET,
        };
        const putPolicy = new qiniu.rs.PutPolicy(options);
        const uploadToken = putPolicy.uploadToken(mac);

        success(res, '获取七牛云上传信息成功', {
            domain: process.env.QINIU_DOMAIN,
            uploadURL: process.env.QINIU_UPLOAD_URL,
            uploadToken,
        })
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
