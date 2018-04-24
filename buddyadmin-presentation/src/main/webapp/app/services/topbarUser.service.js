const service = function (mbgBaseUserService, StorageService, $http, apiLocation) {
	const createImage = (image) => {
		if (image !== null && image !== undefined && typeof image === 'object') {
			return `data:${image.mimeType};base64,${image.bytes}`;
		} else if (typeof image === 'string' && image.length > 1) {
			return image;
		}
		return null;
	};

	this.update = () => {
		const user = JSON.parse(sessionStorage.getItem('user'));

		if (user !== undefined && user !== null) {

			mbgBaseUserService.setUser({
				name: user.name !== undefined ? user.name : undefined,
				avatar: user.picture !== undefined ? createImage(user.picture) : undefined
			});

			if (user.token !== undefined && user.token !== null) {
				$http.get(window.APILocation.apiLocationMobiage.concat('/public/token/organizations/'.concat(user.token)))
					.then((res) => {
						if (res.data !== undefined && res.data.length > 1) {
							const otherOrganizations = res.data.map((value) => {
								const tmpOrg = value;
								tmpOrg.logo = undefined;
								return tmpOrg;
							});
							mbgBaseUserService.setUser({ otherOrganizations });
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
		}

		$http.get(`${window.APILocation.apiLocationMobiage}/api/company/currentcompany`).then((res) => {
			const formatCNPJ = (cnpj) => {
				const tmpCnpj = cnpj.replace('-', '').replace('/', '').replace('.', '').trim();
				return `${tmpCnpj.substr(0, 2)}.${tmpCnpj.substr(2, 3)}.${tmpCnpj.substr(5, 3)}/${tmpCnpj.substr(8, 4)}-${tmpCnpj.substr(12, 2)}`;
			};

			const company = {
				razaoSocial: res.data.name || undefined,
				nomeFantasia: res.data.nickname || undefined,
				avatar: res.data.file !== undefined && res.data.file.url !== undefined ? StorageService.apiAmazonLocation.concat(res.data.file.url) : undefined,
				CNPJ: res.data.cnpj !== undefined ? res.data.cnpj.value || undefined : undefined,
				inscricaoEstadual: res.data.stateRegistration !== undefined ? res.data.stateRegistration : undefined
			};

			const actualOrganization = {
				name: company.nomeFantasia,
				subTitle: company.razaoSocial,
				avatar: company.avatar,
				info: [{
					title: 'Razão Social',
					text: company.razaoSocial
				}, {
					title: 'Nome Fantasia',
					text: company.nomeFantasia
				}]
			};

			if (company.CNPJ !== undefined) {
				actualOrganization.info.push({
					title: 'CNPJ',
					text: formatCNPJ(company.CNPJ)
				});
			}

			if (company.inscricaoEstadual !== undefined) {
				actualOrganization.info.push({
					title: 'Inscrição Estadual',
					text: company.inscricaoEstadual
				});
			}

			mbgBaseUserService.setUser({ actualOrganization });
		}).catch((error) => {
			console.error(error);
		});
	};
};

export default service;
