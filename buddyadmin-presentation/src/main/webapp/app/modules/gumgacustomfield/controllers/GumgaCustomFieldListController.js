
const GumgaCustomFieldListController = ($scope, GumgaCustomFieldService, gumgaController, $gmdAlert) => {
  GumgaCustomFieldService.resetDefaultState();
  gumgaController.createRestMethods($scope, GumgaCustomFieldService, 'gumgacustomfield');


  $scope.gumgacustomfield.execute('get');

  $scope.gumgacustomfield.on('deleteSuccess', function () {
    $gmdAlert.success('Sucesso!', 'Seu registro foi removido!', 2000);
    $scope.gumgacustomfield.execute('get');
  });

  $scope.actions = [
    { key: 'option1', label: 'option1' },
    { key: 'option2', label: 'option2' }
  ]

  $scope.search = function (field, param) {
    $scope.query = { searchFields: [field], q: param }
    $scope.gumgacustomfield.methods.search(field, param)
  }

  $scope.advancedSearch = function (param) {
    $scope.gumgacustomfield.methods.advancedSearch(param)
  }

  $scope.action = function (queryaction) {
    console.log(queryaction);
  }

  $scope.tableConfig = {
    columns: 'clazz,button',
    checkbox: true,
    selection: 'multi',
    materialTheme: true,
    itemsPerPage: [5, 10, 15, 30],
    empty: {
      enabled: true
    },
    columnsConfig: [{
      name: 'clazz',
      title: '<span gumga-translate-tag="gumgacustomfield.clazz">clazz</span>',
      content: '{{$value.clazz}}',
      sortField: 'clazz'
    }, {
      name: 'button',
      title: ' ',
      content: '<span class="pull-right"><a class="btn btn-primary btn-sm" ui-sref="app.gumgacustomfield.edit({id: {{$value.id}} })"><i class="glyphicon glyphicon-pencil"></i></a></span>'
    }]
  };

};

GumgaCustomFieldListController.$inject = ['$scope', 'GumgaCustomFieldService', 'gumgaController', '$gmdAlert'];
module.exports = GumgaCustomFieldListController;
