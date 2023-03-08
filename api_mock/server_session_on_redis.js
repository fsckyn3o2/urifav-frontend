const storeCfg = require('./config-' + (process.env.CONFIG !== undefined ? process.env.CONFIG : 'demo') + '.json').session.store.redis;
const sessionCfg = require('./config-' + (process.env.CONFIG !== undefined ? process.env.CONFIG : 'demo') + '.json').session.cfg;
const session = require("express-session");
const cookieParser = require('cookie-parser');

let RedisStore = require("connect-redis")(session);

// redis@v4
const { createClient } = require("redis");
const {RedisSocketOptions} = require("@redis/client/dist/lib/client/socket");
const {Options: PoolOptions} = require("generic-pool");

let redisClient = createClient({
    legacyMode: true,
    url: storeCfg.url,
    socket: storeCfg.socket,
    username: storeCfg.username,
    password: storeCfg.password,
    tls: {servername: 'location.of.server'}
});

redisClient.connect().catch(console.error);

module.exports = function(app) {

    app.use(cookieParser());
    app.use(
        session({
            store: new RedisStore({client: redisClient}),
            saveUninitialized: false,
            secret: sessionCfg.signPassword,
            resave: false,
            rolling: true,
            cookie: {
                httpOnly: true,
                secure: false,
                sameSite: true,
                maxAge: sessionCfg.expirationTime
            }
        })
    );

}
