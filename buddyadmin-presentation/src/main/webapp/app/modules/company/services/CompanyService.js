define(['apiLocations'], function(APILocation) {

	CompanyService.$inject = ['GumgaRest'];

	function CompanyService(GumgaRest) {
    	var Service = new GumgaRest(APILocation.apiLocation + '/api/company');

		Service.createOrganization = function(person){
			return Service.extend('post','/addorganization',person);
			
		};

        Service.changeOrganization = function(id){
            return Service.extend('get','/changeorganization/' + id)
        };

    	return Service;
    }

  	return CompanyService;
});