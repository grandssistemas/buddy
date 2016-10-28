define(['apiLocations'], function(APILocation) {

	CompanyPersonService.$inject = ['GumgaRest'];

	function CompanyPersonService(GumgaRest) {
    	var Service = new GumgaRest(APILocation.apiLocation + '/api/person');

    	return Service;
    }

  	return CompanyPersonService;
});