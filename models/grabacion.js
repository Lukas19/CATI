/**
 * Created by fchacon on 10-09-16.
 */
"use strict";
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var Grabacion = sequelize.define("Grabacion", {
        //permiso: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Grabacion.belongsTo(models.Llamada, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });

    return Grabacion;
};
