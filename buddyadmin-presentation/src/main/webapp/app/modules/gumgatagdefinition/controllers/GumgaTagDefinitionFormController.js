
const GumgaTagDefinitionFormController = (GumgaTagDefinitionService, $state, entity, $scope, gumgaController, $gmdAlert) => {
    GumgaTagDefinitionService.resetDefaultState();
    gumgaController.createRestMethods($scope, GumgaTagDefinitionService, 'gumgatagdefinition');

    $scope.novoAtributo = "";
    $scope.gumgatagdefinition.data = entity.data || {};
    $scope.continue = {};

    $scope.novo = function () {
        var tem = false;
        var tamanho = $scope.gumgatagdefinition.data.attributes.length;
        for (var i = 0; i < tamanho; i++) {
            if ($scope.gumgatagdefinition.data.attributes[i].name === $scope.novoAtributo) {
                tem = true;
                break;
            }
        }
        if (!tem) {
            $scope.gumgatagdefinition.data.attributes.push({ name: $scope.novoAtributo });
        }
        $scope.novoAtributo = "";
    }

    $scope.remover = function (index) {
        $scope.gumgatagdefinition.data.attributes.splice(index, 1);
    }


    $scope.gumgatagdefinition.on('putSuccess', function (data) {
        $gmdAlert.success('Sucesso!', 'Seu registro foi adicionado!', 2000);
        $state.go('gumgatagdefinition.list');
    })

}

GumgaTagDefinitionFormController.$inject = ['GumgaTagDefinitionService', '$state', 'entity', '$scope', 'gumgaController', '$gmdAlert'];
module.exports = GumgaTagDefinitionFormController;
