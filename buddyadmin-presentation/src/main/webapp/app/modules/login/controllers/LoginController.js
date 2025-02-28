'use strict';

function LoginController(LoginService, $state, $scope, $timeout) {
    var vm = this;

    $scope.configMobiageLogin = {
        logo: 'resources/images/logo_mobiage.png',
        showLogoText: false,
        showCredits: false,
        showSignUp: false,
        theme: 'mobiage',
        appUrl: window.APILocation.apiLocation,
        fbKey: '1786309761398353',
        ggKey: 'FlVUpodFvQFIlUIhzl-_xRqA',
        clientId: '792727207063-77lrbkmkrgum236fs4uq65akjpctq7cm.apps.googleusercontent.com'
    };

    vm.loginGumga = (login) => {
        LoginService.loginGumga(login)
            .then((response) => {
                $state.go('app.welcome.home');
            }, (error) => {
                // console.error(error);
            })
    }

    vm.loginFacebook = (login) => {
        LoginService.createTokenWithFacebook(login.user.email, login.authResponse.accessToken)
            .then((tokenSecurity) => {
                if (!tokenSecurity.data.response) {
                    $state.go('app.welcome.home');
                } else {
                    showMessagesFacebook(tokenSecurity.data.response)
                }
            })
    }

    const showMessagesFacebook = (response) => {
        showMessages(response)
        if (response == 'NO_USER') {
            sweetAlert("Usuário não existe", "O usuário do facebook parece não ter cadastro no sistema, crie uma conta e tente novamente.", "warning");
        }
    }

    const showMessagesGooglePlus = (response) => {
        showMessages(response)
        if (response == 'NO_USER') {
            sweetAlert("Usuário não existe", "O usuário do google plus parece não ter cadastro no sistema, crie uma conta e tente novamente.", "warning");
        }
    }

    const showMessages = (response) => {
        if (response == 'TOKEN_EXPIRED_OR_NOT_IS_VALID') {
            sweetAlert("Oops...", "Seu token está expirado ou não existe.", "error");
        }
        if (response == 'USER_NOT_ENTITLED_IN_TOKEN') {
            sweetAlert("Oops...", "Usuário informado não possui direito sobre o token.", "error");
        }
    }

    vm.loginGooglePlus = (login) => {
        LoginService.createTokenWithGooglePlus(login.user.email, login.authResponse.access_token)
            .then((tokenSecurity) => {
                if (!tokenSecurity.data.response) {
                    $state.go('app.welcome.home');
                } else {
                    showMessagesGooglePlus(tokenSecurity.data.response)
                }
            })
    }

    vm.configuration = {
        appURL: APILocation.apiLocation
    };

    $scope.onLogin = (user) => {
        sessionStorage.setItem('token', user.token);
        $state.go('app.welcome.home');
    }

}

LoginController.$inject = ['LoginService', '$state', '$scope', '$timeout'];

module.exports = LoginController;
