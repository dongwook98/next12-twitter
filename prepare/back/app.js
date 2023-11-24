const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// 분리한 라우터들 불러오기
const passport = require('passport');
const dotenv = require('dotenv');

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
// models/index.js에 있는 db 불러오기
const db = require('./models');
// 패스포트 설정 불러오기
const passportConfig = require('./passport');

dotenv.config();
const app = express();

// 서버 실행할 때 DB,시퀄라이즈 연결
db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

passportConfig();

// use안에들어간애들을 미들웨어라고 부름 express의 기능을 추가
app.use(
  cors({
    origin: true,
  })
);
// 프론트에서 보낸 데이터를 req.body 안에다가 넣어주는 역할
// 라우터들의 위에 위치해야한다. 순서 중요
app.use(express.json()); // 프론트에서 json형식으로 데이터를 보냈을때 json형식의 데이터를 req.body안에 넣을 수 있게 처리
app.use(express.urlencoded({ extended: true })); // 폼 서브밋을 했을때 url encoded 방식으로 데이터가 넘어오는데 그 데이터를 req.body 안에 넣을 수 있게 처리

// 세션/쿠키 설정
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('hello express');
  console.log(req.url, req.method);
});

app.get('/posts', (req, res) => {
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello2' },
    { id: 3, content: 'hello3' },
  ]);
});

// 분리한 라우터들 등록하기
app.use('/post', postRouter);
app.use('/user', userRouter);

app.listen(3065, () => {
  console.log('서버 실행 중');
});
