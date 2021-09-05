const { number } = require('@hapi/joi')
const mongoose = require('mongoose')
const { defaultModel } = require('../config/defineModel')
const Schema = mongoose.Schema


const Cart = new Schema({
  productId:defaultModel.stringRef,
  customerId:defaultModel.stringRef,
  quantity:defaultModel.number
}, { timestamps: true })


module.exports = mongoose.model('Cart', Cart)