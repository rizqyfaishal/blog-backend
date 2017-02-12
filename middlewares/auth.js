var passport = require('passport'),
    bcrypt = require('bcrypt-nodejs'),
    User = require('../models/User'),
    jwt = require('jsonwebtoken'),
    JWTStrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJwt,
    LocalStategy = require('passport-local').Strategy;
require('source-dot-env')();    

var secret = process.env.JWT_SECRET || 'SECRET';

passport.use(new LocalStategy(function(username, password, done){
    console.log(username);

    User.findOne({username: username},function (err,user) {
        if(err) done(err);
        if(!user){
            return done(null, false, {  message: 'Invalid user' });
        } else {    
            if(bcrypt.compareSync(password, user.password)){
                var token = jwt.sign({
                    data: user._id
                }, secret);
                return done(null, token);
            } else {
                return done(null, false, {  message: 'Incorrect password'   });
            }
        }
    })
}));

var opts = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJWT.fromHeader('authorization')
};


passport.use(new JWTStrategy(opts,function (jwt_payload, done) {
    console.log(jwt_payload);
    User.findOne({_id: jwt_payload.data},function (err, user) {
        if(err) return done(err);
        if(!user){
            return done(null, false, {message: 'Incorrect'});
        } else {
            return done(null, true, true);
        }
    });
}));

module.exports = passport;


