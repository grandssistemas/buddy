define(['moment'], function(moment) {

    InstanceModalController.$inject = ['$scope', '$uibModalInstance'];

    function InstanceModalController($scope,$uibModalInstance ) {

        $scope.entity = {}

        $scope.cancel = function(){
            $uibModalInstance.dismiss();
        }

        $scope.create = function(){
            $uibModalInstance.close($scope.entity);
        };

        $scope.blockBtnSave = function(){
            return !$scope.entity.name || !$scope.entity.expiration || moment($scope.entity.expiration).isBefore(moment(new Date()));
        };



    };
    return InstanceModalController;
});
