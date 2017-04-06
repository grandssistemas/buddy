define(['angular'], function (angular) {


    CompanyFormController.$inject = [
        'JuridicaCompanyService',
        'entity',
        '$scope',
        'CompanyService',
        'RoleService',
        'GumgaAlert',
        '$timeout',
        'UserService',
        '$uibModal',
        'InstanceService',
        'moment',
        'SecurityRoleService',
        'CompanyDocumentService',
        'JuridicaService',
        'DepartmentService'
    ];

    function CompanyFormController(JuridicaCompanyService,
                                   entity,
                                   $scope,
                                   CompanyService,
                                   RoleService,
                                   GumgaAlert,
                                   $timeout,
                                   UserService,
                                   $uibModal,
                                   InstanceService,
                                   moment,
                                   SecurityRoleService,
                                   CompanyDocumentService,
                                   JuridicaService,
                                   DepartmentService) {

        $scope.currentCompany = angular.copy(entity.data);
        $scope.continue = {};
        $scope.currentUser = {};
        $scope.currentRole = {};
        $scope.instance = {};
        $scope.isIntegration = true;
        $scope.codeCaptcha = '';
        $scope.tree = {};
        $scope.getCaptcha = function () {
            CompanyDocumentService.getCaptcha().then(function (data) {
                $scope.captchaImg = data.data.captcha;
                $scope.cookie = data.data.cookie;
            });
        };
        setSegments();
        setDepartmens();
        $scope.getCaptcha();

        function setDepartmens () {
            DepartmentService.getAll().then(function (data) {
                $scope.departments = data.data.values;
                $scope.departments.forEach(function (dep) {
                    dep.value = false;
                });
            });
        }

        RoleService.getAdvancedSearch('obj.category != \'OWNER\'').then(function (data) {
            $scope.roleCategories = data.data.values;
        });

        function setSegments () {
            JuridicaService.getSegments().then(function (data) {
                $scope.segments = data.data;
                $scope.segments.forEach(function (seg) {
                    seg.value = false;
                });
            });
        }

        $scope.apply = function () {
            $timeout(function () {
                $scope.a = !$scope.a;
            }, 10)
        };


        $scope.change = function () {
            CompanyService.changeOrganization(8);
        };

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
                $scope.codeCaptcha = document.getElementById('captcha').value;//tive que fazer pois não estava funcionando pelo ng-model
                fillPerson(entity, $scope.codeCaptcha, $scope.cookie);
            }

        };

        function resetState() {
            getTree();
            $scope.cleanAll();
        }

        $scope.selectNode = function (node, $parentNode) {
            node.father = $parentNode;
            $scope.role = node.roles[0].role;
        };

        $scope.treeOptions = {
            nodeChildren: "branches",
            isLeaf: function (node) {
                return (node.branches.length === 0);
            }
        };

        $scope.$watch('currentNode', function (data) {
            if (data) {
                $scope.currentCompany = angular.copy(data);
                if ($scope.currentCompany.segments) {
                    $scope.segments.forEach(function (seg) {
                        seg.value = $scope.currentCompany.segments.indexOf(seg.key) >= 0;
                    });
                }
                if ($scope.currentCompany.departments) {
                    $scope.departments.forEach(function (dep) {
                        $scope.currentCompany.departments.forEach(function (depScope) {
                            if (dep.id === depScope.id) {
                                dep.value = true;
                            }
                        });
                    });
                }
                if (data.roles) {
                    $scope.$broadcast('role', data.roles[0].role);
                } else {
                    $scope.$broadcast('role', {});
                }
                $scope.$broadcast('companyChange', $scope.currentCompany);
            }
        });

        $scope.$on('role', function (ev, data) {
            $scope.role = data;
        });

        $scope.cleanAll = function () {
            cleanOrganization();
            cleanUser();
            cleanInstance();
            cleanRole();
            if ($scope.PersonForm.treeSearch) {
                $scope.PersonForm.treeSearch.$setUntouched();
            }
            $scope.getCaptcha();
            setSegments();
            setDepartmens();
            $timeout(function () {
                document.getElementById('orgTab').click();
            });
        };

        function cleanOrganization() {
            $scope.currentCompany = {};
            $scope.currentNode = {};
            document.getElementById('captcha').value = '';
            document.getElementById('name').value = '';
            document.getElementById('cnpj').value = '';
            $scope.role = {};
        }

        function cleanInstance() {
            $scope.instance = {};
            $scope.PersonForm.instanceName.$setUntouched();
        }

        function cleanRole() {
            $scope.currentRole = {};
            $scope.PersonForm.roleName.$setUntouched();
        }

        $scope.blockBtnSave = function () {
            return !$scope.currentCompany.name || !$scope.role;
        };


        $scope.blockBtnUser = function (user) {
            return !user.name || !user.email;
        };

        $scope.addUser = function (user) {
            var userToAdd = angular.copy(user);
            userToAdd.oi = $scope.currentCompany.oi.value;
            userToAdd.role = user.role;
            UserService.saveUser(userToAdd).then(function (data) {
                console.log(data);
            })
        };

        function cleanUser() {
            $scope.currentUser = {};
            $scope.PersonForm.username.$setUntouched();
            $scope.PersonForm.login.$setUntouched();
        }

        $scope.searchRole = function (param) {
            var hql = "obj.instance.id = " + $scope.currentUser.instance.id;
            if (param) {
                hql = hql + " and obj.name like '%" + param + "%'"
            }
            return SecurityRoleService.getAdvancedSearch(hql).then(function (data) {
                return data.data.values;
            });
        };

        $scope.blockBtnInstance = function (instance) {
            return !instance || !instance.name || !instance.expiration || moment(instance.expiration).isBefore(moment(new Date()));
        };

        $scope.createInstance = function (data) {
            var newInstance = angular.copy(data);
            newInstance.oi = $scope.currentCompany.oi.value;
            newInstance.expiration = moment(newInstance.expiration).format('DD/MM/YYYY');
            if (newInstance.withRole) {
                InstanceService.createInstanceWithRole(newInstance).then(function (data) {
                    console.log(data);
                })
            } else {
                InstanceService.createInstance(newInstance).then(function (data) {
                    console.log(data);
                })
            }
        };

        $scope.searchInstance = function (param) {
            console.log($scope.currentCompany);
            var hql = "obj.organization.id = " + $scope.currentCompany.oi.value.replace(".", "");
            if (param) {
                hql = hql + " and obj.name like '%" + param + "%'"
            }
            return InstanceService.getAdvancedSearch(hql).then(function (data) {
                return data.data.values;
            });
        };


        $scope.newInstance = function () {
            var modalResult = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/modules/instance/views/InstanceModal.html',
                controller: 'InstanceModalController',
                resolve: {},
                size: 'sm'
            });

            modalResult.result.then(function (data) {
                $scope.createInstance(data);

            })

        };

        $scope.createRole = function (curRole) {
            var newRole = {};
            newRole.name = curRole.name;
            newRole.instanceId = curRole.instance.id;
            SecurityRoleService.create(newRole).then(function (data) {
                console.log(data);
            })
        };

        function getTree() {
            JuridicaCompanyService.getTree().then(function (data) {
                $scope.personTree = data.data;
            })
        }

        function getRoleCategories(person) {
            var result = [];
            if (person.roles) {
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
                case "DISTRIBUTOR":
                    if (!entity.father || !containRoles(['OWNER'], entity.father)) {
                        GumgaAlert.createDangerMessage('Erro no Cadastro', 'Um distribuidor deve estar ligado à uma empresa do tipo \'DONO\'.');
                        return false;
                    }
                    break;
                case "COMPANY":
                    if (!entity.father) {
                        GumgaAlert.createDangerMessage('Erro no Cadastro', 'Uma empresa deve estar ligada à alguma entidade.');
                        return false;
                    }
                    break;
                case "AGGREGATOR":
                    if (!entity.father) {
                        GumgaAlert.createDangerMessage('Erro no Cadastro', 'Um Grupo Economico deve estar ligada à alguma entidade.');
                        return false;
                    }
                    break;
                default:
                    GumgaAlert.createDangerMessage('Erro no Cadastro', 'Tipo de empresa inválido.');
                    return false;
            }
            if ($scope.captchaCnpj === '') {
                GumgaAlert.createDangerMessage('Erro na Consulta', 'Por favor digite a captcha para consulta CNPJ.');
                return false;
            }
            if ((entity.name === '' || !entity.name) && !entity.cnpj) {
                GumgaAlert.createDangerMessage('Erro na Cadastro', 'Por favor digite uma Razão Social ou um CNPJ.');
                return false;
            }
            return true;
        }

        function getBranchByName(person, name) {
            return person.branches.filter(function (branch) {
                return branch.name === name;
            })[0];
        }

        $scope.changeSegment = function (index) {
            $scope.segments[index].value = !$scope.segments[index].value;
        };

        $scope.changeDepartment = function (index) {
            $scope.departments[index].value = !$scope.departments[index].value;
        };

        function fillPerson(entity, captcha, cookie) {
            if (!entity.id) {
                if (entity.cnpj && captcha !== '') {
                    CompanyDocumentService.buscaCNPJ(entity.cnpj.value, captcha, cookie).then(function (data) {
                        if (data.data.razaoSocial !== null) {
                            var segments = [];
                            $scope.segments.forEach(function (seg) {
                                if (seg.value) {
                                    segments.push(seg.key);
                                }
                            });
                            var departments = [];
                            $scope.departments.forEach(function (dep) {
                                if (dep.value) {
                                    departments.push(dep);
                                }
                            });
                            entity.segments = segments;
                            entity.departments = departments;
                            entity.active = {value: true};
                            entity.addressList = [{
                                "address": {
                                    "zipCode": data.data.cep,
                                    "premisseType": " ",
                                    "premisse": data.data.logradouro,
                                    "number": data.data.numero,
                                    "information": data.data.complemento,
                                    "neighbourhood": data.data.bairro,
                                    "localization": data.data.cidade,
                                    "state": data.data.uf,
                                    "country": "Brasil",
                                    "latitude": 0,
                                    "longitude": 0,
                                    "formalCode": ""
                                },
                                "primary": true
                            }];
                            entity.name = data.data.razaoSocial;
                            entity.nickname = data.data.nomeFantasia;
                            entity.phones = [{
                                "description": "COMERCIAL", "phone": {"value": data.data.telefone}, "primary": true,
                                "carrier": null, "information": null
                            }];
                            entity.emails = [{
                                "email": {"value": data.data.email}, "primary": true
                            }];
                            entity.type = 'Juridica';
                            entity.attributeValues = [];
                            entity.branches = [];
                            entity.relationships = [];
                            entity.socialNetworks = [];
                            entity.cnaes = [];
                            entity.roles = [{
                                active: true,
                                role: $scope.role
                            }];
                            entity.billAddressList = [];
                            var father = entity.father;
                            var toUpdate = entity;
                            if (!entity.id && father) {
                                father.branches = father.branches || [];
                                father.branches.push(entity);
                                toUpdate = father;
                            }
                            delete entity.father;

                            JuridicaCompanyService.update(toUpdate).then(function (data) {
                                if (!entity.id) {
                                    var newCompany = data.data.data.name === entity.name ? data.data.data : getBranchByName(data.data.data, entity.name);
                                    CompanyService.createOrganization(newCompany).then(function () {
                                        resetState();
                                    });
                                } else {
                                    resetState();
                                }
                            })
                        } else {
                            GumgaAlert.createDangerMessage('Erro na Consulta', 'Por favor verifique o captcha e o CNPJ.');
                        }
                    });
                } else {
                    var segments = [];
                    $scope.segments.forEach(function (seg) {
                        if (seg.value) {
                            segments.push(seg.key);
                        }
                    });
                    var departments = [];
                    $scope.departments.forEach(function (dep) {
                        if (dep.value) {
                            departments.push(dep);
                        }
                    });
                    entity.segments = segments;
                    entity.departments = departments;
                    entity.active = {value: true};
                    entity.addressList = [{
                        "address": {
                            "zipCode": '',
                            "premisseType": '',
                            "premisse": '',
                            "number": '',
                            "information": '',
                            "neighbourhood": '',
                            "localization": '',
                            "state": '',
                            "country": '',
                            "latitude": 0,
                            "longitude": 0,
                            "formalCode": ""
                        },
                        "primary": true
                    }];
                    entity.nickname = entity.name;
                    entity.phones = [{
                        "description": "COMERCIAL", "phone": {"value": ''}, "primary": true,
                        "carrier": null, "information": null
                    }];
                    entity.emails = [{
                        "email": {"value": ''}, "primary": true
                    }];
                    entity.type = 'Juridica';
                    entity.attributeValues = [];
                    entity.branches = [];
                    entity.relationships = [];
                    entity.socialNetworks = [];
                    entity.cnaes = [];
                    entity.billAddressList = [];
                    entity.roles = [{
                        active: true,
                        role: $scope.role
                    }];
                    var father = entity.father;
                    var toUpdate = entity;
                    if (!entity.id && father) {
                        father.branches = father.branches || [];
                        father.branches.push(entity);
                        toUpdate = father;
                    }
                    delete entity.father;

                    JuridicaCompanyService.update(toUpdate).then(function (data) {
                        if (!entity.id) {
                            var newCompany = data.data.data.name === entity.name ? data.data.data : getBranchByName(data.data.data, entity.name);
                            CompanyService.createOrganization(newCompany).then(function () {
                                resetState();
                            });
                        } else {
                            resetState();
                        }
                    });
                }
            }
        }
    }

    return CompanyFormController;
});