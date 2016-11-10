define(['apiLocations'], function (APILocation) {

    UserService.$inject = ['GumgaRest'];

    function UserService(GumgaRest) {
        var service = new GumgaRest(APILocation.apiLocation + '/api/user');

        service.saveUser = function (user) {
            return service.extend('post', '/create', user)
        };

        return service;
    }

    return UserService;
});
