define(function(require){

    var angular = require('angular');
    return angular.module('app.instance.services',['gumga.core'])
        .service('InstanceService',require('./InstanceService'))
});