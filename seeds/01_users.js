var bcrypt = require('bcrypt')
const saltRounds = 10
const myPlaintextPassword = 'password'

exports.seed = async function (knex, Promise) {
  const hash = await bcrypt.hash(myPlaintextPassword, saltRounds)
  await knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
  await knex('users').insert([
    {
      username: 'admin',
      name: 'Admin',
      surname: 'Local',
      password: hash,
      email: 'admin@local.net',
      type: 2,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ])
}
