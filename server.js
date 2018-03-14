const express = require("express");
const qiniu = require("qiniu");
const fs = require("fs");
let server = express();
server.listen(8888);
server.get("/uptoken", function(req, resp) {
    resp.statusCode = 200;
    resp.setHeader('Content-Type', 'text/json;charset=utf-8');
    resp.setHeader('Access-Control-Allow-Origin', '*');
    let config = fs.readFileSync('./uptoken-key.json');
    config = JSON.parse(config);
    let { accessKey, secretKey } = config
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let options = {
        scope: 'music163',
        "expires": 7200
    }

    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    resp.write(`{
           "uptoken": "${uploadToken}",
    }`)
    resp.end();

})
