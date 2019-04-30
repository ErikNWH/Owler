const express = require('express')
const router = express.Router()
const friendCtrl = require('../controllers/friends')
const AuthHelper = require('../Helpers/AuthHelper')

router.post('/follow-user', AuthHelper.VerifyToken, friendCtrl.followUser)
router.post('/unfollow-user', AuthHelper.VerifyToken, friendCtrl.unFollowUser)

module.exports = router;
