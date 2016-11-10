define(function(require){

    var angular = require('angular');
    return angular.module('app.securityrole.controllers',['gumga.core'])
        .controller('RoleModalController',require('./RoleModalController'))
});