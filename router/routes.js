
var express = require('express');
var app = express();
var passport = require('../config/passport');

app.get('/', function(req, res){
    res.render('index.html', {title: 'Inicio de sesión'});
});

app.get('/verUsuario', function(req, res){
    res.redirect('/api/usuarios')
});

app.get('/crearUsuario', function(req, res){
    res.render('CrearUsuario.html', {title: 'Registrar Usuarios'});
});

app.get('/actualizarUsuario', function(req, res){
    res.render('ActualizarUsuario.html', {title: 'Actualizar Usuarios'});
});

app.get('/logged', function(req, res){
    res.render('logged.html', {title: 'tulin tulon'});
});

module.exports=app;