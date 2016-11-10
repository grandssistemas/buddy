define([], function() {

    RoleModalController.$inject = ['$scope', '$uibModalInstance'];

    function RoleModalController($scope,$uibModalInstance) {

        $scope.entity = {}

        $scope.cancel = function(){
            $uibModalInstance.dismiss();
        }

        $scope.create = function(){
            $uibModalInstance.close($scope.entity);
        };

        $scope.blockBtnSave = function(){
            return !$scope.entity.name || !entity.instance;
        };



    };
    return RoleModalController;
});
