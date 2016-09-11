/**
 * Created by fchacon on 10-09-16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Admin = sequelize.define("Admin", {
            username: DataTypes.STRING,
            password: DataTypes.STRING,
            email:    DataTypes.STRING
        }, {
            timestamps: false,
            instanceMethods: {
                authenticate: function (password) {
                    return (password === this.password);
                },
            },
            classMethods:{
                associate: function(models) {
                      Admin.hasMany(models.Proyecto);
                }
            }
        }
    );
    return Admin;
};