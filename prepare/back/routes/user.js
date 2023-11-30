const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
// 만든 모델들 불러와서 구조분해할당
const { User, Post } = require('../models');
// 우리가 로그인, 로그아웃 상태인지 검사하려고 만든 미들웨어 불러오기
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

/**
 * 새로고침시 로그인 풀리는 문제 해결
 * GET /user
 */
router.get('/', async (req, res, next) => {
  try {
    // 사용자가 있을때만 사용자 데이터 찾기
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password'],
        },
        include: [
          {
            model: Post,
            // 게시글 개수만 세면 되서 id만 가져오기
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followings',
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followers',
            attributes: ['id'],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * 로그인 API
 * POST /user/login
 * 로그인은 로그인 하지않은 사람이 해야해서 isNotLoggedIn 미들웨어 추가
 */
router.post('/login', isNotLoggedIn, (req, res, next) => {
  /**
   * authenticate('local') : 우리가 만든 로컬 로그인 전략 실행
   * authenticate 2번째 콜백 함수의 매개변수로 done에서 넣은값들이 순서대로 전달됨
   */
  passport.authenticate('local', (err, user, clientErr) => {
    // 서버 에러가 나면
    if (err) {
      console.error(err);
      return next(err);
    }
    // 클라이언트 에러가 나면
    if (clientErr) {
      console.log('에러', clientErr);
      return res.status(401).send(clientErr.reason); // 401: 허가되지않은
    }
    // 이 아래로 로컬 로그인 성공
    /**
     * 패스포트 로그인 실행
     * 패스포트 로그인하면 세션에 로그인 정보와 쿠키 저장하고 응답으로 쿠키 전달
     * 단, 세션에 로그인 정보를 통째로 다 들고 있으면 무거워서 id만 저장
     * 패스포트 로그인 성공하면 passport/index.js에 있는 serializeUser 실행됨
     */
    return req.login(user, async (loginErr) => {
      // 패스포트 로그인 에러가 나면
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      // 이 아래로 진짜 로그인 성공
      // 응답할때 유저 데이터 추가, 제거 하기 위해 findOne
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        // 프론트로 응답할때 비밀번호 제외
        attributes: {
          exclude: ['password'],
        },
        // 프론트로 응답할때 다른 테이블과 합칠때 include
        include: [
          {
            model: Post,
          },
          {
            model: User,
            as: 'Followings',
          },
          {
            model: User,
            as: 'Followers',
          },
        ],
      });
      // req.login을 하면 res.setHeader('Cookie', '랜덤한 문자열') 이런걸 내부적으로 처리 , 알아서 세션이랑도 연결
      // 패스포트 로그인까지 성공하면 쿠키랑 유저정보 프론트로 보내줌
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next); // 미들웨어 확장하는 방법
});

/**
 * 회원가입 API
 * POST /user/
 * 회원가입은 로그인 하지않은 사람이 해야돼서 isNotLoggedIn 미들웨어 추가
 */
router.post('/', isNotLoggedIn, async (req, res, next) => {
  try {
    /**
     * 기존에 있던 사용자중에 프론트에서 보낸 이메일이랑 같은 걸 쓰고 있는 사용자가 있는지 있다면 그거를 exUser에다가 저장하기
     * findOne도 비동기 함수
     * where에는 조건을 넣어줌
     */
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      /**
       * 요청/응답은 헤더(상태, 용량, 시간, 쿠키)와 바디(데이터)로 구성되어있다.
       * 바디(데이터)에는 문자열, JSON, HTML, 버퍼 등을 전달 할 수 있다.
       * 상태(status)도 헤더 중 하나인데, 403은 금지의 의미를 가지고 있다.
       * 200 성공, 300 리다이렉트, 400 클라이언트 에러, 500 서버 에러
       *
       * send로 응답한 데이터는 사가에서 error.response.data로 전달된다.
       *
       * return 안붙이면 응답이 2개가서 에러가 발생한다.
       */
      return res.status(403).send('이미 사용 중인 아이디입니다.');
    }
    /**
     * 비밀번호는 그대로 저장하면 보안 위협이 된다. 해쉬화 해주는 라이브러리 bcrypt 사용
     * bcrypt도 비동기 함수기 떄문에 await 붙인다.
     * 두번째 인수로 오는 숫자는 높을수록 보안이 쌔진다.
     */
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    // create가 비동기 함수이므로 await 붙여서 순서 맞춰주기
    await User.create({
      email: req.body.email, // req.body는 axios 요청에서 넘겨준 데이터, 단 req.body를 쓰러면 추가로 미들웨어 등록해야함
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    /**
     * CORS 문제 : 브라우저에서 다른 도메인 서버로 보냈을때만 CORS 문제가 생김
     *
     * 해결 방법 1) 프록시
     * 서버에서 서버로 요청보낼때는 cors문제가 안생기니까 브라우저(3060)에서 프론트 서버(3060)로 요청을 보낸 후
     * 프론트 서버(3060)에서 백엔드 서버(3065)로 요청을 보내는 것
     *
     * 해결 방법 2) 직접 헤더 넣어주기
     * CORS 문제를 해결하기 위해 res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060') 이런식으로 해도 되지만
     * cors 미들웨어로 대체
     */
    // 201은 '잘 생성되었다' 라는 의미
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    // next를 통해서 에러를 보내면 익스프레스가 알아서 브라우저로 어떤 에러가 났는지 알려준다.
    next(error); // status 500 서버 에러
  }
});

/**
 * 로그아웃 API
 * POST /user/logout
 * 로그아웃은 로그인 한 사람들만 해야돼서 isLoggedIn 미들웨어 추가
 */
router.post('/logout', isLoggedIn, (req, res) => {
  req.logout(() => {
    res.send('ok');
  });
});

module.exports = router;
