define(function(require){

    var angular = require('angular');
    return angular.module('app.user.services',['gumga.core'])
        .service('UserService',require('./UserService'))
});