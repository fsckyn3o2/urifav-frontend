const clientCfg = require('./config-' + (process.env.CONFIG !== undefined ? process.env.CONFIG : 'demo') + '.json').auth.client;
const {stats} = require('./stats');

function login(app, res, req, data) {
    stats().newGetCall(req);
    if(data.error !== undefined) {
        req.session.userInfo = undefined;
        req.session.error = JSON.stringify(data);
        req.session.isAuthenticated = false;
    } else {
        req.session.userInfo = JSON.stringify(data);
        req.session.error = undefined;
        req.session.isAuthenticated = true;
    }

    req.session.save();

    let cookieData = {};
    for(let srcKey in clientCfg.userInfo2Cookie) {
        cookieData[clientCfg.userInfo2Cookie[srcKey]] = data[srcKey];
    }
    res.cookie('isAuthenticated', JSON.stringify(req.session.isAuthenticated));
    res.cookie('userInfo', JSON.stringify(cookieData));
    res.redirect(clientCfg.endUrl);
}

function logout(app, res, req) {
    stats().newGetCall(req);
    res.clearCookie('userInfo');
    res.clearCookie('isAuthenticated');
}

module.exports = { login: login, logout: logout };
