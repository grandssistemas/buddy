define(['apiLocations'], function (APILocation) {

    InstanceService.$inject = ['GumgaRest'];

    function InstanceService(GumgaRest) {
        var service = new GumgaRest(APILocation.apiLocation + '/api/instance');

       
        service.createInstance = function(instance){
            return service.extend('post','/create',instance)
        }

        service.createInstanceWithRole = function(instance){
            return service.extend('post','/createwithrole',instance)
        }
        
        return service;
    }

    return InstanceService;
});
