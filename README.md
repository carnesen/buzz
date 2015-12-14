[![Build Status](https://travis-ci.org/carnesen/eta-base.svg?branch=master)](https://travis-ci.org/carnesen/eta-base)

# eta-base

This repo is meant to be a good starting point for assignments and projects for students in eta cohort at Prime Digital Academy. It bundles and connects all the technologies that we've been learning about in class.

Browser:
 - jQuery
 - Handlebars
 - Bootstrap
 - Angular

Server:
 - Node.js
 - express
 - express-generator
 - Jade
 - MongoDB
 - Mongoose
 - Mocha (unit testing)

## Install

Install the eta-base project in a terminal with the following sequence of commands:

```
cd <your projects directory>
git clone git@github.com:carnesen/eta-base.git
cd eta-base
npm link
npm install
```

This installs the eta-base source code, dependencies, and command-line interface (CLI).

The eta-base CLI currently only has one command, `eta-base init`, which copies the eta-base source code and dependencies into your current working directory. So to start a new project based on eta-base, first create a repo for it on GitHub, then do like:

```
cd <your projects directory>
git clone <URL of your new empty GitHub repository>
cd <your new empty repo's name>
eta-base init
```

That init command runs `npm install` so you don't have to again.

## WebServer
[The WebServer module](lib/WebServer.js) is the core of eta-base. It exports an object containing a pre-configured express app, an http server, and several convenience methods for adding routes and for starting and stopping the server. When WebServer is instantiated, it *automatically* loads all routes specified in the project ["routes" subdirectory](routes). In eta-base, a route spec is an ordinary object with three properties:

 - path: The route path (e.g. "/api/users")
 - method: The http request method for this route (e.g. "get")
 - handler: A function of request, response, and next for handling requests to this route.

WebServer expects that each file in the "routes" subdir module.exports an array of route objects. In an application derived from express-generator, the web server configuration is split between app.js and bin/www. In eta-base, all the action is in WebServer.js and the executable ([server.js](server.js)) has just one line, `require('lib/WebServer').start()`. Front-end libraries like jquery.min.js are served under the URL path "/lib". Check out the WebServer source code for a full list of auto-served vendor libraries.

## Mongo

Check out the [User module](lib/User)

## Unit testing
The eta-base features are unit-tested using [Mocha](https://mochajs.org/). All routes added to WebServer are tested using [supertest](https://www.npmjs.com/package/supertest). Calls to MongoDB are mocked and tested with [Mockgoose](https://www.npmjs.com/package/mockgoose). Check out [lib/\_\_tests\_\_](lib/__tests__) for examples. Every git push to the master branch triggers the unit tests to run on [Travis CI](https://travis-ci.org/carnesen/eta-base). Check the badge at the top of this README to see the current build status.
