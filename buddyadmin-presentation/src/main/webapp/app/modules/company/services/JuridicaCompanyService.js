define(['apiLocations'], function(APILocation) {

	JuridicaCompanyService.$inject = ['GumgaRest'];

	function JuridicaCompanyService(GumgaRest) {
    	var Service = new GumgaRest(APILocation.apiLocation + '/api/juridica');

		Service.loadWithParent = function(id){
			return Service.extend('get','/loadwithfather/' + id);
		}

		Service.getTree = function(){
			return Service.extend('get','/tree');
		}

		return Service;
    }

  	return JuridicaCompanyService;
});