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
    res.redirect('/llamar/?_id=' + idProyecto);

});


//Change method
router.use( function( req, res, next ) {
	// this middleware will call for each requested
	// and we checked for the requested query properties
	// if _method was existed
	// then we know, clients need to call DELETE request instead
	//console.log("time to change " + req.query._method);
	//console.log(req.body._method);
	if ( req.query._method == 'DELETE' ) {
		// change the original METHOD
		req.method = 'DELETE';
		req.url = req.path;
	}else if ( req.body._method == 'PUT' ) {
		console.log("putttt");
		req.method = 'PUT';
		req.url = req.path;
	}
	next();
});

//SET Encuestado
router.get('/encuestados/:id/:idd', function(req, res, next){
    try {
        models.Encuestado.findOne({where: {id: req.params.id}}).then(function (user) {
            user.updateAttributes({
                estado: req.params.idd
            })
            res.redirect('/llamar');
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
		res.redirect("/");
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
            res.redirect("/");
        });
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});

//POST crear proyecto
router.post('/:id/proyectos/create', function(req,res,next){
    console.log(req.params.id);
    try{
        models.Proyecto.create({
            nombre: req.body.nombre,
            AdminId: req.params.id
        }).then(function (result) {
            res.redirect("/");
        });
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});

//Update user
router.put('/usuarios/:id', function(req,res,next){
	console.log("router.put");
	try{
		models.Usuario.findOne({ where: {id:req.params.id} }).then(function (user) {
			if(req.body.username){
				if(req.body.email && req.body.password) {
					user.updateAttributes({
						username: req.body.username,
						email: req.body.email,
						password: req.body.password
					})
				}else {
					user.updateAttributes({
						username: req.body.username
					})
				}
			}
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
    console.log("router.put");
    try{

        models.Proyecto.findOne({ where: {id:req.params.id} }).then(function (user) {
            if(req.body.nombre){
                user.updateAttributes({
                    nombre: req.body.nombre
                })
            }
            return models.Proyecto.findAll().then(function (user) {
                res.redirect('/api/proyectos');
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
    console.log("router.put");
    try{

        models.Admin.findOne({ where: {id:req.params.id} }).then(function (user) {
            if(req.body.username){
                if(req.body.email && req.body.password) {
                    user.updateAttributes({
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password
                    })
                }else {
                    user.updateAttributes({
                        username: req.body.username
                    })
                }
            }
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
                res.redirect('/api/proyectos');
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
        models.Admin.destroy({where: {id: req.params.id} }).then(function () {
            return models.Admin.findAll().then(function (user) {
				res.redirect('/api/admins');
            })
        })
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

