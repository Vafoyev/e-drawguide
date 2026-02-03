const request = require('supertest');
const app = require('../../src/app');
const { Quiz, Question, User, sequelize } = require('../../src/database');

describe('Quiz Submission Integration', () => {
    let token, quizId, questionId;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
        const user = await User.create({
            full_name: 'Test Student',
            phone: '998901234567',
            password: 'HashedPassword123!',
            role: 'student'
        });

        const res = await request(app).post('/api/v1/auth/login').send({
            phone: '998901234567',
            password: 'HashedPassword123!'
        });
        token = res.body.access_token;

        const quiz = await Quiz.create({ title: 'Math Quiz', is_active: true });
        quizId = quiz.id;

        const question = await Question.create({
            quiz_id: quizId,
            question_text: '2+2?',
            options: [{A: '3'}, {B: '4'}],
            correct_answer: 'B'
        });
        questionId = question.id;
    });

    test('Should calculate score correctly on submit', async () => {
        const res = await request(app)
            .post(`/api/v1/student/quizzes/${quizId}/submit`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                answers: [{ question_id: questionId, selected_option: 'B' }]
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.correct).toBe(1);
        expect(res.body.data.percentage).toBe(100);
    });

    afterAll(async () => {
        await sequelize.close();
    });
});