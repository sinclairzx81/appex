﻿/*--------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2013 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

/// <referecne path="../references.ts" />
/// <reference path="../interfaces.ts" />
/// <reference path="../modules/IModule.ts" />
/// <reference path="../modules/Module.ts" />
/// <reference path="../schema/Schema.ts" />
/// <reference path="routing/IRouter.ts" />
/// <reference path="routing/Router.ts" />
/// <reference path="media/Mime.ts" />
/// <reference path="IContext.ts" />
/// <reference path="Context.ts" />
/// <reference path="IServer.ts" />
/// <reference path="ServerOptions.ts" />
/// <reference path="Waiter.ts" />


///////////////////////////////////
//
// Example Deployment Server.
//
//
///////////////////////////////////

module appex.web {

    declare var _appex_compiler_result_:any;

    /** a appex development server. manages JIT compilations on http request. */
    export class DeploymentServer implements appex.web.IServer {

        private server                 : http.Server;

        private module                 : appex.modules.IModule;

        private schema                 : appex.schema.Schema;

        private router                 : appex.web.routing.IRouter;

        private mime                   : appex.web.media.Mime;

        private waiters                : appex.web.Waiter[];
        
        private compiling              : boolean;
        
        /** arguments:
        *    options - server start options.
        */
        constructor(public options:appex.web.IServerOptions) {

            this.mime                  = new appex.web.media.Mime();

            this.module                = null;

            this.schema                = null;

            this.router                = null;

            this.waiters               = [];

            this.compiling             = false;

            this.options.stdout.write('appex \033[32m- development server\033[0m\n');
        }
        
        /** creates a nodejs http server based on the server options protocol.
         * 
         *  arguments:
         *      port - the port to listen on.
         */
        public listen(port:number) : void {
            
            var protocol:any = this.options.protocol == "http" ? node.http : node.https;

            var that = this;

            this.server = protocol.createServer(function(request : http.ServerRequest, response : http.ServerResponse, next : Function) : void {
            
                that.handler(request, response, null);
            });

            this.server.listen(port);
        }

        /** the http request handler.
        *   
        *   arguments:
        *       request  - the nodejs http request.
        *       response - the nodejs http response.
        *       next     - (optional) the next callback used for express / connect middleware.
        */       
        public handler (request:http.ServerRequest, response:http.ServerResponse, next?:Function) : void {

            this.waiters.push( new appex.web.Waiter(request, response, next) );
            
            var that = this;

            this.compile(function(diagnostics) {

                if(diagnostics) {
                
                    that.errors(diagnostics);

                    return;
                }

                while(that.waiters.length > 0) {

                    var waiter  = that.waiters.pop();

                    var context = that.load_context(waiter.request, waiter.response, waiter.next);

                    var handled = that.router.handler (context);

                    if(handled) {
                        
                        if(that.options.logging) {

                            var message = [];

                            message.push(context.request.method , ' ');

                            message.push(context.request.url, '\n');

                            that.options.stdout.write(message.join(''));
                        }
                    }
                    else 
                    {    
                        if(context.next) 
                        { 
                            context.next();
                        }
                    }
                }
            });
        }


        /** loads the context.
        *   
        *   arguments:
        *       request  - the nodejs http request
        *       response - the nodejs http response
        *       next     - the next function
        *       returns  - the context
        */   
        private load_context(request:http.ServerRequest, response:http.ServerResponse, next?:Function) : appex.web.IContext {

            var context       = new appex.web.Context();

            // bind in user objects.
            if(this.options.context) {

                for(var n in this.options.context) {
            
                    context[n] = this.options.context[n];
                }
            }

            // bind in context objects.
            context.request   = appex.web.BindRequest(request);

            context.response  = appex.web.BindResponse(response);

            context.next      = function() {};

            context.module    = this.module;

            context.schema    = this.schema;

            context.router    = this.router;

            context.mime      = this.mime;

            if(next) {
            
                context.next = next;
            }

            // initialize the cascade.
            context.cascade = {};

            return context;
        }

        /** compiles options.program and loads the module and router.
        *   
        *   arguments:
        *       callback - a callback containing any diagnostics.
        */ 
        private compile ( callback: ( diagnostics:typescript.api.Diagnostic[] ) => void ): void {

            this.module     = new appex.modules.Module( _appex_compiler_result_ );

            this.schema     = new appex.schema.Schema(this.module.reflection);

            this.router     = new appex.web.routing.ModuleRouter(this.module);

            callback(null);       
        }

        /** emits compilation errors to options.stdout and http buffer.
        *   
        *   arguments:
        *       diagnostics - the diagnostics to emit.
        */
        private errors  ( diagnostics:typescript.api.Diagnostic[] ) : void {
        
            while(this.waiters.length > 0) {

                var request = this.waiters.pop ();

                request.response.writeHead(500, {'content-type' : 'text/plain'});

                for(var n in diagnostics) {
                
                    var diagnostic = diagnostics[n];

                    var message = [];
                            
                    message.push( diagnostic.path )
                            
                    message.push(" [" , (diagnostic.line_index + 1).toString(),  ":" , (diagnostic.char_index + 1).toString() , "] ");
                            
                    message.push(diagnostic.message, '\n');

                    request.response.write(message.join(''));

                    if(this.options.logging) {

                        this.options.stderr.write( message.join('') );
                    }
                }

                request.response.end();
            }         
        }
        
        /** disposes of this server */
        public dispose  (): void {

            if(this.module) {
            
                this.module.dispose();
            }
        }
    }
}