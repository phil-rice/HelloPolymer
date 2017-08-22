var expect = require('chai').expect
var request = require('superagent')

var PactOpts = {
    consumer: 'PactUI',             // the name of your consumer
    provider: 'Projects Provider',  // the name of your Provider
    providerPort: 1234              // the port on which the provider runs
}

PactConsumer(PactOpts, function () {

    // this is wrapped in a before() block
    // it takes an Array of interactions
    addInteractions([{
        state: 'i have a list of projects',
        uponReceiving: 'a request for projects',
        withRequest: {
            method: 'get',
            path: '/projects',
            headers: { 'Accept': 'application/json' }
        },
        willRespondWith: {
            status: 200,
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: { reply: 'hello' }
        }
    }])

    function requestProjects () {
        return request.get('http://localhost:' + PactOpts.providerPort + '/projects').set({ 'Accept': 'application/json' })
    }

    // this is your 'it' block
    verify('a list of projects is returned', requestProjects, function (result, done) {
        expect(JSON.parse(result)).to.eql({ reply: 'hello' })
        done()
    })

    // this is wrapped in a after block
    // thus it runs after all your verify's
    // it writes the pact and clear all interactions
    finalizePact()

})