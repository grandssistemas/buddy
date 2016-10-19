define([], function() {

  PersonListController.$inject = ['$scope', 'PersonService', 'gumgaController'];

  function PersonListController($scope, PersonService, gumgaController) {

    gumgaController.createRestMethods($scope, PersonService, 'person');

    PersonService.resetDefaultState();
    $scope.person.execute('get');

    $scope.tableConfig = {
      columns: 'nome ,button',
      checkbox: true,
      columnsConfig: [{
        name: 'nome',
        title: '<span gumga-translate-tag="person.nome"> nome </span>',
        content: '{{$value.nome }}',
        sortField: 'nome'
      }, {
        name: 'button',
        title: ' ',
        content: '<span class="pull-right"><a class="btn btn-primary btn-sm" ui-sref="person.edit({id: {{$value.id}} })"><i class="glyphicon glyphicon-pencil"></i></a></span>'
      }]
    };

  };
  return PersonListController;
});
