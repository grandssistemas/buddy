define(function (require) {
    var angular = require('angular');
    require('./services/module');

    angular.module('app.user', ['app.user.services']);
});
