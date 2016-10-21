define(['apiLocations'], function(APILocation) {

	IndividualCompanyService.$inject = ['GumgaRest'];

	function IndividualCompanyService(GumgaRest) {
    	var Service = new GumgaRest(APILocation.apiLocation + '/api/individual');

    	return Service;
    }

  	return IndividualCompanyService;
});