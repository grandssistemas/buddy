define(function(require) {
   require('angular')
   .module('app.company.services', [])
   .service('CompanyBuddyService', require('app/modules/company/services/CompanyBuddyService'))
   .service('CompanyPersonService', require('app/modules/company/services/CompanyPersonService'))
   .service('JuridicaCompanyService', require('app/modules/company/services/JuridicaCompanyService'))
   .service('IndividualCompanyService', require('app/modules/company/services/IndividualCompanyService'))
   .service('CompanyDocumentService', require('app/modules/company/services/CompanyDocumentService'));
});