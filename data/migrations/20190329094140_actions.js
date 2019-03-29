
exports.up = function(knex) {
    return knex.schema.createTable('actions', tbl => {

        tbl
            .increments()

        tbl
            .string('name', 128)
            .notNullable()

        tbl
            .integer('project_id')
            .unsigned()
            .references('id')
            .inTable('projects')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .notNullable()

        tbl
            .string('notes', 128)

        tbl
            .boolean('complete')
            .defaultTo('false')

    })
};



exports.down = function(knex) {
    return knex.schema.dropTableIfExists('actions')
};


