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
const path = require('path');

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

// 패스포트 설정 실행
passportConfig();

/**
 * express의 미들웨어란?
 *
 * Express의 미들웨어는 Express 애플리케이션에서 HTTP 요청과 응답 사이에서 동작하는 함수입니다.
 * 미들웨어 함수는 요청 객체 (req), 응답 객체 (res), 그리고 애플리케이션의 요청-응답 주기 중의 다음 미들웨어 함수를 호출하는 next 함수에 대한 액세스 권한을 갖습니다.
 * 미들웨어는 위에서 부터 아래로 왼쪽에서 부터 오른쪽으로 실행된다.
 * 미들웨어는 순서가 중요하다.
 */

/**
 * morgan
 *
 * morgan은 Node.js 웹 프레임워크인 Express에서 사용되는 HTTP 요청 로깅 미들웨어입니다.
 * HTTP 요청이 서버에 도착할 때, morgan은 각각의 요청에 대한 정보를 로그로 남기는 역할을 합니다.
 * 이는 애플리케이션의 동작을 모니터링하고 디버깅할 때 유용합니다.
 */
app.use(morgan('dev'));
/**
 * 브라우저는 보안상의 이유로 기본적으로 스크립트에서 다른 출처의 리소스에 접근을 제한합니다.
 * 이를 우회하기 위해서는 서버에서 클라이언트의 요청에 대한 응답 헤더에 CORS 관련 정보를 추가해야 합니다.
 * cors 미들웨어는 이러한 CORS 관련 헤더를 자동으로 추가하여 클라이언트와의 상호 작용을 용이하게 만듭니다.
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
// express.static을 사용하여 특정 디렉터리에 있는 정적 파일들을 브라우저에 제공할 수 있다.
// 이미지 미리보기 가능
app.use('/', express.static(path.join(__dirname, 'uploads')));
/**
 * 프론트에서 보낸 데이터를 req.body 안에다가 넣어주는 역할
 * 라우터들의 위에 위치해야한다. 순서 중요
 *
 * express.json() : 프론트에서 json형식으로 데이터를 보냈을때 json형식의 데이터를 req.body안에 넣을 수 있게 처리
 * express.json()은 Express 애플리케이션에서 내장된 미들웨어로, 들어오는 요청의 본문(body)을 JSON 형식으로 파싱하는 역할을 합니다.
 * 이 미들웨어를 사용하면 클라이언트에서 서버로 전송되는 JSON 형식의 데이터를 쉽게 파싱하여 JavaScript 객체로 변환할 수 있습니다.
 * 기본적으로 Express는 요청의 본문을 파싱하지 않으므로, 클라이언트에서 JSON 형식으로 데이터를 보낼 때 해당 데이터를 해석하려면 express.json()을 사용해야 합니다.
 *
 * express.urlencoded() : 폼 서브밋을 했을때 url encoded 방식으로 데이터가 넘어오는데 그 데이터를 req.body 안에 넣을 수 있게 처리
 * express.urlencoded()는 Express 애플리케이션에서 내장된 미들웨어로, 들어오는 요청의 본문(body)을 URL-encoded 형식으로 파싱하는 역할을 합니다.
 * URL-encoded 형식은 HTML 폼에서 사용되는 데이터 전송 방식 중 하나이며, 이를 파싱하여 JavaScript 객체로 변환해주는 역할을 합니다.
 * 기본적으로 Express는 요청의 본문을 파싱하지 않으므로, HTML 폼을 통해 전송되는 데이터를 해석하려면 express.urlencoded() 미들웨어를 사용해야 합니다.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * cookie-parser는 Express 애플리케이션에서 쿠키를 파싱하기 위한 미들웨어입니다.
 * 클라이언트와 서버 간에 상태를 유지하기 위해 사용되는 쿠키는 기본적으로 클라이언트의 브라우저에 저장되며,
 * 이를 서버에서 해석하고 활용하려면 cookie-parser를 사용할 수 있습니다.
 */
app.use(cookieParser(process.env.COOKIE_SECRET));

