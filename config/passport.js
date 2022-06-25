const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const User = require('../model/user');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

module.exports = function(passport) {
    passport.use(
        new LocalStrategy((username, password, done) => {
          User.findOne({ username: username }, (err, user) => {
            if (err) { 
              return done(err);
            }
            if (!user) {
              return done(null, false, { message: "Username is incorrect" });
            }
            bcrypt.compare(password, user.password, (err, res) => {
              if (res) {
                // passwords match! log user in
                return done(null, user)
              } else {
                // passwords do not match!
                return done(null, false, { message: "Incorrect password" })
              }
            })
          });
        })
      );

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey : 'this_is_the_jwt_secret'
      },
      function (jwtPayload, done){
        return done(null, jwtPayload);
      }
    ));
}