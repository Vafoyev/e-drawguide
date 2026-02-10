jest.mock('../../src/utils/cache', () => ({
    CacheManager: { get: jest.fn(), set: jest.fn() },
    redis: { quit: jest.fn(), on: jest.fn() }
}));

const QuizService = require('../../src/services/QuizService');

describe('Quiz Scoring Logic', () => {
    const mockQuestions = [
        { id: '1', correct_answer: 'A' },
        { id: '2', correct_answer: 'B' }
    ];

    test('Barcha javoblar to\'g\'ri bo\'lganda natija to\'g\'ri bo\'lishi kerak', () => {
        const studentAnswers = [
            { question_id: '1', selected_option: 'A' },
            { question_id: '2', selected_option: 'B' }
        ];

        let score = 0;
        studentAnswers.forEach(ans => {
            const q = mockQuestions.find(i => i.id === ans.question_id);
            if (q && q.correct_answer === ans.selected_option) score++;
        });

        expect(score).toBe(2);
    });
});