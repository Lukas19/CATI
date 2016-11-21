/**
 * Created by lukaszamora on 11/2/16.
 */
var express = require('express');
var models = require('../models');
var router = express.Router();

exports.getAllEncuestados = function(req, res) {
    models.Encuestado.findAll().then(function (encuestado) {
        res.json(encuestado)
    });
};

exports.getEncuesta = function(req, res) {
    models.Proyecto.findAll().then(function (encuesta) {
        res.json(encuesta)
    });
};
