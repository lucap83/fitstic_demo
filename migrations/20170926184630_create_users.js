
exports.up = function (knex, Promise) {
  return knex.schema
    .createTableIfNotExists('users', function (table) {
      table.increments('id').primary()
      table.string('username').notNullable().unique()
      table.string('name').notNullable()
      table.string('surname').notNullable()
      table.integer('type').notNullable()
      table.boolean('is_active').notNullable()
      table.string('password').notNullable()
      table.string('email').notNullable().unique()
      table.timestamps(false, true)
    })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('users')
}
