define([], function () {
    MenuBuddyController.$inject = [
        '$scope',
        '$timeout',
        '$rootScope',
        '$state',
        '$filter',
        '$http'];

    function MenuBuddyController($scope,
                                 $timeout,
                                 $rootScope,
                                 $state,
                                 $filter,
                                 $http) {


        $scope.user = JSON.parse(sessionStorage.getItem('user'));

        // if ($scope.user.profileImage && $scope.user.profileImage.indexOf("src/images/user-without-image.png") !== -1) {
        //     $scope.user.profileImage = userwithoutimage;
        // }

        function getItemByName(menu, key, callback){
            menu.forEach(function(item){
                if(item.state == key){
                    callback(item);
                }else{
                    if(item.children){
                        return getItemByName(item.children, key, callback);
                    }
                }
                //cesar
            })
        }

        $http.get('grands-menu.json').then(function (response) {
            $scope.menu = response.data;

            if($state.current && $state.current.name){
                getItemByName(response.data, $state.current.name, item => {
                    $scope.titleState = item && item.label ? item.label : '';
                });
            }

        });

        $http.get('keys.json').then(function (response) {
            $scope.keys = response.data;
        });


        document.onkeyup = function (e) {
            e = e || window.event; // for IE to cover IEs window object
            if (e.ctrlKey && e.which === 66) {
                angular.element('#searchBase')[0].focus();
                return false;
            }
        };

        $rootScope.$on('myAccountUpdateUser', function (event, user) {
            sessionStorage.setItem('user', user);
            $scope.user = user;
        });

        $scope.$watch('menu', function (current) {
            if (current && current.length) {
                $scope.oneLayerMenu = [];
                current.forEach(function (item) {
                    splitMenu(item, $scope.oneLayerMenu);
                })
            }
        })

        function splitMenu(menu, array) {
            if (menu.children && menu.children.length) {
                menu.children.forEach(function (menuItem) {
                    splitMenu(menuItem, array);
                })
            } else {
                array.push(menu);
            }
        }


        $scope.searchMenu = function (param) {
            return $filter('filter')($scope.oneLayerMenu, param, function (actual, expected) {
                return (typeof actual === 'object')
                    && (actual.search && actual.search.indexOf(StringUtilsService.removeAcento(expected.replace(new RegExp(' ', 'g'), '').toLowerCase())) > -1)
                    && (actual.key && $scope.keys.indexOf(actual.key) > -1);
            }, 'search');
        };

        $scope.goToState = function (item) {
            $state.go(item.state);
        };

        $scope.navCollapse = function () {
            $timeout(() => {
                if ($scope.menuOpened){
                    document.querySelector('.gumga-layout nav.gl-nav').classList.remove('collapsed');
                } else {
                    document.querySelector('.gumga-layout nav.gl-nav').classList.add('collapsed');
                }
            }).then(function () {
                $scope.menuOpened = angular.element(document.querySelector('.gumga-layout nav.gl-nav')).hasClass('collapsed');
            });
        };



        $scope.logout = function () {
            sessionStorage.clear();
            $state.go('login.log');
        }

    }

    return MenuBuddyController;


});
