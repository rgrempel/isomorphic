/*
 * Isomorphic SmartClient
 * Version 7.0RC (2009-04-21)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */





//> @class DMI
// 
// Direct Method Invocation (DMI) allows background HTTP requests to directly
// invoke methods on server-side objects via XML configuration.
// <P>
// DMI is an alternative to the +link{RPCManager.actionURL} approach where your server code
// receives a generalized +link{RPCRequest,request object} which you route to appropriate
// methods yourself.  Which interface (DMI or RPCManager) you choose is largely a matter of
// preference - they provide equivalent functionality.  Note that there are also several
// approaches for +link{group:nonJavaBackend,non-Java backends} and/or Java backends not
// running the ISC server.
// <p>
// When using DMI, inbound request data is translated to Java objects and passed as method
// parameters to the designated method, with available request data matched to each declared
// parameter by Java type.  The return value of your method is automatically wrapped as a valid
// response and delivered to the browser.
// <P>
// <u><b>DataSource DMI</b></u>
// <br>
// To enable DMI for a given DataSource, simply include a <code>&lt;serverObject&gt;</code>
// configuration block in that DataSource's configuration either at
// +link{DataSource.serverObject} or on a particular operationBinding via
// +link{OperationBinding.serverObject}.  The ServerObject specifies the target of the method
// invocation and +link{OperationBinding.serverMethod} specifies the method that will be
// called.
// <P>
// For example, the following Datasource DMI declaration would route "fetch" operations for
// this DataSource to the method "fetch" on an object stored in the servlet session under the
// name "beanFetcher":
// <pre>
// &lt;DataSource&gt;
//   &lt;operationBindings&gt;
//       &lt;binding operationType="fetch" serverMethod="fetch"&gt;
//           &lt;serverObject  
//                lookupStyle="attribute" 
//                attributeScope="session" 
//                attributeName="beanFetcher"/&gt;
//       &lt;/binding&gt;
//   &lt;/operationBindings&gt;
//   ...
// &lt;/DataSource&gt;
// </pre>
// Method overloading is not supported - there must be exactly one method on the target class
// with the name specified in +link{OperationBinding.serverMethod}.  The method must be public,
// but can be either an instance or static method.  If no operationBinding is specified or the
// operationBinding does not specify a <code>serverMethod</code> then it defaults to the name of
// the operation (eg "fetch").
// <p>
// By default, the DSResponse data sent back by DataSource DMIs is filtered to just the set of
// fields specified on the DataSource.  This allows you to simply return beans that potentially
// have getter methods for fields other than are defined in the DataSource without that
// (potentially private) data being sent to the client.  If you want to disable this
// functionality, you can do so on a per-operation basis by setting
// +link{ServerObject.dropExtraFields}, on a per-DataSource level by setting
// +link{DataSource.dropExtraFields}, or globally by setting the config parameter
// <code>DMI.dropExtraFields</code> to <code>false</code> in
// <code>[webroot]/WEB-INF/classes/server.properties</code>.  Non-DMI DSResponse data is, by
// default, not filtered in this manner for backward compatibility reasons.  If you want to
// enable this type of filtering for non-DMI DSResponse data, you can do so by setting the
// config parameter <code>DSResponse.dropExtraFields</code> to <code>true</code> in
// <code>[webroot]/WEB-INF/classes/server.properties</code>.  <code>DMI.dropExtraFields</code>
// and <code>DSResponse.dropExtraFields</code> can be enabled/disabled independently of each
// other - that is, setting one does not side-effect the other.  <code>server.properties</code>
// settings can be overridden by an explicit setting in +link{dataSource.dropExtraFields} which
// in turn can be overridden by an explicit setting in +link{serverObject.dropExtraFields} (this
// last one for DMI only since non-DMI operations don't have a serverObject context).
// <p>
// <u><b>RPC DMI</b></u>
// <br>
// RPC DMI makes a set of methods from a server-side class available as client-side methods for
// direct invocation.  RPC DMI also uses a +link{ServerObject} configuration block to specify
// the server-side DMI end-point, but in the case of RPCs, the +link{ServerObject} definition
// goes into an <code>rpcBindings</code> section of an <code>Application</code> definition in a
// .app.xml file.  For an example, see the <code>example.app.xml</code> file in the /shared/app
// directory of the SmartClient SDK.  The only difference between the RPC DMI
// ServerObject definition and the DataSource DMI version is the addition of the
// +link{ServerObject.visibleMethods} block that specifies which methods are callable on this
// ServerObject.  This section is not consulted for DataSource DMIs because the
// +link{OperationBinding.serverMethod} is used to specify the callable method in that case.
// <p>
// <u><b>Method Invocation</b></u>
// <br>
// SmartClient can pass a set of stock context variables to your DMI method and also performs
// some type adaptation logic to make this interface more flexible.  For DataSource DMI, you
// can declare your method to take any number of the following types of arguments and they will
// be passed to you:
// <ul>
// <li>HttpServletRequest
// <li>HttpServletResponse
// <li>ServletContext
// <li>HttpSession
// <li>RPCManager
// <li>DSRequest
// <li>RequestContext (from com.isomorphic.servlet)
// <li>DataSource (same as DSRequest.getDataSource())
// <li>Map (same as DSRequest.getValues())
// <li>Bean (auto-populated from DSRequest.getValues())
// </ul>
// DataSource DMI methods can return any of the following types of values:
// <ul>
// <li>DSResponse (used as the DSResponse verbatim)
// <li>List (valid response to a fetch operation - gets auto-popuplated into a DSResponse for
// you via setData())
// <li>Map or Bean (valid response to add, update, remove operations - gets auto-populated
// into a DSResponse for you via setData()).
// </ul>
// Note that to take advantage of some SmartClient features like paging and custom validation,
// you need to return a DSResponse and provide the required metadata (like
// startRow/endRow/totalRows for paging).  You can simply return a <code>List</code> instead,
// but this won't work for large datasets.
// <p>
// So, for example, all of the following DataSource DMI method signatures are valid:
// <pre>
// public List myFetch(Map criteria)
// public List myFetch(SupplyItem criteria)
// public DSResponse myAdd(HttpSession session, 
//                         DataSource ds, 
//                         DSRequest dsRequest)
// </pre>
// <p>
// See
// +externalLink{/examples/server_integration/#customDataSourceIntegrationDMI,the supplyItemDMI example}
// for an example of DataSource DMI.
// <p>
// <p>
// RPC DMIs work slighly differently.  Unlike DataSource DMIs, RPC DMIs can have an arbitrary
// number of required arguments, and also some optional context arguments.  For example, let's
// say you call a method from the client like so (note that there's a cleaner way to invoke
// DMIs if you use the +link{group:loadDMIStubsTag} JSP tag):
// <pre>
// DMI.call("myApp", "com.foo.MyClass", "doSomething",
//          1, "zoo", [1, 2, 3], "clientCallback()");
// </pre>
// The server-side implementation of method <code>doSomething</code> must take a least three
// arguments of the type used above - specifically a Number, String, and List.  SmartClient
// will try to adapt arguments where possible - so for example the first argument can be a Long
// or an Integer instead and the invocation will still work.  Also, an object literal passed
// from the client becomes a Map on the server and will be automatically applied to a bean if
// the method argument takes a Bean in that position.  See +link{RPCRequest.data} for a table
// of type conversions.  You can use native types in the server-side signature for things like
// Integer, Long, etc - so e.g. you can specify your method taking an int or long. In addition
// to the required arguments, you can pass the following optional arguments:
// <ul>
// <li>HttpServletRequest
// <li>HttpServletResponse
// <li>HttpSession
// <li>RPCManager
// <li>RPCRequest
// </ul>
// See
// +externalLink{/examples/server_integration/#genericRPCIntegrationDMI,the getTimeStampDMI example}
// for an example of RPC DMI.
//
// @see group:loadDMIStubsTag
// @see ServerObject    
// @see DataSource.serverObject
// @see OperationBinding.serverObject
//
// @see group:clientServerIntegration
//
// @treeLocation Client Reference/RPC
// @requiresModules SCServer
// @visibility external
//<
isc.defineClass("DMI").addClassProperties({

actionURL: isc.RPCManager.actionURL,
					
//> @classMethod DMI.call()
//
// Calls a server-side DMI method.  At a minimum, you need to specify the appID (.app.xml
// file), +link{serverObject.className} or +link{serverObject.ID} and methodName to call.
// Arguments and callback are optional.  There are two ways to invoke this method:
// <pre>
// DMI.call(appID, className, methodName, 
//          arg1, arg2 ...argN, callback);
// </pre>
// or:
// <pre>
// DMI.call({
//     appID: appID,
//     className: className,
//     methodName: methodName,
//     arguments: [arg1, arg2, ...argN], //optional
//     callback: callback, //optional
//     requestParams: requestProps // optional
// });
// </pre>
// If you use the first signature, you must either specify a callback or if you don't want a
// callback, pass a <code>null</code> as the last argument.  The second signature allows you to
// specify requestParams that are applied to the +link{RPCRequest} generated by this DMI call.
// This allows you to override some defaults - for example to suppress the "Contacting Server"
// prompt, change it's text; change the timeout or set any other property settable on
// +link{RPCRequest}.
// <p>
// Note that you can use the +link{group:loadDMIStubsTag} tag to bind all methods of
// <code>ServerObjects</code> defined in a given .app.xml file and call methods on them
// directly.
//
// @param appID         (string or Object)  the appID (.app.xml file to look in) or comprehensive request
//                          object as documented above.
// @param className     (string)    +link{serverObject.className} or +link{serverObject.ID}
// @param methodName    (string)    the name of the method to call on the serverObject
// @param [args]        (any)    The next N-1 params specify arguments to the server-side method.
// @param callback      (RPCCallback)    The callback of the response.  If you do not want a callback, you
//                          must specify a <code>null</code> value for this parameter when
//                          using the first signature (documented above).
//
// @return (RPCRequest) the RPCRequest that was sent to the server.
//
// @visibility external
//<
call : function (appID, className, methodName) {

    // arguments isn't a real array so methods like slice() that we use below don't work on it
    // - so make a real array
    var args = [];
    for (var i = 0; i < arguments.length; i++) args[args.length] = arguments[i];

    // two invocation styles: can pass an object literal that is the dmi request or as the
    // documented above for external consumption
    var request = {};
    if (isc.isAn.Object(appID) && args.length == 1) {
        // internal signature
        // appID = {
        //   appID: x,
        //   className: x,
        //   methodName: x,
        //   arguments: [],
        //   callback: x,
        //   requestParams: {}
        // }
        
        // don't modify user object - clone it
        var requestData = isc.clone(appID);
        if (requestData.requestParams) {
            isc.addProperties(request, requestData.requestParams);
            delete requestData.requestParams;
        }
        request.callback = requestData.callback;
        delete requestData.callback;
        
        request.data = requestData;
    } else {
        // external style - as in method signature
        // all following args except last = arguments
        // lastArg = callback - must be specified, but can be null
        //
        request.data = {
            appID: appID,
            className: className,
            methodName: methodName,
            // the next argument.lenght-1 args are method arguments
            arguments: args.slice(3, args.length-1)
        };
        // and the last is a callback.
        request.callback = args[args.length-1]
    }
    
    // force arguments to an array - that's what the server expects
    args = request.data.arguments;
    if (!isc.isAn.Array(args)) {
        if (args == null) args = [];
        else args = [args];
    }
    request.data.arguments = args;

    // mark this as a DMI RPC so the server can figure it out
    request.data.is_ISC_RPC_DMI = true;

    // expose appID, className, methodName in query string.  Useful for looking at timing
    // output of proxy-based performance testing tools like JMeter where parsing the
    // request to get this data is a pain.
    if (this.addMetaDataToQueryString) {
        if (!request.queryParams) request.queryParams = {};
        isc.addProperties(request.queryParams, {
            dmi_appID: request.data.appID,
            dmi_class: request.data.className,
            dmi_method: request.data.methodName
        });
    }
    return isc.RPCManager.sendRequest(request);
},

//> @groupDef loadDMIStubsTag
//
// <i>produces:</i> JavaScript
// <p>
// Creates global bindings for all serverObjects defined in the <code>rpcBindings</code>
// section of the .app.xml file specified by the <code>ID</code> or <code>name</code> attribute of
// this tag.  Once you've loaded your <code>rpcBindings</code> using this tag, you can call
// methods on the <code>ServerObjects</code> defined there directly.  For example, you can load
// the example.app.xml (located in /shared/app directory of the webRoot of the SDK) like this:
// <pre>
// &lt;isomorphic:loadDMIStubs ID="example"/&gt;
// </pre>
// Whereas using +link{DMI.call} you would have had to invoke the <code>getTimeStamp</code>
// method like this:
// <pre>
// DMI.call("example", "GetTimeStampDMI", "getTimeStamp", new Date(), "alert(data)";
// </pre>
// Having loaded the stubs of the <code>example</code> .app.xml, you can then call
// <code>getTimeStamp</code> like this:
// <pre>
// GetTimeStampDMI.getTimeStamp(new Date(), "alert(data)");
// </pre>
// or this:
// <pre>
// GetTimeStamp.getTimeStamp({
//     arguments: [new Date()],
//     callback: "alert(data)"
// });
// </pre>
// or this:
// <pre>
// GetTimeStamp.call({
//     methodName: "getTimeStamp",
//     arguments: [new Date()],
//     callback: "alert(data)"
// });
// </pre>
// As with +link{DMI.call}, the last argument must be the callback - if you don't want a
// callback, simply specify <code>null</code> as the callback.  The name of the global binding
// created will be the same as the +link{ServerObject.ID} or the non-qualified name of the
// +link{ServerObject.className} (java namespace, if any, will be stripped).
// <p>
// <b><u>Tag Attributes:</u></b>
// <p>
// <b>ID or name</b><br>
// <i>value format</i>: String - name of .app.xml file to load (minus the .app.xml extension)<br>
// <i>default value</i>: NONE
// <p>
// This attribute specifies the name of the file that contains the rpcBindings to load.
// UI files are located in <code>[webroot]/shared/app</code> by default.  This location is
// changeable in <code>[webroot]/WEB-INF/classes/server.properties</code> by setting the config
// parameter <code>project.apps</code> to the directory where your .app.xml files are located.   
// We recommend that for prototying, at least, you use the default directory.
//
// @see DMI
//
// @visibility external
// @requiresModules SCServer
// @treeLocation Java Server Reference/SmartClient JSP Tags
// @title &lt;isomorphic:loadDMIStubs&gt;
//<

// template used to generate method bindings.  firstArg can be an object literal, in which case
// that's passed directly to isc.DMI.call() - otherwise the arguments array is the set of
// arguments to pass to the target method
callTemplate : "(function(){var x = function (firstArg) { "
        // isCall specifies whether this is a generic call() binding - where the methodName
        // must be passed in as the first arg or a named call() binding where the methodName
        // will be encoded into this template
        +"var isCall = ${isCall};"
        +"var obj = isc.addProperties({}, this.requestParams);"
        // copy arguments to array - for some reason we can't call standard array methods on
        // the arguments object.
        +"if(isc.isAn.Object(firstArg) && arguments.length == 1){"
        // for isCall == true, the methodName must be supplied in the obj that is the firstArg,
        // so setting it to 'firstArg' here is harmless
//        +"isc.addProperties(obj,{appID:'${appID}',className:'${className}',methodName:'${methodName}',arguments:firstArg.arguments});"
        +"isc.addProperties(obj,{appID:'${appID}',className:'${className}',methodName:'${methodName}'},firstArg);"
        +"} else {"
        +"var args = [];for (var i = 0; i < arguments.length; i++) args[args.length] = arguments[i];"
        // switch on isCall to treat the first argument either as the method name (isCall ==
        // true) or as part of the arguments array
        +"isc.addProperties(obj,{appID:'${appID}',className:'${className}',methodName:isCall?firstArg:'${methodName}',"
                               +"arguments:args.slice(isCall ? 1 : 0,args.length-1),callback:args[args.length-1]});"
        +"}isc.DMI.call(obj);"
        +"};return x;})()",
// returns an object on which you can directly invoke the methods passed in here - those are
// plumbed through to isc.DMI.call()
bind : function (appID, className, methods, requestParams) {
    //!OBFUSCATEOK
    if (!isc.isAn.Array(methods)) methods = [methods];

    // this is the class we'll be returning
    var binding = isc.defineClass(className).addProperties({
        requestParams : requestParams
    });
    
    // bind the special 'call' method that works just like DMI.call(), but with the first
    // argument being the methodName to call
    var callArgs = {appID: appID, className: className, methodName: "firstArg", isCall: true};
    binding.call = isc.eval(this.callTemplate.evalDynamicString(this, callArgs));

    // bind all other named methods.  Note that if the user specifies a method named 'call'
    // then it will clobber the generic call binding above
    for (var i = 0; i < methods.length; i++) {
        var bindingArgs = {appID: appID, className: className, methodName: methods[i], isCall: false};
        binding[methods[i]] = isc.eval(this.callTemplate.evalDynamicString(this, bindingArgs));
    }
    window[className] = binding;
    return binding;
},

makeDMIMethod : function (appID, className, isCall, methodName) {
    //!OBFUSCATEOK
    var callArgs = {appID: appID, className: className, isCall: isCall,
                   methodName: isCall ? "firstArg" : methodName};
    return isc.eval(this.callTemplate.evalDynamicString(this, callArgs));
}

});

isc.DMI.callBuiltin = isc.DMI.makeDMIMethod("isc_builtin", "builtin", true);

