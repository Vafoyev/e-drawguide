module.exports = (sequelize, DataTypes) => {
    return sequelize.define('AppConfig', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        platform: { type: DataTypes.ENUM('android', 'ios'), allowNull: false },
        latest_version: { type: DataTypes.STRING, allowNull: false },
        minimum_version: { type: DataTypes.STRING, allowNull: false },
        update_url: { type: DataTypes.STRING, allowNull: false },
        is_force_update: { type: DataTypes.BOOLEAN, defaultValue: false },
        message_uz: { type: DataTypes.STRING },
        message_ru: { type: DataTypes.STRING }
    }, { timestamps: true, underscored: true, tableName: 'app_configs' });
};