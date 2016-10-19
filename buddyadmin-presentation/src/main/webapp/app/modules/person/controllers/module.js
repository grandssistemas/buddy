define(function (require) {
    var angular = require('angular');
    require('app/modules/person/services/module');
    require('angular-ui-router');

    return angular
            .module('app.person.controllers', ['app.person.services','ui.router'])
            .controller('PersonFormController', require('app/modules/person/controllers/PersonFormController'))
            .controller('PersonListController', require('app/modules/person/controllers/PersonListController'));
});