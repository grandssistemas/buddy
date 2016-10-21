define(function(require) {
   require('angular')
   .module('app.person.services', [])
   .service('PersonService', require('app/modules/person/services/PersonService'))
   .service('JuridicaService', require('app/modules/person/services/JuridicaService'))
   .service('IndividualService', require('app/modules/person/services/IndividualService'));
});