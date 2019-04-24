let knex

function init () {
  knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development'])
  knex.on('query-error', function (err) {
    console.log(err)
  })
}

module.exports = {
  knex: () => {
    if (!knex) init()
    return knex
  }
}
