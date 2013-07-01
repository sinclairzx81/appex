require('typescript.api').register();
 
var appex = require('appex');


appex.create_runtime('./service.ts', function(runtime){
    
    appex.create_activation_context(runtime, function(activation_context) {

        appex.create_service_objects(activation_context, function(service_objects) {
            

            
        });
    }); 
});