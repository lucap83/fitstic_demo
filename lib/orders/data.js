'use strict'

const knex = require('../../knexHandler').knex()

module.exports = function build (db) {
  return {
    list: list
  }

  async function list (user, query) {
    let orderList = knex
      .table('orders')
    if (query['ship_country']) {
      orderList = orderList.where('ship_country', query['ship_country'])
    }
    return orderList
  }
}
