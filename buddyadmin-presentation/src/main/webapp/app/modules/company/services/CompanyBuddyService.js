define(['apiLocations'], function(APILocation) {

	CompanyBuddyService.$inject = ['GumgaRest'];

	function CompanyBuddyService(GumgaRest) {
    	var Service = new GumgaRest(APILocation.apiLocation + '/api/companybuddy');

		Service.createOrganization = function(person){
			return Service.extend('post','/addorganization',person);
			
		};

        Service.changeOrganization = function(id){
            return Service.extend('get','/changeorganization/' + id)
        };

        Service.verifyExistSh = function() {
        	return Service.extend('post', '/verifyexistsh');
		};

    	return Service;
    }

  	return CompanyBuddyService;
});