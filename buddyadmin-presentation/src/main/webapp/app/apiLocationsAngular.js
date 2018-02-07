define(['angular','apiLocations'], function (angular, apiLocation) {
    angular.module('api.location', [])
        .constant('apiLocation', apiLocation.apiLocation)
        .constant('apiStorageLocation', apiLocation.apiStorageLocation)
        .constant('apiAmazonStorageLocation', apiLocation.apiAmazonStorageLocation)
        .constant('apiFinanceLocation', apiLocation.apiFinanceLocation)
        .constant('frontFinanceLocation', apiLocation.frontFinanceLocation);

});