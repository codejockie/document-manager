module.exports = {
  development: {
    username: null,
    password: null,
    database: 'doc_man',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres'
  },
  devsqlserver: {
    username: null,
    password: null,
    database: 'DocMan',
    host: 'localhost',
    dialect: 'mssql',
    dialectOptions: {
      instanceName: 'MSSQLSERVER2016'
    }
  },
  test: {
    username: null,
    password: null,
    database: 'doc_man_test',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
  }
};
