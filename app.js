require('typescript.api').register();
 
var appex = require('appex');

// initialize the runtime.
appex.create_runtime('./service.ts', function(runtime) {
    
    // create a activation context for this runtime.
    appex.create_activation_context(runtime, function(activation_context) {

        // initialize service host object.
        appex.create_service_host(activation_context, function(service_host) {

            console.log(service_host);
            
        });
    }); 
});