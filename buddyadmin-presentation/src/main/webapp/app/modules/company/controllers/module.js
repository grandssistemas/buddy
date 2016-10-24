define(function (require) {
    var angular = require('angular');
    require('app/modules/company/services/module');
    require('angular-ui-router');

    return angular
            .module('app.company.controllers', ['app.company.services','ui.router'])
            .controller('CompanyFormController', require('app/modules/company/controllers/CompanyFormController'))
            .controller('CompanyListController', require('app/modules/company/controllers/CompanyListController'))
            .controller('PersonFormController', require('bower_components/buddy-person-front/app/modules/person/controllers/PersonFormController'));
});