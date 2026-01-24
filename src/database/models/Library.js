module.exports = (sequelize, DataTypes) => {
    const Library = sequelize.define('Library', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false
        },
        file_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cover_url: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: true,
        underscored: true
    });

    return Library;
};