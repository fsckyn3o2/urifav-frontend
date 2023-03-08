const env = process.env.REACT_APP_CONFIG;
console.debug("Loading Configuration for environment env='" + env + "'");

let config = null;
const configCfg = require('./configs/config.json');
const demoCfg = require('./configs/demo.json');
const appCfg = require('./configs/application.json');

switch(env) {
    default:
    case 'demo':
        config = {...configCfg, ...demoCfg};
        break;
    case 'application':
        config = {...configCfg, ...appCfg};
        break;
}

module.exports.config = config;
