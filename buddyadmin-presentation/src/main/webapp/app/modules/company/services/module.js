define(function(require) {
   require('angular')
   .module('app.company.services', [])
   .service('CompanyService', require('app/modules/company/services/CompanyService'))
   .service('JuridicaCompanyService', require('app/modules/company/services/JuridicaCompanyService'))
   .service('IndividualCompanyService', require('app/modules/company/services/IndividualCompanyService'));
});