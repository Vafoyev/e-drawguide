const { Quiz, Question, Result } = require('../database');
const AppError = require('../utils/AppError');
const transactional = require('../utils/transactional');
const { CacheManager } = require('../utils/cache');
const { t } = require('../utils/i18n');

class QuizService {
    async getAllQuizzes(userRole) {
        const cacheKey = `quizzes:list:${userRole}`;
        const cached = await CacheManager.get(cacheKey);
        if (cached) return cached;

        const where = userRole === 'admin' ? {} : { is_active: true };
        const quizzes = await Quiz.findAll({
            where,
            order: [['created_at', 'DESC']]
        });

        await CacheManager.set(cacheKey, quizzes, 1800);
        return quizzes;
    }

    async getQuizById(id, userRole) {
        const cacheKey = `quiz:${id}:${userRole}`;
        const cached = await CacheManager.get(cacheKey);
        if (cached) return cached;

        const questionScope = userRole === 'admin' ? 'withAnswer' : 'defaultScope';
        const quiz = await Quiz.findByPk(id, {
            include: [{
                model: Question.scope(questionScope),
                as: 'questions'
            }]
        });

        if (!quiz) throw new AppError('quiz.not_found', 404);

        await CacheManager.set(cacheKey, quiz, 1800);
        return quiz;
    }

    createQuiz = transactional(async (data, transaction) => {
        const quiz = await Quiz.create(data, { transaction });
        await CacheManager.invalidate('quizzes:list:*');
        return quiz;
    });

    addQuestion = transactional(async (quizId, questionData, transaction) => {
        const quiz = await Quiz.findByPk(quizId, { transaction });
        if (!quiz) throw new AppError('quiz.not_found', 404);

        const question = await Question.create({
            quiz_id: quizId,
            question_text: questionData.question_text,
            options: questionData.options,
            correct_answer: questionData.correct_answer.trim().toUpperCase()
        }, { transaction });

        await CacheManager.invalidate(`quiz:${quizId}:*`);
        await CacheManager.invalidate(`quiz_answers:${quizId}`);
        return question;
    });

    submitQuiz = transactional(async (userId, quizId, userAnswers, lang = 'uz', transaction) => {
        const answersCacheKey = `quiz_answers:${quizId}`;
        let correctAnswersMap = await CacheManager.get(answersCacheKey);

        if (!correctAnswersMap) {
            const questions = await Question.scope('withAnswer').findAll({
                where: { quiz_id: quizId },
                attributes: ['id', 'correct_answer'],
                transaction
            });

            if (questions.length === 0) throw new AppError(t('quiz.no_questions', lang), 404);

            correctAnswersMap = {};
            questions.forEach(q => {
                correctAnswersMap[q.id] = String(q.correct_answer).trim().toUpperCase();
            });

            await CacheManager.set(answersCacheKey, correctAnswersMap, 3600);
        }

        let score = 0;
        const totalQuestions = Object.keys(correctAnswersMap).length;
        const processedQuestions = new Set();

        userAnswers.forEach(ans => {
            if (!processedQuestions.has(ans.question_id)) {
                const correctAnswer = correctAnswersMap[ans.question_id];
                const studentAnswer = String(ans.selected_option || '').trim().toUpperCase();

                if (correctAnswer && correctAnswer === studentAnswer) {
                    score++;
                }
                processedQuestions.add(ans.question_id);
            }
        });

        try {
            const result = await Result.create({
                user_id: userId,
                quiz_id: quizId,
                score: score,
                total_questions: totalQuestions
            }, { transaction });

            return {
                result_id: result.id,
                correct: score,
                total: totalQuestions,
                percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0,
                submitted_at: result.created_at
            };
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new AppError(t('validation.unique_constraint', lang), 409);
            }
            throw error;
        }
    });
}

module.exports = new QuizService();