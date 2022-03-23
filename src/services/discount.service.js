const { defaultRoles, defaultStatusCart } = require("../config/defineModel");
const DISCOUNT = require("../models/discount.model");
const PRODUCT = require("../models/Product.model");
const GROUPPRODUCT = require("../models/GroupProduct.model");

const uploadServices = require("../services/uploadS3.service");
const { configEnv } = require("../config");

exports.createDiscountAsync = async (body) => {
  try {
    console.log(body);
    const discount = new DISCOUNT(body);
    console.log("abc");
    await discount.save();
    return {
      message: "Successfully create discount",
      success: true,
      data: discount,
    };
  } catch (e) {
    console.log(e);
    return {
      message: "An error occurred",
      success: false,
    };
  }
};

exports.updateDiscountAsync = async (id, body) => {
  try {
    const discount = await DISCOUNT.findOneAndUpdate({ _id: id }, body, {
      new: true,
    });
    return {
      message: "Successfully update DISCOUNT",
      success: true,
      data: discount,
    };
  } catch (e) {
    return {
      message: "An error occurred",
      success: false,
    };
  }
};

exports.deleteDiscontAsync = async (id) => {
  try {
    const discount = await DISCOUNT.deleteOne({ _id: id });
    return {
      message: "Successfully delete Discount",
      success: true,
    };
  } catch (e) {
    console.log(e);
    return {
      message: "An error occurred",
      success: false,
    };
  }
};

exports.getDiscountAsync = async (id) => {
  try {
    const discount = await DISCOUNT.findById(id);
    return {
      message: "Successfully get discount",
      success: true,
      data: discount,
    };
  } catch (e) {
    return {
      message: "An error occurred",
      success: false,
    };
  }
};

exports.getAllDiscount = async () => {
  try {
    const arrDiscount = await DISCOUNT.find().sort({
      createdAt: -1,
    });
    return {
      message: "Successfully Get discount",
      success: true,
      data: arrDiscount,
    };
  } catch (e) {
    return {
      message: "An error occurred",
      success: false,
    };
  }
};
exports.getAllDiscountActive = async () => {
  try {
    var now = new Date();
    var timeCurrent = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    );
    var arrResult = [];
    const arrDiscount = await DISCOUNT.find().sort({
      createdAt: -1,
    });

    arrDiscount.forEach((discount) => {
      var finishedTime = new Date(discount.duration).getTime();
      var startTime = new Date(discount.startTime).getTime();
      if (timeCurrent <= finishedTime && timeCurrent >= startTime) {
          arrResult.push(discount);
      }
    });

    return {
      message: "Successfully Get discount",
      success: true,
      data: arrResult,
    };
  } catch (e) {
    console.log(e);
    return {
      message: "An error occurred",
      success: false,
    };
  }
};
exports.CheckDiscountActive = async (idDiscount) => {
	try {
	  var now = new Date();
	  var timeCurrent = Date.UTC(
		now.getUTCFullYear(),
		now.getUTCMonth(),
		now.getUTCDate(),
		now.getUTCHours(),
		now.getUTCMinutes(),
		now.getUTCSeconds(),
		now.getUTCMilliseconds()
	  );
	  const discount = await DISCOUNT.findById(idDiscount)
	  if (discount == null)
		return {
		  message: "Discount not exit",
		  success: false,
		};

    var finishedTime = new Date(discount.duration).getTime();
    var startTime = new Date(discount.startTime).getTime();
		if (timeCurrent <= finishedTime && timeCurrent >= startTime && discount.used < discount.quantity ) {
			return {
				message: "Successfully Get discount",
				success: true,
				data: discount,
			  };
		}
		return {
			message: "Get discount fail",
			success: false,
			data: null,
		};
	} catch (e) {
	  console.log(e);
	  return {
		message: "An error occurred",
		success: false,
	  };
	}
  };
