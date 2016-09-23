//导入http模块
import * as http from 'http'

//创建server。无论啥请求都回应Hello world。
let server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Hello world.</h1>');
    res.end();
});

//在设定端口启动server
let port = 3000;
server.listen(port);
console.log(`HTTP server is listening at port {port}.`);
