const Joi = require('joi');

const submitQuizSchema = Joi.object({
    answers: Joi.array().items(
        Joi.object({
            question_id: Joi.string().uuid().required(),
            selected_option: Joi.string().required()
        })
    ).required()
});

const addQuestionSchema = Joi.object({
    question_text: Joi.string().min(5).required(),
    options: Joi.array().items(Joi.object().min(1)).min(2).required().messages({
        'array.min': "Kamida 2 ta variant bo'lishi shart",
        'array.base': "Options massiv bo'lishi shart"
    }),
    correct_answer: Joi.string().length(1).required()
});

module.exports = { submitQuizSchema, addQuestionSchema };