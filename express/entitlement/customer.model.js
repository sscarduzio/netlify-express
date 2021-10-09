const Sequelize = require('sequelize');
const {getConfig} = require("../config-manager");
const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('customers', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    s_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    alt_email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cb_id: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'customers',
    schema: getConfig().static.entitlement_schema,
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    indexes: [
      {
        name: "customers_alt_email_uindex",
        unique: true,
        fields: [
          { name: "alt_email" },
        ]
      },
      {
        name: "customers_cb_id_uindex",
        unique: true,
        fields: [
          { name: "cb_id" },
        ]
      },
      {
        name: "customers_pkey",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "customers_s_id_key",
        unique: true,
        fields: [
          { name: "s_id" },
        ]
      },
    ]
  });
};
