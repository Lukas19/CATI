"use strict";

var LocalStrategy = require('passport-local');
var models	= require('../models');
var passport = require('passport');

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        models.Usuario.find({where: {id: id}}).then(function(user){
            if(!user){
                return done(null, false);
            }
            done(null, user);
        }).catch(function(err){
            done(err, null);
        });
    });

    passport.use('login-usuario', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            models.Usuario.findOne({ where: { email: email }}).then(function(usuario) {
                if (!usuario) {
                    done(null, false, { message: 'Unknown user' });
                } else if (!usuario.authenticate(password)) {
                    done(null, false, { message: 'Invalid password'});
                } else {
                    done(null, usuario);
                }
            }).catch(function(err){
                done(err);
            });
        }
    ));

    passport.use('login-admin', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            models.Admin.findOne({ where: { email: email }}).then(function(usuario) {
                if (!usuario) {
                    done(null, false, { message: 'Unknown user' });
                } else if (!usuario.authenticate(password)) {
                    done(null, false, { message: 'Invalid password'});
                } else {
                    done(null, usuario);
                }
            }).catch(function(err){
                done(err);
            });
        }
    ));

module.exports = passport;