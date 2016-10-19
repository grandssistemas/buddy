define([], function() {


 	PersonFormController.$inject = ['PersonService', '$state', 'entity', '$scope', 'gumgaController'];

 	function PersonFormController(PersonService, $state, entity, $scope, gumgaController) {

    	gumgaController.createRestMethods($scope, PersonService, 'person');



		$scope.getPerson = function (param) {
			if (param){
				return PersonService.getAdvancedSearch('(lower(obj.name) like lower(\'%' + param + '%\'))').then(function (data) {
					return $scope.people = data.data.values;
				})
			}
		};

		$scope.person.data = entity.data || {};
		$scope.continue = {};
	
		$scope.person.on('putSuccess',function(data){
			$state.go('person.list');
		});
 	}
	
	return PersonFormController;   
});