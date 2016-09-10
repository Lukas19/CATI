
var express = require('express');
var app = express();

app.use(function (req,res,next) {
    console.log("estoy en app.use");
    if (req.query._id != null) {
        console.log("no nulo: " + req.query._id);
    }
    next();
});

app.get('/',function(req,res){
    res.render('index.html', {title: 'CATI'});
});

app.get('/verUsuario',function(req,res){
    res.redirect('/api/usuarios')
});

app.get('/crearUsuario',function(req,res){
    res.render('CrearUsuario.html', {title: 'Registrar Usuarios'});
});

app.get('/actualizarUsuario',function(req,res){
    console.log("en app.get");
    //console.log(req.query._id);
    var id = req.query._id;
    res.render('ActualizarUsuario.html', {title: 'Actualizar Usuarios', id: id.toString()});
    console.log("non");
});

module.exports=app;

