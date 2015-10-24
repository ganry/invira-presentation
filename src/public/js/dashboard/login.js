/*
 * login.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-dashboard
 */

function Login(app) {
    var $this = this;
    this.app = app;

    this.fade = function (el1, el2) {
        el1.fadeOut('fast', function() {
            el2.fadeIn('400');
        });
    };

    this.init = function () {
        var loginContainer = $('#login-container');
        var signUpContainer = $('#signup-container');
        var note = $('#notification');

        $('#signup-link').on('click', function(e) {
            $this.fade(loginContainer, signUpContainer);
            e.preventDefault();
            return false;
        });

        $('#login-link').on('click', function(e) {
            $this.fade(signUpContainer, loginContainer);

            e.preventDefault();
            return false;
        });

        if (note.length > 0) {
            showNotification(note.text(), 'error');
        }

        $('#login-fb').on('click', function(e) {
            window.location.replace('/auth/facebook');
            e.preventDefault();
            return false;
        });

        $('#login-twitter').on('click', function(e) {
            window.location.replace('/auth/twitter');
            e.preventDefault();
            return false;
        });

        $('#login-google').on('click', function(e) {
            window.location.replace('/auth/google');
            e.preventDefault();
            return false;
        });

        //Events
        $(".forgotten-password-trigger").click(function() {
            $(".forgotten-password").slideToggle("slow");
        });

        // Validation Login
        $("#login-form").submit($this.loginSubmit);

        // Validation Email in Forgotten password
        $("#forgotten-password-form").submit($this.forgotPasswordSubmit);

        // Validation Sign up
        $("#signup-form").submit($this.signupSubmit);
    };

    this.loginSubmit = function(e) {

        var value_login = $("#login-username").val();
        var value_password = $("#login-password").val();


        var email_values = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

        // Email format validation
        if (!email_values.test(value_login))
        {
            $("#status-username").removeClass("icon-check");
            $("#status-username").addClass("icon-close");
            $(".login-username").addClass("error-placeholder");
            $("#login-username").addClass("error-input");

            return false;
        }

        // Everything is all right
        if (value_login != "" && value_password != "")
        {
            $("#status-username").addClass("icon-check");
            $("#status-username").toggleClass("icon-close", "icon-check");

            $("#status-password").addClass("icon-check");
            $("#status-password").toggleClass("icon-close", "icon-check");

            return true;
        }

        // If its not ok
        else {
            // If login isn't ok
            if (value_login == "")
            {
                $("#status-username").removeClass("icon-check");
                $("#status-username").addClass("icon-close");
                $(".login-username").addClass("error-placeholder");
                $("#login-username").addClass("error-input");
            }

            // If login is ok but password not
            else if (value_login != "")
            {
                $("#status-username").removeClass("icon-close");
                $("#status-username").addClass("icon-check");
                $(".login-username").removeClass("error-placeholder");
                $("#login-username").removeClass("error-input");
            }

            // If password isn't ok
            if (value_password == "")
            {
                $("#status-password").removeClass("icon-check");
                $("#status-password").addClass("icon-close");
                $(".login-password").addClass("error-placeholder");
                $("#login-password").addClass("error-input");
            }

            // If password is ok but login not
            else if (value_password != "")
            {
                $("#status-password").removeClass("icon-close");
                $("#status-password").addClass("icon-check");
                $(".login-password").removeClass("error-placeholder");
                $("#login-password").removeClass("error-input");
            }

            return false;
        }
    };

    this.forgotPasswordSubmit = function(e) {

        var value_forgotten_password_email = $("#login-forgotten-password").val();
        var email_values = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

        // Email format validation
        if (!email_values.test(value_forgotten_password_email) || value_forgotten_password_email == "") {
            $("#status-forgotten-password").removeClass("icon-check");
            $("#status-forgotten-password").addClass("icon-close");
            $(".login-forgotten-password").addClass("error-placeholder");
            $("#login-forgotten-password").addClass("error-input");

            return false;
        } else {
            $("#status-forgotten-password").removeClass("icon-close");
            $("#status-forgotten-password").addClass("icon-check");
            $(".login-forgotten-password").removeClass("error-placeholder");
            $("#login-forgotten-password").removeClass("error-input");

            // Send password reset
            $.get("assets/php/login.php");
            $("#forgotten-password-form").slideUp("slow");
            $(".forgotten-password").addClass("forgotten-password-sent");
            $(".forgotten-password p").text("Password reset succesfully sent");

            return false;
        }
    };

    this.signupSubmit = function(e) {

        var value_name = $("#signup-name").val();
        var value_email = $("#signup-email").val();
        var value_password = $("#signup-password").val();
        var value_repassword = $("#signup-repassword").val();

        // Email format validation
        var email_values = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

        if (!email_values.test(value_email)) {
            $("#status-email").removeClass("icon-check");
            $("#status-email").addClass("icon-close");
            $(".signup-email").addClass("error-placeholder");
            $("#signup-email").addClass("error-input");
            return false;
        }

        // Everything is all right
        if (value_name != "" && value_email != "" && value_password != "" && value_repassword == value_password && ($('#signup-agree:checked').val() !== undefined))
        {

            return true;
        }

        // If its not ok
        else {
            // If login isn't ok
            if (value_name == "")
            {
                $("#status-name").removeClass("icon-check");
                $("#status-name").addClass("icon-close");
                $(".signup-name").addClass("error-placeholder");
                $("#signup-name").addClass("error-input");
            }

            // If login is ok
            else if (value_name != "")
            {
                $("#status-name").addClass("icon-check");
                $("#status-name").removeClass("icon-close");
                $(".signup-name").removeClass("error-placeholder");
                $("#signup-name").removeClass("error-input");
            }

            // If email isn't ok
            if (value_email == "")
            {
                $("#status-email").removeClass("icon-check");
                $("#status-email").addClass("icon-close");
                $(".signup-email").addClass("error-placeholder");
                $("#signup-email").addClass("error-input");
            }

            // If email is ok
            else if (value_email != "")
            {
                $("#status-email").addClass("icon-check");
                $("#status-email").removeClass("icon-close");
                $(".signup-email").removeClass("error-placeholder");
                $("#signup-email").removeClass("error-input");
            }

            // If password isn't ok
            if (value_password == "")
            {
                $("#status-signup-password").removeClass("icon-check");
                $("#status-signup-password").addClass("icon-close");
                $(".signup-password").addClass("error-placeholder");
                $("#signup-password").addClass("error-input");
            }

            // If password is ok
            else if (value_password != "")
            {
                $("#status-password").addClass("icon-check");
                $("#status-password").removeClass("icon-close");
                $(".signup-password").removeClass("error-placeholder");
                $("#signup-password").removeClass("error-input");
            }

            // If repassword isn't same
            if (value_password != value_repassword || value_repassword == "")
            {
                $("#status-repassword").removeClass("icon-check");
                $("#status-repassword").addClass("icon-close");
                $(".signup-repassword").addClass("error-placeholder");
                $("#signup-repassword").addClass("error-input");
            }

            // If repassword is ok
            else if (value_password == value_repassword && value_repassword != "")
            {
                $("#status-repassword").addClass("icon-check");
                $("#status-repassword").removeClass("icon-close");
                $(".signup-repassword").removeClass("error-placeholder");
                $("#signup-repassword").removeClass("error-input");
            }

            if ($('#signup-agree:checked').val() == undefined)
            {
                $("#status-agree").addClass("icon-close");
                $("#status-agree").removeClass("icon-check");
                $('#status-agree').attr('data-original-title', 'Incorrect Email');
            }

            else if ($('#signup-agree:checked').val() !== undefined)
            {
                $("#status-agree").removeClass("icon-close");
                $("#status-agree").addClass("icon-check");
                $('#status-agree').prop('title', '');
            }

            return false;
        }
    };

    $this.init();
    return this;
}