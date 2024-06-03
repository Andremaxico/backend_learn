const http = require('http');
const fs = require('fs')

let requestCount = 0;

const readFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if(!err) {
                resolve(data);
            } else {
                reject(err);
            }
        })
    }) 
}

const delay = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();   
        }, ms)   
    })
}

const server = http.createServer(async (request, response) => {
    const isFaviconReq = request.url.includes('favicon');

    switch(request.url) {
        case '/home':
            await delay(3000);
            response.write('welcome to main page');
            response.end();
            break;
        case '/about':
            const data = await readFile('./static/about.html');
            response.write('file read');
            response.end();
            break;
        default:
            response.write('404 page not found');
            response.end();
            break;
    }

})

server.listen(1614);