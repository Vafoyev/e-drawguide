const express = require('express');
const router = express.Router();
const authenticate = require('../../../middlewares/authenticate');
const validate = require('../../../middlewares/validate');

const LibraryController = require('../../../controllers/student/LibraryController');
const VideoController = require('../../../controllers/student/VideoController');
const QuizController = require('../../../controllers/QuizController');

const { submitQuizSchema } = require('../../../requests/quiz/QuizRequest');

router.use(authenticate);

router.get('/library', LibraryController.index);
router.get('/videos', VideoController.index);

router.get('/quizzes', QuizController.index);
router.get('/quizzes/:id', QuizController.show);
router.post('/quizzes/:id/submit', validate(submitQuizSchema), QuizController.submit);

module.exports = router;