//DataBase
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'fchacon',
    database : 'adsw'
});


//Dependecies
var express  = require('express');
var router	 = express.Router();
var models   = require('../models');
var passport = require('passport');
var util 	 = require('util');
var fs		 = require('fs');


//Return router
module.exports = router;

router.post("/survey/:id", function(req, res, next){
    var idProyecto = req.params.id;
    res.redirect('/llamar/?_id=' + idProyecto);

});

router.get('/download/:id/:name', function(req, res){
    var id = req.params.id;
    var name = req.params.name;
    var file = '/home/fchacon/git/CATI/public/uploads/'+ id + '/' + name;
    res.download(file); // Set disposition and send it.
});

router.get('/grabacion/:id', function (req,res) {
    var walk    = require('walk');
    var files   = [];

    // Walker options
    var walker  = walk.walk('./public/uploads/' + req.params.id + '/', { followLinks: false });

    walker.on('file', function(root, stat, next) {
        // Add this file to the list of files
        files.push(stat.name);
        next();
    });

    walker.on('end', function() {
        console.log(files);
        res.render('Grabacion.html', {user: req.user, files: files, id: req.params.id});
    });

});

router.post("/upload/:id", function(req, res, next) {
    if (!req.file) {
        res.send('No files were uploaded.');
        return;
    }

    var idProyecto = req.params.id;
    var name = req.file.filename;
    var ruta = "/home/fchacon/git/CATI/" + req.file.path;

    connection.connect();
    connection.query("LOAD DATA LOCAL INFILE '" + ruta + "' INTO TABLE " +
        "Encuestado FIELDS TERMINATED BY ',' " +
        "LINES TERMINATED BY '\n' " +
        "IGNORE 1 ROWS (@col1,@col2,@col3,@col4) " +
        "SET ProyectoId = " + idProyecto + ", estado = 1 , nombre = @col1, apellido = @col2, numero = @col3", function(err) {
        if (!err) {
            console.log('All good.');
        }
        else{
            console.log('Error while performing Query.');
            console.log(err);
        }
    });
    res.redirect('/api/proyectos/true');

});


//Change method
router.use( function( req, res, next ) {
	// this middleware will call for each requested
	// and we checked for the requested query properties
	// if _method was existed
	// then we know, clients need to call DELETE request instead
	if ( req.query._method == 'DELETE' ) {
		// change the original METHOD
		req.method = 'DELETE';
		req.url = req.path;
	}else if ( req.body._method == 'PUT' ) {
		req.method = 'PUT';
		req.url = req.path;
	}
	next();
});

//SET Encuestado
router.get('/encuestados/:id/:idd/:idP/:link', function(req, res, next){
    var idProyecto = req.params.idP;
    try {
        models.Encuestado.findOne({where: {id: req.params.id}}).then(function (user) {
            user.updateAttributes({
                estado: req.params.idd
            })
            res.redirect('/llamar?_id=' + idProyecto + '&&_link=' + req.params.link);
        });
    }catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});

