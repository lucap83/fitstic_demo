'use strict'
require('dotenv').config()

const Hapi = require('hapi')

const server = Hapi.server({
  port: 8000,
  host: '0.0.0.0',
  routes: {
    cors: true
  }
})

const pluginFolder = './lib/'
const fs = require('fs')

const plugins = []

fs.readdirSync(pluginFolder).forEach(plugin => {
  plugins.push(require(pluginFolder + plugin))
})

let auth = require('./lib/auth').authentication

const init = async () => {
  await auth(server, plugins)
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
