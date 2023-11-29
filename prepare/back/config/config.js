const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'twitter',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'twitter',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'twitter',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  // 데이터 베이스를 dev, test, production 모드 3가지로 따로 둠
  // port의 기본값은 3306
};
