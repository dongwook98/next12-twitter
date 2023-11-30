const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  // 패스포트 로그인 성공 시 실행되어서 세션에 쿠키와 user.id만 저장
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 로그인 성공하고 그 다음 요청부터 매번 deserializeUser 실행
  // 세션에 저장된 user.id로 User 테이블에서 찾아서 유저 정보 복구해서 req.user로 보내줌
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user); // req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};
