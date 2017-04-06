define(['angular',
    'angular-ui-router',
    'angular-sanitize',
    'ngImgCrop',
    'gumga-components',
    'ng-filter-br',
    'tree-control',
    'angular-input-masks',
    'string-mask',
    'moment',
    'br-validations',
    'gumga-layout',
    'buddy-core',
    'inspinia-datepicker',
    'angular-locale',
    'app/modules/login/module',
    'apiLocations',
    'bootstrap',
    'app/modules/user/module',
    'app/modules/instance/module',
    'app/modules/role/module',
    'app/modules/company/module',
    'app/directives/module',
    'product',
    'api-variables'], function (angular, moment) {
    //FIMREQUIRE
    window.moment = moment;
    angular.module('app.core', [
        'ui.router'
        , 'ngSanitize'
        , 'gumga.core'
        , 'app.login'
        , 'app.company'
        , 'app.user'
        , 'app.instance'
        , 'app.securityrole'
        , 'brasil.filters'
        , 'treeControl'
        , 'ui.utils.masks'
        , 'gumga.layout'
        , 'buddy.core'
        , 'buddyadmin.core'
        , 'datePicker'
        , 'product.core'
        //FIMINJECTIONS
    ])
        .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $injector, GumgaAlertProvider) {

            var template = [
                '<gumga-nav></gumga-nav>',
                '<gumga-menu menu-url="gumga-menu.json" keys-url="keys.json" image="./resources/images/gumga.png"></gumga-menu>',
                'oi<div class="gumga-container">',
                '<gumga-multi-entity-search data="multi.search"></gumga-multi-entity-search>',
                '</div>'
            ];

            $urlRouterProvider.otherwise('login/log');
            $stateProvider
                .state('login', {
                    abstract: true,
                    url: '/login',
                    data: {
                        id: 0
                    },
                    template: '<div ui-view style="height: 100%;"></div>'
                })
                .state('welcome', {
                    url: '/welcome',
                    data: {
                        id: 0
                    },
                    templateUrl: 'app/modules/welcome/views/welcome.html'
                })
                .state('multientity', {
                    url: '/multientity/:search',
                    template: template.join('\n'),
                    controller: 'MultiEntityController',
                    controllerAs: 'multi',
                    data: {
                        id: 0
                    },
                    resolve: {
                        SearchPromise: ['$stateParams', '$http', function ($stateParams, $http) {
                            var url = APILocations.apiLocation + '/public/multisearch/search/';
                            return $http.get(url + $stateParams.search);
                        }]
                    }
                })
                .state('gumgatagdefinition', {
                    url: '/gumgatagdefinition',
                    templateUrl: 'app/modules/gumgatagdefinition/views/base.html'
                })
                .state('gumgacustomfield', {
                    url: '/gumgacustomfield',
                    templateUrl: 'app/modules/gumgacustomfield/views/base.html'
                })
                .state('company', {
                    data: {
                        id: 1
                    },
                    url: '/company',
                    templateUrl: 'app/modules/company/views/base.html'
                })

            //FIMROUTE

            var countLoader = 0, countSuccessMessage = 0;
            $httpProvider.interceptors.push(function ($q, $injector, $timeout) {

                var rootScope = $injector.get('$rootScope');
                    rootScope.hideMessage = false;
                    rootScope.$on('hideNextMessage', function () {
                        console.log(rootScope.hideMessage);
                    rootScope.hideMessage = true;
                });
                return {
                    'request': function (config) {
                        config.headers['gumgaToken'] = window.sessionStorage.getItem('token') || 0;
                        return config;
                    },
                    'response': function (config) {
                        var isPost = config.config.method === 'POST' && config.config.url.indexOf('catalog') === -1;
                        if ((config.config.method === 'PUT' || isPost) && --countSuccessMessage === 0 && !rootScope.hideMessage) {
                            switch (config.config.method) {
                                case 'POST':
                                    GumgaAlertProvider.createSuccessMessage('Salvo com sucesso!', 'Pronto!');
                                    break;
                                case 'PUT':
                                    GumgaAlertProvider.createSuccessMessage('Editado com sucesso!', 'Pronto!');
                                    break;
                                default:
                                    break;
                            }
                        }
                        if (--countLoader === 0) {
                            rootScope.$broadcast('loader_hide');
                        }
                        if (rootScope.hideMessage && !countSuccessMessage && (config.config.method === 'PUT' || isPost)) {
                            rootScope.hideMessage = false;
                        }

                        return config;
                    },
                    'responseError': function (rejection) {
                        // var $state = $injector.get('$state');
                        // GumgaAlertProvider.createDangerMessage(rejection.data.response, rejection.statusText);
                        // rejection.status === 403 && ($state.go('login.log'));
                        // return $q.reject(rejection);
                        if (rejection.status === 403) {
                            var state = $injector.get('$state');
                            GumgaAlertProvider.createDangerMessage('Usuário ',
                                'Sua sessão expirou ou você não tem acesso a esta funcionalidade, faça login e tente novamente.',
                                'errors', {
                                    timer: 9999999
                                });
                            state.go('login.log');
                            return $q.reject(rejection);
                        }
                        if (rejection.status === 409 && rejection.data.data && rejection.data.data.SQLState === '23503') {
                            var state = rejection.data.data.SQLState,
                                message = $filter('gumgaTranslate')(state, 'errors');
                            GumgaAlertProvider.createDangerMessage('Conflito',
                                message,
                                'errors', {
                                    timer: 9999999
                                });
                            return $q.reject(rejection);
                        }
                        if (rejection.data && rejection.data.details && rejection.data.details.indexOf('notooltip;;') > -1) {
                            return $q.reject(rejection);
                        }
                        if (rejection.data && rejection.data.details && rejection.data.details.indexOf(';;') > -1) {
                            GumgaAlertProvider.createDangerMessage('ERRO AO REALIZAR O METODO ' + rejection.config.method + ' (' + rejection.status + ')',
                                $filter('gumgaTranslate')(rejection.data.details.split(';;')[0], 'errors'), {
                                    timer: 9999999
                                });
                            return $q.reject(rejection);
                        }
                        GumgaAlertProvider.createDangerMessage('ERRO AO REALIZAR O METODO ' + rejection.config.method + ' (' + rejection.status + ')',
                            rejection.config.url, 'errors', {
                                timer: 9999999
                            });
                        return $q.reject(rejection);
                    }
                };
            })
        })
});
