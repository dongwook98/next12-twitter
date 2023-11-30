/**
 * 미들웨어 만들어서 라우터 검사하기
 */
// 로그인한 상태인지 검사
exports.isLoggedIn = (req, res, next) => {
  // 패스포트에서 isAuthenticated를 제공한다. req.isAuthenticated()가 true이면 로그인 한 상태이다.
  if (req.isAuthenticated()) {
    /**
     * next의 사용방법 2가지
     *
     * 1) next(askdlj) : 에러 처리하러 가기
     * 2) next() : 다음 미들웨어로 넘어가기
     */
    next();
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
  }
};
