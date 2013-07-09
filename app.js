var http    = require('http');

var express = require('express');

var appex   = require('appex');

var appx = appex({   sourcefile : './program.ts', 
                      devmode    : true, 
                      logging    : true,
                 });


//console.log(appx);

var app = express();

app.use( appx  );

//console.log(app);

app.get('/', function(req, res) {

    res.send("respond with a resource");

});

http.createServer(appx).listen(5000, function() {

  console.log("Express server listening on port " + app.get('port'));

});

 