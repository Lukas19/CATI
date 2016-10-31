"use strict";

module.exports = function(sequelize, DataTypes) {
    var Usuario = sequelize.define("Usuario", {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        email:    DataTypes.STRING
    }, {
        timestamps: false,
        instanceMethods: {
            authenticate: function(password) {
                return (password === this.password);
            }
        },
        classMetUshods:{
            associate: function(models) {
                Usuario.hasMany(models.Llamada);
            }
        }
    }
    );
    return Usuario;
};