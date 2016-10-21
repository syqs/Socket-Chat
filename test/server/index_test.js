var request = require('supertest')
var routes = require(__server + '/index.js')

describe("The Server", function() {

  var app = TestHelper.createApp()
  app.use('/', routes)
  app.testReady()

  it("serves an example endpoint", function() {

    // Mocha will wait for returned promises to complete
    return request(app)
      .get('/api/friends')
      .expect(200)
      .expect(function(response) {
        console.log("response: ", response.body)
        expect(response.body).to.include('user1')
      })
  })
})
