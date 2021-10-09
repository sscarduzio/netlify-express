const { DataTypes } = require('sequelize');
const configManager = require("../config-manager");

module.exports = model;

function model(sequelize) {
    const attributes = {
        s_id: { type: DataTypes.STRING, allowNull: false },
        emailVerificationToken: { type: DataTypes.STRING, allowNull: false },
        verified: {type: DataTypes.DATE},
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE, allowNull:false, defaultValue: DataTypes.NOW }
    };

    return sequelize.define('customer', attributes, {
        schema: configManager.getConfig().static.portal_schema
    });
}
