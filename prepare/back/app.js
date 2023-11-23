const express = require('express');

// 분리한 라우터들 불러오기
const postRouter = require('./routes/post');

// models/index.js에 있는 db 불러오기
const db = require('./models');

const app = express();

// 서버 실행할 때 DB 시퀄라이즈 연결도 같이 된다.
db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

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

app.listen(3065, () => {
  console.log('서버 실행 중');
});
