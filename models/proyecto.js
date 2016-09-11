/**
 * Created by fchacon on 10-09-16.
 */
"use strict";

var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var Proyecto = sequelize.define("Proyecto", {
        nombre: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                    Proyecto.belongsTo(models.Admin, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });

    return Proyecto;
};
