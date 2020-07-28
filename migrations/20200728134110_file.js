
exports.up = function(knex) {
    return knex.schema.createTable('files', function (table) {
        table.increments();
        table.string('name').notNullable();
        table.string('path').notNullable();

        table.unique(['name', 'path'])
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('files');
};
