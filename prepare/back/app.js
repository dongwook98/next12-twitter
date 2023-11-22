const http = require('http');
const server = http.createServer((req, res) => {
  console.log(req.url, res.method);
  res.write('<h1>Hello node1</h1>');
  res.write('<h2>Hello node2</h2>');
  res.write('<h3>Hello node3</h3>');
  res.write('<h4>Hello node4</h4>');
  res.end('<h5>Hello node5</h5>');
});
server.listen(3065, () => {
  console.log('서버 실행 중');
});
