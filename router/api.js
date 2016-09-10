//Dependecies
var express = require('express');
var router	= express.Router();
var models  = require('../models');
var passport = require('../config/passport.js');

//Return router
module.exports = router;

//Change method
router.use( function( req, res, next ) {
	// this middleware will call for each requested
	// and we checked for the requested query properties
	// if _method was existed
	// then we know, clients need to call DELETE request instead
	console.log("time to change " + req.query._method);
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


//GET usuarios
router.get('/usuarios', function(req, res, next) {
	try {
		models.Usuario.findAll().then(function (user) {
			res.render('VerUsuario.html', {title: 'Listar Usuarios', resultado: user});
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
			res.render('VerUsuario.html', {title: 'Listar Usuarios', resultado: user});
		});
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});

//POST crear usuario
router.post('/usuarios', function(req,res,next){
try{
	console.log(req.body.permiso);
	models.Usuario.create({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email
	}).then(function (result) {
		models.Rol.create({
			permiso: req.body.permiso,
			UsuarioId: result.id
		});
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
				res.render('VerUsuario.html', {title: 'Listar Usuarios', resultado: user});
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
				res.render('VerUsuario.html', {title: 'Listar Usuarios', resultado: user});
			})
		})
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});


//Login
router.post('/login', passport.authenticate('local-login', {
	successRedirect : '/logged', // redirect
	failureRedirect : '/'
}));