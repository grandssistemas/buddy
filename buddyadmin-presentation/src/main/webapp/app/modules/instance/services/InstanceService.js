define(['apiLocations'], function (APILocation) {

    InstanceService.$inject = ['GumgaRest'];

    function InstanceService(GumgaRest) {
        var service = new GumgaRest(APILocation.apiLocation + '/api/instance');

       
        return service;
    }

    return InstanceService;
});
