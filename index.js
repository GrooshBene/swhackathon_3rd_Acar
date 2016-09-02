/**
 * Created by GrooshBene on 2016. 9. 2..
 */

var express = require('express');

var mongoose = require('mongoose');

var serveStatic = require('serve-static');

var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended : true
}));

var server = require('http').Server(app);


var schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/acar", function (err) {
    if(err){
        console.log("MongoDB Error!");
        throw err;
    }
});

var userSchema = new schema({
    _id : {
        type : String
    },
    name : {
        type : String
    },

    profile : {
        type : String
    },

    gcm_token : {
        type : String
    }
});

var User = mongoose.model('user', userSchema);

server.listen(8000);
console.log("Server Running At Port 8000");

require('./route/oauth')(app, User);

require('./route/user')(app, User);
