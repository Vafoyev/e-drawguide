class QuestionResource {
    /**
     * Savol ma'lumotlarini formatlaydi, rollga qarab correct_answer'ni yashiradi.
     * @param {Object} question - Question modeli
     * @param {string} userRole - Javobni olayotgan foydalanuvchi roli ('student' yoki 'admin')
     * @returns {Object} Formatlangan ma'lumot
     */
    static format(question, userRole = 'student') {
        if (!question) return null;

        const formatted = {
            id: question.id,
            quiz_id: question.quiz_id,
            question_text: question.question_text,
            options: question.options,
            created_at: question.created_at
        };

        if (userRole === 'admin') {
            formatted.correct_answer = question.correct_answer;
        }

        return formatted;
    }
}

module.exports = QuestionResource;