# urifav-frontend
Bookmark uri frontend based on reactjs.
This is a simple app just to be an example/test on ReactJs with a mock backend.

## How to start it for test
- Start *api-backend* for backend example (inside api-mock) : `cd ./api-mock` `npm run dev`
- Start *front-end* ReactJs application : `npm run start`

## Default http-port
- api-mock : 3080
- reactjs : 3000

## Configuration for ReactJs-app

### Files
- json files are in `/src/configs` directory
- `config.json` + `demo.json` is the default configuration overrided by an other file
- other file is selected an environment variable : ENV

### Proxy
- configured by `setupProxy.js`
- see `proxy` field inside `demo.json` which is parsed by `setupProxy.js`
- proxy can be activate or not
- a proxy contains a list of prefix *configs{ url }* which will redirect to the target *target{ .host + .url }*
