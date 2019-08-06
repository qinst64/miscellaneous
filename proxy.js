/* reverse proxy by nodejs */
const fs = require('fs');
const http = require('http');
const url = require('url');
const httpProxy = require('http-proxy');

let proxy = httpProxy.createProxyServer({
    xfwd: true
});



proxy.on('error', function (err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/html'
    });
    res.end(`<head><title>错误</title>
    <meta charset="UTF-8"></head>
    <style/>
        body{
            background-color: #FFF9C4;
        }
        div{
            margin: 0 auto;
            text-align: center;
            margin-top: 200px;
        }
        h3{
            font-size: 40px;
            color: #D32F2F;
        }
    </style>
    <div>
        <h3>后台出错, 请过几分钟种再尝试一下...</h3>
        <p>如果还有问题, 请联系管理员</p>
    </div>
    `);
    /* or from file
    fs.readFile('500.html', function(err, data) {
        if(err) {
            console.error(err);
        } else {
            res.end(data);
        }
        return;
    });
    */
});


let proxyServer = http.createServer(function (req, res) {
    let host = req.headers.host.split(':')[0];
    switch (host) {
        case '127.0.0.1':
        case 'localhost':
        case 'xxxx1.com':
            proxy.web(req, res, {
                target: 'http://127.0.0.1:800'
            });
            break;
        case 'xxxx2.com':
        case 'xxxx3.com':
            proxy.web(req, res, {
                target: 'http://127.0.0.1:801'
            });
            break;
        default:
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end('Welcome!');
            break;
    }
}).listen(80);
