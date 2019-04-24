'use strict'

const constants = require('../../const')

exports.register = async function (server, options, next) {
  const orders = require('./data')()

  server.route({
    method: 'GET',
    path: '/',
    config: constants.DEFAULT_ROUTE_CONFIG,
    handler: async (request, reply) => {
      console.log(request.query)
      return orders.list(request.auth.credentials, request.query, reply)
    }
  })
}

exports.attributes = {
  name: 'orders',
  prefixPath: '/orders'
}
