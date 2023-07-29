const express = require('express');
const router = express.Router();

const {checkToken} = require('../middleware/token-system')
const {editProfile} = require('../controllers/update-profile');
const {leaderBoard, userInfo, request, configuration} = require('../controllers/ranking-system');
const {resetPassword, passwordResetRequest, form} = require('../controllers/password-reset')
const {register, login} = require('../controllers/registration');
const {verifyEmail} = require('../controllers/VerifyMail');

// Registration & Login
router.get('/verify/:token', checkToken, verifyEmail);
router.post('/register', register);
router.post('/login', login);

// Password Reset
router.post('/password-reset', passwordResetRequest);
router.get('/password-reset/:token',checkToken, form)
router.patch('/password-reset/:token', checkToken, resetPassword);

// Ranking
router.get('/userinfo/:user', userInfo)
router.post('/retrieve/token', request)
router.patch('/configuration/:token',checkToken, configuration)
router.get('/leaderboard', leaderBoard)

// Edit Profile
router.put('/editprofile/:userID', editProfile);

module.exports = router;