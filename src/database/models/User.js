module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('student', 'admin'),
            defaultValue: 'student'
        }
    }, {
        timestamps: true,
        underscored: true,
        paranoid: true,
        tableName: 'users'
    });

    User.associate = (models) => {
        User.hasMany(models.Result, { foreignKey: 'user_id', as: 'results' });
    };

    return User;
};