module.exports = {

    development: {
        client: 'sqlite3',
        useNullAsDefault: false,
        connection: {
            filename: './dev.sqlite3'
        },
        seeds: {
            directory: './seeds'
        }
    }
/*
    development: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'your_database_user',
            password: 'your_database_password',
            database: 'myapp_test'
        }
    }
*/
}
