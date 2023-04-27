const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Flights', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    airline: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    flight_number: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    departure_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    arrival_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    departure_location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    arrival_location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    price: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Flights',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
