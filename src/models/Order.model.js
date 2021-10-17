const { number } = require('@hapi/joi')
const mongoose = require('mongoose')
const { defaultModel } = require('../config/defineModel')
const Schema = mongoose.Schema


const Order = new Schema({
    customerId:defaultModel.stringR,
    totalMoney:defaultModel.number,
    product:[{productId: String,price: Number ,quantity: Number, weight: Number ,name: String, nameGroup: String}],
    status:defaultModel.number,
    address:defaultModel.stringR,
    area:defaultModel.string,
    shipFee:defaultModel.number,
    history:[{title: String ,createdAt: Date}],
    typePayment: {type: String, default: "Chưa thanh toán"}
}, { timestamps: true })


module.exports = mongoose.model('Order', Order)