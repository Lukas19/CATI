"use strict";

var LocalStrategy = require('passport-local');
var models	= require('../models');
//var Admin = require('../models/admin.js');
var passport = require('passport');

module.exports = function(passport) {
    passport.serializeUser(function (user, done) {
        console.log("Test #2");
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        models.Usuario.find({where: {id: id}}).then(function (user) {
            if (!user) {
                console.log("Test deserialize #1");
                //return done(null, false);
                models.Admin.find({where: {id: id}}).then(function (admin) {
                    if (!admin) {
                        console.log("Test deserialize admin #1");
                        return done(null, false);

                    }
                    console.log("Test deserialize admin #2");
                    done(null, admin);
                }).catch(function (err) {
                    console.log("Test deserialize admin #3");
                    done(err, null);
                });
            }
            else {
                console.log("Test deserialize #2");
                done(null, user);
            }
        }).catch(function (err) {
            console.log("Test deserialize #3");
            done(err, null);
        });
    });

    passport.use('usuario', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            models.Usuario.findOne({where: {email: email}}).then(function (usuario) {
                if (!usuario) {
                    done(null, false, {message: 'Unknown user'});
                } else if (!usuario.authenticate(password)) {
                    done(null, false, {message: 'Invalid password'});
                } else {
                    done(null, usuario);
                }
            }).catch(function (err) {
                done(err);
            });
        }
    ));

    passport.use('admin', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            models.Admin.findOne({where: {email: email}}).then(function (admin) {
                if (!admin) {
                    done(null, false, {message: 'Unknown user'});
                } else if (!admin.authenticate(password)) {
                    done(null, false, {message: 'Invalid password'});
                } else {
                    done(null, admin);
                }
            }).catch(function (err) {
                done(err);
            });
        }
    ));
}