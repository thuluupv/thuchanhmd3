const fs = require('fs');
const qs = require('qs');
const mysql = require('mysql');
const url = require("url");

const http = require('http');
let indexupdate;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'cities',
    charset: 'utf8_general_ci'
});
connection.connect(function (err) {
    if (err) {
        throw err.stack;
    }
    else
        console.log("connect success");
})
class Appcontrol {
    async showHomeadmin(req, res) {
        const sql = 'SELECT * FROM city'
        await connection.query(sql, (err, data) => {
            if (err) {
                throw new Error(err);
            }
            let html = ''
            data.forEach(item => {
                html += '<tr>';
                html += `<td> ${item.id}</td>`;
                html += `<td> ${item.nameCity}</td>`;
                html += `<td> ${item.Nation}</td>`;
                html += `<td><a href="/update?id=${item.id}"><button class = "btn btn-danger btn-sm" ><span class = "glyphicon glyphicon-">sửa</button></a>
<a href="/delete?id=${item.id}" onclick = "confirm('Are you sure?')"><button class = "btn btn-primary btn-sm" >Xoá</button></a>  
<a href="/showallinfor?id=${item.id}"><button class = "btn btn-link btn-sm">chi tiết</button>  </a>
</td>`;
                html += '</tr>';
            })
            fs.readFile('./views/homeadmin.html', 'utf8', (err, datahtml) => {
                if (err) {
                    throw new Error(err);
                }
                datahtml = datahtml.replace('{showlist}', html)
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(datahtml);
                res.end();
            })
        })
    }

    async showallinfor(req, res) {
        let index = +qs.parse(url.parse(req.url).query).id
        const sql = `SELECT * FROM city WHERE id = ${index}`
        await connection.query(sql, (err, data) => {
            if (err) {
                throw new Error(err);
            }
            let html = ''
            data.forEach(item => {
                html += '<tr>';
                html += `<td> ${item.id}</td>`;
                html += `<td> ${item.nameCity}</td>`;
                html += `<td> ${item.Nation}</td>`;
                html += `<td> ${item.Area}</td>`;
                html += `<td> ${item.Population}</td>`;
                html += `<td> ${item.GDP}</td>`;
                html += `<td> ${item.Describes}</td>`;
                html += '</tr>';
            })
            fs.readFile('./views/showallinfor.html', 'utf8', (err, datahtml) => {
                if (err) {
                    throw new Error(err);
                }
                datahtml = datahtml.replace('{showlist}', html)
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(datahtml);
                res.end();
            })
        })
    }

    async addnewcity(req, res) {
        let newNamcity = qs.parse(url.parse(req.url).query).namecity;
        let newNation = qs.parse(url.parse(req.url).query).nation;
        let newArea = qs.parse(url.parse(req.url).query).area;
        let newPopulation = qs.parse(url.parse(req.url).query).Population;
        let newGDP = qs.parse(url.parse(req.url).query).GDP;
        let describes = qs.parse(url.parse(req.url).query).Describes;

        const sql1 = `insert into city(nameCity, Nation, area, Population, GDP, Describes) values ('${newNamcity}','${newNation}','${newArea}',${newPopulation},${newGDP},'${describes}')`
        await connection.query(sql1, (err, data) => {
            if (err) {
                throw new Error(err)
            }
            res.writeHead(301, {'location': '/homeadmin'})
            res.end();
        })
    }

    async deletecity(req, res) {
        let index = +qs.parse(url.parse(req.url).query).id
        const sql = `DELETE FROM city WHERE id = ${index}`
        await connection.query(sql, (err, data) => {
            if (err) {
                throw new Error(err);
            } else {
                res.writeHead(301, {'location': '/homeadmin'})
                res.end();
            }
        })

    }

    showupdatecity(req, res) {
        indexupdate = +qs.parse(url.parse(req.url).query).id;
        let datas = fs.readFileSync('./views/updatecity.html', 'utf8');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(datas);
        res.end();
    }

    async updatecity(req, res) {
        let data = '';
        req.on('data', function (chunk) {
            data += chunk;
        })
        req.on('end', async function () {
            let datacheck = qs.parse(data);
            console.log(datacheck)
            let newname = datacheck.nameCity;
            let newnation = datacheck.nation;
            let newarea = datacheck.area;
            let newpopulation = datacheck.Population;
            let newGDP = datacheck.GDP;
            let newdescribes = datacheck.Describes;

            console.log(newnation);

            const sql1 = `UPDATE city SET nameCity = '${newname}', Nation = '${newnation}', Area = ${newarea}, Population = ${newpopulation}, GDP = ${newGDP}, Describes = '${newdescribes}' where id = ${indexupdate}`
            await connection.query(sql1, function (err, data) {
                if (err) {
                    console.log(err.message)
                }
                res.writeHead(301, {'location': '/homeadmin'})
                res.end()
            })
        })
    }
}

module.exports = Appcontrol