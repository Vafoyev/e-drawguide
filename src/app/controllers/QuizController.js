const QuizService = require('../../services/QuizService');
const QuizResource = require('../resources/QuizResource');
const catchAsync = require('../../utils/catchAsync');

class QuizController {
    index = catchAsync(async (req, res) => {
        const quizzes = await QuizService.getAllQuizzes(req.user.role);
        res.status(200).json({
            success: true,
            data: QuizResource.format(quizzes, req.user.role)
        });
    });

    show = catchAsync(async (req, res) => {
        const quiz = await QuizService.getQuizById(req.params.id, req.user.role);
        res.status(200).json({
            success: true,
            data: QuizResource.format(quiz, req.user.role)
        });
    });

    create = catchAsync(async (req, res) => {
        const quiz = await QuizService.createQuiz(req.body);
        res.status(201).json({
            success: true,
            data: quiz
        });
    });

    addQuestion = catchAsync(async (req, res) => {
        const question = await QuizService.addQuestion(req.params.id, req.body);
        res.status(201).json({
            success: true,
            data: question
        });
    });

    submit = catchAsync(async (req, res) => {
        const result = await QuizService.submitQuiz(req.user.id, req.params.id, req.body.answers);
        res.status(200).json({
            success: true,
            data: result
        });
    });
}

module.exports = new QuizController();