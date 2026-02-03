module.exports = (sequelize, DataTypes) => {
    const Quiz = sequelize.define('Quiz', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true,
        underscored: true,
        paranoid: true,
        tableName: 'quizzes'
    });

    Quiz.associate = (models) => {
        Quiz.hasMany(models.Question, { foreignKey: 'quiz_id', as: 'questions' });
        Quiz.hasMany(models.Result, { foreignKey: 'quiz_id', as: 'results' });
    };

    return Quiz;
};