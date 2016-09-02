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

                var FCM = require('fcm').FCM;
                var apiKey = '프로젝트가 같다면 기존 GCM API 코드 쓰면 됨';
                var fcm = new FCM(apiKey);
                var message = {
                    registration_id: result.gcm_token, // required
                    collapse_key: 'Collapse key',
                    data1: '테스트',
                    data2: 't으아아아' };
                    fcm.send(message, function(err, messageId){
                        if (err) {
                            console.log("Something has gone wrong!");
                        }
                        else {
                            console.log("Sent with message ID: ", messageId);
                        }
                    });
            })

        });

    //function end
}
