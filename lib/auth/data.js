'use strict'

const bcrypt = require('bcrypt')
const knex = require('../../knexHandler').knex()

const saltRounds = 10
const returning = ['id', 'username', 'name', 'surname', 'email', 'type', 'created_at', 'updated_at']

module.exports = function build (db) {
  return {
    checkUserPass: checkUserPass,
    getUserInfo: getUserInfo,
    updatePassword,
    updateUser
  }
  async function checkUserPass (username, password) {
    let user = await knex.first().table('users').where('email', username)
    if (!user) {
      return false
    }

    let validHash = await bcryptCompare(password, user.password)
    if (!user.is_active) {
      validHash = false
    }
    if (!validHash) {
      return false
    }
    delete user.password
    return user
  }

  async function getUserInfo (userIn) {
    const queryUserInfo = knex
      .first()
      .table('users')
      .where('id', userIn.id)

    return queryUserInfo
  }

  async function updateUser ({ auth: { credentials }, payload }, cb) {
    return knex('users')
      .where('id', credentials.id)
      .update(payload, returning)
  }

  async function updatePassword ({ auth: { credentials }, payload: { oldPassword, newPassword } }, cb) {
    let isPasswordCorrect = await verifyOldPassword(credentials.id, oldPassword)

    if (!isPasswordCorrect) {
      return 'old password does not match'
    }

    const hash = await bcrypt.hash(newPassword, saltRounds)

    return knex('users')
      .where('id', credentials.id)
      .update({
        password: hash
      }, returning)
  }

  async function verifyOldPassword (id, password) {
    const user = await knex.first().table('users').where('id', id)

    return bcryptCompare(password, user.password)
  }

  function bcryptCompare (p1, p2) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(p1, p2, (err, isValid) => {
        if (err) {
          reject(err)
        } else {
          resolve(isValid)
        }
      })
    })
  }
}
