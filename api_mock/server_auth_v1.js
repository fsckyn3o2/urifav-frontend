const authService = require('./server_auth');
const {rootPath} = require("./host_config");
const clientCfg = require('./config-' + (process.env.CONFIG !== undefined ? process.env.CONFIG : 'demo') + '.json').auth.client;
const {stats} = require("./stats");

module.exports = function(app) {
    app.get(rootPath + '/auth/signout', (req, res) => {
        stats().newGetCall(req);
        req.session.destroy();
        authService.logout(app, res, req);
        res.redirect(clientCfg.endUrl);
    });
};
