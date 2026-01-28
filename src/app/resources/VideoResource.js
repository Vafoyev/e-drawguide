class QuestionResource {
    /**
     * @param {Object} question - Question modeli
     * @param {string} userRole - 'student' yoki 'admin'
     */
    static format(question, userRole = 'student') {
        if (!question) return null;

        const formatted = {
            id: question.id,
            quiz_id: question.quiz_id || "",
            question_text: question.question_text || "",
            options: Array.isArray(question.options) ? question.options : [],
            created_at: question.created_at
        };

        if (userRole === 'admin') {
            formatted.correct_answer = question.correct_answer || "";
        }

        return formatted;
    }

    static collection(questions, userRole = 'student') {
        if (!questions || !Array.isArray(questions)) return [];
        return questions.map(q => this.format(q, userRole));
    }
}

module.exports = QuestionResource;