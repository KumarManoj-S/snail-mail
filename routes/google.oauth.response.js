var request = require('request');
var emailHelpers = require('./email.helpers');
var emailer = require('./emailer');
var url = require('url');

module.exports = {
    handle: function (req, res) {
        var form = {
            code: req.query.code,
            client_id: '421703536444-megt0e62oo4kjamdavcq451f61snfi70.apps.googleusercontent.com',
            client_secret: 'lSkDHrnRyTYIjxNqAU_s7UD9',
            redirect_uri: req.protocol + '://' + req.get('host')  + '/googleOuathResponse',
            grant_type: 'authorization_code'
        };
        var accessToken = '';
        request.post({
            url: 'https://accounts.google.com/o/oauth2/token',
            form: form,
            json: true
        }, function (err, response, body) {
            console.log("google oauth body");
            console.dir(body);
            accessToken = body.access_token;
            var headers = {
                'Authorization': 'Bearer ' + accessToken
            };
            if(!body.access_token){
                res.render('error', {message : "Oops, something went wrong. Please try again"});
                return;
            }
            request.get({
                url: 'https://www.googleapis.com/plus/v1/people/me',
                headers: headers,
                json : true
            }, function (err, response, body) {
                var parsedUrl =  url.parse(req.originalUrl, true);
                var emailFormParams = url.parse("/anything?"+ parsedUrl.query.state, true).query;
                console.dir(emailFormParams);
                var fromEmail = body.emails[0].value;
                var emailContent = emailHelpers.getEmailArray(emailFormParams);
                emailFormParams['email-account'] = fromEmail;
                emailFormParams['accessToken'] = accessToken;
                emailer.sendEmails(emailContent, emailFormParams, 'Gmail', function(response){
                    res.render('send-email-response', response);
                });
            });
        });
    }
};