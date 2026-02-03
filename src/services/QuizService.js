const { Quiz, Question, Result } = require('../database');
const AppError = require('../utils/AppError');
const transactional = require('../utils/transactional');
const { CacheManager } = require('../utils/cache');

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

    async createQuiz(data) {
        const quiz = await Quiz.create(data);
        await CacheManager.invalidate('quizzes:list:*');
        return quiz;
    }

    async addQuestion(quizId, questionData) {
        const quiz = await Quiz.findByPk(quizId);
        if (!quiz) throw new AppError('quiz.not_found', 404);

        const question = await Question.create({
            quiz_id: quizId,
            question_text: questionData.question_text,
            options: questionData.options,
            correct_answer: questionData.correct_answer
        });

        await CacheManager.invalidate(`quiz:${quizId}:*`);
        await CacheManager.invalidate(`quiz_answers:${quizId}`);
        return question;
    }

    async submitQuiz(userId, quizId, userAnswers) {
        const answersCacheKey = `quiz_answers:${quizId}`;
        let correctAnswersMap = await CacheManager.get(answersCacheKey);

        if (!correctAnswersMap) {
            const questions = await Question.scope('withAnswer').findAll({
                where: { quiz_id: quizId },
                attributes: ['id', 'correct_answer']
            });

            if (questions.length === 0) throw new AppError('quiz.no_questions', 404);

            correctAnswersMap = {};
            questions.forEach(q => {
                correctAnswersMap[q.id] = String(q.correct_answer).trim().toUpperCase();
            });

            await CacheManager.set(answersCacheKey, correctAnswersMap, 3600);
        }

        let score = 0;
        const processedIds = new Set();
        const questionIds = Object.keys(correctAnswersMap);

        for (const ans of userAnswers) {
            if (correctAnswersMap[ans.question_id] && !processedIds.has(ans.question_id)) {
                const correct = correctAnswersMap[ans.question_id];
                const student = String(ans.selected_option || '').trim().toUpperCase();
                if (correct === student) score++;
                processedIds.add(ans.question_id);
            }
        }

        const totalQuestions = questionIds.length;
        const resultData = {
            user_id: userId,
            quiz_id: quizId,
            score: score,
            total_questions: totalQuestions
        };

        const savedResult = await this._saveResult(resultData);

        return {
            correct: score,
            total: totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100) || 0,
            result_id: savedResult.id
        };
    }

    _saveResult = transactional(async (data, transaction) => {
        return await Result.create(data, { transaction });
    });
}

module.exports = new QuizService();