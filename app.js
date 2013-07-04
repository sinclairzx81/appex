
var appex = require('appex');

var host = new appex.Host(server);

host.require('./service.ts');


var server = require('http').createServer(function(request, response) {

    host.metadata(request, response);

});


host.bind(server);

server.listen(7777);