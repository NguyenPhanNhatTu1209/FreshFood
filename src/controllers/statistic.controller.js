const controller = require('./controller');
const productUserServices = require('../services/productUser.service');
const statisticServices = require('../services/statistic.services');

const { defaultRoles } = require('../config/defineModel');
const { formatDateYYMMDD } = require('../helper');
exports.statisticByOrder = async (req, res, next) => {
	try {
    const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
    var timeStart = req.query.timeStart;
    var timeEnd = req.query.timeEnd;

    const currentTime = new Date(timeStart);

    const start = new Date(currentTime.getTime()-7*3600*1000);

		let endTimeByDay = new Date(timeEnd).setHours(23, 59, 59, 999);
		const end = new Date(new Date(endTimeByDay).getTime()-7*3600*1000);

    var day = new Date(end.getTime() - start.getTime());
    var difference= Math.abs(end-start);
    var days = difference/(1000 * 3600 * 24);
    var changeDays = Math.floor(days);
    var result = [];
    if(changeDays < days)
      changeDays = changeDays +1;
    for(let i = 0; i<changeDays;i++)
    {
      var dayCurrent = new Date();
      dayCurrent = dayCurrent.setDate(start.getDate()+i);
      var formatDayCurrent = formatDateYYMMDD(dayCurrent);
      console.log(formatDayCurrent)
      var bodyTime = {
        timeStart: formatDayCurrent,
        timeEnd: formatDayCurrent,
      }
      var resultStatucByOrder = await statisticServices.staticByOrder(bodyTime);
      if(resultStatucByOrder.success == false)
      {
        return controller.sendSuccess(
          res,
          null,
          300,
          "Don't get statistic by Admin"
        );
      }
      var obj = {};
      obj[ `${formatDayCurrent}` ] = resultStatucByOrder.data;
      result.push(obj);
    }
		return controller.sendSuccess(
			res,
			result,
			200,
			"Get statistic order success"
		);
	} catch (error) {
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};
exports.statisticByProduct = async (req, res, next) => {
	try {
    var result = await statisticServices.staticByProduct();
    if(result.success == true)
    {
      return controller.sendSuccess(
        res,
        result.data,
        200,
        "Get statistic order success"
      );
    }
		return controller.sendSuccess(
			res,
			null,
			300,
			result.message
		);
	} catch (error) {
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};
