define(['jquery'],
    function ($) {
        'use strict';
        LoginController.$inject = ['$scope', 'LoginService','$uibModal', 'CompanyBuddyService'];

        function LoginController($scope, LoginService, $uibModal, CompanyBuddyService) {
            $('#emailInput').focus();

            LoginService.removeToken();

            $scope.doLogin = function (user) {
                LoginService.setToken(user).then(function () {
                    CompanyBuddyService.verifyExistSh();
                });
            };
        }
        return LoginController;

    });
