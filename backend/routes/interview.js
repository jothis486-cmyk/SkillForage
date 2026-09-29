const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const auth = require('../middleware/auth');

router.post('/setup', auth, interviewController.setupInterview);
router.post('/run-code', auth, interviewController.runCode);
router.post('/submit', auth, interviewController.submitInterview);
router.get('/history', auth, interviewController.getInterviewHistory);
router.get('/:id', auth, interviewController.getInterviewById);

module.exports = router;
