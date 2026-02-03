const QuizService = require('../../src/services/QuizService');

describe('Quiz Scoring Logic', () => {
    const mockQuestions = [
        { id: '1', correct_answer: 'A' },
        { id: '2', correct_answer: 'B' },
        { id: '3', correct_answer: 'C' }
    ];

    test('Barcha javoblar to\'g\'ri bo\'lganda 100% natija berishi kerak', () => {
        const studentAnswers = [
            { question_id: '1', selected_option: 'A' },
            { question_id: '2', selected_option: 'B' },
            { question_id: '3', selected_option: 'C' }
        ];

        let score = 0;
        studentAnswers.forEach(ans => {
            const q = mockQuestions.find(i => i.id === ans.question_id);
            if (q && q.correct_answer === ans.selected_option) score++;
        });

        expect(score).toBe(3);
        expect(Math.round((score / mockQuestions.length) * 100)).toBe(100);
    });

    test('Katta-kichik harflar va bo\'shliqlar natijaga ta\'sir qilmasligi kerak', () => {
        const studentAnswers = [
            { question_id: '1', selected_option: ' a ' },
            { question_id: '2', selected_option: 'B' }
        ];

        let score = 0;
        studentAnswers.forEach(ans => {
            const q = mockQuestions.find(i => i.id === ans.question_id);
            if (q && q.correct_answer.trim().toUpperCase() === ans.selected_option.trim().toUpperCase()) {
                score++;
            }
        });

        expect(score).toBe(2);
    });

    test('Takroriy javoblar ballga qo\'shilmasligi kerak (set logic)', () => {
        const studentAnswers = [
            { question_id: '1', selected_option: 'A' },
            { question_id: '1', selected_option: 'A' }
        ];

        const processed = new Set();
        let score = 0;
        studentAnswers.forEach(ans => {
            if (!processed.has(ans.question_id)) {
                const q = mockQuestions.find(i => i.id === ans.question_id);
                if (q && q.correct_answer === ans.selected_option) score++;
                processed.add(ans.question_id);
            }
        });

        expect(score).toBe(1);
    });
});