const { config } = require('./config');
const { createProxyMiddleware } = require('http-proxy-middleware');

if( config.proxy.enable === true ) {
    console.log('PROXY TRUE');

    module.exports = function(app) {

        config.proxy.configs.forEach(proxyCfg => {
            if(proxyCfg.enable === false) return;

            console.log(proxyCfg);
            app.use(
                proxyCfg.url,
                createProxyMiddleware({
                    target: proxyCfg.target.host,
                    changeOrigin: true,
                    logLevel: proxyCfg.logLevel,
                    pathRewrite: (item => {
                        item['^' + proxyCfg.url + '/*'] = proxyCfg.target.url;
                        return item;
                    })({}),
                    hostRewrite: proxyCfg.target.host,
                    headers: {
                        Connection: "keep-alive"
                    }
                })
            );
        });
    };

} else {
    console.log('PROXY FALSE');
    module.exports = function(app) { };
}
