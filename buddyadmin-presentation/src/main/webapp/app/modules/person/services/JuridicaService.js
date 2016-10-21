define(['app/apiLocations'], function(APILocation) {

	JuridicaService.$inject = ['GumgaRest'];

	function JuridicaService(GumgaRest) {
    	var Service = new GumgaRest(APILocation.apiLocation + '/api/juridica');

		Service.loadWithParent = function(id){
			return Service.extend('get','/loadwithfather/' + id);
		}

		Service.getTree = function(){
			return Service.extend('get','/tree');
		}

		return Service;
    }

  	return JuridicaService;
});