module.exports = (sequelize, DataTypes) => {
    return sequelize.define('AuditLog', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_id: { type: DataTypes.UUID, allowNull: true },
        action: { type: DataTypes.STRING, allowNull: false },
        resource: { type: DataTypes.STRING, allowNull: false },
        resource_id: { type: DataTypes.STRING, allowNull: true },
        changes: { type: DataTypes.JSONB, allowNull: true },
        ip_address: { type: DataTypes.STRING, allowNull: true },
        user_agent: { type: DataTypes.STRING, allowNull: true }
    }, { underscored: true, tableName: 'audit_logs', updatedAt: false });
};