const {stats} = require("./stats");
const { rootPath } = require('./host_config');
const githubCfg = require('./config-' + (process.env.CONFIG !== undefined ? process.env.CONFIG : 'demo') + '.json').auth.provider.github;
const clientCfg = require('./config-' + (process.env.CONFIG !== undefined ? process.env.CONFIG : 'demo') + '.json').auth.client;
const https = require('https');
const authService = require('./server_auth');

// GitHub retrieve token :
function getToken(_code, callback) {

    const data = JSON.stringify({
        client_id: githubCfg.client_id,
        client_secret: githubCfg.client_secret,
        code: _code
    });

    const options = {
        hostname: 'github.com',
        path: '/login/oauth/access_token',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    let response = '';
    const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => response += chunk )
        .on('end', () => callback(JSON.parse(response)) )
        .on("error", (err) => {
            console.log("Error: ", err.message);
        });
    });
    req.write(data);
    req.end();
}

// GitHub retrieve user info :
function getUserInfo(token, callback) {
    const options = {
        hostname: 'api.github.com',
        path: '/user',
        method: 'GET',
        headers: {
            'User-Agent': 'Url-Bookmark',
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github+json',
            'Authorization': 'token ' + token
        }
    };

    let response = '';
    const req = https.request(options, res => {
        res.on('data', (chunk) => response+=chunk )
        res.on('end', () => {
            const data = JSON.parse(response);
            let userInfo = {};
            for (let key in githubCfg.userInfoMapping) {
                if(userInfo[githubCfg.userInfoMapping[key]] === undefined) {
                    userInfo[githubCfg.userInfoMapping[key]] = data[key];
                } else {
                    userInfo[githubCfg.userInfoMapping[key]] += githubCfg.userInfoGlue + data[key];
                }
            }
            callback(userInfo);
        });
    });
    req.end();
}

module.exports = function(app){

    app.get(rootPath + '/auth/github', (req, res) => {
        stats().newGetCall(req);
        getToken(req.query.code, (tokenRes) => {
            if (tokenRes.error !== undefined) {
                res.status(403);
                const errorData = {error: tokenRes.error, error_description: tokenRes.error_description};
                res.json(errorData);
                authService.login(app, res, req, errorData);
            } else {
                getUserInfo(tokenRes.access_token, (userInfo) => {
                    authService.login(app, res, req, userInfo);
                });
            }
        });
    });

}
