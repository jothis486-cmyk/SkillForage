const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const upload = require('../middleware/upload');

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.post('/resume', auth, upload.single('resume'), userController.uploadResume);

module.exports = router;
