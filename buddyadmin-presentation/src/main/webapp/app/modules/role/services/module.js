define(function(require){

    var angular = require('angular');
    return angular.module('app.securityrole.services',['gumga.core'])
        .service('SecurityRoleService',require('./SecurityRoleService'))
});