define(['angular','apiLocations'], function (angular, apiLocation) {
    angular.module('api.location', [])
        .constant('apiLocation', apiLocation.apiLocation);
});