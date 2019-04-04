const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/posts')
const AuthHelper = require('../Helpers/AuthHelper')

/**
 * @description Router for posts
 */

router.get('/posts', AuthHelper.VerifyToken, postCtrl.GetAllPosts);

router.post('/post/add-post', AuthHelper.VerifyToken, postCtrl.addPost);
router.post('/post/add-like', AuthHelper.VerifyToken, postCtrl.addLike);

module.exports = router;