module.exports = (sequelize, DataTypes) => {
    const Result = sequelize.define('Result', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        quiz_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_questions: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        timestamps: true,
        underscored: true,
        paranoid: true,
        tableName: 'results'
    });

    Result.associate = (models) => {
        Result.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Result.belongsTo(models.Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
    };

    return Result;
};