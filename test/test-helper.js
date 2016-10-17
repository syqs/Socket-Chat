process.env.NODE_ENV = 'test'

// The following allows you to require files independent of
// the location of your test file.
// Example:
//  var User = require(__server + '/models/user.js')
//
global.__server = __dirname + '/../server'
global.__client = __dirname + '/../client'

//
// Assertions
//
var chai = require('chai')
// Make the `expect` and `should` functions available in every test file
global.expect = chai.expect
global.should = chai.should()

// Helper Functions:
// Attach any helper functions used across several test files.
global.TestHelper = {}

// Mock apps for API testing
var express = require('express')

TestHelper.createApp = function (loader) {
  var app = express()
  app.use(require('body-parser').json())

  app.testReady = function () {
    // Log all errors
    app.use(function (err, req, res, next) {
      console.error("==Error==")
      console.error("   " + err.stack)
      next(err)
    })
  }
  return app
}
