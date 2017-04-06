define(function (require) {
    var angular = require('angular');
    require('./services/module');
    require('./controllers/module');

    angular.module('app.instance', ['app.instance.services','app.instance.controllers']);
});
