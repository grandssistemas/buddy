define(function (require) {
    var angular = require('angular');
    require('./services/module');
    require('./controllers/module');

    angular.module('app.securityrole', ['app.securityrole.services','app.securityrole.controllers']);
});
