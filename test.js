const axios = require('axios').default;
axios
.get('https://services.giaohangtietkiem.vn/services/shipment/fee', {
	params: {
		address: "Hồ Chí Minh",
		province: 'Hồ Chí Minh',
		district: 'Thủ Đức',
		pick_province: 'Hồ Chí Minh',
		pick_district: 'Thủ Đức',
		weight: 1 * 1000
	},
	headers: { Token: "83b5796301Fc00A131eb690fA9d8B9B5cCf0497b" }
})
.then(function (response) {
	totalShip = response.data.fee.fee;
	console.log(response.data);
})
.catch(function (error) {
	console.log(error);
})
.then(function () {
	// always executed
});