const appCfg = require('./config-' + (process.env.CONFIG !== undefined ? process.env.CONFIG : 'demo') + '.json').app;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { v4: uuidv4 } = require('uuid');

const DEFAULT_PAGE_SIZE = appCfg.pagination.defaultSize;
const { port, rootPath, version } = require('./host_config');
const { stats } = require('./stats.js');
const { cssStyle } = require('./style.js');

const users = require('./data/users.json');
const urls = require('./data/urls.json');
const categories = require('./data/categories.json');

for (let i in urls) {
   if(urls[i].category_uuid){
       categories.forEach(categ => {
           if(categ.uuid === urls[i].category_uuid) urls[i].category_name = categ.name;
       });
   }
}

app.use(rootPath, function(req, res, next) {
    const contype = req.headers['content-type'];
    if (req.baseUrl !== rootPath) {
        if (!contype || contype.indexOf('application/json') !== 0) return res.sendStatus(400);
    }
    next();
});

app.use(bodyParser.json());

require('./server_session_on_redis')(app);

app.get(rootPath, (req,res) => {
    stats().newCall(req);
    res.send(`${cssStyle}
                  <h1><span>API Running on port ${port} in version ${version}</span></h1>
                  <h2><span>Statistic</span></h2>` + stats().html());
});

app.get(rootPath + '/admin/users', (req, res) => {
    stats().newGetCall(req);
    res.json(users);
});

const pageToHeader = (page, size, res, dataLength = 0) => {
    res.setHeader('page-number', Number.parseInt(page ? page : 1));
    res.setHeader('page-size', Number.parseInt(size ? size : DEFAULT_PAGE_SIZE));
    res.setHeader('page-last', Math.round(dataLength/Number.parseInt(size ? size : DEFAULT_PAGE_SIZE)));
}

const pageFromHeader = (req) => ({
    number: Number.parseInt(req.header('page-number') !== undefined ? req.header('page-number') : 1),
    size: Number.parseInt(req.header('page-size') !== undefined ? req.header('page-size') : DEFAULT_PAGE_SIZE),
    last: Math.round(urls.length/Number.parseInt(req.header('page-size') !== undefined ? req.header('page-size') : '' + DEFAULT_PAGE_SIZE ))
});

const itemsPage = (items, page) => {
    const last = page.number * page.size;
    return items.slice((page.number - 1) * page.size, last >= items.length ? items.length:last);
}

app.get(rootPath + '/url', (req, res) => {
    stats().newGetCall(req);
    const page = pageFromHeader(req);
    if((page.number-1) * page.size > urls.length){
        res.status(404);
        res.json([])
    } else {
        pageToHeader(page.number, page.size, res, urls.length);
        res.json(itemsPage(urls, page));
    }
});


app.get(rootPath + '/url/pages/size/:size', (req, res) => {
    stats().newGetCall(req);
    const size = Number.parseInt(req.params.size);
    pageToHeader(1, size, res);
    res.json({
        last: Math.round(urls.length/size),
        size: size
    });
});

app.get(rootPath + '/url/page/:number/size/:size', (req, res) => {
    stats().newGetCall(req);
    const page = req.params.number, size = req.params.size;
    if(page === 'last') {
        res.json(urls.slice(-size));
    } else {
        pageToHeader(page, size, res, urls.length);
        res.json(urls.slice((page-1) * size, page * size));
    }
});

app.post(rootPath + '/user', (req, res) => {
    const user = req.body.user;
    console.log('Adding user ::: ', user);
    users.push(user);
    res.json({message: 'user added' });
});

app.post(rootPath + '/url', (req, res) => {
    stats().newPostCall(req);
    const url = req.body;
    url.uuid = uuidv4();
    url.creation_date = new Date().toISOString();
    url.update_date = '' + url.creation_date;
    console.log('Adding url ::: ', url);
    urls.push(url);
    res.json(url);
});

app.post(rootPath + '/category', (req, res) => {
    stats().newPostCall(req);
    const categ = req.body;
    categ.uuid = uuidv4();
    categ.creation_date = new Date().toISOString();
    categ.update_date = '' + categ.creation_date;
    console.log('Adding category ::: ', categ);
    categories.push(categ);
    res.json(categ);
});

app.put(rootPath + '/url', (req, res) => {
    stats().newPutCall(req);
    const url = req.body;
    console.log('Update url ::: ', url);
    for (const urlsKey in urls) {
        if(urls[urlsKey].uuid === url.uuid) {
            if(urls[urlsKey].update_date === url.update_date) {
                url.update_date = new Date().toISOString();
                urls[urlsKey] = url;
                res.json(url);
                return;
            } else {
                res.status(412);
                res.json({data: { name: url.name, uuid: url.uuid }, status: 412});
                return;
            }
        }
    }

    res.status(400);
    res.json({data: { name: url.name, uuid: url.uuid }, status: 400});
});

app.put(rootPath + '/category', (req, res) => {
    stats().newPutCall(req);
    const categ = req.body;
    console.log('Update category ::: ', categ);
    for (const categKey in categories) {
        if(categories[categKey].uuid === categ.uuid) {
            if(categories[categKey].update_date === categ.update_date) {
                categ.update_date = new Date().toISOString();
                categories[categKey] = categ;
                res.json(categ);
                return;
            } else {
                res.status(412);
                res.json({data: { name: categ.name, uuid: categ.uuid }, status: 412});
                return;
            }
        }
    }

    res.status(400);
    res.json({data: { name: categ.name, uuid: categ.uuid }, status: 400});
});

app.post(rootPath + '/category/select', (req, res) => {
    stats().newPostCall(req);
    const search = req.body;
    console.log('Search category ::: ', search);

    const categRes = categories.filter(categ => Object.keys(search).every(key => categ[key] === search[key]));
    if(res.length <= 0) {
        res.status(404);
    } else {
        res.json(categRes);
    }
});

app.post(rootPath + '/category/search', (req, res) => {
    stats().newPostCall(req);
    const search = req.body;
    console.log('Search category ::: ', search);

    const page = pageFromHeader(req);
    const categRes = categories.filter(categ => Object.keys(search).every(key => categ[key].includes(search[key])));
    if(categRes.length <= 0) {
        pageToHeader(false, false, res);
        res.json([]);
    } else {
        pageToHeader(page.number, page.size, res, categRes.length);
        res.json(itemsPage(categRes, page));
    }
});

app.post(rootPath + '/url/search', (req, res) => {
    stats().newPostCall(req);
    const search = req.body;
    console.log('Search url ::: ', search);

    const page = pageFromHeader(req);
    const urlRes = urls.filter(url => Object.keys(search).some(key => url[key].toString().toLowerCase().includes(search[key].toString().toLowerCase())));
    if(urlRes.length <= 0) {
        pageToHeader(false, false, res);
        res.json([]);
    } else {
        pageToHeader(page.number, page.size, res, urlRes.length);
        res.json(itemsPage(urlRes, page));
    }
});

app.get(rootPath + '/category', (req, res) => {
    stats().newGetCall(req);
    const page = pageFromHeader(req);
    if((page.number-1) * page.size > categories.length){
        res.status(404);
        res.json([])
    } else {
        pageToHeader(page.number, page.size, res, categories.length);
        res.json(itemsPage(categories, page));
    }
});

require('./server_auth_v1')(app);
require('./server_auth_github_v1')(app);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
