[![npm](https://img.shields.io/npm/l/express.svg)](https://github.com/codejockie/document-manager)
[![Build Status](https://travis-ci.org/codejockie/document-manager.svg?branch=master)](https://travis-ci.org/codejockie/document-manager)
[![Code Climate](https://codeclimate.com/github/codejockie/document-manager/badges/gpa.svg)](https://codeclimate.com/github/codejockie/document-manager)
[![Test Coverage](https://codeclimate.com/github/codejockie/document-manager/badges/coverage.svg)](https://codeclimate.com/github/codejockie/document-manager/coverage)
[![Coverage Status](https://coveralls.io/repos/github/codejockie/document-manager/badge.svg?branch=master)](https://coveralls.io/github/codejockie/document-manager?branch=master)


## Introduction
+  **`Document Manager`** is a RESTful API.
+  It has the following features:
   +  Login
   +  Signup
   +  Search for documents
   +  Search for users
   +  Create documents
   +  Delete documents, users
   +  Update documents, users

## Endpoints
#### Document Resources

- **[<code>GET</code> documents]()** - Get all documents
- **[<code>GET</code> documents/:id]()** - Get a document
- **[<code>POST</code> documents]()** - Create a document
- **[<code>PUT</code> documents/:id]()** - Update a document
- **[<code>DELETE</code> documents/:id/]()** - Delete a document

#### User Resources

- **[<code>GET</code> users]()** - Get all users
- **[<code>GET</code> users/:id]()** - Get a user
- **[<code>GET</code> users/:id/documents]()** - Get user's document
- **[<code>POST</code> users]()** - Create a user
- **[<code>POST</code> users/login]()** - Authenticate a user
- **[<code>PUT</code> users/:id]()** - Update a user
- **[<code>DELETE</code> users/:id]()** - Delete a user

#### Search Resources

- **[<code>GET</code> search/users]()** - Search for users
- **[<code>GET</code> search/documents]()** - Search for documents
   
## Project Dependencies
### Dependencies
+  **[babel-cli](https://www.npmjs.com/package/babel-cli)** - Allows running the app in ES6 mode on the fly without having to transpile down to ES5
+ **[babel-preset-es2015](https://www.npmjs.com/package/babel-preset-es2015)**, **[babel-preset-stage-0](https://www.npmjs.com/package/babel-preset-stage-0)** - These packages provide Babel presets for es2015 plugins, stage 0 plugins
+  **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Used to hash passwords
+  **[body-parser](https://www.npmjs.com/package/body-parser)** - Node.js body parsing middleware. Parse incoming request bodies in a middleware before your handlers, available under the `req.body` property.
+  **[dotenv](https://www.npmjs.com/package/dotenv)** - Loads environment variables
+  **[express](https://www.npmjs.com/package/express)** - Used as the web server for this application
+  **[express-validator](https://www.npmjs.com/package/express-validator)** - Validates input on request body, params and query
+  **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)** - Generates JWT tokens and can verify them
+  **[lodash](https://www.npmjs.com/package/lodash)** - Provides utility functions
+  **[pg](https://www.npmjs.com/package/pg)** - Non-blocking PostgreSQL client for node.js. Pure JavaScript and optional native libpq bindings
+  **[pg-hstore](https://www.npmjs.com/package/pg-hstore)** - A node package for serializing and deserializing JSON data to hstore format
+  **[sequelize](https://www.npmjs.com/package/sequelize)** - Sequelize is a promise-based Node.js ORM for Postgres, MySQL, SQLite and Microsoft SQL Server. It features solid transaction support, relations, read replication and more
+  **[sequelize-cli](https://www.npmjs.com/package/sequelize-cli)** - The Sequelize Command Line Interface (CLI)

### Development Dependencies
+  **[chai](https://www.npmjs.com/package/chai)** - Chai is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework.
+  **[chai-http](https://www.npmjs.com/package/chai-http)** - 
+  **[coveralls](https://www.npmjs.com/package/coveralls)** - Coveralls.io support for node.js. Get the great coverage reporting of coveralls.io and add a cool coverage button to your README.
+  **[gulp](https://www.npmjs.com/package/gulp)** - gulp is a toolkit that helps you automate painful or time-consuming tasks in your development workflow.
+  **[gulp-babel](https://www.npmjs.com/package/gulp-babel)** - Use next generation JavaScript, today, with Babel
+  **[gulp-exit](https://www.npmjs.com/package/gulp-exit)** - ensures that the task is terminated after finishing.
+  **[gulp-inject-modules](https://www.npmjs.com/package/gulp-inject-modules)** - Loads JavaScript files on-demand from a Gulp stream into Node's module loader.
+  **[gulp-istanbul](https://www.npmjs.com/package/gulp-istanbul)** - Istanbul unit test coverage plugin for gulp.
+  **[gulp-jasmine-node](https://www.npmjs.com/package/gulp-jasmine-node)** - This is a very basic implementation of a gulp task for jasmine-node
+  **[gulp-nodemon](https://www.npmjs.com/package/gulp-nodemon)** - it's gulp + nodemon + convenience
+  **[supertest](https://www.npmjs.com/package/supertest)** - HTTP assertions made easy via superagent.

## Installation and Setup
+  Navigate to a directory using your favourite `terminal`.
+  Clone this repository to that directory.
  +  Using SSH;
    `$ git clone git@github.com:codejockie/document-manager.git`

  +  Using HTTP;
    `$ git clone https://github.com/codejockie/document-manager.git`

+  Navigate to the repo's directory
  +  `$ cd document-manager`
+  Install the app's dependencies
  +  `$ npm install`
+  Run the app
  +  `$ npm start`
 
## Tests
+  The tests were written using Supertest, Chai, Chai-HTTP.
+  The test coverage is generated by `gulp-istanbul` package
+  To run tests, navigate to the project's root directory
+  Run the following commands.
  +  `$ npm test

## How to contribute
To contribute, fork this repo to your private repository and create a pull request based on the feature you want to add.

## Disclaimer
This app and its functions are limited by time constraint and is in no way at its best.

## FAQs
+ Can I fork the repo?
  + Feel free
+ Can I contribute to the project?
  + Feel free

## License
License included in the repository

## Author
John Kennedy - @codejockie
