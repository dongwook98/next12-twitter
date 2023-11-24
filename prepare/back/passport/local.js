const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local'); // 나중을 위해 이름 바꿔놓기
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = () => {
  passport.use(
    // 로컬 로그인 전략
    new LocalStrategy(
      {
        usernameFiled: 'email', // req.body.email 이라고 적어준 것
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            // 패스포트에서는 res로 넘겨주는게 아니라 done으로 넘겨줘야함
            return done(null, false, { reason: '존재하지 않는 이메일입니다.' }); // done(서버에러, 성공, 클라이언트 에러)
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user); // 성공했으니 사용자정보 넘겨줌
          }
          return done(null, false, { reason: '비밀번호가 틀렸습니다. ' });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
