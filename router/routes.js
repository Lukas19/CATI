
var express     = require('express');
var app         = express();
var passport    = require('../config/passport');
var fileUpload  = require('express-fileupload');

//app.use(fileUpload());

app.use(function (req,res,next) {
    console.log("estoy en app.use");
    if (req.path == '/upload'){
        app.use(fileUpload());
        console.log("activado upload");
    }
    if (req.query._id != null) {
        console.log("no nulo: " + req.query._id);
    }
    next();
});



app.get('/', function(req, res){
    res.render('index.html', {title: 'Inicio de sesión'});
});

app.get('/verUsuario', function(req, res){
    res.redirect('/api/usuarios');
});

app.get('/verAdmin', function(req, res){
    res.redirect('/api/admins');
});

app.get('/crearAdmin', function(req, res){
    res.render('CrearUsuario.html', {title: 'Registrar Admins', target: 'admins'});
});

app.get('/crearUsuario', function(req, res){
    res.render('CrearUsuario.html', {title: 'Registrar Usuarios', target: 'usuarios'});
});

app.get('/subirDatos', function (req, res) {
    res.render('SubirDatos.html');
})

app.get('/actualizarUsuario',function(req,res){
    console.log("en app.get");
    //console.log(req.query._id);
    var id = req.query._id;
    res.render('ActualizarUsuario.html', {title: 'Actualizar Usuarios', id: id.toString(), target:'usuarios'});
});

app.get('/actualizarAdmin',function(req,res){
    console.log("en app.get");
    //console.log(req.query._id);
    var id = req.query._id;
    res.render('ActualizarUsuario.html', {title: 'Actualizar Admins', id: id.toString(), target: 'admins'});
});

/*var uploading = multer({
 dest: __dirname + '../public/uploads/',
 });*/

app.get('/logged', function(req, res){
    res.render('logged.html', {title: 'Logged'});
});


app.post('/upload', function(req, res) {
    var sampleFile;

    console.log("me atore");
    //console.log(req.files.sampleFile.name);
    /*if (req.files.sampleFile == null){
        return;
    }

    if (!req.files.sampleFile.name) {
        //res.send('No files were uploaded.');
        return;
    }*/
    sampleFile = req.files.sampleFile;
    sampleFile.mv('./public/uploads/' + req.files.sampleFile.name, function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            //res.send('File uploaded!');
        }
    });
    res.render('index.html', {title: 'CATI'});
});

app.get('/logout', function(req, res){
    console.log('logout');
    req.logout();
    res.redirect('/');
});


module.exports = app;