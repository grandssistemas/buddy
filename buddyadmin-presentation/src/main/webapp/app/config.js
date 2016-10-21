'use strict';
requirejs.config({

    paths: {
        "angular": "bower_components/angular/angular.min",
        "angular-mocks": "node_modules/angular-mocks/angular-mocks",
        "angular-bootstrap": "bower_components/angular-bootstrap/ui-bootstrap-tpls.min",
        "angular-ui-router": "bower_components/angular-ui-router/release/angular-ui-router.min",
        "angular-sanitize": "bower_components/angular-sanitize/angular-sanitize.min",
        "bootstrap": "bower_components/bootstrap/dist/js/bootstrap.min",
        "jquery": "bower_components/jquery/dist/jquery.min",
        "es5-sshim": "bower_components/es5-shim/es5-shim.min",
        'notify': "bower_components/remarkable-bootstrap-notify/dist/bootstrap-notify.min",
        "apiLocations":"app/apiLocations",
        "gumga-components":"bower_components/gumga-components/dist/gumga.min",
        "gumga-layout":"bower_components/gumga-layout/dist/app",
        "mousetrap-latest": "bower_components/mousetrap-latest/mousetrap.min",
        "remarkable-bootstrap-notify": "bower_components/remarkable-bootstrap-notify/dist/bootstrap-notify.min",
        "ngImgCrop": "bower_components/ng-img-crop/compile/minified/ng-img-crop",
        "ng-filter-br": "resources/javascript/ng-filters-br/ng-filter-br",
        'angular-input-masks': "bower_components/angular-input-masks/angular-input-masks",
        "string-mask": "bower_components/string-mask/src/string-mask",
        "moment": "bower_components/moment/min/moment-with-locales.min",
        "moment-timezone": "bower_components/moment-timezone/builds/moment-timezone.min",
        "br-validations": "bower_components/br-validations/releases/br-validations",
        "tree-control": "bower_components/angular-tree-control/angular-tree-control",
        "buddy-core": "bower_components/buddy-person-front/app/app"
    },
    shim: {
        "angular": {exports: "angular", deps: ["jquery"]},
        "angular-bootstrap": {deps: ["angular"]},
        "angular-input-masks": {deps: ['angular']},
        "angular-sanitize": {deps: ["angular"]},
        "angular-ui-router": {deps: ["angular"]},
        "angular-mocks": {deps: ["angular"], exports: "angular-mocks"},
        "bootstrap": {deps: ["jquery"]},
        "jquery-mask": {deps: ["jquery"]},
        "moment": {deps: ["jquery"], exports:"moment"},
        "gumga-components":{deps:['angular','angular-bootstrap', 'angular-ui-router', 'jquery', 'remarkable-bootstrap-notify', 'mousetrap-latest'] },
        "ngImgCrop": {deps: ["angular"]},
        "ng-filter-br": {deps: ['angular']},
        "tree-control": {deps: ['angular']},
        "buddy-core":{deps:['angular','gumga-components','apiLocations']},
        "gumga-layout":{deps:['angular']}
    }
});
