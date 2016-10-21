define([], function() {

  PersonListController.$inject = ['$scope', 'PersonService', 'gumgaController'];

  function PersonListController($scope, PersonService, gumgaController) {

    gumgaController.createRestMethods($scope, PersonService, 'person');

    PersonService.resetDefaultState();
    $scope.person.execute('get');
    
    $scope.$on('deleteSuccess',function(){
      $scope.person.execute('get');
    })

    $scope.tableConfig = {
      columns: 'button, name',
      columnsConfig: [
        {
          name: 'button',
          size: 'col-md-1',
          title: ' ',
          content: '<span class="pull-right"><a class="btn btn-primary gmd btn-sm" ui-sref="person.edit({id: {{$value.id}} })"><i class="glyphicon glyphicon-pencil"></i></a></span>'
        },{
        name: 'name',
        title: '<span gumga-translate-tag="person.name"> nome </span>',
        content: '{{$value.name }}',
        sortField: 'nome'
      }, ]
    };

  };
  return PersonListController;
});
