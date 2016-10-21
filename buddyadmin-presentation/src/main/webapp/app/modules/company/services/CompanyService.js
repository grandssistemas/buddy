define(['apiLocations'], function(APILocation) {

	CompanyService.$inject = ['GumgaRest'];

	function CompanyService(GumgaRest) {
    	var Service = new GumgaRest(APILocation.apiLocation + '/api/person');

    	return Service;
    }

  	return CompanyService;
});