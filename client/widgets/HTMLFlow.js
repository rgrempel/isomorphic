/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2011-01-05 (2011-01-05)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */

 




// HTMLFlow / HTMLPane
// ---------------------------------------------------------------------------------------
// Behaviors in these classes are slated to be moved down to Canvas.  Theses class principally
// exist as a way of organizing functionality for more useful defaults, documentation, tool and
// skinning purposes.

//>	@class	HTMLFlow
//
// Use the HTMLFlow component to display HTML content that should expand to its natural size
// without scrolling.  
// <p>
// HTML content can be loaded and reloaded from a URL via the property
// <code>contentsURL</code>.  This method of loading is for simple HTML content
// only; SmartClient components should be loaded via the +link{class:ViewLoader} class.
// <P>
// NOTE: Since the size of an HTMLFlow component is determined by its HTML contents, this
// component will draw at varying sizes if given content of varying size.  When using HTMLFlow
// components within a Layout, consider what will happen if the HTMLFlow renders at various
// sizes.  An HTMLFlow which can expand should be placed in a container where other components
// can render smaller, where the container is allowed to scroll, or where there is padding to
// expand into.
// 
// @group contentLoading
// @treeLocation Client Reference/Foundation
// @visibility external
// @example htmlFlow
//<
isc.ClassFactory.defineClass("HTMLFlow", "Canvas");

