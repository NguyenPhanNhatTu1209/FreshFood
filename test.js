// async function api() {
//   const response = await fetch('services.giaohangtietkiem.vn/services/shipment/fee?address=P.503%20t%C3%B2a%20nh%C3%A0%20Auu%20Vi%E1%BB%87t,%20s%E1%BB%91%201%20L%C3%AA%20%C4%90%E1%BB%A9c%20Th%E1%BB%8D&province=Hồ Chí Minh&district=Quận 1&pick_province=Hồ Chí Minh&pick_district=Quận Bình Thạnh&weight=1000&value=300000&deliver_option=none&tags%5B%5D=1', {
//     method: 'get',
//     // body: JSON.stringify(body),
//     headers: {'Content-Type': 'application/json', 'Token': '83b5796301Fc00A131eb690fA9d8B9B5cCf0497b'}
//   });
// }
// var url = new URL('https://services.giaohangtietkiem.vn/services/shipment/fee')

// var params = {address: "Chung cư quận 1", province:"Hồ Chí Minh",district: "Quận 1", pick_province: "Hồ Chí Minh",pick_district: "Quận Bình Thạnh",weight:1000}

// url.search = new URLSearchParams(params).toString();

const axios = require('axios').default;
axios
	.get('https://services.giaohangtietkiem.vn/services/shipment/fee', {
		params: {
			address: 'Chung cư quận 1',
			province: 'Hồ Chí Minh',
			district: 'Quận 1',
			pick_province: 'Hồ Chí Minh',
			pick_district: 'Thu Duc',
			weight: 10000
		},
    headers: { 'Token': '83b5796301Fc00A131eb690fA9d8B9B5cCf0497b' },

	})
	.then(function (response) {
		console.log(response.data);
	})
	.catch(function (error) {
		console.log(error);
	})
	.then(function () {
		// always executed
	});
