const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth')

/**
 * @description Router for login and register
 */

router.post('/register', authCtrl.CreateUser);
router.post('/login', authCtrl.LoginUser)

module.exports = router;