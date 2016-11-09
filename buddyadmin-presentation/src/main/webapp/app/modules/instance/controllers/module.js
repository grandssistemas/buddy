define(function(require){

    var angular = require('angular');
    return angular.module('app.instance.controllers',['gumga.core'])
        .controller('InstanceModalController',require('./InstanceModalController'))
});