const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development'; // 기본으로 development
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config); // 시퀄라이즈가 노드랑 mysql을 연결해주는걸 도와줌
// 시퀄라이즈는 내부적으로 mysql2를 사용해서 mysql2 드라이버에 설정 정보들을 보내줌

db.Comment = require('./comment')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// 시퀄라이즈가 노드랑 mysql을 연결해주는걸 도와줌 // 시퀄라이즈는 내부적으로 mysql2를 사용해서 mysql2 드라이버에 설정 정보들을 보내줌
