
// add this to the apl
module.exports.compile  = function(program:string) {

    var compiler = new appex.compiler.Compiler();

    var writestream = node.fs.createWriteStream('./output.js');

    compiler.compile(program, function(result) {

        compiler.dispose();

        compiler = new appex.compiler.Compiler();
        
        compiler.compile('./node_modules/appex/web/DeploymentServer.ts', function(host) {
            
            compiler.dispose();

            writestream.write('var _appex_compiler_result_ = ');
            
            writestream.write(JSON.stringify(result));
            
            writestream.write(';\n');
            
            writestream.write(host.javascript);
            
            writestream.write('module.exports = function (options) {\n');
            
            writestream.write('options = appex.web.NormalizeServerOptions(options);\n');
            
            writestream.write('var server = new appex.web.DeploymentServer(options);\n');
            
            writestream.write('var facade = function (request, response, next) {\n');
            
            writestream.write('server.handler(request, response, next);\n');
            
            writestream.write('};\n');
            
            writestream.write('for (var n in server) { facade[n] = server[n]; }\n');
            
            writestream.write('return facade;\n');
            
            writestream.write('};\n');
            
            writestream.end();
        });
    });
}