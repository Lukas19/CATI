/**
 * Created by fchacon on 10-09-16.
 */
"use strict";
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var Encuesta = sequelize.define("Encuesta", {
        link: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Encuesta.belongsTo(models.Proyecto, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
                Encuesta.hasMany(models.Llamada);
            }
        }
    });

    return Encuesta;
};
