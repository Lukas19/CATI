/**
 * Created by fchacon on 10-09-16.
 */
"use strict";

var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var Encuestado = sequelize.define("Encuestado", {
        nombre: DataTypes.STRING,
        apellido: DataTypes.STRING,
        numero: DataTypes.INTEGER,
        estado: { type: DataTypes.INTEGER, defaultValue: 1 }
    }, {
        timestamps: false,
        classMethods: {
            associate: function(models) {
                Encuestado.hasMany(models.Llamada);
                Encuestado.belongsTo(models.Proyecto);
            }
        }
    });

    return Encuestado;
};