//GET usuarios
router.get('/usuarios', function(req, res, next) {
	var User = req.user;
	try {
		models.Usuario.findAll().then(function (user) {
			res.render('VerUsuario.html', {title: 'Listar Usuarios', resultado: user, user: User});
		});
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});

//GET proyectos
router.get('/proyectos/:isAdmin', function(req, res, next) {
	var User = req.user;
    var isAdmin = req.params.isAdmin;
    try {
		models.Proyecto.findAll().then(function (user) {
		    if (isAdmin != 'false') {
                res.render('RDProyecto.html', {title: 'Listar Proyectos', resultado: user, user: User});
            }else{
                res.render('RDProyectoU.html', {title: 'Listar Proyectos', resultado: user, user: User});
		}});
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});

//GET admins
router.get('/admins', function(req, res, next) {
    var User = req.user;
    try {
        models.Admin.findAll().then(function (user) {
            res.render('VerUsuario.html', {title: 'Listar Admins', resultado: user, target: 'admins', user: User});
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});

//GET un usuario con id determinado
router.get('/usuarios/:id', function(req, res, next) {
	try {
		console.log(req.params.id);
		models.Usuario.findAll({
			where: {
				id: req.params.id
			}
		}).then(function (user) {
			res.redirect('/api/usuarios');
		});
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});

//POST crear usuario
router.post('/usuarios', function(req,res,next){
try{
	models.Usuario.create({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email
	}).then(function (result) {
		res.redirect("/api/usuarios");
	});
	}
	catch(ex){
	console.error("Internal error:"+ex);
	return next(ex);
	}
});

//POST crear admin
router.post('/admins', function(req,res,next){
    try{
        models.Admin.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        }).then(function (result) {
            res.redirect("/api/admins");
        });
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});

//POST crear proyecto
router.post('/:id/proyectos/create', function(req,res,next){
    var Enlace = req.body.enlace;
    Enlace = Enlace.substring(30);
    try{
        models.Proyecto.create({
            nombre: req.body.nombre,
            enlace: Enlace,
            AdminId: req.params.id
        }).then(function (result) {
            fs.mkdirSync('./public/uploads/' + result.id);
            res.redirect("/api/proyectos/true");
        });
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});

//Update user
router.put('/usuarios/:id', function(req,res,next){
	var User;
	var Password;
	var Email;
    try{
		models.Usuario.findOne({ where: {id:req.params.id} }).then(function (user) {
			if(req.body.username){User = req.body.username;}
		    else{User = user.username;}
            if(req.body.password){Password = req.body.password;}
            else{Password = user.password;}
            if(req.body.email){Email = req.body.email;}
            else{Email = user.email;}

            user.updateAttributes({
                    username: User,
                    email: Email,
                    password: Password
                });
			return models.Usuario.findAll().then(function (user) {
				res.redirect('/api/usuarios');
			})
		});
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});

//Update proyecto
router.put('/proyectos/:id', function(req,res,next){
    var Name;
    var Enlace;
    try{
        models.Proyecto.findOne({ where: {id:req.params.id} }).then(function (user) {
            if(req.body.nombre){Name = req.body.nombre;}
            else{Name = user.nombre;}
            if(req.body.enlace){Enlace = req.body.enlace;}
            else{Enlace = user.enlace;}

            user.updateAttributes({
                nombre: Name,
                enlace: Enlace
            });

            return models.Proyecto.findAll().then(function (user) {
                res.redirect('/api/proyectos/true');
            })
        });
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});

//Update admin
router.put('/admins/:id', function(req,res,next){
    var User;
    var Password;
    var Email;
    try{
        models.Admin.findOne({ where: {id:req.params.id} }).then(function (user) {
            if(req.body.username){User = req.body.username;}
            else{User = user.username;}
            if(req.body.password){Password = req.body.password;}
            else{Password = user.password;}
            if(req.body.email){Email = req.body.email;}
            else{Email = user.email;}

            user.updateAttributes({
                username: User,
                email: Email,
                password: Password
            });
            return models.Admin.findAll().then(function (user) {
				res.redirect('/api/admins');
            })
        });
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});

//Delete user
router.delete('/usuarios/:id', function(req,res,next){
	try{
		models.Usuario.destroy({where: {id: req.params.id} }).then(function () {
			return models.Usuario.findAll().then(function (user) {
				res.redirect('/api/usuarios');
			})
		})
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});

//Delete proyecto
router.delete('/proyectos/:id', function(req,res,next){
    try{
        models.Proyecto.destroy({where: {id: req.params.id} }).then(function () {
            return models.Proyecto.findAll().then(function (user) {
                res.redirect('/api/proyectos/true');
            })
        })
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});

//Delete admin
router.delete('/admins/:id', function(req,res,next){
    try{
        if (req.user.id != req.params.id) {
            models.Admin.destroy({where: {id: req.params.id}}).then(function () {
                return models.Admin.findAll().then(function (user) {
                    res.redirect('/api/admins');
                })
            })
        }
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});


router.post('/loginUsuario', passport.authenticate('usuario', {
	successRedirect : '/logged',
	failureRedirect : '/'
}));

router.post('/loginAdmin', passport.authenticate('admin', {
	successRedirect : '/loggedAdmin',
	failureRedirect : '/logAdmin'
}));


