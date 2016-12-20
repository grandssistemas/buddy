define(['apiLocations'], function (APILocation) {

    SecurityRoleService.$inject = ['GumgaRest'];

    function SecurityRoleService(GumgaRest) {
        var service = new GumgaRest(APILocation.apiLocation + '/api/securityrole');
        
        service.create = function(role){
            return service.extend('post','/create',role);
        }


        return service;
    }
    
    return SecurityRoleService;
});
