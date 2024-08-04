const express = require('express');
const router = express.Router();
const { Tree } = require('../models');
const { success, failure } = require('../utils/responses');

/**
 * 使用递归，构建无限级树形结构
 * @param trees
 * @param parentId
 * @returns {*[]}
 */
function buildTree(trees, parentId = 0) {
    const treeArr = [];

    trees.forEach(tree => {
        if (tree.parentId === parentId) {
            let children = buildTree(trees, tree.id);
            if (children.length > 0) {
                tree.children = children;
            }
            treeArr.push(tree);
        }
    })

    return treeArr;
}

/**
 * 查询教程列表
 * GET /trees
 */
router.get('/', async function (req, res) {
    try {
        const trees = await Tree.findAll({
            order: [
                ['parentId', 'ASC'],
                ['rank', 'ASC'],
                ['id', 'ASC']
            ]
        });

        // 将trees转换成普通js对象
        const treesObj = trees.map((tree) => tree.toJSON());

        // 生成树形结构
        const treeArr = buildTree(treesObj);

        success(res, '查询教程列表成功。', { treeArr });
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
