define(['app/apiLocations'], function(APILocation) {

	PersonService.$inject = ['GumgaRest'];

	function PersonService(GumgaRest) {
    	var Service = new GumgaRest(APILocation.apiLocation + '/api/person');

    	return Service;
    }

  	return PersonService;
});