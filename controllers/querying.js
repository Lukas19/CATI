/**
 * Created by lukaszamora on 11/2/16.
 */
var express = require('express');
var models = require('../models');
var router = express.Router();

/*
var encuestado = models.Encuestado.findAll({
    attriubtes: ['nombre', 'apellido', 'numero']
});
*/

exports.getAllEncuestados = function(req, res) {
    models.Encuestado.findAll().then(function (encuestado) {
        res.json(encuestado)
    });
};

