
define(function (require) {
    'use strict';
    require('angular-ui-router');
    require('app/modules/welcome/controllers/module');
    return angular.module('app.welcome', ['ui.router', 'welcome.controllers', 'gumga.core']);
});
