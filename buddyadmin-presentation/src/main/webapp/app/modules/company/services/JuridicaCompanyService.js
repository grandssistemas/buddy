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

		Service.getAdvancedSearchWithoutTenancy = function(p){
			Service.resetDefaultState();
			if(typeof p === 'string'){
				this._query.params.aq = p;
				return Service.extend('get','/searchwithouttenancy',this._query)
			}
			this._query.params.aq = p.hql;
			this._query.params.aqo = JSON.stringify(p.source);
			return Service.extend('get','/searchwithouttenancy',this._query)

		}

		return Service;
    }

  	return JuridicaCompanyService;
});