define(['angular'], function (angular) {


    CompanyFormController.$inject = ['JuridicaCompanyService', 'entity', '$scope','$controller'];

    function CompanyFormController(JuridicaCompanyService, entity, $scope,$controller) {

        $scope.currentCompany = angular.copy(entity.data);
        $scope.continue = {};
        $scope.isIntegration = true;

        $scope.getPerson = function (param) {
            param = param || '';
            return JuridicaCompanyService.getAdvancedSearch('(lower(obj.name) like lower(\'%' + param + '%\'))').then(function (data) {
                return $scope.people = data.data.values;
            })
        };

        getTree();

        $scope.getFatherFat = function (value) {
            JuridicaCompanyService.loadWithParent(value.id).then(function (data) {
                $scope.currentCompany.father = data.data;
            })
        };
        $scope.update = function (entity) {
            if (!entity.id) {
                fillPerson(entity);
            }

            var father = entity.father;
            if (father) {
                father.branches = father.branches || [];
                father.branches.push(entity);
                delete entity.father;
                JuridicaCompanyService.update(father).then(function () {
                    getTree();
                    $scope.clean();
                })
            } else {
                JuridicaCompanyService.update(entity).then(function () {
                    getTree();
                    $scope.clean();
                })
            }
        }

        $scope.selectNode = function(node,$parentNode){
            node.father = $parentNode;
        }

        $scope.treeOptions = {
            nodeChildren: "branches",
            isLeaf: function(node){
                return (node.branches.length === 0);
            }
        }

        $scope.$watch('currentNode',function(data){
            if(data){
                $scope.currentCompany = angular.copy(data);
                $scope.$broadcast('companyChange',$scope.currentCompany);
            }
        });

        $scope.clean = function(){
            $scope.currentCompany = {}
            $scope.currentNode = {};
        }


        function getTree(){
            JuridicaCompanyService.getTree().then(function(data){
                $scope.personTree = data.data;
            })
        }

        function fillPerson(entity) {

            entity.active = {value: true};
            entity.addressList = [{
                "address": {
                    "zipCode": " ",
                    "premisseType": " ",
                    "premisse": "",
                    "number": "",
                    "information": "",
                    "neighbourhood": "",
                    "localization": "",
                    "state": "",
                    "country": ""
                },
                "primary": true
            }];
            entity.phones = [{
                "description": "CELULAR", "phone": {"value": ""}, "primary": true,
                "carrier": null, "information": null,
            }];
            entity.emails = [{
                "email": {"value": ""}, "primary": true
            }];
            entity.nickname = entity.name;

            entity.type = 'Juridica'

            entity.roles = [
                {
                    "active": true,
                    "role": {
                        "id": 1,
                        "oi": {"value": "8.21."},
                        "version": 0,
                        "name": "Empresa",
                        "groupAttributes": [{
                            "id": 2,
                            "oi": {"value": "8."},
                            "version": 0,
                            "attributes": [{
                                "id": 2,
                                "oi": {"value": "8."},
                                "version": 0,
                                "required": false,
                                "genericRoleAttribute": {
                                    "id": 1,
                                    "oi": {"value": "8."},
                                    "version": 1,
                                    "name": "Naturalidade",
                                    "tipoDeValorCaracteristica": "TEXTO",
                                    "classOption": null,
                                    "values": [],
                                    "standardSystem": null,
                                    "origin": "PERSON",
                                    "originLabel": "Pessoa"
                                },
                                "dependence": null
                            }],
                            "name": "ab",
                            "dependence": null
                        }],
                        "color": "#000000"
                    }
                }

            ];

        }
    }

    return CompanyFormController;
});