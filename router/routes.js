var express     = require('express');
var app         = express();
var passport    = require('../config/passport');
var fileUpload  = require('express-fileupload');

function isLogged(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

/*app.use(function (req,res,next) {
    console.log("estoy en app.use");
    if (req.path == '/upload'){
        app.use(fileUpload());
        console.log("activado upload");
    }
    if (req.query._id != null) {
        console.log("no nulo: " + req.query._id);
    }
    next();
});*/



app.get('/', function(req, res){
    res.render('index.html', {title: 'Inicio de sesión Usuario'});
});

app.get('/logAdmin', function(req, res){
    res.render('index.html', {title: 'Inicio de sesión Admin'});
});

app.get('/verUsuario', isLogged, function(req, res){
    res.redirect('/api/usuarios');
});

app.get('/verAdmin', isLogged,  function(req, res){
    res.redirect('/api/admins');
});

app.get('/verProyecto', isLogged,  function(req, res){
    res.redirect('/api/proyectos');
});

app.get('/crearAdmin', isLogged, function(req, res){
    res.render('CrearUsuario.html', {title: 'Registrar Admins', target: 'admins'});
});

app.get('/crearUsuario', isLogged, function(req, res){
    res.render('CrearUsuario.html', {title: 'Registrar Usuarios', target: 'usuarios'});
});

app.get('/crearProyecto', isLogged, function(req, res){
    res.render('CrearProyecto.html', {title: 'Crear Proyecto'});
});

app.get('/subirDatos', isLogged, function (req, res) {
    res.render('SubirDatos.html');
});

app.get('/actualizarUsuario', isLogged, function(req,res){
    console.log("en app.get");
    //console.log(req.query._id);
    var id = req.query._id;
    res.render('ActualizarUsuario.html', {title: 'Actualizar Usuarios', id: id.toString(), target:'usuarios'});
});

app.get('/actualizarAdmin', isLogged, function(req,res){
    console.log("en app.get");
    //console.log(req.query._id);
    var id = req.query._id;
    res.render('ActualizarUsuario.html', {title: 'Actualizar Admins', id: id.toString(), target: 'admins'});
});

app.get('/actualizarProyecto', isLogged, function(req,res){
    //console.log(req.query._id);
    var id = req.query._id;
    res.render('ActualizarProyecto.html', {title: 'Actualizar Proyectos', id: id.toString()});
});


app.get('/logged', function(req, res){
    res.render('logged.html', {title: 'Logged'});
});



app.get('/logout', function(req, res){
    console.log('logout');
    req.logout();
    res.redirect('/');
});


module.exports = app;