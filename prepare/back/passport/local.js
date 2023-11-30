const passport = require('passport');
// 나중을 위해 이름 바꿔놓기
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = () => {
  passport.use(
    // 로컬 로그인 전략 설정
    new LocalStrategy(
      // req.body에 대한 설정
      {
        usernameField: 'email', // req.body.email 이라고 적어준 것
        passwordField: 'password',
      },
      // 여기서 로그인 전략을 세우면 됨
      async (email, password, done) => {
        try {
          // User 테이블에서 입력한 이메일의 유저가 있는지 찾기
          const user = await User.findOne({
            where: { email },
          });
          // 테이블에서 찾아봤는데 유저가 없으면
          if (!user) {
            /**
             * 패스포트에서는 res로 넘겨주는게 아니라 done으로 넘겨줌
             * done(서버에러, 성공, 클라이언트 에러)
             * done이 실행되면 routes/user.js에 있는 authenticate 2번째 매개변수 콜백 실행
             */
            return done(null, false, { reason: '존재하지 않는 이메일입니다.' });
          }
          // 테이블에서 찾아봤는데 이메일은 존재한다. 그럼 이제 입력한 비밀번호와 테이블에 저장되있는 비밀번호를 비교
          const result = await bcrypt.compare(password, user.password);
          // 비밀번호가 일치하면 로그인 성공이니까 사용자정보 넘겨줌
          if (result) {
            return done(null, user);
          }
          // 비밀번호가 일치하지 않으니까 클라이언트 에러 넘겨줌
          return done(null, false, { reason: '비밀번호가 틀렸습니다. ' });
        } catch (error) {
          console.error(error);
          // 서버 에러 난다면 done으로 서버 에러 넘겨줌
          return done(error);
        }
      }
    )
  );
};
