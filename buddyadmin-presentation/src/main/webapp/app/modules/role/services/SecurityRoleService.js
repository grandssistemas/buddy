define(['apiLocations'], function (APILocation) {

    SecurityRoleService.$inject = ['GumgaRest'];

    function SecurityRoleService(GumgaRest) {
        var service = new GumgaRest(APILocation.apiLocation + '/api/securityrole');


        return service;
    }
    
    return SecurityRoleService;
});
