// 시퀄라이즈 불러오기
const Sequelize = require('sequelize');
// 기본값으로 development
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

// 시퀄라이즈는 내부적으로 mysql2를 사용해서 mysql2 드라이버에 설정 정보들을 보내줘서
// 시퀄라이즈가 노드랑 mysql을 연결해주는걸 도와줌
// 연결 성공하면 sequelize 객체에 연결 정보가 들어있다.
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Comment = require('./comment')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

// [Comment, Hashtag, Image, Post, User] 반복문으로 돌면서 associate
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// db 변수에 시퀄라이즈 넣어두기
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db 변수 내보내기
module.exports = db;
