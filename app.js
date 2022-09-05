const http = require('http');
const fs = require('fs')
const url = require('url');
const mysql = require('mysql');
const qs = require('qs');
const Appcontrol = require('./controller/appcontrol');
const port = 8088;
let appcontrol = new Appcontrol();

let server = http.createServer((req, res) => {
    let urlpath = url.parse(req.url).pathname;
    if (req.method === 'GET') {
        switch (urlpath) {
            case '/homeadmin':
                appcontrol.showHomeadmin(req, res);
                break;
            case '/showallinfor':
                appcontrol.showallinfor(req, res);
                break;
            case '/addnewcity':
                appcontrol.addnewcity(req, res);
                break;
            case '/delete':
                appcontrol.deletecity(req, res);
                break;
            case '/update':
                appcontrol.showupdatecity(req, res);
                break;
            default:
                res.end();
        }
    } else {
        switch (urlpath) {
            case '/update': {
                appcontrol.updatecity(req, res);
                break;
            }
        }
    }

})

server.listen(port, () => {
    console.log('server is running')
})

