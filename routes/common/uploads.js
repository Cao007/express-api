const express = require('express');
const router = express.Router();
const { success, failure } = require('../../utils/responses');
const { config, client, singleFileUpload } = require('../../utils/aliyun');
const { BadRequest } = require('http-errors')
const { Attachment } = require('../../models');

/**
 * 阿里云 OSS 客户端上传
 * POST /common/uploads/aliyun
 */
router.post('/aliyun', function (req, res) {
  try {
    singleFileUpload(req, res, async function (error) {
      if (error) {
        return failure(res, error);
      }

      if (!req.file) {
        return failure(res, new BadRequest('请选择要上传的文件。'));
      }

      // 记录附件信息
      await Attachment.create({
        ...req.file,
        userId: req.userId,
        fullpath: req.file.path + '/' + req.file.filename,
      })

      success(res, '上传成功。', { file: req.file });
    });
  } catch (error) {
    failure(res, error);
  }
})

module.exports = router;