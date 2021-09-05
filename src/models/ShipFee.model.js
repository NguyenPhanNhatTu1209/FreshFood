const { number } = require('@hapi/joi')
const mongoose = require('mongoose')
const { defaultModel } = require('../config/defineModel')
const Schema = mongoose.Schema


const ShipFee = new Schema({
    address:defaultModel.stringR,
    fee:defaultModel.number
}, { timestamps: true })


module.exports = mongoose.model('ShipFee', ShipFee)