'use strict';
requirejs.config({

    paths: {
        "angular": "bower_components/angular/angular.min",
        "angular-mocks": "node_modules/angular-mocks/angular-mocks",
        "angular-bootstrap": "bower_components/angular-bootstrap/ui-bootstrap-tpls.min",
        "angular-ui-router": "bower_components/angular-ui-router/release/angular-ui-router.min",
        "angular-ui-tree" : "bower_components/angular-ui-tree/dist/angular-ui-tree",
        "ui-select" : "/bower_components/ui-select/dist/select.min",
        "angular-sanitize": "bower_components/angular-sanitize/angular-sanitize.min",
        "popper": "bower_components/popper.js/dist/umd/popper",
        "bootstrap": "bower_components/bootstrap/dist/js/bootstrap.min",
        "jquery": "bower_components/jquery/dist/jquery.min",
        'jquery-mask': "bower_components/jQuery-Mask-Plugin/dist/jquery.mask.min",
        "es5-sshim": "bower_components/es5-shim/es5-shim.min",
        'notify': "bower_components/remarkable-bootstrap-notify/dist/bootstrap-notify.min",
        "apiLocations":"app/apiLocations",
        "api-variables": "app/systemVariables",
        "api-locations-angular": "app/apiLocationsAngular",
        "gumga-core": "app/gumgaCore",
        "gumga-layout":"gumga-layout/gumga-layout.min",
        "gumga-simple-image": "bower_components/gumga-simple-image-ng/dist/simple-image-ng.min",
        "gumga-security-embedded": "bower_components/gumga-security-embedded/dist/security-embedded.min",
        "gumga-rest": "bower_components/gumga-rest-ng/dist/gumga-rest.min",
        "gumga-controller": "bower_components/gumga-controller-ng/dist/gumga-controller.min",
        "gumga-alert": "bower_components/gumga-alert-ng/dist/gumga-alert.min",
        "gumga-web-storage": "bower_components/gumga-web-storage-ng/dist/gumga-web-storage.min",
        "gumga-many-to-one": "bower_components/gumga-many-to-one-ng/dist/gumga-many-to-one.min",
        "gumga-address": "bower_components/gumga-address-ng/dist/gumga-address.min",
        "gumga-translate": "bower_components/gumga-translate-ng/dist/gumga-translate.min",
        "gumga-mask": "bower_components/gumga-mask-ng/dist/gumga-mask.min",
        "gumga-upload": "bower_components/gumga-upload-ng/dist/gumga-upload.min",
        "gumga-custom-fields": "bower_components/gumga-custom-fields-ng/dist/gumga-custom-fields.min",
        "gumga-form-buttons": "bower_components/gumga-form-buttons-ng/dist/gumga-form-buttons.min",
        "gumga-counter": "bower_components/gumga-counter/dist/gumga-counter.min",
        "gumga-breadcrumb": "bower_components/gumga-breadcrumb/dist/gumga-breadcrumb.min",
        "gumga-confirm": "bower_components/gumga-confirm/dist/gumga-confirm.min",
        "gumga-one-to-many": "bower_components/gumga-one-to-many-ng/dist/gumga-one-to-many.min",
        "gumga-populate": "bower_components/gumga-populate-ng/dist/gumga-populate.min",
        "gumga-many-to-many": "bower_components/gumga-many-to-many-ng/dist/gumga-many-to-many.min",
        "gumga-form": "bower_components/gumga-form-ng/dist/gumga-form.min",
        "gumga-generic-filter": "bower_components/gumga-generic-filter-ng/dist/gumga-generic-filter.min",
        "gumga-query-filter": "bower_components/gumga-query-filter-ng/dist/gumga-query-filter.min",
        "gumga-list": "bower_components/gumga-list-ng/dist/gumga-list.min",
        "gumga-number-in-words": "bower_components/gumga-number-in-words-ng/dist/gumga-number-in-words.min",
        "gumga-date": "bower_components/gumga-date-ng/dist/gumga-date.min",
        "gumga-click-sync": "bower_components/gumga-click-sync-ng/dist/gumga-click-sync.min",
        "gumga-gallery-icon": "bower_components/gumga-gallery-icon-ng/dist/gumga-gallery-icon.min",
        "gumga-avatar": "bower_components/gumga-avatar-ng/dist/gumga-avatar.min",
        "gumga-gquery": "bower_components/gumga-gquery-ng/dist/gumga-gquery.min",
        "grands-core": "bower_components/grands-components/grands-components.min",
        "mousetrap-latest": "bower_components/mousetrap-latest/mousetrap.min",
        "remarkable-bootstrap-notify": "bower_components/remarkable-bootstrap-notify/dist/bootstrap-notify.min",
        "ngImgCrop": "bower_components/ng-img-crop/compile/minified/ng-img-crop",
        "ng-filter-br": "resources/javascript/ng-filters-br/ng-filter-br",
        'angular-input-masks': "bower_components/angular-input-masks/angular-input-masks",
        "inspinia": "dist/inspinia/js/inspinia",
        "string-mask": "bower_components/string-mask/src/string-mask",
        "moment": "bower_components/moment/min/moment-with-locales.min",
        "moment-timezone": "bower_components/moment-timezone/builds/moment-timezone.min",
        "br-validations": "bower_components/br-validations/releases/br-validations",
        "tree-control": "bower_components/angular-tree-control/angular-tree-control",
        "buddy-core": "bower_components/buddy-person-front/buddypersonfront.min",
        "inspinia-datepicker": "bower_components/angular-datepicker/dist/angular-datepicker",
        "angular-moment": "bower_components/angular-moment/angular-moment.min",
        "angular-locale": "bower_components/angular-locale-pt-br/angular-locale_pt-br",
        "sweet-alert": "bower_components/sweetalert/dist/sweetalert.min",
        "ng-sweet-alert": "bower_components/ngSweetAlert/SweetAlert.min",
        "product": "bower_components/product-front/product.min",
        "characteristic": "bower_components/characteristic-front/characteristic.min",
        "payment-type": "bower_components/paymenttype-front/paymenttype.min",
        "operation-type": "bower_components/operationtype-front/operationtype.min",
        "pdv": "bower_components/pdv-front/pdv.min",
        "tributador": "bower_components/tributador-front/tributador.min",
        "movementgroup": "bower_components/movementgroup-front/movementgroup.min",
    },
    shim: {
        "angular": {exports: "angular", deps: ["jquery"]},
        "popper": {exports: "popper", deps: ["jquery", "angular"]},
        "ui-select": {deps: ["jquery", "angular"]},
        "angular-ui-tree": {deps: ["jquery", "angular"]},
        "angular-bootstrap": {deps: ["angular"]},
        "angular-input-masks": {deps: ['angular']},
        "angular-sanitize": {deps: ["angular"]},
        "angular-ui-router": {deps: ["angular"]},
        "angular-mocks": {deps: ["angular"], exports: "angular-mocks"},
        "bootstrap": {deps: ["jquery", "popper"]},
        "jquery-mask": {deps: ["jquery"]},
        "moment": {deps: ["jquery"], exports:"moment"},
        "gumga-core":{deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-components":{deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-simple-image": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-security-embedded": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-rest": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-controller": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest', 'gumga-rest'] },
        "gumga-alert": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-web-storage": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-many-to-one": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-address": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-translate": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-mask": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-upload": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-custom-fields": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-form-buttons": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-counter": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-breadcrumb": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-confirm": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-one-to-many": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-populate": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-many-to-many": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-form": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-generic-filter": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-query-filter": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-list": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-number-in-words": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-date": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-click-sync": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-gallery-icon": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-avatar": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "gumga-gquery": {deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "ngImgCrop": {deps: ["angular"]},
        "jquery": {exports: 'jquery'},
        "inspinia-datepicker": {deps: ['angular', 'angular-moment','moment']},
        "ng-filter-br": {deps: ['angular']},
        "inspinia": {deps: ['jquery']},
        "angular-locale": {deps: ['angular']},
        "grands-core": {deps: ['angular', 'api-locations-angular']},
        "tree-control": {deps: ['angular']},
        "buddy-core": {
            deps: [
                'angular',
                'gumga-rest',
                'gumga-gquery',
                'grands-core',
                'gumga-controller',
                'br-validations',
                'characteristic',
                'angular-ui-router',
                'angular-sanitize',
                'apiLocations',
                'ng-filter-br',
                'angular-input-masks',
                'string-mask',
                'moment',
                'inspinia-datepicker',
                'angular-locale'
            ]
        },
        "characteristic": {deps: ['angular', 'angular-ui-router','grands-core', 'api-locations-angular', 'grands-core']},
        "payment-type": {deps: ['angular', 'angular-ui-router', 'ui-select', 'angular-sanitize', 'grands-core', 'api-locations-angular', 'grands-core']},
        "pdv": {deps: ['angular', 'angular-ui-router', 'ui-select', 'angular-sanitize', 'grands-core', 'api-locations-angular', 'grands-core']},
        "tributador": {deps: ['angular', 'angular-ui-router', 'ui-select', 'angular-sanitize', 'grands-core', 'api-locations-angular', 'grands-core']},
        "operation-type": {deps: ['angular', 'angular-ui-router','grands-core', 'api-locations-angular', 'characteristic', 'movementgroup', 'grands-core']},
        "movementgroup": {deps: ['angular', 'angular-ui-router', 'ui-select', 'angular-sanitize', 'grands-core', 'api-locations-angular', 'grands-core']},
        "gumga-layout":{deps:['angular']},
        "api-locations-angular": {
            deps: ['angular', 'apiLocations']
        },
        "product": {deps: ['angular', 'grands-core', 'angular-ui-router','api-locations-angular','characteristic', 'ng-sweet-alert']},
        "api-variables": {deps: ['angular']},
        "sweet-alert": {deps: ['angular']},
        "ng-sweet-alert": {deps: ['angular', 'sweet-alert']}
    }
});


