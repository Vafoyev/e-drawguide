module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        quiz_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        question_text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        options: {
            type: DataTypes.JSONB,
            allowNull: false
        },
        correct_answer: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        underscored: true
    });

    Question.associate = (models) => {
        Question.belongsTo(models.Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
    };

    return Question;
};