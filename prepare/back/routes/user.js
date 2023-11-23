const express = require('express');
const bcrypt = require('bcrypt'); // 비밀번호 해쉬해주는 bcrypt 불러오기
const { User } = require('../models'); // db 불러와서 구조분해할당
const router = express.Router();

router.post('/', async (req, res, next) => {
  // POST /user/
  try {
    // 혹시나 기존에 있던 사용자중에 프론트에서 보낸 이메일이랑 같은 걸 쓰고 있는 사용자가 있는지 있다면 그거를 exUser에다가 저장하기
    const exUser = await User.findOne({
      // fincOnd도 비동기 함수
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      /**
       * 요청/응답은 헤더(상태, 용량, 시간, 쿠키)와 바디(데이터(문자열, JSON, HTMl, 버퍼))로 구성되어있다.
       * 상태(status)도 헤더 중 하나인데, 403은 금지의 의미를 가지고 있다.
       * 200 성공, 300 리다이렉트, 400 클라이언트 에러, 500 서버 에러
       */
      return res.status(403).send('이미 사용 중인 아이디입니다.'); // return 안붙이면 응답이 2개감
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // bcrypt도 비동기 함수기 떄문에 await 붙임, 두번째 인수로 오는 숫자는 높을수록 보안이 쌔짐
    await User.create({
      // create가 비동기 함수이므로 await 붙임
      email: req.body.email, // req.body는 axios 요청에서 넘겨준 데이터
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error); // status 500 // next를 통해서 에러를 보내면 익스프레스가 알아서 브라우저로 어떤 에러가 났는지 알려줌
  }
});

module.exports = router;
