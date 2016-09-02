/**
 * Created by GrooshBene on 2016. 9. 2..
 */
module.exports = init;

function init(app, User) {
    var passport = require('passport');
    var randomString = require('randomstring');
    app.use(passport.initialize());
    app.use(passport.session());
    var FacebookTokenStrategy = require('passport-facebook-token');

    passport.serializeUser(function(user, done){
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    passport.use(new FacebookTokenStrategy({
        clientID : "",
        clientSecret : "",
        profileFields : ['id', 'displayName', 'photos', 'email', 'permissions']
    }, function (accessToken, refreshToken, profile, done) {
        console.log("User Logged In : " + profile);
        User.findOne({
            '_id' : profile.id
        }, function (err, user) {
            if(err){
                return done(err);
            }

            if(!user){
                user = new User({
                    _id : profile.id,
                    name : profile.displayName,
                    profile : profile.photos,
                    gcm_token : ""
                });
                user.save(function (err) {
                    if (err){
                        console.log("User DB Saving Error : " + err);
                    }
                    else{
                        done(null, profile);
                    }
                });
            }

            else if(user){
                console.log(profile.displayName + "Logged In");
                done(null, profile);
            }
        });
    }));

    app.get('/auth/facebook/token', passport.authenticate('facebook-token'), function (req, res) {
        console.log("User Access Request : " + req.param('access_token'));
        if(req.user){
            console.log(req.user + "Logged In");
            res.send(200, req.user);
        }
        else if(!req.user){
            console.log("Token Expired!");
            res.send(401, req.user);
        }
    });

    app.get('/auth/facebook/callback', passport.authenticate('facebook-token', {
        successRedirect : "/",
        failureRedirect : "/"
    }));

}