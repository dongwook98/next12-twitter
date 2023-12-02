// 노드에서 제공하는 http 모듈이 서버 역할을 해준다. 노드는 자바스크립트 런타임이지 서버가 아니다.
// 단, http 모듈로는 라우터 쪼개기가 어려워서 우리는 express라는 프레임워크를 사용한다.
// const http = require('http');
const express = require('express');
// cors 미들웨어 불러오기
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');

// 분리한 라우터들 불러오기
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
// models/index.js에 있는 db 불러오기
const db = require('./models');
// 패스포트 설정 불러오기
const passportConfig = require('./passport');

dotenv.config();
const app = express();

// 익스프레스에서 시퀄라이즈 등록
// 서버 실행할 때 DB,시퀄라이즈 연결도 같이됨
db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

// 패스포트 설정 불러와서 실행
passportConfig();

/**
 * use안에들어간애들을 미들웨어라고 부른다. 미들웨어는 express의 기능을 추가해준다.
 * 미들웨어는 위에서 부터 아래로 왼쪽에서 부터 오른쪽으로 실행된다.
 * 미들웨어는 순서가 중요하다.
 */

// morgan이 프론트 서버에서 백엔드 서버로 보낸 요청을 기록해줌
app.use(morgan('dev'));
/**
 * 모든 요청에 다 res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060') 이런식으로 넣어준다.
 * origin에는 요청을 허용할 주소를 적어준다.
 * credentials: true를 하면 쿠키도 같이 전달이 된다.
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
/**
 * 프론트에서 보낸 데이터를 req.body 안에다가 넣어주는 역할
 * 라우터들의 위에 위치해야한다. 순서 중요
 *
 * express.json() : 프론트에서 json형식으로 데이터를 보냈을때 json형식의 데이터를 req.body안에 넣을 수 있게 처리
 * express.urlencoded() : 폼 서브밋을 했을때 url encoded 방식으로 데이터가 넘어오는데 그 데이터를 req.body 안에 넣을 수 있게 처리
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 쿠키 설정
app.use(cookieParser(process.env.COOKIE_SECRET));

// 세션 설정
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    /**
     * 쿠키에 저장된 랜덤한 문자열은 사실 우리 데이터의 기반으로 생성된다.
     * secret이 해킹당하면 우리의 데이터가 노출 될 수 있다.
     * 그래서 secret을 숨겨놔야한다. 보통 닷엔브로 숨겨놓는다.
     */
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

/**
 * HTTP 메서드
 *
 * get -> 가져오다
 * post -> 생성하다
 * put -> 전체 수정
 * delete -> 제거
 * patch -> 부분 수정
 * options -> 찔러보기
 * head -> 헤더만 가져오기
 */
// 라우터에 들어가는 (req, res, next) => {} 도 미들웨어이다.
app.get('/', (req, res) => {
  console.log(req.url, req.method);
  // 문자열 응답
  res.send('hello express');
});

// app.get('/posts', (req, res) => {
//   이런식으로 json 응답 가능 (보통 데이터들은 json 객체로 많이 응답한다.)
//   res.json([
//     { id: 1, content: 'hello' },
//     { id: 2, content: 'hello2' },
//     { id: 3, content: 'hello3' },
//   ]);
// });

// 분리한 라우터들 등록하기
// 첫번째 인수로 주소를 전달하였는데 이 주소가 postRouter의 라우터 주소에 prefix로 붙는다. (중복 제거)
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);

// 에러처리 미들웨어가 내부적으로 존재한다.
// app.use((err, req, res, next) => {});

// 포트 번호 지정 가능
app.listen(3065, () => {
  console.log('서버 실행 중');
});
