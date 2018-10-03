[![npm](https://img.shields.io/npm/l/express.svg)](https://github.com/codejockie/document-manager)
[![Build Status](https://travis-ci.org/codejockie/document-manager.svg?branch=master)](https://travis-ci.org/codejockie/document-manager)
[![Code Climate](https://codeclimate.com/github/codejockie/document-manager/badges/gpa.svg)](https://codeclimate.com/github/codejockie/document-manager)
[![Coverage Status](https://coveralls.io/repos/github/codejockie/document-manager/badge.svg?branch=master)](https://coveralls.io/github/codejockie/document-manager?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/60ce4b40c146417286ed65d28132126d)](https://www.codacy.com/app/codejockie/document-manager?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=codejockie/document-manager&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/60ce4b40c146417286ed65d28132126d)](https://www.codacy.com/app/codejockie/document-manager?utm_source=github.com&utm_medium=referral&utm_content=codejockie/document-manager&utm_campaign=Badge_Coverage)
[![CircleCI](https://circleci.com/gh/codejockie/document-manager.svg?style=svg)](https://circleci.com/gh/codejockie/document-manager)


## Introduction
+  **`CJDocs`** is a document management system that exposes endpoints via RESTful APIs.
+  It has the following features:
   +  Login
   +  Signup
   +  Search for documents
   +  Search for users
   +  Create documents
   +  Delete documents, users
   +  Update documents, users

+ App lives [here](http://cjdocs.herokuapp.com)
   
## Project Dependencies
### Backend Dependencies
+  **[autoprefixer](https://www.npmjs.com/package/autoprefixer)** - PostCSS plugin to parse CSS and add vendor prefixes to CSS rules using values from Can I Use.
+  **[axios](https://www.npmjs.com/package/axios)** - Promise based HTTP client for the browser and node.js.
+  **[babel-cli](https://www.npmjs.com/package/babel-cli)** - Allows running the app in ES6 mode on the fly without having to transpile down to ES5
+ **[babel-preset-env](https://www.npmjs.com/package/babel-preset-env)**, **[babel-preset-stage-0](https://www.npmjs.com/package/babel-preset-stage-0)** - These packages provide Babel presets for es2015 plugins, stage 0 plugins
+  **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Used to hash passwords
+  **[body-parser](https://www.npmjs.com/package/body-parser)** - Node.js body parsing middleware. Parse incoming request bodies in a middleware before your handlers, available under the `req.body` property.
+  **[classnames](https://www.npmjs.com/package/classnames)** - A simple JavaScript utility for conditionally joining classNames together.
+  **[css-loader](https://www.npmjs.com/package/css-loader)** - The css-loader interprets @import and url() like import/require() and will resolve them.
+  **[dotenv](https://www.npmjs.com/package/dotenv)** - Loads environment variables.
+  **[express](https://www.npmjs.com/package/express)** - Used as the web server for this application.
+  **[express-validator](https://www.npmjs.com/package/express-validator)** - Validates input on request body, params and query.
+  **[extract-text-webpack-plugin](https://www.npmjs.com/package/extract-text-webpack-plugin)** - Extract text from a bundle, or bundles, into a separate file.
+  **[file-loader](https://www.npmjs.com/package/file-loader)** - A file loader module for webpack
+  **[gulp](https://www.npmjs.com/package/gulp)** - gulp is a toolkit that helps you automate painful or time-consuming tasks in your development workflow.
+  **[gulp-babel](https://www.npmjs.com/package/gulp-babel)** - Use next generation JavaScript, today, with Babel
+  **[gulp-exit](https://www.npmjs.com/package/gulp-exit)** - ensures that the task is terminated after finishing.
+  **[gulp-inject-modules](https://www.npmjs.com/package/gulp-inject-modules)** - Loads JavaScript files on-demand from a Gulp stream into Node's module loader.
+  **[gulp-istanbul](https://www.npmjs.com/package/gulp-istanbul)** - Istanbul unit test coverage plugin for gulp.
+  **[gulp-jasmine](https://www.npmjs.com/package/gulp-jasmine)** - This is a very basic implementation of a gulp task for jasmine
+  **[gulp-nodemon](https://www.npmjs.com/package/gulp-nodemon)** - it's gulp + nodemon + convenience.
+  **[html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin)** - Plugin that simplifies creation of HTML files to serve your bundles
+  **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)** - Generates JWT tokens and can verify them
+  **[lodash](https://www.npmjs.com/package/lodash)** - Provides utility functions
+  **[material-ui](https://www.npmjs.com/package/material-ui)** - Material-UI is a set of React components that implement Google's Material Design specification.
+  **[moment](https://www.npmjs.com/package/moment)** - A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
+  **[node-sass](https://www.npmjs.com/package/node-sass)** - Node-sass is a library that provides binding for Node.js to LibSass, the C version of the popular stylesheet preprocessor, Sass.
+  **[nodemailer](https://www.npmjs.com/package/nodemailer)** - Send e-mails from Node.js – easy as cake!
+  **[passport](https://www.npmjs.com/package/passport)** - Passport is Express-compatible authentication middleware for Node.js.
+  **[pg](https://www.npmjs.com/package/pg)** - Non-blocking PostgreSQL client for node.js. Pure JavaScript and optional native libpq bindings
+  **[pg-hstore](https://www.npmjs.com/package/pg-hstore)** - A node package for serializing and deserializing JSON data to hstore format
+  **[postcss-loader](https://www.npmjs.com/package/postcss-loader)** - Loader for webpack to process CSS with PostCSS
+  **[prop-types](https://www.npmjs.com/package/prop-types)** - Runtime type checking for React props and similar objects.
+  **[react](https://www.npmjs.com/package/react)**,**[react-dom](https://www.npmjs.com/package/react-dom)**,**[react-router-dom](https://www.npmjs.com/package/reactrouter-dom)**,**[react-redux](https://www.npmjs.com/package/react-redux)** - React is a JavaScript library for creating user interfaces.
+  **[redux](https://www.npmjs.com/package/redux)**,**[redux-devtools-extension](https://www.npmjs.com/package/redux-devtools-extension)**,**[redux-logger](https://www.npmjs.com/package/redux-logger)**,**[redux-thunk](https://www.npmjs.com/package/redux-thunk)** - Redux is a predictable state container for JavaScript apps.
+  **[sass-loader](https://www.npmjs.com/package/sass-loader)** - Loads a Sass/SCSS file and compiles it to CSS.
+  **[sequelize](https://www.npmjs.com/package/sequelize)** - Sequelize is a promise-based Node.js ORM for Postgres, MySQL, SQLite and Microsoft SQL Server. It features solid transaction support, relations, read replication and more
+  **[validator](https://www.npmjs.com/package/express)** - 
+  **[webpack](https://www.npmjs.com/package/webpack)**,**[webpack-dev-middleware](https://www.npmjs.com/package/webpack-dev-middleware)**,**[webpack-hot-middleware](https://www.npmjs.com/package/webpack-hot-middleware)** - webpack is a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset.

### Development Dependencies
+  **[chai](https://www.npmjs.com/package/chai)** - Chai is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework.
+  **[codacy-coverage](https://www.npmjs.com/package/codacy-coverage)** - Get coverage reporting and code analysis for Node.js from Codacy.
+  **[coveralls](https://www.npmjs.com/package/coveralls)** - Coveralls.io support for node.js. Get the great coverage reporting of coveralls.io and add a cool coverage button to your README.
+  **[enzyme](https://www.npmjs.com/package/enzyme)**,**[enzyme-adapter-react-16](https://www.npmjs.com/package/enzyme-adapter-react-16)** - Enzyme is a JavaScript Testing utility for React that makes it easier to assert, manipulate, and traverse your React Components' output.
+  **[eslint](https://www.npmjs.com/package/eslint)** - ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
+  **[jest](https://www.npmjs.com/package/jest)** - Complete and ready to set-up JavaScript testing solution. Works out of the box for any React project.
+  **[mocha](https://www.npmjs.com/package/mocha)** - Simple, flexible, fun JavaScript test framework for Node.js & The Browser.
+  **[moxios](https://www.npmjs.com/package/moxios)** - Mock axios requests for testing.
+  **[nyc](https://www.npmjs.com/package/nyc)** - Istanbul's state of the art command line interface.
+  **[redux-mock-store](https://www.npmjs.com/package/redux-mock-store)** - A mock store for testing your redux async action creators and middleware. The mock store will create an array of dispatched actions which serve as an action log for tests.
+  **[sequelize-cli](https://www.npmjs.com/package/sequelize-cli)** - The Sequelize Command Line Interface (CLI)
+  **[supertest](https://www.npmjs.com/package/supertest)** - HTTP assertions made easy via superagent.

## Installation and Setup
+  Navigate to a directory using your favourite `terminal`.
+  Clone this repository to that directory.
  +  Using SSH:
    `$ git clone git@github.com:codejockie/document-manager.git`

  +  Using HTTPS:
    `$ git clone https://github.com/codejockie/document-manager.git`

+  Navigate to the repo's directory
  +  `$ cd document-manager`
+  Install the app's dependencies
  +  `$ npm install` or `yarn install`
+  Run the app
  +  `$ npm start` or `yarn start`
 
## Tests
+  The tests were written using `supertest`, `chai` assertion library.
+  The test coverage is generated by `gulp-istanbul` package
+  To run tests, navigate to the project's root directory
+  Run the following commands.
  +  `$ npm test` or `yarn test`

## How to contribute
In order to contribute, certain guidelines and style guides must be followed.
More info is available on the repo's [wiki](https://github.com/codejockie/document-manager/wiki).  
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
John Kennedy - [@codejockie](https://twitter.com/codejockie)
