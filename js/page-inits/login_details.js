var accountDetailsTemplate = require('../../views/partials/email_account_details.hbs');
var urlHelpers = require('../functions/url.helpers');
var emailData = require('../functions/email_data');
var sendViaSmtp = require('../email_sending/send_via_smtp');
var tracking = require('../tracking');

module.exports = {
    init: function () {
        $("#login-details").html(accountDetailsTemplate()).show();
        this.bindGmailLogin();
        sendViaSmtp.init();
    },

    bindGmailLogin : function(){
        $("#gmail-login-link").click(function(){
            var url = $(this).attr("href");
            var serializedFormDetails = $("#attribute-details").serialize() + '&' +  $("#email-details-form").serialize();
            emailData.save(serializedFormDetails);
            tracking.track('gmailLoginClick');
            window.location.href = url + "&redirect_uri=" + encodeURIComponent(urlHelpers.getHost() + "/googleOauthResponse");
            return false;
        });
    }
};