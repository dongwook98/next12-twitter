const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  // 패스포트 로그인 성공 시 실행되어서 세션에 쿠키와 user.id만 저장
  passport.serializeUser((user, done) => {
    /**
     * 여기서 done은 Passport에게 작업이 완료되었음을 알리는 콜백 함수입니다.
     * 첫 번째 매개변수는 에러 객체이며, 두 번째 매개변수는 세션에 저장할 값입니다.
     */
    done(null, user.id);
  });

  /**
   * 이후 사용자가 다시 요청을 보낼 때, Passport는 세션에 저장된 식별자를 이용하여 deserializeUser 함수를 호출하여 사용자 객체를 복원합니다.
   * 이를 통해 로그인한 사용자의 정보를 유지하고 세션을 통해 사용자를 식별할 수 있게 됩니다.
   */
  // 로그인 성공하고 그 다음 요청부터 매번 deserializeUser 실행
  // 세션에 저장된 user.id로 User 테이블에서 찾아서 유저 정보 복구해서 req.user로 보내줌
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user); // 찾은 사용자 객체는 req.user로 추가되어 라우트 핸들러에서 사용할 수 있게 된다.
      /**
       * 위의 코드에서 deserializeUser 함수는 세션에 저장된 식별자를 이용하여 데이터베이스에서 사용자 객체를 찾아냅니다.
       * 찾은 사용자 객체는 요청 객체에 req.user로 추가되어 라우트 핸들러에서 사용할 수 있게 됩니다.
       */
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  // 로컬 로그인 전략 실행
  local();
};

/**
 * passport.serializeUser는 Passport에서 사용자 객체를 세션에 저장하는 역할을 하는 함수입니다.
 * 세션은 사용자의 로그인 상태를 지속적으로 유지하기 위해 사용되는 메커니즘 중 하나입니다.
 *
 * Passport에서 사용자를 세션에 저장하는 과정은 다음과 같습니다:
 * 1. 사용자가 로그인에 성공하면 Passport는 serializeUser 콜백 함수를 호출합니다.
 * 2. serializeUser 함수는 사용자 객체에서 식별자(예: 사용자 ID)를 추출하여 세션에 저장합니다.
 * 3. 세션에 저장된 식별자를 기반으로, 사용자가 다시 요청을 보낼 때마다 deserializeUser 콜백 함수를 통해 사용자 객체를 복원합니다.
 */
