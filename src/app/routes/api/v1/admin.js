const express = require('express');
const router = express.Router();
const authenticate = require('../../../middlewares/authenticate');
const authorize = require('../../../middlewares/authorize');
const upload = require('../../../middlewares/upload');
const { checkFileSignature } = require('../../../middlewares/fileSecurity');
const validate = require('../../../middlewares/validate');
const auditLogger = require('../../../middlewares/auditLogger');

const LibraryController = require('../../../controllers/admin/LibraryController');
const VideoController = require('../../../controllers/admin/VideoController');
const UserController = require('../../../controllers/admin/UserController');
const QuizController = require('../../../controllers/QuizController');

const { createLibrarySchema } = require('../../../requests/library/LibraryRequest');
const { createVideoSchema } = require('../../../requests/video/VideoRequest');
const { addQuestionSchema } = require('../../../requests/quiz/QuizRequest');

router.use(authenticate, authorize('admin'));

router.post('/library',
    auditLogger('Library'),
    upload.fields([{ name: 'book_file', maxCount: 1 }, { name: 'cover_file', maxCount: 1 }]),
    checkFileSignature(['pdf', 'jpg', 'png', 'jpeg']),
    validate(createLibrarySchema),
    LibraryController.create
);

router.delete('/library/:id', auditLogger('Library'), LibraryController.delete);

router.post('/videos',
    auditLogger('Video'),
    upload.single('thumbnail_file'),
    checkFileSignature(['jpg', 'png', 'jpeg']),
    validate(createVideoSchema),
    VideoController.create
);

router.delete('/videos/:id', auditLogger('Video'), VideoController.delete);
router.patch('/videos/:id/restore', auditLogger('Video'), VideoController.restore);

router.get('/users', UserController.index);
router.get('/results', UserController.getResults);

router.get('/quizzes', QuizController.index);
router.post('/quizzes', auditLogger('Quiz'), QuizController.create);

router.post('/quizzes/:id/questions',
    auditLogger('Quiz'),
    validate(addQuestionSchema),
    QuizController.addQuestion
);

module.exports = router;