/*--------------------------------------------------------------------------

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

/// <reference path="references/ecma.d.ts" />
/// <reference path="references/node.d.ts" />
/// <reference path="references/typescript.api.d.ts" />

interface ICascade {
    use   ? : {(context:appex.web.IContext) : any;}[];
    verbs ? : string [];
}

/** applies this object to the global scope. 
*
*   arguments:
*       obj - the object to apply.
*/
declare function cascade (obj:ICascade);

/** applies this object to the qualified scope. 
*
*   arguments:
*       qualifier - the qualifier to scope this object to.
*       obj - the object to apply.
*/
declare function cascade (qualifier:string, obj:ICascade);

declare module appex {
    interface IDisposable {
        dispose(): void;
    }
    interface IDictionary<string, T> {
        [key: string]: T;
    }
}
declare module appex.workers {
    /** a message exchanged between the parent and child process. */
    class Message<T> {
        /** the type of message being sent */
        public type: string;
        /** the message identifier used to associate with waiters */
        public messageid: number;
        /** the body of the message */
        public body: T;
    }
}
declare module appex.workers {
    /** a waiter */
    class Waiter<Response> {
        public messageid: number;
        public delegate: (response: Response) => void;
        /** arguments:
        *       messageid: the message id issued by this waiter.
        *       delegate : the callback handling completed work.
        */ 
        constructor(messageid: number, delegate: (response: Response) => void);
    }
}
declare module appex.workers {
    /** appex worker. a class used differ heavy lifting out to a child_process */
    class Worker<TRequest, TResponse> implements appex.IDisposable {
        public delegate: (request: TRequest, callback: (response: TResponse) => void) => void;
        private child_process;
        private waiters;
        private message_index;
        constructor(delegate: (request: TRequest, callback: (response: TResponse) => void) => void);
        /** dispatches responses to callers.
        *
        *   arguments:
        *       message - the message to dispatch.
        */
        private dispatch(message);
        /** calls the worker.
        *
        *   arguments:
        *       request  - the request to send to the worker.
        *       callback - the callback function containing a response from the worker.
        */
        public call(request: TRequest, callback: (response: TResponse) => void): void;
        /** disposes this worker by terminating its child_process */
        public dispose(): void;
    }
}
declare module appex.compiler {
    /** compilation result */
    interface CompilerResult {
        /** the programs filename */
        filename: string;
        /** the javascript generated from the compilation */
        javascript: string;
        /** script reflection meta data */
        scripts: typescript.api.Script[];
        /** typescript diagnostic messages (an empty array if no errors occur) */
        diagnostics: typescript.api.Diagnostic[];
    }
}
declare module appex.compiler {
    /** The appex typescript compiler  */
    class Compiler implements appex.IDisposable {
        private worker;
        constructor();
        /** compiles a typescript source file.
        *
        * arguments:
        *       filename - the source file to compile.
        *       callback - a callback for the compilation result.
        */ 
        public compile(filename: string, callback: (result: compiler.CompilerResult) => void): void;
        /** disposes the compiler by terminating the worker process. */
        public dispose(): void;
        /** the compilation kernel. run in a child_process */
        private kernel(filename, callback);
    }
}
declare module appex.modules {
    /** module reflection api */
    class Reflection {
        public scripts: typescript.api.Script[];
        /** arguments:
        *
        *      scripts: the scripts return from a appex compile.
        */
        constructor(scripts: typescript.api.Script[]);
        /** returns the fully qualified name of this reflected type.
        *
        *   arguments:
        *       reflected_type - the reflected type to qualify.
        *       returns        - the fully qualified name.
        */
        public typename(reflected_type: typescript.api.ReflectedType): string;
        /** returns a reflected type.
        *
        *   arguments:
        *       qualifier - the fully qualified name of the type.
        */
        public get(qualifier: string): typescript.api.ReflectedType;
        private scan_variable(qualifier, stack, variable);
        private scan_method(qualifier, stack, method);
        private scan_class(qualifier, stack, _class);
        private scan_interface(qualifier, stack, _interface);
        private scan_import(qualifier, stack, _import);
        private scan_module(qualifier, stack, _module);
        private scan_script(qualifier, stack, script);
    }
}
declare module appex.modules {
    /** interface for module exports */
    interface IModuleExport {
        module: modules.IModule;
        /** the type of export this is */
        type: typescript.api.ReflectedType;
        /** returns the module accessor. */
        accessor(): any;
        /** returns cascading attributes on the export */
        cascade(): any;
    }
}
declare module appex.modules {
    /** interface for modules */
    interface IModule extends appex.IDisposable {
        exports: modules.IModuleExport[];
        /** the vm context. (exported objects accessible on context.exports) */
        context: any;
        /** the javascript this module is mapping */
        javascript: string;
        /** type reflection meta data for this module */
        reflection: modules.Reflection;
        /** compiler diagnostics for this module. */
        diagnostics: typescript.api.Diagnostic[];
        /** compiler diagnostics for this module. */
        cascades: any[];
    }
}
declare module appex.modules {
    /** A container for javascript objects exported on a module. */
    class ModuleExport implements modules.IModuleExport {
        public module: modules.IModule;
        public type: typescript.api.ReflectedType;
        private _accessor;
        private _cascade;
        private _accessor_checked;
        private _cascade_checked;
        /** arguments:
        *       module - the appex module this export is mapping.
        *       type   - the reflected typed information for the object being exported.
        */
        constructor(module: modules.IModule, type: typescript.api.ReflectedType);
        /** returns cascading properies on this export. */
        public cascade(): any;
        /** returns a accessor handle to the exported javascript object */
        public accessor(): any;
    }
}
declare module appex.modules {
    class Cascade {
        public name: string;
        public value: any;
    }
    /** A vm and object mapping over a javascript module compiled with the appex compiler */
    class Module implements modules.IModule {
        /** the modules filename */
        public filename: string;
        /** exported javascript objects */
        public exports: modules.ModuleExport[];
        /** the vm context. (exported objects accessible on context.exports) */
        public context: any;
        /** the javascript this module is mapping */
        public javascript: string;
        /** type reflection meta data for this module */
        public reflection: modules.Reflection;
        /** compiler diagnostics for this module. */
        public diagnostics: typescript.api.Diagnostic[];
        /** (experimental) attributes defined in this module. */
        public cascades: Cascade[];
        /** arguments
        *       compilerResult - a compilation result from the appex compiler
        */
        constructor(compilerResult: appex.compiler.CompilerResult);
        /** loads the module into a vm */
        private load_vm();
        /** loads the module exports derived from the reflection. */
        private load_exports();
        private load_variable(variable);
        private load_parameter(parameter);
        private load_method(method);
        private load_class(_class);
        private load_interface(_interface);
        private load_import(_import);
        private load_module(_module);
        private load_script(script);
        /** disposes of this module (cleaning up the vm) */
        public dispose(): void;
    }
}
declare module appex.web.media {
    /** appex mime types */
    class Mime {
        public lookup(filename: string): string;
    }
}
declare module appex.templates.util {
    class Path {
        static isAbsoluteUrl(path: string): boolean;
        static isAbsoluteUrn(path: string): boolean;
        static isRootRelative(path: string): boolean;
        static isAbsolute(path: string): boolean;
        static isRelative(path: string): boolean;
        static toForwardSlashes(path: string): string;
        static relativeToAbsolute(absolute_parent_path: string, relative_path: string): string;
        static makeAbsolute(path: string): string;
    }
}
declare module appex.templates.io {
    class Buffer {
        static process(buffer): string;
    }
}
declare module appex.templates.io {
    class IOSync {
        constructor();
        public load(filename: string): string;
    }
}
declare module appex.templates {
    class Declaration {
        public type: string;
        public start: number;
        public length: number;
        public body_start: number;
        public body_length: number;
        public declarations: Declaration[];
        constructor(type: string, start: number, length: number, body_start: number, body_length: number);
    }
    class Document extends Declaration {
        public filename: string;
        public content: string;
        constructor(filename: string, content: string);
    }
    class LayoutDeclaration extends Declaration {
        public filename: string;
        constructor(filename: string, start: number, length: number);
    }
    class RenderDeclaration extends Declaration {
        public filename: string;
        constructor(filename: string, start: number, length: number);
    }
    class SectionDeclaration extends Declaration {
        public name: string;
        constructor(content: string, name: string, start: number, length: number, body_start: number, body_length: number);
    }
    class ForDeclaration extends Declaration {
        public expression: string;
        constructor(content: string, expression: string, start: number, length: number, body_start: number, body_length: number);
    }
    class IfDeclaration extends Declaration {
        public expression: string;
        constructor(content: string, expression: string, start: number, length: number, body_start: number, body_length: number);
    }
    class ExpressionDeclaration extends Declaration {
        public expression: string;
        constructor(content: string, expression: string, start: number, length: number);
    }
    class ContentDeclaration extends Declaration {
        constructor(start: number, length: number);
    }
    class Scanner {
        public declaration: Declaration;
        public content: string;
        public declarations: Declaration[];
        constructor(declaration: Declaration, content: string);
        private max();
        private read(start, length);
        private advance(index);
        private advanceto(index, code);
        private scan_section(index);
        private scan_layout(index);
        private scan_render(index);
        private scan_for(index);
        private scan_if(index);
        private scan_expression(index);
        private scan_content(index);
        private scan();
    }
}
declare module appex.templates {
    class Parser {
        public filename: string;
        public io: templates.io.IOSync;
        public reference_document: templates.Document;
        public document: templates.Document;
        public output: string[];
        constructor(filename: string);
        public parse(): string;
        private emit(current_document, declaration);
        private read(document, start, length);
        private write(content);
        private write_literal(content);
    }
}
declare module appex.templates {
    interface ITemplate {
        render(data: any);
    }
    interface IEngineOptions {
        devmode?: boolean;
    }
    class Engine {
        public options: IEngineOptions;
        /** a the appex template cache. */
        public templates: ITemplate[];
        constructor(options: IEngineOptions);
        /** renders this file specified as a appex template. */
        public render(filename: string, data?: any): string;
    }
}
declare module appex.schema {
    /** json schema node.
    *  structure to represent a json schema type definition.
    */
    class JsonSchemaNode {
        public id: string;
        public $ref: string;
        public type: any;
        public description: string;
        public properties: any;
        public items: any;
        public required: boolean;
    }
}
declare module appex.schema {
    /** appex - json schema generator
    *  generates json schema from appex reflection meta data.
    */
    class JsonSchemaGenerator {
        public reflection: appex.modules.Reflection;
        constructor(reflection: appex.modules.Reflection);
        private get_schema_compatible_typename(typename);
        /** checks the qualified_typename_stack for the qualified name.
        *
        *   arguments:
        *       qualified_names - the array of names to check.
        *       returns         - true if exists, false if not.
        */
        private is_declared(qualified_typename_stack, qualified_typename);
        /** for a given reflected type, check if it has any comments and if
        *   so, read them, format them and return them.
        *
        *   arguments:
        *       reflected_type - the reflected_type to fetch comments from.
        *       returns        - the comment.
        */
        private get_description(reflected_type);
        /** loads in this interfaces variables by traversing back to get extended properties.
        *
        *   arguments:
        *       interface - the interface or class.
        *       returns - variables declarared in this interface or class.
        */
        private get_variables(qualified_names, interface);
        /** loads a schema type
        *
        *   arguments:
        *       interface - the interface to load.
        *       returns   - a schema type.
        */
        private get_schema_object(qualified_typename_stack, interface);
        /** from a class or interfaces variable, this method will return
        *   the property to be assigned to the outer most type.
        *   arguments:
        *       variable - the variable being loaded.
        *       returns  - the schema type.
        */
        private get_schema_property(qualified_typename_stack, variable);
        /** safely loads a reflected type.
        *
        *   arguments:
        *       qualified_typename_stack - the typename stack.
        *       reflection_type          - the reflected type to be loaded
        *       returns                  - a schema object or null.
        */
        private load_reflected_type(qualified_typename_stack, reflection_type);
        /** returns a json schema by looking up a interface or class.
        *
        *   arguments:
        *       qualifier - the fully qualified name to generate a schema from.
        *       returns   - a schema object, or null if not found.
        */
        public get(qualifier: string): schema.JsonSchemaNode;
    }
}
declare module appex.util {
    class TypeCheck {
        /** test to see if this object is a boolean */
        static isBoolean(instance: any): boolean;
        /** test to see if this object is a integer */
        static isInteger(instance: any): boolean;
        /** test to see if this object is a number */
        static isNumber(instance: any): boolean;
        /** test to see if this object is an array */
        static isArray(instance: any): boolean;
        /** tests to see if this object is a string */
        static isString(instance: any): boolean;
        /** tests to see if this object is a object */
        static isObject(instance: any): boolean;
        /** tests to see if this object is a function */
        static isFunction(instance: any): boolean;
    }
}
declare module appex.schema {
    /** a json schema validation error.
    *
    */
    class JsonSchemaValidatorError {
        public message: string;
        constructor(message: string);
    }
}
declare module appex.schema {
    /** appex - JsonSchemaValidator
    *   validates json schema (generated from the appex json schema generator)
    *   against a object.
    */
    class JsonSchemaValidator {
        public errors: schema.JsonSchemaValidatorError[];
        public schemas: schema.JsonSchemaNode[];
        public get_referenced_schema(uri: string): schema.JsonSchemaNode;
        public validate_object(name: string, object: any, schema: schema.JsonSchemaNode): void;
        /** validates this object against this schema
        *
        *   arguments:
        *       object: the object or instance to validate.
        *       schema: a instance of a appex.schema.JsonSchemaNode.
        *       returns: validation errors, or a empty array if none found.
        */
        public validate(object: any, schema: schema.JsonSchemaNode): schema.JsonSchemaValidatorError[];
    }
}
declare module appex.schema {
    /** appex - json schema api.
    *  acts as a container for the generator and validator.
    */
    class JsonSchema {
        private reflection;
        constructor(reflection: appex.modules.Reflection);
        /** generate a json schema object
        *   from a class or interface definition. if the definition cannot be located, will return null.
        *
        *   arguments:
        *       qualifier - the fully qualified name of the type being generated.
        *       returns   - a json schema, or null if type not found.
        */
        public generate(qualifier: string): schema.JsonSchemaNode;
        /** validates a json object against a class or interface definition.
        *
        *   arguments:
        *       qualifier - the fully qualified name of the type being validated against.
        *       returns   - a array of json schema validation errors, or a empty array if none.
        */
        public validate(qualifier: string, object: any): schema.JsonSchemaValidatorError[];
    }
}
declare module appex.web {
    /** A appex http request */
    interface IRequest extends http.ServerRequest {
        /** appex headers */
        headers: string;
    }
    /** patches the nodejs http request with appex request api.
    *
    *   arguments:
    *       request  - the nodejs http request
    *       returns  - nodejs http + appex request api.
    */
    function BindRequest(request: http.ServerRequest): IRequest;
}
declare module appex.web {
    /** A appex http response */
    interface IResponse extends http.ServerResponse {
        /** appex response headers */
        headers: any;
        /** sends a response to the http output stream with http status code 200. will set
        *   the 'Content-Type' http header to 'text/plain' if value has not been set.
        *   arguments:
        *       data - a string value to send.
        */
        send(data: string): void;
        /** sends a response to the http output stream with http status code 200.will set
        *   the 'Content-Type' http header to 'text/plain' if value has not been set.
        *
        *   arguments:
        *       data - nodejs buffer to send.
        */
        send(data: NodeBuffer): void;
        /** sends a response to the http output stream. will set the 'Content-Type' http header
        * to 'text/plain' if value has not been set.
        *
        *   arguments:
        *       status - the http status code.
        *       data - nodejs buffer to send.
        */
        send(status: number, data: string): void;
        /** serves a local file. if not found, will send status code 404 with a 'not found' message.
        *   will resolve files mime type if the 'Content-Type' header has already been set.
        *
        *   arguments:
        *       filepath - the filepath from the root directory to serve.
        */
        serve(filepath: string): void;
        /** serves a local file from this root path. if not found, will send status code 404 with
        *   a 'not found' message. will resolve files mime type if the 'Content-Type' header has
        *   already been set.
        *
        *   arguments:
        *       root - the root directory in which to serve.
        *       filepath - the filepath from the root directory to serve.
        */
        serve(root: string, filepath: string): void;
        /** serves a local file. if not found, will send status code 404 with a 'not found' message.
        *
        *   arguments:
        *       root     - the root directory in which to serve.
        *       filepath - the filepath from the root directory to serve.
        *       mime     - the mime type of the content being served.
        */
        serve(root: string, filepath: string, mime: string): void;
        /** sends a json string to the http output stream with http status code 200. will set
        *   the http header 'Content-Type' to 'application/json' if this value has not been by the
        *   caller.
        *   arguments:
        *       obj - a javascript object.
        */
        json(obj: any): void;
        /** sends a json string to the http output stream with the supplied status code. will set
        *   the http header 'Content-Type' to 'application/json' if this value has not been by the
        *   caller.
        *
        *   arguments:
        *       status - the http status code.
        *       obj - a javascript object.
        */
        json(status: number, obj: any): void;
        /** sends a jsonp string to the http output stream with http status code 200. will set
        *   the http header 'Content-Type' to 'text/javascript' if this value has not been by the
        *   caller. the jsonp callback variable name will be set to 'callback'.
        *
        *   arguments:
        *       obj - a javascript object.
        */
        jsonp(obj: any): void;
        /** sends a jsonp string to the http output stream with the supplied status code. will set
        *   the http header 'Content-Type' to 'text/javascript' if this value has not been by the
        *   caller. the jsonp callback variable name will be set to 'callback'.
        *
        *   arguments:
        *       status - the http status code.
        *       obj - a javascript object.
        */
        jsonp(status: number, obj: any): void;
        /** sends a jsonp string to the http output stream with the supplied status code. will set
        *   the http header 'Content-Type' to 'text/javascript' if this value has not been by the
        *   caller.
        *
        *   arguments:
        *       status - the http status code.
        *       obj - a javascript object.
        *       callback - a string value to set the jsonp callback variable.
        */
        jsonp(status: number, obj: any, callback: string): void;
    }
    /** patches the nodejs http response with appex response api.
    *
    *   arguments:
    *       response - the nodejs http response
    *       returns  - nodejs http + appex response api.
    */
    function BindResponse(response: http.ServerResponse): IResponse;
}
declare module appex.web {
    interface IContext {
        /** the appex web request */
        request: web.IRequest;
        /** the appex web response */
        response: web.IResponse;
        /** the appex cascade */
        cascade: any;
        /** the next function */
        next: Function;
        /** the appex router */
        router: web.routing.IRouter;
        /** the current executing module */
        module: appex.modules.IModule;
        /** the appex schema api */
        schema: appex.schema.JsonSchema;
        /** the appex template engine */
        template: appex.templates.Engine;
        /** mime utility */
        mime: web.media.Mime;
    }
}
declare module appex.web.routing {
    /** appex route interface */
    interface IRoute {
        /** matches a route from the given request
        *
        *   arguments:
        *       context  - the context.
        */
        match(context: web.IContext): boolean;
        /** handles route invocation.
        *
        *   arguments:
        *       context  - the context.
        *       request  - the nodejs http request.
        *       response - the nodejs http response.
        *       returns  - success if the route was handled.
        */
        handler(context: web.IContext): boolean;
    }
}
declare module appex.web.routing {
    /** appex router interface */
    interface IRouter {
        /** the routes */
        routes: routing.IRoute[];
        /** router http handler
        *
        *   arguments:
        *       context  - the app context
        *       request  - the nodejs http request.
        *       response - the nodejs http response.
        */
        handler(context: web.IContext): boolean;
    }
}
declare module appex.web {
    /** appex server start options **/
    interface IServerOptions {
        program: string;
        devmode?: boolean;
        logging?: boolean;
        protocol?: string;
        context?: any;
        stdout?: WritableStream;
        stderr?: WritableStream;
    }
    /** normalizes the appex server start options
    *
    *   arguments:
    *       options - the options to normalize.
    *       returns - the normalized options.
    */
    function NormalizeServerOptions(options: IServerOptions): IServerOptions;
}
declare module appex.web {
    /** interface for appex servers. */
    interface IServer extends appex.IDisposable {
        options?: web.IServerOptions;
        /** creates a nodejs http server on the given port.
        *
        *  arguments:
        *      port : the port to listen on.
        */
        listen(port: number): void;
        /** the http request handler.
        *
        *   arguments:
        *       request  - the nodejs http request.
        *       response - the nodejs http response.
        *       next     - (optional) the next callback used for express / connect middleware.
        */
        handler(request: http.ServerRequest, response: http.ServerResponse, next?: Function): void;
    }
}
declare module appex.web.routing {
    /** appex generic route. handles named routes / function */
    class IndexRoute implements routing.IRoute {
        public moduleExport: appex.modules.IModuleExport;
        /** the pathname used to match this route. */
        public pathname: string;
        /** arguments:
        *       moduleExport : the module export for this route. (must be a function).
        */
        constructor(moduleExport: appex.modules.IModuleExport);
        /** matches a route from the given request
        *
        *   arguments:
        *       request : the nodejs http request to match.
        */
        public match(context: web.IContext): boolean;
        /** invokes the target.
        *
        *   arguments:
        *       method  : the method to invoke.
        *       context : the context.
        */
        private invoke(method, context);
        /** handles route invocation.
        *
        *   arguments:
        *       app      - the application context.
        *       request  - the nodejs http request.
        *       response - the nodejs http response.
        *       returns  - success if the route was handled.
        */
        public handler(context: web.IContext): boolean;
        /** initializes this route */
        private initialize();
    }
}
declare module appex.web.routing {
    /** appex named route. handles named routes / function */
    class NamedRoute implements routing.IRoute {
        public moduleExport: appex.modules.IModuleExport;
        /** the pathname used to match this route. */
        public pathname: string;
        /** arguments:
        *       moduleExport : the module export for this route. (must be a function).
        */
        constructor(moduleExport: appex.modules.IModuleExport);
        /** matches a route from the given request
        *
        *   arguments:
        *       request : the nodejs http request to match.
        */
        public match(context: web.IContext): boolean;
        /** invokes the target.
        *
        *   arguments:
        *       method  : the method to invoke.
        *       context : the context.
        */
        private invoke(method, context);
        /** handles route invocation.
        *
        *   arguments:
        *       app      - the application context.
        *       request  - the nodejs http request.
        *       response - the nodejs http response.
        *       returns  - success if the route was handled.
        */
        public handler(context: web.IContext): boolean;
        /** initializes this route */
        private initialize();
    }
}
declare module appex.web.routing {
    /** appex wildcard route. handles wildcard routing and url parameters */
    class WildcardRoute implements routing.IRoute {
        public moduleExport: appex.modules.IModuleExport;
        /** regular expressions used in matching routes */
        public regexps: RegExp[];
        /** arguments:
        *       moduleExport : the module export for this route. (must be a function).
        */
        constructor(moduleExport: appex.modules.IModuleExport);
        /** matches a route from the given request
        *
        *   arguments:
        *       request : the nodejs http request to match.
        */ 
        public match(context: web.IContext): boolean;
        /** invokes the target.
        *
        *   arguments:
        *       method  : the method to invoke.
        *       context : the context.
        */
        private invoke(method, parameters, context);
        /** handles route invocation.
        *
        *   arguments:
        *       context  - the context.
        *       request  - the nodejs http request.
        *       response - the nodejs http response.
        *       returns  - success if the route was handled.
        */
        public handler(context: web.IContext): boolean;
        /** initializes this route */
        private initialize();
        /** loads arguments from the url.
        *
        *   arguments:
        *       url : the url pathname
        *       returns: an array of arguments to applied to the invocation target.
        */
        private arguments(url);
    }
}
declare module appex.web.routing {
    /** the appex router */
    class ModuleRouter implements routing.IRouter {
        public module: appex.modules.IModule;
        /** the routes */
        public routes: routing.IRoute[];
        /** the appex module in which to apply routes
        *
        *   arguments:
        *       module - the appex module.
        */
        constructor(module: appex.modules.IModule);
        /** router http handler
        *
        *   arguments:
        *       app      - the app context
        *       request  - the nodejs http request.
        *       response - the nodejs http response.
        */
        public handler(context: web.IContext): boolean;
        /** initializes the router */
        private initialize();
        /** resolves a route from a appex modules export
        *
        *   arguments:
        *       moduleExport - the module export to resolve.
        *       returns      - a route (or null if not applicable)
        */
        private resolve_route_from_export(moduleExport);
        /** validates a wildcard signature */
        private validate_wildcard_signature(method);
        /** validates a index signature */
        private validate_index_signature(method);
        /** validates a named signature */
        private validate_named_signature(method);
    }
}
declare module appex.web {
    class Context implements web.IContext {
        /** the appex request */
        public request: web.IRequest;
        /** the appex response */
        public response: web.IResponse;
        /** the appex cascade */
        public cascade: any;
        /** the next function */
        public next: Function;
        /** the appex router */
        public router: web.routing.IRouter;
        /** the current executing module */
        public module: appex.modules.IModule;
        /** the appex schema api */
        public schema: appex.schema.JsonSchema;
        /** the appex template engine */
        public template: appex.templates.Engine;
        /** mime utility */
        public mime: web.media.Mime;
    }
}
declare module appex.timers {
    /** a stop watch used to time things */
    class StopWatch {
        private starttime;
        constructor();
        /** starts / resets the stopwatch. */
        public start(): void;
        /** stops the stop watch.
        *
        *       returns - the time delta in milliseconds.
        */
        public stop(): number;
    }
}
declare module appex.web {
    class Waiter {
        public request: http.ServerRequest;
        public response: http.ServerResponse;
        public next: Function;
        constructor(request: http.ServerRequest, response: http.ServerResponse, next: Function);
    }
}
declare module appex.web {
    /** a appex development server. manages JIT compilations on http request. */
    class DevelopmentServer implements web.IServer {
        public options: web.IServerOptions;
        private server;
        private compiler;
        private module;
        private schema;
        private router;
        private template;
        private mime;
        private waiters;
        private compiling;
        /** arguments:
        *    options - server start options.
        */
        constructor(options: web.IServerOptions);
        /** creates a nodejs http server based on the server options protocol.
        *
        *  arguments:
        *      port - the port to listen on.
        */
        public listen(port: number): void;
        /** the http request handler.
        *
        *   arguments:
        *       request  - the nodejs http request.
        *       response - the nodejs http response.
        *       next     - (optional) the next callback used for express / connect middleware.
        */ 
        public handler(request: http.ServerRequest, response: http.ServerResponse, next?: Function): void;
        /** loads the context.
        *
        *   arguments:
        *       request  - the nodejs http request
        *       response - the nodejs http response
        *       next     - the next function
        *       returns  - the context
        */ 
        private load_context(request, response, next?);
        /** compiles options.program and loads the module and router.
        *
        *   arguments:
        *       callback - a callback containing any diagnostics.
        */ 
        private compile(callback);
        /** emits compilation errors to options.stdout and http buffer.
        *
        *   arguments:
        *       diagnostics - the diagnostics to emit.
        */
        private errors(diagnostics);
        /** disposes of this server */
        public dispose(): void;
    }
}
declare module appex.web {
    /** a appex server. JIT once and watch it fly. */
    class Server implements web.IServer {
        public options: web.IServerOptions;
        private server;
        private compiler;
        private module;
        private schema;
        private router;
        private template;
        private mime;
        private waiters;
        private compiled;
        private compiling;
        /** arguments:
        *    options - server start options.
        */
        constructor(options: web.IServerOptions);
        /** creates a nodejs http server based on the server options protocol.
        *
        *  arguments:
        *      port - the port to listen on.
        */
        public listen(port: number): void;
        /** the http request handler.
        *
        *   arguments:
        *       request  - the nodejs http request.
        *       response - the nodejs http response.
        *       next     - (optional) the next callback used for express / connect middleware.
        */ 
        public handler(request: http.ServerRequest, response: http.ServerResponse, next?: Function): void;
        /** loads the context.
        *
        *   arguments:
        *       request  - the nodejs http request
        *       response - the nodejs http response
        *       next     - the next function
        *       returns  - the context
        */ 
        private load_context(request, response, next?);
        /** compiles options.program once and loads the module and router.
        *
        *   arguments:
        *       callback - a callback containing any diagnostics.
        */ 
        private compile(callback);
        /** emits compilation errors to options.stdout and a 500 'internal server error' message to http buffer.
        *
        *   arguments:
        *       diagnostics - the diagnostics to emit.
        */
        private errors(diagnostics);
        /** disposes of this server */
        public dispose(): void;
    }
}