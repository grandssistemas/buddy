define(function(require) {
   require('angular')
   .module('app.person.services', [])
   .service('PersonService', require('app/modules/person/services/PersonService'));
});