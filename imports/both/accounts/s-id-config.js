import { Meteor } from 'meteor/meteor';
import { sId } from 'meteor/juliancwirko:s-id';
import { FlowRouter } from 'meteor/kadira:flow-router';

// configuration for sId Meteor package
// see more at http://s-id.meteor.com
Meteor.startup(function () {
    sId.config({
        registerForm: {
            mainClass: 's-chat-sign-up-form', // css class for main container - you can change it and style it like you want in your app
            title: 'Sign Up', // form title
            leadText: '', // form description text
            submitBtnLabel: 'Sign Up' // button label text
        },
        loginForm: {
            mainClass: 's-chat-login-form',
            title: 'Login',
            leadText: '',
            submitBtnLabel: 'Login'
        },
        forgotPassForm: {
            mainClass: 's-chat-forgot-password-form',
            title: 'Forgot Password',
            leadText: '',
            submitBtnLabel: 'Send New!'
        },
        resetPassForm: {
            mainClass: 's-chat-reset-password-form',
            title: 'Reset Password',
            leadText: '',
            submitBtnLabel: 'Set New and Login!'
        },
        socialButtons: { // disable/enable social login/register buttons
            'github': false,
            'google': true,
            'twitter': false,
            'facebook': true,
            'labels': { // labels for social buttons
                'github': 'GitHub Access',
                'google': 'Google Access',
                'twitter': 'Twitter Access',
                'facebook': 'Facebook Access'
            }
        },
        // turn on e-mail verification.. without it user is still able to login, you can block it in the app by
        // checking e-mail verified field
        emailVerification: true,
        // change it to 'true' if you need only e-mail field on register form (default there is username and e-mail)
        registerEmailFieldOnly: false,
        // you can pass empty messages object to turn it off
        messages: {
            verifyEmail: 'You can login now. Also verify your e-mail address',
            verifiedEmail: 'Your email address was verified. Thanks!',
            somethingWrong: 'Something went wrong! Here is the error message: ',
            fillAllFields: 'Fill in all fields!',
            loginNow: 'You can login now.',
            sending: 'Sending...',
            validEmail: 'E-mail should be a valid e-mail address!',
            validPassword: 'Password should be at least one number, one lowercase and one uppercase letter and at least six characters!',
            validUsername: 'Username should be at least 3 characters long and max 12 characters!',
            // placeholders
            loginNamePlaceholder: 'Username or E-mail',
            usernamePlaceholder: 'Username',
            passwordPlaceholder: 'Password',
            emailPlaceholder: 'E-mail',
            newPasswordPlaceholder: 'New password'
        },
        // should return true or false - you can overwrite these functions in your app sId config...
        // also remember to adjust your error messages (config above)
        validateUsername: function (username) {
            var min = 3;
            var max = 12;
            if (username && username.length >= min && username.length <= max) {
                return true;
            }
            return false;
        },
        validatePassword: function (password) {
            var r = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
            if (password && r.test(password)) {
                return true;
            }
            return false;
        },
        validateEmail: function (email) {
            var r = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (r.test(email)) {
                return true;
            }
            return false;
        },
        onLogged: function () {
            // callback after successful login
            // it could be for example Router.go('/') or FlowRouter.go('/dashboard') or any other
            FlowRouter.go('/apps');
        },
        onRegistered: function () {
            // callback after successful registration
            // we want to wait on sAlert message
            FlowRouter.go('/login');
        },
        onForgotPassword: function () {
            // callback after successful on forgot password action
        },
        onResetPassword: function () {
            // callback after successful password reset
            FlowRouter.go('/apps');
        },
        getPasswordResetToken: function () {
            // here you should return reset password tokent from your route param
            // you should have configured route: '/reset-password/:resetToken',
            // then with Iron Router you can do something like:
            //
            // With Iron Router
            // return Router.current().params.resetToken; or with Flow Router
            // or with Flow Router
            // return FlowRouter.getParam('resetToken');
            return FlowRouter.getParam('resetToken');
        }
    });
});