module.exports = {
  DEFAULT_ROUTE_CONFIG: {
    auth: 'jwt',
    state: {
      parse: false, // parse and store in request.state
      failAction: 'ignore' // may also be 'ignore' or 'log'
    }
  },
  IMPORT_ROUTE_CONFIG: {
    payload: {
      maxBytes: 5 * 1000 * 1000
    },
    auth: 'default',
    state: {
      parse: false, // parse and store in request.state
      failAction: 'ignore' // may also be 'ignore' or 'log'
    }
  },

  EXPORT_ROUTE_CONFIG: {
    auth: 'default',
    state: {
      parse: false, // parse and store in request.state
      failAction: 'ignore' // may also be 'ignore' or 'log'
    },
    payload: { output: 'stream' }
  },

  JWT_SECRET: process.env.SECRET || 'arandowjwtstring'
}