/**
 * express-session은 Express 애플리케이션에서 세션 관리를 쉽게 구현하기 위한 미들웨어입니다.
 * 세션은 클라이언트와 서버 간의 지속적인 상태를 유지하기 위해 사용되며,
 * express-session은 이러한 세션을 효과적으로 다룰 수 있도록 도와줍니다.
 *
 * secret을 통해 세션 데이터를 암호화하는데 사용되는 키를 설정
 * resave 및 saveUninitialized 옵션은 세션 저장 여부와 초기화 여부에 관련된 설정
 */
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
/**
 * passport.initialize()는 Passport 미들웨어를 Express 애플리케이션에 추가하여 Passport를 초기화하는 역할을 합니다.
 * Passport는 Node.js 웹 애플리케이션에서 사용자 인증을 처리하기 위한 유명한 미들웨어입니다.
 * 사용자가 로그인하거나 인증되어야 하는 경로에서 Passport를 사용하려면, passport.initialize() 미들웨어가 필요합니다.
 * 이 미들웨어는 요청 객체(req)에 Passport의 초기 상태를 추가하며, 이를 통해 Passport를 사용할 수 있게 됩니다.
 */
app.use(passport.initialize());
/**
 * passport.session()은 Passport 미들웨어에서 세션 지원을 활성화하는 역할을 합니다.
 * 이 미들웨어는 passport.initialize() 이후에 사용되며, Express 애플리케이션에서 사용자의 세션을 지속적으로 유지하도록 도와줍니다.
 * Passport는 세션을 이용하여 사용자 인증 상태를 유지하고 복원합니다. passport.session() 미들웨어는 이 세션을 관리하며,
 * 사용자가 로그인하면 세션에 사용자 정보를 저장하고, 사용자가 로그아웃하면 세션에서 해당 정보를 제거합니다.
 */
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

/**
 * 분리한 라우터들 등록하기
 * 첫번째 인수로 주소를 전달하였는데 이 주소가 postRouter의 라우터 주소에 prefix로 붙는다. (주소 중복 제거)
 */
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);

/**
 * 에러 처리 미들웨어는 Express 애플리케이션에서 발생한 예외를 처리하고 클라이언트에게 적절한 응답을 전달하는 역할을 합니다.
 * 이 미들웨어는 애플리케이션의 나머지 부분에서 발생한 에러를 잡아내고, 이를 효과적으로 처리하는데 사용됩니다.
 *
 * 에러 처리 미들웨어는 네 개의 매개변수를 갖습니다:
 * err: 발생한 에러 객체.
 * req: 요청 객체.
 * res: 응답 객체.
 * next: 다음 미들웨어로 제어를 전달하기 위한 함수.
 * 에러 처리 미들웨어는 에러 객체(err)를 받아서 적절한 응답을 생성합니다.
 * 이때, 일반적으로 HTTP 응답 상태 코드를 설정하고, 클라이언트에게 전달할 에러 메시지나 HTML 페이지를 생성하여 응답합니다.
 * 주의할 점은 에러 처리 미들웨어는 반드시 네 개의 매개변수를 갖도록 정의되어야 합니다.
 * 그렇지 않으면 Express는 이것을 일반적인 미들웨어로 간주하여 에러 처리로 사용하지 않습니다.
 */
// 에러 처리 미들웨어 등록 (맨 아래에 등록하는 것이 일반적), 작성 안해도 내부적으로 존재
// app.use((err, req, res, next) => {});

/**
 * app.listen()은 Express 애플리케이션을 특정 포트에서 리스닝하도록 하는 메서드입니다.
 * 이 메서드를 사용하면 Express 서버가 클라이언트의 요청을 받아들일 수 있도록 설정됩니다.
 *
 * app.listen() 메서드를 호출하면 Express 애플리케이션이 웹 서버로 동작하게 되며,
 * 클라이언트는 해당 포트로 HTTP 요청을 보낼 수 있습니다.
 * 예를 들어, http://localhost:3065로 접속하면 이 Express 애플리케이션에 요청이 전달됩니다.
 */
app.listen(3065, () => {
  console.log('서버 실행 중');
});
