const { number } = require('@hapi/joi')
const mongoose = require('mongoose')
const { defaultModel } = require('../config/defineModel')
const Schema = mongoose.Schema


const Order = new Schema({
    customerId:defaultModel.stringR,
    totalMoney:defaultModel.stringR,
    product:[{productId: String ,price: Number ,quantity: Number, weight: Number ,name: String}],
    status:defaultModel.array,
    address:defaultModel.stringR,
    area:defaultModel.string,
    shipFee:defaultModel.number,
    history:[{title: String ,createdAt: Date}],
}, { timestamps: true })


module.exports = mongoose.model('Order', Order)