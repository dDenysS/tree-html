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
};
