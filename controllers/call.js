/**
 * Created by lukaszamora on 10/30/16.
 */
(function () {
    var app = angular.module('call', []);

    app.controller('CallController',function(){
        this.contact = encuestado;
    });

    var models = require('../models');
    var encuestado = models.Encuestado.findAll();

})();