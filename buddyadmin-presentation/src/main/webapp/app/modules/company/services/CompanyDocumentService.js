/**
 * Created by gelatti on 02/02/17.
 */
define(['apiLocations'], function (APILocation) {

    CompanyDocumentService.$inject = ['GumgaRest'];

    function CompanyDocumentService(GumgaRest) {
        var Service = new GumgaRest(APILocation.apiLocation + '/api/cnpj');

        Service.getCaptcha = function () {
            return Service.extend('get', '/generate-captcha');
        };

        Service.buscaCNPJ = function (cnpj, captcha, cookie) {
            return Service.extend('get', '/buscacnpj', {params: {cnpj: cnpj, captcha: captcha, cookie: cookie}});
        }

        return Service;
    }

    return CompanyDocumentService;
});