const env = process.env.NODE_ENV == 'production' ? require('./environments/environment.prod').env : require('./environments/environment').env;

import topbarUserService from './services/topbarUser.service';

Object.keys(env).forEach((key) => window[key] = env[key]);
require('./import-libs');
require('./import-styles');
require('./import-modules');
require('./import-projects');

require('./apiLocationsAngular');
require('./apiVariables');


angular.module('gumga.core', [
	'gumga.rest',
	'gumga.controller',
	'gumga.alert',
	'gumga.webstorage',
	'gumga.manytoone',
	'gumga.address',
	'gumga.translate',
	'gumga.mask',
	'gumga.chips',
	'gumga.upload',
	'gumga.customfields',
	'gumga.avatar',
	'gumga.formbuttons',
	'gumga.counter',
	'gumga.breadcrumb',
	'gumga.confirm',
	'gumga.onetomany',
	'gumga.populate',
	'gumga.manytomany',
	'gumga.form',
	'gumga.queryfilter',
	'gumga.genericfilter',
	'gumga.list',
	'gumga.login',
	'gumga.layout',
	'gumga.date',
	'gumga.queryaction',
	'gumga.myAccountEmbedded',
	'gumga.numberinwords',
	'gumga.gallery-icon'
]);

angular.module('app.core', [
	'ui.router',
	'ui.router.state.events',
	'ui.select',
	'ui.tree',
	'mbg.base',
	'mbgLogin',

	'ui.sortable',
	'ngSanitize',
	'ngColorPicker',
	'ui.bootstrap',
	'gumga.core',
	'app.login',
	'app.base',
	'app.account',
	'app.gumgatagdefinition',
	'app.gumgacustomfield',
	'app.welcome',
	'oitozero.ngSweetAlert',
	'ui.select',
	'ui.ace',
	'brasil.filters',
	'app.taxsettings.services',
	'buddy.core',
	'grands.components',
	'finance.embedded',
	'characteristic.core',
	'product.core',
	'operationtype.core',
	'taxsettings.core',
	'paymenttype.core',
	'pdv.core',
	'movementgroup.core',
	'app.reportlist'
	// FIMINJECTIONS
])
	.service('updateUserTop', topbarUserService)
	.run(['$rootScope', '$timeout', '$transitions', 'updateUserTop', function ($rootScope, $timeout, $transitions, updateUserTop) {
		$rootScope.$watch(() => {
			setTimeout(() => angular.element('a[href]').attr('target', '_self'), 0);
		});
		$rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState) => {
			if (toState.name !== 'login') {
				updateUserTop.update();
			}
		});
	}])
	.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$injector', function ($stateProvider, $urlRouterProvider, $httpProvider, $injector) {
		let template = [
			'<gumga-nav></gumga-nav>',
			'<gumga-menu menu-url="gumga-menu.json" keys-url="keys.json" image="./resources/images/gumga.png"></gumga-menu>',
			'<div class="gumga-container">',
			'<gumga-multi-entity-search data="multi.search"></gumga-multi-entity-search>',
			'</div>'
		];

		let tempĺateBase = 'app/modules/common/views/base.html';
		$urlRouterProvider.otherwise('/login');

		$stateProvider
			.state('app', {
				abstract: true,
				template: `
					<mbg-base config="configBase">
						<mb-topbar config="configTopbar"></mb-topbar>
						<mb-container>
							<mb-sidemenu config="configMenu"></mb-sidemenu>
							<mb-content>
							<ui-view></ui-view>
							</mb-content>
						</mb-container>
						<mb-footer></mb-footer>
						<mb-pageloader></mb-pageloader>
					</mbg-base>
					<mb-notifications></mb-notifications>
			  `
			})
			.state('app.account', {
				url: '/account',
				abstract: true
			})
			.state('app.welcome', {
				url: '/welcome',
				abstract: true,
				data: { id: 0 }
			})
			.state('app.multientity', {
				url: '/multientity/:search',
				template: template.join('\n'),
				controller: 'MultiEntityController',
				controllerAs: 'multi',
				data: { id: 0 },
				resolve: {
					SearchPromise: ['$transition$', '$http', function ($transition$, $http) {
						let url = `${APILocations.apiLocation}/public/multisearch/search/`;
						return $http.get(url + $transition$.params().search);
					}]
				}
			})
			.state('app.gumgatagdefinition', {
				url: '/gumgatagdefinition',
				abstract: true
			})
			.state('app.gumgacustomfield', {
				url: '/gumgacustomfield',
				abstract: true
			});

		const handlingLoading = ($injector, $timeout) => {
			let $http = $injector.get('$http');

			const loading = angular.element('gmd-spinner.loading');
			if (loading) $timeout(() => loading.css({ display: $http.pendingRequests.length > 0 ? 'block' : 'none' }));
		};

		$httpProvider.interceptors.push(($q, $injector, $timeout, $filter, $gmdAlert) => {
			return {
				'request': function (config) {
					config.headers['gumgaToken'] = window.sessionStorage.getItem('user') ? JSON.parse(window.sessionStorage.getItem('user')).token : 0
					handlingLoading($injector, $timeout);
					var url = config.url;
					if (url === '/baseGrandsComponents.html') {
						config.url = tempĺateBase;
					}
					return config
				},
				'response': function (config) {
					handlingLoading($injector, $timeout);
					return config
				},
				'responseError': function (rejection) {
					handlingLoading($injector, $timeout);
					var $state = $injector.get('$state')
					var GumgaAlert = $injector.get('GumgaAlert')
					if (rejection.status == 404) {
						$gmdAlert.error('404', 'Verifique se o endereço foi digitado corretamente.', 3000);

						return;
					}
					var error = {
						title: rejection.data.response || rejection.data.code,
						message: rejection.data.response ? rejection.statusText : rejection.data.details,
						errorCode: (rejection.data.data) ? rejection.data.data.ErrorCode : null
					}
					if (error.title === 'NO_USER' || error.title === 'BAD_PASSWORD') {
						error.message = 'Usuario ou senha está incorreto!'
					}
					if (rejection.data.response == 'NO_TOKEN' || rejection.data.response == 'TOKEN_EXPIRED') {
						sessionStorage.clear();
						localStorage.clear();
						$state.go('login');
						$gmdAlert.error('Login necessário', 'Sua sessão expirou, faça o login novamente.', 3000);
					}
					if (error.title === 'OPERATION_NOT_ALLOWED') {
						error.message = rejection.data.operation
					}
					if (error.title === 'ConstraintViolation') {
						error.message = 'Estes dados não podem ser deletados, pois estão sendo utilizado por outros registros.'
					}
					$gmdAlert.error($filter('gumgaTranslate')(error.title, 'exception'), error.message, 3000);
					rejection.status === 403 && ($state.go('login'));
					return $q.reject(rejection);
				}
			}
		});
	}])
	.controller('app.controller', ($scope, $state, updateUserTop, $http) => {
		$scope.configBase = {
			theme: 'theme10'
		};

		$scope.configTopbar = {
			logo: 'resources/images/logo_mobiage_darker.png',
			logoActionType: 'state',
			logoAction: 'app.welcome.home',
			user: {
				links: [
					{
						label: 'Meu Perfil',
						iconSrc: 'fontawesome',
						icon: 'far fa-user',
						iconSize: '22',
						actionType: 'state',
						action: 'app.account.browse'
					},
					{
						label: 'Trocar de Conta',
						iconSrc: 'fontawesome',
						icon: 'fas fa-exchange-alt',
						iconSize: '22',
						actionType: 'internal',
						action: 'changeAccount'
					},
					{
						label: 'Sair',
						iconSrc: 'fontawesome',
						icon: 'fas fa-sign-out-alt',
						iconSize: '22',
						actionType: 'function',
						action: () => {
							sessionStorage.clear();
							$state.go('login');
						}
					}
				],
				changeOrganizationAction: (organizationSelected) => {
					const user = JSON.parse(sessionStorage.getItem('user'));
					$http.get(`${window.APILocation.apiLocation}/public/token/changeorganization/${user.token}/${organizationSelected.id}`)
						.then((res) => {
							const newOrganization = res.data;
							if (res.status === 200 && newOrganization !== undefined) {
								user.organization = newOrganization.name;
								user.organizationHierarchyCode = newOrganization.hierarchyCode;
								user.securityManager = newOrganization.securityManager;
								user.softwareHouse = newOrganization.isSoftwareHouse;
								user.token = newOrganization.token || user.token;
								window.location.reload();
							} else {
								console.error(res);
							}
						})
						.catch((error) => { console.error(error); });
				}
			},
			search: {
				active: true,
				indexFields: [{
					name: 'name'
				}],
				data: [
					{
						type: 'static',
						data: 'sideMenuLinks'
					}
				]
			}
		};

		$scope.configMenu = {
			quickMenu: { enabled: false },
			structure: [
				{
					type: 'category',
					label: 'Menu',
					children: [
						{
							type: 'btn',
							label: 'Início',
							iconSrc: 'material',
							icon: 'home',
							actionType: 'state',
							action: 'app.welcome.home'
						},
						{
							type: 'sub-category',
							label: 'Cadastros',
							children: [
								{
									type: 'btn',
									label: 'Árvore de Produto',
									iconSrc: 'material',
									icon: 'device_hub',
									actionType: 'state',
									action: 'app.categorization.tree'
								},
								{
									type: 'btn',
									label: 'Características',
									iconSrc: 'material',
									icon: 'photo_filter',
									actionType: 'state',
									action: 'app.characteristic.list'
								},
								{
									type: 'btn',
									label: 'Tipos de Pagamento',
									iconSrc: 'material',
									icon: 'monetization_on',
									actionType: 'state',
									action: 'app.paymentmethods.insert'
								},
								{
									type: 'btn',
									label: 'Tipos de Operação',
									iconSrc: 'material',
									icon: 'layers',
									actionType: 'state',
									action: 'app.stock.insert'
								},
								{
									type: 'btn',
									label: 'Regra Comercial',
									iconSrc: 'material',
									icon: 'local_offer',
									actionType: 'state',
									action: 'app.businessrule.list'
								},
								{
									type: 'btn',
									label: 'Papéis',
									iconSrc: 'material',
									icon: 'person_pin',
									actionType: 'state',
									action: 'app.role.list'
								},
								{
									type: 'btn',
									label: 'Grupo fiscal de Produto',
									iconSrc: 'material',
									icon: 'local_library',
									actionType: 'state',
									action: 'app.productfiscalgroup.productlist'
								},
								{
									type: 'btn',
									label: 'Grupo fiscal de Pessoa',
									iconSrc: 'material',
									icon: 'person_pin_circle',
									actionType: 'state',
									action: 'app.fiscalgroup.personlist'
								},
								{
									type: 'btn',
									label: 'Fórmulas',
									iconSrc: 'material',
									icon: 'note_add',
									actionType: 'state',
									action: 'app.formula.list'
								},
								{
									type: 'btn',
									label: 'Configurações de Tributo',
									iconSrc: 'material',
									icon: 'local_atm',
									actionType: 'state',
									action: 'app.taxsettings.list'
								}
							]
						}
					]
				}
			]
		};
	});
