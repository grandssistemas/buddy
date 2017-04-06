define(['jquery'],
    function ($) {
        'use strict';
        LoginController.$inject = ['$scope', 'LoginService','$uibModal', 'CompanyService'];

        function LoginController($scope, LoginService, $uibModal, CompanyService) {
            $('#emailInput').focus();

            LoginService.removeToken();

            $scope.doLogin = function (user) {
                LoginService.setToken(user).then(function () {
                    CompanyService.verifyExistSh();
                });
            };
        }
        return LoginController;

    });