isc.HTMLFlow.addClassMethods({


  
//> @classMethod htmlFlow.executeScript() (A)
// Given a block of HTML extract any JavaScript from it (including script loaded from external 
// files via <code>script src=...</code> tags), and execute it.<br>
// Note: This method will be asynchronous if script blocks needs to be loaded from the server.
// @param html (HTML) Block of HTML from which script tags will be extracted and executed
// @param callback (callback) Callback to fire when the script has been executed. If a
//  script error occurred during execution, it will be passed to this parameter as the
//  first parameter <code>error</code>
// @param [displayErrors] (boolean) By default script errors encountered executing the
//  extracted script will be logged to the developer console. Pass in a false value for this
//  parameter to suppress this behavior
// @visibility internal
//<
// Not currently used anywhere
_scriptID:0,
_executeContext:[],
executeScript : function (html, callback, displayErrors) {
    this._executeContext[this._scriptID] = {callback:callback, displayErrors:displayErrors};
    this._scriptID++;
    this.getScript(
        html, 
        "isc.HTMLFlow._completeExecuteScript(" + this._scriptID + ",htmlFragments, scripts);"
    );
},

// helper for asynchronous executeScript() method
_completeExecuteScript : function (scriptID, htmlFragments, scripts) {
    var context = this._executeContext[scriptID];
    delete this._executeContext[scriptID];
    // reset scriptID to 0 if we've got no other outstanding executions so we dont let
    // the array get large
    var empty=true;
    for (var i = 0; i < this._executeContext.length; i++) {
        if (this._executeContext[i] != null) {
            empty = false;
            break;
        }
    }
    if (empty) this._scriptID = 0;
    
    isc.Class.globalEvalWithCapture(scripts, context.callback, null, context.displayErrors);
},
    

//> @classMethod htmlFlow.getScript() (A)
// Retrieves any JavaScript embedded in a snippet of HTML as a string of script that
// can be executed.
// <P>
// If the HTML contains a <code>&lt;script src=...</code> tag, this method will load that external
// script file, extract its contents and included it in the returned block of script.
// <P>
// Note that since the script may have to be loaded from the server, this method may be
// asynchronous.
//
// @param html (HTML) Snippet of HTML to retrieve the script from
// @param callback (callback) callback fired when the script has been retrieved. Parameters
//    passed to this callback are <code>html</code> [the block of html] and <code>script</code>
//    [the script].
// @param [extractScriptFromHTML] (boolean) Should the <code>html</code> parameter passed to
//    the callback include the extracted script blocks, or have them removed.
// @visibility internal
//<
// Used by _loadContentReply
getScript : function (html, callback, extractScriptFromHTML, dontFetchScripts) {    
    // Make a copy of the HTML for us to return if extractScriptFromHTML if false
    var originalHTML = html;

    // Strip all <!-- --> comment blocks from the html before extracting script tags so we
    // only get script that would natively execute
    
    var commentStart, commentEnd,
        commentStartIndex, commentEndIndex;
        
    while ((commentStart = html.match(/<!--/i)) != null) {
        commentEnd = html.match(/-->/i);
        if (commentEnd == null || (commentEnd.index < commentStart.index)) {
            this.logWarn('HTMLFlow content contains an opening comment tag "<!--"' + 
                    ' with no closing tag "-->", or vice versa. We recommend you review this ' +
                    'HTML (original HTML follows):\n'
                    + originalHTML);
            // strip the mismatched comment tag from the working html as if it were a 
            // full comment block
            if (commentEnd) {
                commentStartIndex = commentEnd.index;
                commentEndIndex = commentStartIndex + 3;
            } else {
                commentStartIndex = commentStart.index;
                commentEndIndex = commentStartIndex + 4;
            }
        } else {
            commentStartIndex = commentStart.index;
            commentEndIndex = commentEnd.index + 3;
        }        
        html = html.slice(0, commentStartIndex) + html.slice(commentEndIndex, html.length);
    }
    
    
    // parse out <SCRIPT> blocks to eval later.
    var scripts = []; // script accumulator
    var scriptIncludes = []; // src= values
    
    var htmlFragments = [];
    var htmlRemaining = html;
    html = null;

    var scriptStart;

    // match the start of a <script> block: note that the script block can contain a type or
    // language or type specifier or a src=
    while ((scriptStart = htmlRemaining.match(/(<script([^>]*)?>)/i)) != null) {
        var scriptStartTag = scriptStart[1];
        
        // chop out the opening script tag, then pick up the closing script tag.
        // If we hit another opening script tag before the closing tag, or can't find a
        // closing tag, log a warning and continue.
        htmlFragments.add(htmlRemaining.slice(0, scriptStart.index));
        scripts.add(null);
        scriptIncludes.add(null);
        htmlRemaining = htmlRemaining.slice(
            scriptStart.index+ scriptStartTag.length, htmlRemaining.length)
                
        // match the end of the script block
        var scriptEnd = htmlRemaining.match(/<\/script>/i),
            nextScriptStart = htmlRemaining.match(/(<script([^>]*)?>)/i);

        if (scriptEnd == null || (nextScriptStart && (scriptEnd.index > nextScriptStart.index))) {
            this.logWarn("HTMLFlow content contains an opening <script ...> tag " + 
                    "with no closing tag, or vice versa. Stripping out this tag:" + scriptStartTag);
            continue;
        }

        // the script block is the stuff inside the <script></script> brackets
        var scriptBlock = htmlRemaining.slice(0, scriptEnd.index);

        // pull the script block we just matched out of the html stream so we can match
        // additional script blocks and because it's possible that rendering the script blocks
        // will get the executed - which we don't want because we'll be evaling them ourselves.
        htmlRemaining = htmlRemaining.slice(scriptEnd.index+9, htmlRemaining.length);

        // only append script blocks containing JS code.  A js script block either does not
        // specify type/language, or has a type=/language= that 
        // contains javascript, jscript, or ecmascript
        var isJS = (scriptStartTag.match(/<script\s*(language|type)/i) == null) ||
                   (scriptStartTag.match(/<script\s*(language|type)\s*=["']?[^'"]*(javascript|ecmascript|jscript)[^'"]*["']?/i) 
                     != null);
 
        // override point for excluding scripts                      
        if (!this.shouldLoadScript(scriptStartTag)) continue;

        if (isJS) {
            var srcMatch;
            if (srcMatch = scriptStartTag.match(/src=('|")?([^'"> ]*)/i)) {
                scriptIncludes.add(srcMatch[2]);
                scripts.add(null);
            } else { 
                // avoid empty script blocks which can lead to hangs
                if (!isc.isA.String(scriptBlock) || isc.isAn.emptyString(scriptBlock)) continue;
                // slot this script into our script accumulator
                scripts.add(scriptBlock);
                scriptIncludes.add(null);
            }
            htmlFragments.add(null);
        } else {
            // Warn (rather than just logInfo) if we hit non JS script tags since functionality
            // could actually be lost from the HTML in some cases
            this.logWarn("html to be evaluated contains non-JS script tags - these will be"
                         + " ignored.  Tag: " + scriptStartTag);
        }
    }
    
    // if scriptStart never matched, set htmlFragments to the entire html text
    if (htmlFragments.length == 0)
        htmlFragments = [ htmlRemaining ];
    else
        htmlFragments.push(htmlRemaining);
        
    // If we had any 'script src=...' tags, we need to load their contents and fold it into
    // the script to evaluate
    
    if (scriptIncludes.length > 0 && !dontFetchScripts) {
        if (isc.RPCManager) {
            var loadingScripts = false;
            for (var i = 0; i < scriptIncludes.length; i++) {
                // it's a sparse array
                if (scriptIncludes[i] == null) {
                    continue;
                }
                isc.RPCManager.sendRequest(
                    {actionURL: scriptIncludes[i], serverOutputAsString:true, httpMethod:"GET",
                     clientContext:{
                        scriptIndex:i, scripts:scripts, scriptIncludes:scriptIncludes, 
                        callback:callback, 
                        htmlFragments:(extractScriptFromHTML ? htmlFragments : [originalHTML])
                     },
                     callback:"isc.HTMLFlow.loadedRemoteScriptBlock(data, rpcResponse.clientContext)"
                    }
                );
                loadingScripts = true;
            }
            // wait for the script files to be loaded (asynchronous) before firing the 
            // 'completion' method            
            if (loadingScripts) return;
        } else {
            // Warn the user that their non-JS code and JS code loaded via SCRIPT SRC= will not execute.
            this.logWarn("html contains <script src=> blocks with the "
                        +"following target URLs: " + scriptIncludes + " If you want "
                        +"these to be dynamically loaded, please include the "
                        +"DataBinding module or include the contents of "
                        +"these files in inline <script> blocks.");
        }
    }
    // In this case we have no script src =, so we can synchronously fire the callback
    var script = scripts.join("\n");

    this.fireCallback(callback, "htmlFragments,scripts", 
        [extractScriptFromHTML ? htmlFragments : [originalHTML], 
        scripts]);
},

// whether we should load a script based on the <SCRIPT> tag (passed as first argument)
shouldLoadScript : function (scriptStartTag) {
    // skip loading SmartClient modules that are already loaded
    var iscMatch = scriptStartTag.match(/ISC_([^.]*)\.js/i);        
    if (iscMatch && isc["module_" + iscMatch[1]]) return false;

    // skip loading other skins or loading the skin twice.  Among many other problems, loading
    // a skin twice could change defaults like showEdges, causing components to assume they have
    // edges that they don't.
    var iscMatch = scriptStartTag.match(/load_skin\.js/i);        
    if (iscMatch) return false;

    return true;
},

// Helper for 'getScript()' to fold the contents of (asynchronously loaded) javascript files
// into any inline script blocks encountered in html passed to that method.
loadedRemoteScriptBlock : function (script, context) {    
    var scriptIndex = context.scriptIndex,
        scripts = context.scripts,
        scriptIncludes = context.scriptIncludes;
    
    scripts[scriptIndex] = script;
    delete scriptIncludes[scriptIndex];
    
    // Check whether we've loaded all outstanding scripts from the original request
    for (var i = 0; i < scriptIncludes.length; i++) {
        if (scriptIncludes[i] != null) return;
    }
    this.fireCallback(context.callback, "htmlFragments,scripts", 
        [context.htmlFragments, scripts]);
}


});

isc.HTMLFlow.addProperties({

defaultWidth:200,
defaultHeight:1,

// both children and content will exist when both HTML code and SmartClient script blocks
// exist in the contents
allowContentAndChildren : true,

// enable text selection and i-beam cursor for HTMLFlow and HTMLPane contents
cursor:"auto",


//>	@attr htmlFlow.contents		(string : "&nbsp;" : [IRW])
// @include canvas.contents
//<

//> @attr htmlFlow.dynamicContents (boolean : false : IRWA)
//	@include canvas.dynamicContents
//<

//> @attr htmlFlow.contentsURL    (URL : null : IRW)
// URL to load content from.
// <P>
// If specified, this component will load HTML content from the specified URL when it is
// first drawn.
// <p>
// This feature relies on the XMLHttpRequest object which can be disabled by end-users in some
// supported browsers.  See +link{group:platformDependencies} for more information.
//
// @group contentLoading
// @visibility external
//<
// NOTE: to load content before draw, or refresh contents from the server after draw
// setContentsURL() can be called manually.

//> @attr htmlFlow.loadingMessage      (HTML : "&amp;nbsp;\${loadingImage}" : IRW)
// HTML to show while content is being fetched, active only if the <code>contentsURL</code>
// property has been set.
// Use <code>"\${loadingImage}"</code> to include +link{Canvas.loadingImageSrc,a loading image}.
// <P>
// The loading message will show both during the initial load of content, and during reload if
// the contents are reloaded or the contentsURL changed.  For a first-time only loading
// message, initialize the <code>contents</code> property instead.<br>
// Note: the <code>loadingMessage</code> is never displayed when loading complete web pages 
// rather than HTML fragments (see +link{HTMLFlow.contentsType}).
//
// @group contentLoading
// @visibility external
//<
// NOTE: no setter, intended usage is to setLoadingMessage then call setContentsURL()
loadingMessage: "&nbsp;${loadingImage}",

//> @attr htmlFlow.contentsURLParams   (Object : null : IRW)
// Parameters to be sent to the contentsURL when fetching content.
// @group contentLoading
// @visibility external
//<
// Intended usage: specifying something like a chartId for a dynamically loaded and reloaded
// server-generated chart.
//contentsURLParams: null,

//> @attr htmlFlow.httpMethod         (SendMethod : "GET" : IRW)
// Selects the HTTP method that will be used when fetching content.  Valid values are "POST"
// and "GET".
// @group contentLoading
// @visibility external
//<
httpMethod:"GET", // default would POST

//> @attr htmlFlow.contentsType       (String : null : IR)
// The default setting of 'null' or 'fragment' indicates that HTML loaded from
// +link{contentsURL} is assumed to be an HTML fragment rather than a complete page.  Set to
// "page" to load HTML as a standalone page, via an IFRAME.  
// <P>
// <code>contentsType:"page"</code> should only be used for controlled HTML content, and only
// when such content cannot be delivered as an HTML fragment instead (the default).  To
// dynamically load SmartClient components, use +link{ViewLoader}, <b>never</b> this mechanism
// (click +link{group:noFrames,here} for why).
// <P>
// Loading HTML content as a fragment is less resource intensive and avoids visual artifacts
// such as translucent media becoming opaque or disappearing when placed over an IFRAME.  
// <P>
// Loading third-party, uncontrolled content could lead to the surrounding page disappearing if
// a user clicks on an HTML link with <code>target=_top</code>.
// <P>
// With <code>contentsType:"page"</code>, +link{loadingMessage} is not supported, and only
// "GET" is supported for +link{httpMethod,httpMethod}.
//
// @group contentLoading
// @visibility external
//<

useSimpleHttp:true, // don't send stuff that RPC layer usually sends (serialized transaction, etc)

//> @attr htmlFlow.allowCaching (boolean : false : IR)
// By default an HTMLFlow will explicitly prevent browser caching.
// <P>
// Set to true to allow browser caching <b>if the browser would normally do so</b>, in other
// words, if the HTTP headers returned with the response indicate that the response can be
// cached.
//
// @visibility external
//<

// custom properties for RPC.  Maybe be needed in the future for cache control, etc
//contentRPCProperties: null,

//> @attr htmlFlow.evalScriptBlocks (boolean : true : IR)
// If <code>evalScriptBlocks</code> is true, HTMLFlow will pre-process the loaded HTML in order to
// mimic how the HTML would execute if it were loaded as an independent page or loaded via an
// IFRAME.  
// <P>
// This feature is intended to assist with migrating existing applications to SmartClient.
// <P>
// Note that, if evalScriptBlocks is false, &lt;SCRIPT&gt; blocks will still be detected and disabled
// to avoid the inconsistent results across different browsers.
// <P>
// Only applies when contentsType is <b>not</b> "page".
//
// @group contentLoading
// @visibility external
//<
evalScriptBlocks: true,

//> @attr htmlFlow.captureSCComponents (boolean : true : IR)
// If true, SmartClient components created while executing the loaded HTML are captured
// for rendering inside the HTMLFlow.
// <P>
// Only applies when contentsType is <b>not</b> "page".
//
// @group contentLoading
// @visibility external
//<
captureSCComponents: true
});

isc.HTMLFlow.addMethods({

initWidget : function () {
    // We can't auto-size to the contents of the IFRAME at present. When we contain an
    // IFRAME, the only meaningful overflows are "auto" or "hidden" because "visible" produces
    // inconsistent results that you would never want (never overflows in FF, oveflows to 200px
    // in IE).
    //
    // overflow: "auto" correctly introduces a native scrollbar on the IFRAME when its content
    // exceeds the space allocated to this component, but this component overflows to the max
    // space allowed by its container - which is generally what the user wants.
    //
    // ovefflow: "hidden" works like "auto", but native IFRAME scrollbars are suppressed.  This
    // is controlled in Canvas.getIFrameHTML by setting the "scrolling" property of the IFRAME.
    if (this.contentsType == "page" && this.overflow == "visible") this.setOverflow("auto");
},

// Don't load content until draw to allow declarative delayed loading
draw : function () {
    if (!this.readyToDraw()) return this;
    this.Super("draw", arguments);

    // in this case content isn't loaded until draw, when the IFRAME is created.
    // NOTE: actual code for this resides in Canvas
    var undef;
    if (this.containsIFrame()) return this; 
    else if (this.canSelectText === undef) this.canSelectText = true;

    // this will cause contents to be loaded if they are not already loading
    if (this.contentsURL && 
        !(this._loadedContentsURL == this.contentsURL || this.loadingContent()))
    {
        this.setContentsURL();
    }
    return this;
},
    
//> @method htmlFlow.setContentsURL()
// Change the URL this component loads content from.  Triggers a fetch for content from the new
// URL.
// <p>
// Can also be called with no arguments to reload content from the existing +link{contentsURL}.
// <P>
// This feature relies on the XMLHttpRequest object which can be disabled by end-users in some
// supported browsers.  See +link{group:platformDependencies} for more information.
//
// @param [url]    (URL)      URL to retrieve contents from
// @param [params] (Object)   Parameters to send to the contentsURL.  Merged with
//                            <code>component.contentsURLParams</code> if both are set.
// @group contentLoading
// @visibility external
// @example loadHtmlPages
//<
setContentsURL : function (url, params, rpcProperties) {

    // for IFRAME-based loading, leave it up to Canvas code
    if (this.contentsType == "page") {
        return this.invokeSuper(isc.HTMLFlow, "setContentsURL", url, params);
    }

    // store new URL
    if (url != null) this.contentsURL = url; 

    // during the reload, re-show the loading message
    if (this.loadingMessage) {
        var processedLoadingMsg = this.loadingMessage.evalDynamicString(this, {
            loadingImage: this.imgHTML(isc.Canvas.loadingImageSrc, 
                                       isc.Canvas.loadingImageSize, 
                                       isc.Canvas.loadingImageSize)});
        this.setContents(processedLoadingMsg);
    }

    var allParams = isc.addProperties({}, this.contentsURLParams, params),
        useSimpleHttp = this.useSimpleHttp,
        httpMethod = this.httpMethod,
        serverOutputAsString = true;

    

    var reloadRequest = isc.addProperties({
        showPrompt:false,
        actionURL: this.contentsURL,
        httpMethod: httpMethod,
        useSimpleHttp: useSimpleHttp,
        // IE caches very aggressively by default, which can be confusing, so disable caching
        // unless this (currently undocumented) flag is set
        bypassCache: !this.allowCaching,
        params: allParams
    },
    this.contentRPCProperties, // widget rpc properties
    rpcProperties, // method rpc properties
    // non-overrideable
    {
        willHandleError: true,        
        serverOutputAsString: serverOutputAsString,
        callback: this.getID()+"._loadContentReply(rpcRequest, rpcResponse)"
    });

    // remember the transactionNum so we load the last request only
    this._loadNumber = isc.rpc.sendProxied(reloadRequest, true).transactionNum;
    
},

//> @method htmlFlow.loadingContent() (A)
// Returns true if this htmlFlow is currently loading content from the server.<br>
// Note: Does not apply to htmlFlows with +link{htmlFlow.contentsType, contentsType} set to 
// <code>"page"</code>
//
// @group contentLoading
// @see htmlFlow.contentLoaded()
// @visibility external
//<
loadingContent : function () { return this._loadNumber != null; },
    
_loadContentReply : function (rpcRequest, rpcResponse) {
    
    //!OBFUSCATEOK
    var html = rpcResponse.data;

    if (rpcResponse.status != isc.RPCResponse.STATUS_SUCCESS) {        
        if (this.handleError(rpcRequest, rpcResponse) === false) return;
    }

    // handles case of setContentsURL() being called while we're fetching from some other URL
    if (rpcRequest.transactionNum != this._loadNumber) {        
        return;
    }
    // We need to execute Script embedded in the HTML [which we may have to load asynchronously from
    // script src=... tags].  
    // Steps:
    // 1: Extract any script tags from the HTML and store them
    
    // 2: Set our contents to match the sanitized HTML 
    // 3: Execute scripts
    isc.HTMLFlow.getScript(html, {target:this, methodName:"_setContentsAndExecute"}, 
                           true, !this.evalScriptBlocks);
},

_relPosID: 0,
_captureSCComponentsRelPos : function (component) {
    if (!component.parentElement) this.addChild(component);

    var componentID = "HTMLFlow" + this._relPosID++;
    component.htmlElement = componentID;
    var returnHtml = '<DIV id="' + componentID + '"></DIV>';
    return returnHtml;
},

_captureSCComponentsAbsPos : function (component) {
    if (!component.parentElement) this.addChild(component);
    return null;
},

// setContentsAndExecute - helper method for 'loadContentReply()' when we have
// separated any JS from the HTML
_setContentsAndExecute : function (htmlFragments, scripts) {    
    // render the html
    
    this.setContents(this.transformHTML(htmlFragments.join("")));
    
    // Any split of htmlFragments into multiple entries must imply that a script was
    // found that must be executed.
    if (htmlFragments.length > 1) {
        if (this.evalScriptBlocks) {
            // At this point we know we don't have any script src=... blocks
            // If we have any inline script, eval it now.
            if (this.isDirty()) this.redraw();
            
            if (this.captureSCComponents) {
                this._oldAutoDraw = isc.Canvas.autoDraw;
                isc.setAutoDraw(false);
            }

            for (var i=0; i<htmlFragments.length; i++) {
                // put together a callback that writes directly into htmlFragments.
                // (but if !captureSCComponents, don't.)
                var callback = null;
                var mythis = this;
                if (this.captureSCComponents) callback = function (globals, error) {
                    if (!globals.length) return;
                    htmlFragments[i] = globals.map(function (newGlobalID) {
                        var newGlobal = window[newGlobalID];
                        if (!newGlobal || !isc.isA.Canvas(newGlobal)) return null;
                        if (newGlobal.position == isc.Canvas.RELATIVE) 
                                return mythis._captureSCComponentsRelPos(newGlobal); 
                        else    return mythis._captureSCComponentsAbsPos(newGlobal);
                    }).join("");
                };
                
                // note that this relies on the callback being executed
                // synchronously
                if (scripts[i]) isc.Class.globalEvalWithCapture(scripts[i], callback);
            }
            
            if (this.captureSCComponents) {
                this.setContents(this.transformHTML(htmlFragments.join("")));
                if (this._oldAutoDraw) {
                    // Reenable autodraw and redraw everything that originally
                    // had autodraw enabled
                    isc.setAutoDraw(true);
                    for (var global in window)
                        if (isc.isA.Canvas(global) && global.autoDraw)
                            global.markForRedraw();
                }
            }
        } //>DEBUG
        else {
            this.logWarn("html returned by server appears to contain <script> blocks.  " +
                "If you want these to be evaluated, you must set evalScriptBlocks:true.");
        }
        //<DEBUG
    }
    this._loadContentsReplyComplete();    
    
},


//> @method htmlFlow.handleError()
//
// This method is called when a transport error occurs.  Typically, this is the result of the
// server returning an HTTP error code such as 404 - document not found.  You can inspect the
// RPCResponse object for the reasons for the error and take appropriate action.  Typical
// properties to look at are rpcResponse.status, and rpcResponse.httpResponseCode.
// <p>
// This method is called from the response processing pipeline.  If you want to provide your
// own HTML response that should be rendered into this component as the result of the error,
// you can do so by setting rpcResponse.data to your HTML string.  Returning false from this
// method suppresses any further response handling.  The default implementation of this method
// causes an error message to be logged to the Developer Console and sets the HTML to the error
// string.
//
// @param rpcRequest    (RPCRequest)      The RPCRequest that was made to the server
// @param rpcResponse   (RPCResponse)     The RPCResponse that was received
//
// @return (boolean) false to suppress further response processing
// 
// @group contentLoading
// @visibility external
//<
handleError : function (rpcRequest, rpcResponse) {
    this.logWarn(rpcResponse.data);
},

_loadContentsReplyComplete : function () {    
    this._loadedContentsURL = this.contentsURL;
    this._loadNumber = null;
    this.contentLoaded();
},

//> @method htmlFlow.transformHTML()
// Override to modify the loaded HTML before it is rendered.
//
// @param html (HTML) the html as loaded from the server
// return (HTML) html to be rendered
// @group contentLoading
// @visibility external
//<
transformHTML : function (html) {
    return html;
},

//> @method htmlFlow.contentLoaded()
// StringMethod fired when content is completely loaded in this htmlFlow. Has no default 
// implementation. May be observed or overridden as a notification type method to fire custom
// logic when loading completes.
// <P>
// Note: Does not apply to htmlFlows with +link{htmlFlow.contentsType, contentsType} set 
// to <code>"page"</code>
//
// @group contentLoading
// @visibility external
//<
contentLoaded : function () { },

modifyContent : function () {
    
    this._updateFloat();
}

});

isc.HTMLFlow.registerStringMethods({

    // contentLoaded takes no arguments
    contentLoaded:""

})

//> @class HTMLPane
// Use the HTMLPane component to display HTML content in a pane of specified size. If the HTML
// content is larger than the size of the pane, the pane will provide scrollbars for viewing
// clipped content.
// <P>
// You can set the size of an HTMLPane directly via the width and height properties, or
// indirectly by placing the HTMLPane in a container component (+link{Layout}, +link{Window}, 
// +link{SectionStack}, etc) that manages the sizes of its members.
//
// @treeLocation Client Reference/Foundation
// @visibility external
// @example htmlPane
//<

isc.defineClass("HTMLPane", isc.HTMLFlow).addProperties({ 
overflow:isc.Canvas.AUTO,
defaultHeight:200 
});

