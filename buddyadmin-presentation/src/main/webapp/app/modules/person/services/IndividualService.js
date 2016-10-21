define(['app/apiLocations'], function(APILocation) {

	IndividualService.$inject = ['GumgaRest'];

	function IndividualService(GumgaRest) {
    	var Service = new GumgaRest(APILocation.apiLocation + '/api/individual');

    	return Service;
    }

  	return IndividualService;
});