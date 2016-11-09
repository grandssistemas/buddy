define(function (require) {
    var angular = require('angular');
    require('./services/module');

    angular.module('app.securityrole', ['app.securityrole.services']);
});
