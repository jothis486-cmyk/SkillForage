const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/chat', auth, aiController.chat);
router.post('/roadmap', auth, aiController.generateRoadmap);
router.post('/mock-interview', auth, aiController.mockInterview);
router.post('/project-builder', auth, aiController.generateProjectBlueprint);
router.post('/debug', auth, aiController.debugCode);
router.post('/github-analyze', auth, aiController.analyzeGithub);
router.post('/resume-job-match', auth, aiController.matchJob);
router.post('/predict-success', auth, aiController.predictSuccess);
router.post('/doc-generator', auth, aiController.generateDoc);
router.post('/review-project', auth, aiController.reviewProject);

module.exports = router;

