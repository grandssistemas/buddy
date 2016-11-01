define(['angular'], function (angular) {


    CompanyFormController.$inject = ['JuridicaCompanyService', 'entity', '$scope', 'CompanyService', 'RoleService', 'GumgaAlert'];

    function CompanyFormController(JuridicaCompanyService, entity, $scope, CompanyService, RoleService,  GumgaAlert) {

        $scope.currentCompany = angular.copy(entity.data);
        $scope.continue = {};
        $scope.isIntegration = true;


        RoleService.findAll().then(function (data) {
            $scope.roleCategories = data.data;
        })


        $scope.change = function () {
            CompanyService.changeOrganization(8);
        }
        $scope.getPerson = function (param) {
            param = param || '';
            return JuridicaCompanyService.getAdvancedSearchWithoutTenancy('(lower(obj.name) like lower(\'%' + param + '%\'))').then(function (data) {
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
            if (validRecord(entity)) {
                fillPerson(entity);
                var father = entity.father;
                var toUpdate = entity;
                if (father) {
                    father.branches = father.branches || [];
                    father.branches.push(entity);
                    delete entity.father;
                    toUpdate = father;
                }
                JuridicaCompanyService.update(toUpdate).then(function (data) {
                    if (!entity.id) {
                        var newCompany = data.data.data.name === entity.name ? data.data.data : getBranchByName(data.data.data,entity.name);
                        CompanyService.createOrganization(newCompany).then(function(){
                            resetState();
                        });
                    } else{
                        resetState();
                    }
                })


            }

        };

        function resetState(){
            getTree()
            $scope.clean();
        }

        $scope.selectNode = function (node, $parentNode) {
            node.father = $parentNode;
            $scope.role = node.roles[0].role;
        }

        $scope.treeOptions = {
            nodeChildren: "branches",
            isLeaf: function (node) {
                return (node.branches.length === 0);
            }
        }

        $scope.$watch('currentNode', function (data) {
            if (data) {
                $scope.currentCompany = angular.copy(data);
                $scope.$broadcast('companyChange', $scope.currentCompany);
            }
        });

        $scope.clean = function () {
            $scope.currentCompany = {}
            $scope.currentNode = {};
            $scope.role = null;
        }

        $scope.blockBtnSave = function () {
            return !$scope.currentCompany.name || !$scope.role;
        }


        function getTree() {
            JuridicaCompanyService.getTree().then(function (data) {
                $scope.personTree = data.data;
            })
        }

        function getRoleCategories(person) {
            var result = [];
            if (person.roles){
                person.roles.forEach(
                    function (associative) {
                        if (associative.active) {
                            result.push(associative.role.category);
                        }
                    })
            }
            return result;
        }

        function containRoles(roles, person) {
            var personRoles = getRoleCategories(person);
            return personRoles.filter(function (role) {
                    return roles.indexOf(role) > -1;
                }).length > 0
        }

        function validRecord(entity) {
            switch ($scope.role.category) {
                case "OWNER":
                    if (entity.father) {
                        GumgaAlert.createDangerMessage('Erro no Cadastro', 'Uma empresa do tipo \'DONO\' não pode ter registro pai.');
                        return false;
                    }
                    break;
                case "DISTRIBUTOR":
                    if (!entity.father || !containRoles(['OWNER'], entity.father)) {
                        GumgaAlert.createDangerMessage('Erro no Cadastro', 'Um distribuidor deve estar ligado à uma empresa do tipo \'DONO\'.');
                        return false;
                    }
                    break;
                case "REPRESENTATIVE":
                    if (!entity.father || !containRoles(['REPRESENTATIVE', 'DISTRIBUTOR'], entity.father)) {
                        GumgaAlert.createDangerMessage('Erro no Cadastro', 'Um representante deve estar ligado à uma empresa revendedor ou à outro representante');
                        return false;
                    }
                    break;
                case "COMPANY":
                    if (entity.father && (containRoles('OWNER', entity.father))) {
                        GumgaAlert.createDangerMessage('Erro no Cadastro', 'Uma empresa não pode estar ligada diretamente à uma entidade do tipo \'DONO\'.');
                        return false;
                    }
                    break;
                case "AGGREGATOR":
                    GumgaAlert.createDangerMessage('Erro no Cadastro', 'Uma matriz agregadora não pode estar ligada diretamente à uma entidade do tipo \'DONO\'.');
                    return false;
                    break;
                default:
                    GumgaAlert.createDangerMessage('Erro no Cadastro', 'Uma empresa não pode estar ligada diretamente à uma entidade do tipo \'DONO\'.');
                    return false;
                    break;
            }
            return true;
        }

        function getBranchByName(person,name){
            return person.branches.filter(function(branch){
                return branch.name === name;
            })[0];
        }

        function fillPerson(entity) {


            if (!entity.id) {

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

                entity.attributeValues = [];
                entity.branches = [];
                entity.relationships = [];
                entity.socialNetworks = [];
                entity.cnaes = [];
                entity.roles = [{
                    active: true,
                    role: $scope.role
                }];

            }
        }
    }

    return CompanyFormController;
});