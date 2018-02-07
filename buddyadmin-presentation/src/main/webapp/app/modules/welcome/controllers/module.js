
define(function (require) {
    var angular = require('angular');
    require('angular-ui-router');


    return angular.module('welcome.controllers', ['ui.router','gumga.core'])
        .controller('MenuBuddyController', require('./MenuBuddyController'))
});