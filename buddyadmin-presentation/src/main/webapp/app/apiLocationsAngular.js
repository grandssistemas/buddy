angular.module('api.location', [])
    .constant('apiName', APILocation.apiName)
    .constant('apiLocation', APILocation.apiLocation)
    .constant('apiStorageLocation', APILocation.apiStorageLocation)
    .constant('apiAmazonStorageLocation', APILocation.apiAmazonStorageLocation)
    .constant('apiFinanceLocation', APILocation.apiFinanceLocation)
    .constant('frontFinanceLocation', APILocation.frontFinanceLocation);
