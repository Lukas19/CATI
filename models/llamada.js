/**
 * Created by fchacon on 10-09-16.
 */
"use strict";
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var Llamada = sequelize.define("Llamada", {
        duracion: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                Llamada.hasOne(models.Grabacion);
            }
        }
    });

    return Llamada;
};
