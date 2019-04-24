'use strict'
const Joi = require('joi')
const constants = require('../../const')
const { sign } = require('jsonwebtoken')
const secret = constants.JWT_SECRET
const jwtOptions = { expiresIn: '30 days' }

exports.register = async function (server, options, next) {
  const userDB = require('./data')()

  server.route({
    method: 'POST',
    path: '/login',
    config: {
      validate: {
        payload: {
          password: Joi.string().min(8).max(32).required(),
          username: Joi.string().max(32).required(),
          rememberMe: Joi.boolean()
        }
      },
      ...constants.DEFAULT_ROUTE_CONFIG,
      auth: null
    },
    handler: async (request, reply) => {
      const user = await userDB.checkUserPass(request.payload.username, request.payload.password, reply)
      if (user) {
        const token = sign(user, secret, jwtOptions)
        return { ...user, token }
      } else {
        return 'unauthorized'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/getUserInfo',
    config: constants.DEFAULT_ROUTE_CONFIG,
    handler: async (request, reply) => {
      console.log(request.pre)
      return userDB.getUserInfo(request.auth.credentials, reply)
    }
  })

  server.route({
    method: 'PUT',
    path: '/update/password',
    handler: async (request, reply) => {
      return userDB.updatePassword(request, reply)
    },
    config: {
      validate: {
        payload: {
          oldPassword: Joi.string().min(8).max(32).required(),
          newPassword: Joi.string().min(8).max(32).required()
        }
      },
      ...constants.DEFAULT_ROUTE_CONFIG
    }
  })

  server.route({
    method: 'PUT',
    path: '/update/currentUser',
    handler: async (request, reply) => {
      console.log('AUTH', request.auth)
      return userDB.updateUser(request, reply)
    },
    config: {
      validate: {
        payload: {
          name: Joi.string().min(4).required(),
          surname: Joi.string().min(4).required(),
          username: Joi.string().min(3).required(),
          email: Joi.string(),
          type: Joi.number().required()
        }
      },
      ...constants.DEFAULT_ROUTE_CONFIG
    }
  })
}

exports.attributes = {
  name: 'auth',
  prefixPath: '/auth'
}

// unitTestingMode = false|null normal mode, 1 = always true, 2 = always false
exports.authentication = async function (server, plugins) {
  const validate = async function (decoded, request) {
    const userDB = require('./data')()
    const user = await userDB.getUserInfo(decoded)
    if (user) {
      return { isValid: true }
    } else {
      return { isValid: false }
    }
  }

  var alparser = require('accept-language-parser')

  server.ext('onPreHandler', function (request, reply) {
    request.pre = request.pre || {}
    request.pre.language = alparser.parse(request.raw.req.headers['accept-language'] || 'it-IT')
    if (request.pre.language.length > 0) {
      const srvLang = require('../../i18n')
      srvLang.currentLang = request.pre.language[0].code
      request.pre.srvLang = srvLang
    }
    return reply.continue
  })

  await server.register(require('hapi-auth-jwt2'))
  server.auth.strategy('jwt', 'jwt',
    { key: secret,
      validate: validate,
      verifyOptions: { algorithms: [ 'HS256' ] }
    })

  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i]
    await server.register(
      {
        register: plugin.register,
        name: plugin.attributes.name
      }, {
        routes: {
          prefix: '/api' + plugin.attributes.prefixPath
        }
      }, (err) => { if (err) console.error(err, server) })
  }
}

exports.bearerHeader = function (id) {
  return 'Bearer ' + sign({
    id: id
  }, secret, jwtOptions)
}
