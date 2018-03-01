
const GumgaCustomFieldFormController = (GumgaCustomFieldService, $state, entity, $scope, gumgaController, $gmdAlert) => {
  $scope.continue = !$state.params.id
  GumgaCustomFieldService.resetDefaultState();
  gumgaController.createRestMethods($scope, GumgaCustomFieldService, 'gumgacustomfield');

  $scope.clazzes = [
    { label: 'ClasseA', value: 'br.pacote.domain.model.ClasaseA' },
    { label: 'ClasseB', value: 'br.pacote.domain.model.ClasaseB' },
    { label: 'ClasseC', value: 'br.pacote.domain.model.ClasaseC' }
  ];
  $scope.customFields = [
    { label: 'Texto', value: 'TEXT' },
    { label: 'Número', value: 'NUMBER' },
    { label: 'Data', value: 'DATE' },
    { label: 'Booleano', value: 'LOGIC' },
    { label: 'Seleção', value: 'SELECTION' }
  ];
  $scope.gumgacustomfield.data = entity.data || {};
  $scope.continue = {};

  $scope.$watch('gumgacustomfield.data.type', function (newValue, oldValue) {
    if (
      ($scope.gumgacustomfield.data.id == null) ||
      ($scope.gumgacustomfield.data.id != null && newValue != oldValue)
    ) {
      switch (newValue) {
        case 'TEXT': $scope.gumgacustomfield.data.defaultValueScript = "''"; break;
        case 'NUMBER': $scope.gumgacustomfield.data.defaultValueScript = "0"; break;
        case 'DATE': $scope.gumgacustomfield.data.defaultValueScript = "new Date()"; break;
        case 'LOGIC': $scope.gumgacustomfield.data.defaultValueScript = true; break;
        case 'SELECTION': $scope.gumgacustomfield.data.defaultValueScript = "''"; break;
      }
    }
  });


  $scope.gumgacustomfield.on('putSuccess', function (data) {
    $gmdAlert.success('Sucesso!', 'Seu registro foi adicionado!', 3000);
    if ($scope.shouldContinue) {
      $scope.gumgacustomfield.data = {};
    } else {
      $state.go('gumgacustomfield.list');
    }
  });

  $scope.gumgacustomfield.on('putError', function (data) {
    $gmdAlert.error('Ops!', 'Acho que algo deu errado!', 3000);
  });

}

GumgaCustomFieldFormController.$inject = ['GumgaCustomFieldService', '$state', 'entity', '$scope', 'gumgaController', '$gmdAlert'];

module.exports = GumgaCustomFieldFormController;
