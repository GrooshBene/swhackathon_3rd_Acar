/**
 * Created by GrooshBene on 2016. 9. 2..
 */

module.exports = init;

function init(app, User) {
    app.post('/user/update/pushtoken', function (req, res) {
            User.update({_id : req.param('id')}, {gcm_token : req.param('gcm_token')}, function (err, result) {
                if(err){
                    console.log("/user/update/pushtoken update err");
                    throw err;
                }

                res.send(200, result);
                console.log("User Token Updated : " + result);
            });
        //user push test
            User.findOne({_id : req.param('id')}, function (err, result) {
                if(err){
                    console.log("/user/update/pushtoken find err");
                    throw err;
                }

                var gcm = require('node-gcm');
                var message = new gcm.Message({
                    collapseKey : 'demo',
                    delayWhileIdle : true,
                    timeToLive : 3,
                    data : {
                        key1 : '테스트',
                        key2 : 'test'
                    }
                });
                var sender = new gcm.Sender(server_access_key);
                var registrationIds = [];
                registrationIds.push(result.gcm_token);

                sender.send(message, registrationIds, 4, function (err, result) {
                    console.log(result);
                })
            })

        });

    //function end
}
