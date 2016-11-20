var express     = require('express');
var app         = express();
var passport    = require('../config/passport');
var fileUpload  = require('express-fileupload');
var querying = require('../controllers/querying');
var isAdmin = false;

function isLogged(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isLoggedAdmin(req, res, next) {
    if (req.isAuthenticated() && isAdmin)
        return next();

    res.redirect('/');
}

app.get('/', function(req, res){
    var user = req.user;
    if (user == null)
        user = "";
    else
        user = user.username;
    res.render('index.html', {title: 'Inicio de sesión Usuario', user: user});
});

app.get('/logAdmin', function(req, res){
    var user = req.user;
    if (user == null)
        user = "";
    else
        user = user.username;
    res.render('LoginAdmin.html', {title: 'Inicio de sesión Admin', user: user});
});

app.get('/verUsuario', isLoggedAdmin, function(req, res){
    var user = req.user;
    res.redirect('/api/usuarios');
});

app.get('/verAdmin', isLoggedAdmin,  function(req, res){
    var user = req.user;
    res.redirect('/api/admins');
});

app.get('/verProyecto', isLogged,  function(req, res){
    var user = req.user;
    res.redirect('/api/proyectos');
});

app.get('/crearAdmin', isLoggedAdmin, function(req, res){
    var user = req.user;
    res.render('CrearUsuario.html', {title: 'Registrar Admins', target: 'admins', user: user});
});

app.get('/crearUsuario', isLoggedAdmin, function(req, res){
    var user = req.user;
    res.render('CrearUsuario.html', {title: 'Registrar Usuarios', target: 'usuarios', user: user});
});

app.get('/crearProyecto', isLoggedAdmin, function(req, res){
    var user = req.user;
    res.render('CrearProyecto.html', {title: 'Crear Proyecto', user: user});
});

app.get('/subirDatos', isLoggedAdmin, function (req, res) {
    var user = req.user;
    var id = req.query._id;
    res.render('SubirDatos.html',{user: user, id: id.toString()});
});

app.get('/actualizarUsuario', isLoggedAdmin, function(req,res){
    var user = req.user;
    var id = req.query._id;
    res.render('ActualizarUsuario.html', {title: 'Actualizar Usuarios', id: id.toString(), target:'usuarios', user: user});
});

app.get('/actualizarAdmin', isLoggedAdmin, function(req,res){
    var user = req.user;
    var id = req.query._id;
    res.render('ActualizarUsuario.html', {title: 'Actualizar Admins', id: id.toString(), target: 'admins', user: user});
});

app.get('/actualizarProyecto', isLoggedAdmin, function(req,res){
    var user = req.user;
    var id = req.query._id;
    res.render('ActualizarProyecto.html', {title: 'Actualizar Proyectos', id: id.toString(), user: user});
});

app.get('/llamar', isLogged, function(req, res){
    var user = req.user;
    var id = req.query._id;
    res.render('Call.html',{id: id.toString(), user: user});
});

app.get('/logged', function(req, res){
    var user = req.user;
    isAdmin = false;
    res.render('logged.html', {title: 'Logged', user: user});
});

app.get('/loggedAdmin', function(req, res){
    var user = req.user;
    isAdmin = true;
    res.render('loggedAdmin.html', {title: 'Logged', user: user});
});

app.get('/logout', function(req, res){
    isAdmin = false;
    console.log('logout');
    req.logout();
    res.redirect('/');
});

app.get('/getAllEncuestado', isLogged, querying.getAllEncuestados);

module.exports = app;