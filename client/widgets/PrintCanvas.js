/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2010-05-15 (2010-05-15)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */
//> @object PrintProperties
// Settings for generating printable HTML for components.
// @group printing
// @visibility external
//<

//> @attr printProperties.omitControls (Array of String : null : IR)
// An array of Strings indicating the classNames of controls that should be omitted from
// printing.  By default, <code>omitControls</code> includes all button-based controls, menus
// and similar interactive controls that are typically useless in printed output.
// <P>
// All subclasses of the specified classes are also omitted.
// <P>
// See also +link{includeControls}.
//
// @group printing
// @visibility external
//<

//> @attr printProperties.includeControls (Array of String : null : IR)
// An array of Strings indicating the classNames of controls that should be specifically
// included when printing, even if a superclass is listed in +link{omitControls}.
//
// @group printing
// @visibility external
//<

//> @class PrintCanvas
// PrintCanvas is a subclass of canvas which renders printable content HTML and 
// provides APIs for printing this content as a separate document.
// @visibility external
// @group printing
//<
isc.defineClass("PrintCanvas", "Canvas").addProperties({

redrawOnResize: false,
overflow: "hidden",

initWidget : function () {
    this.Super("initWidget", arguments);    
},


useExplicitHeight:isc.Browser.isSafari,

resized : function () {
    if (this.useExplicitHeight) {
        var handle = this.getIFrameHandle();
        if (handle) {
            handle.style.width = this.getInnerWidth();
            handle.style.height = this.getInnerHeight();
        }
    }
},

getInnerHTML : function () {
    var width = "100%", height = "100%";
    if (this.useExplicitHeight) {
        width = this.getInnerWidth();
        height = this.getInnerHeight();
    }
    return "<iframe height='" + height + "' width='" + width + "' scrolling='auto' id='"
        + this.getIFrameID()+"'"+" frameborder='0'" +" src=\"" +this.getPrintFrameURL(this.title)+"\"></iframe>";
},

getIFrameID : function () {
    return this.getID()+"_frame";
},  

//> @attr printCanvas.printFrameURL (String : "[HELPERS]printFrame.html" : IRA)
// Location of the special printFrame html file provided as part of the SmartClient libraries.
// This file must be present at the specified location for the printCanvas printing APIs.
// @visibility external
//<
printFrameURL:"[HELPERS]printFrame.html",

getPrintFrameURL : function (title) {
    return  isc.Page.getURL(this.printFrameURL + "?id="+this.getID() +
                            "&title=" + (title || ""));
},

getIFrameHandle : function () {
    return document.getElementById(this.getIFrameID());
},

getIFrameWindow : function () {
    return this.getIFrameHandle().contentWindow;
},

iframeLoad : function () {
    this.iframeLoaded = true;
},

//> @method printCanvas.setHTML()
// Update the HTML content displayed in this print canvas. If the printCanvas is not yet
// drawn the HTML will be displayed when the canvas is drawn.
//
// @param HTML (String) HTML to show in this print canvas
// @param callback (callback) callback function to fire when the HTML is displayed. The
//  callback will be passed a pointer to this print canvas as the first parameter with the
//  name <code>printPreview</code>. If this canvas is not drawn when this method is called,
//  the callback will not be fired until the canvas is drawn and the HTML rendered out into
//  the page.
// @visibility external
//<
setHTML : function (HTML, callback) {
    if (!this.isDrawn()) {
        this._undrawnHTMLContext = {
            HTML:HTML,
            callback:callback
        };
        return;
    }
    if (!this.iframeLoaded) {
        this.delayCall("setHTML", [HTML, callback], 100);
        return;
    }

    var frame = this.getIFrameWindow();
    frame.assignHTML(HTML);
    this.fireCallback(callback, ["printPreview","callback"], [this, callback]);
},

// override draw to assignHTML specified before draw.
draw : function () {
    this.Super("draw", arguments);
    if (this._undrawnHTMLContext != null) {
        var context = this._undrawnHTMLContext;
        this._undrawnHTMLContext = null;
        this.setHTML(context.HTML, context.callback);
    }
},

//> @method printCanvas.setTitle()
// Specify the title for the printCanvas. This is the title that will appear on the printed 
// document
// @param title (String) Title to show
// @visibility internal
//<

setTitle : function (title) {
    this.title = title;
    // if the iframe hasn't been loaded we can bail - when we load it we'll include the
    // title in the HTML passed in.
    if (!this.iframeLoaded) return;
    
    // In IE window.title is essentially read-only - we really need to rewrite the entire HTML of
    // the frame to update it
},

// Note there's no call to 'draw()' in here so if called before draw this would have no
// effect
printHTML : function (HTML, title ,debugOnly) {
    var self = this;
    this.setTitle(title);
    this.setHTML(HTML, 
    
                    function () {
                    self.print();
                });
},


//> @method printCanvas.print()
// Show the native print dialog and allow the user to print the current HTML for
// this printCanvas. Note that the PrintCanvas must be drawn to be printed.
// @visibility external
//<
print : function () {
    if (!this.isDrawn()) {
        this.logWarn("print(): Attempt to print an undrawn PrintCanvas. Ignoring.");
        return;
    }
    
    if (!this.iframeLoaded) {
        this.delayCall("print", [], 100);
        return;
    }

    this.getIFrameWindow().doPrint();
    
    
},

// Handler to fire when printing is complete - only fires in IE
printComplete : function () {
  //this.logWarn("print complete!~");
}

});

isc.Canvas.addClassMethods({
    //> @classMethod Canvas.printComponents()
    // Generate printable HTML for the designated components and trigger the native print
    // dialog, without never showing the printable HTML to the user.
    //
    // @param components (Array of Canvas) components to get the print HTML for. May also include
    //        raw HTML strings which will be folded into the generated print output
    // @param [printProperties] (PrintProperties) object for customizing the print HTML output
    //
    // @group printing
    // @visibility external
    //<
    printComponents : function (components, printProperties, title, debugOnly) {
        isc.Canvas.getPrintHTML(
            components, printProperties, 
            {target:this, methodName:"_printComponentHTML", title:title, debugOnly:debugOnly}
        );
    },
    _printComponentHTML : function (printHTML, callback) {        
        var title = callback.title,
            debugOnly  = callback.debugOnly;
            
        if (!this._printCanvas) this._printCanvas = isc.PrintCanvas.create({
            // sizing to 100/100 should cause the layout to match as closely as possible...
            width:"100%", height:"100%", autoDraw:false
            ,backgroundColor:"white"
        });
        this._printCanvas.moveTo(null, -isc.Page.getHeight());
        if (!this._printCanvas.isDrawn()) this._printCanvas.draw();
        this._printCanvas.printHTML(printHTML, title, debugOnly);
    },
    
    //> @classMethod Canvas.getPrintPreview()
    // Returns a printCanvas containing the full printHTML for a series of components. Note that
    // the generated preview canvas will be drawn automatically by this method. Developers may
    // also explicitly create a PrintCanvas instance and populate it with HTML derived from the
    // +link{Canvas.getPrintHTML()} for finer grained control over when the print canvas is
    // drawn.
    // @param components (array of Canvas) components to get the print HTML for. May also include
    //    raw HTML strings which will be folded into the generated print output
    // @param [printProperties] (PrintProperties) PrintProperties object for customizing the print HTML output
    // @param [previewProperties] (Canvas Properties) properties to apply to the generated printPreview Canvas.
    // @param [callback] (Callback) callback to fire when the print preview canvas has been populated
    //    with the printable HTML. The generated canvas will be passed to the callback as a single 
    //    <code>printPreview</code> parameter.
    // @param [separator] (String) optional string of HTML to render between each component
    // @group printing
    // @visibility external
    //< 
    
    getPrintPreview : function (components, printProperties, previewProperties, callback, separator) {
        // always auto-draw - this is required so the thing gets populated with print HTML
        // and actually gets shown.
        if (previewProperties == null) previewProperties = {};
        previewProperties.autoDraw = true;
        
        // 2 steps here - both are asynchronous:
        // - generate print html from components
        // - apply HTML to the print canvas (asynchronous if iframe wasn't yet loaded)
        isc.Canvas.getPrintHTML(components, printProperties, 
                                {target:this, methodName:"_createPrintPreview", 
                                    origCallback:callback, previewProperties:previewProperties},
                                    separator);
        
    },
    _createPrintPreview : function (HTML, callback) {
        var PC = isc.PrintCanvas.create(callback.previewProperties);
        PC.setHTML(HTML, {target:this, methodName:"_printPreviewGenerated",
                                        origCallback:callback.origCallback});
    },
    _printPreviewGenerated : function (printPreview, callback) {
        if (callback.origCallback) {
            this.fireCallback(callback.origCallback, ["printPreview"], [printPreview]);
        }
    },

    //> @classMethod Canvas.showPrintPreview()
    // Generate and show a +link{class:PrintWindow} containing a +link{class:PrintCanvas}
    // showing a printable view of the components passed in.
    //
    // @param components (Array of Canvas) components to get the print HTML for. May also include
    //  raw HTML strings which will be folded into the generated print output
    // @param [printProperties] (PrintProperties) PrintProperties object for customizing the 
    //    print HTML output
    // @param [printWindowProperties] (PrintWindow Properties) Properties to apply to the 
    //    generated print window.
    // @param [callback] (Callback) callback to fire when the print preview canvas has 
    //    been populated with the printable HTML. This callback takes 2 parameters:
    //    <code>printPreview</code> - a pointer to the generated print canvas shown in the
    //    body of the print window.
    //    <code>printWindow</code> - a pointer to the generated print window and 
    // @param [separator] (String) Optional HTML separator to render between each component's printable
    //                      HTML
    //
    // @group printing
    // @visibility external
    //<
    showPrintPreview : function (components, printProperties, previewProperties, callback,
                                  separator) 
    {
        if (!isc.PrintWindow) {
            isc.definePrintWindow();
        }
        if (!isc.PrintWindow) return;
        
        // Make the PrintWindow an autoChild
        if (previewProperties == null) previewProperties = {};
        previewProperties.autoDraw = false;
        if (previewProperties.width == null) previewProperties.width = "100%";
        if (previewProperties.height == null) previewProperties.height = "100%";
        if (previewProperties.left == null) previewProperties.left = 0;
        if (previewProperties.top == null) previewProperties.top = 0;

        if (!this._previewWindow) {
            this._previewWindow = isc.PrintWindow.create(previewProperties);
        } else {
            this._previewWindow.setProperties(previewProperties);
        }
        this._previewWindow.showPrintPreview(components, printProperties, callback, separator);
    }
    
});

// separate the definition of the PrintWindow class into a separate function.
// We fire this at the end of Window.js, after the Window class has been defined (but before page
// load so we know the class is available when load_skin.js gets loaded).
isc.definePrintWindow = function () {

if (!isc.Window) {
    isc.logWarn("Attempting to create PrintWindow class with no defined Window class. " + 
                "Ensure the required 'Containers' module is laoded");
    return;
}

//> @class PrintWindow
// Subclass of +link{class:Window} used for displaying a printable view. Includes a "Print" button
// header control to trigger printing of content.
//
// @group printing
// @visibility external
//<
isc.defineClass("PrintWindow", "Window");
isc.PrintWindow.addProperties({
    isModal: true,
    headerControls: ["headerIcon", "headerLabel", "printButton", "closeButton"],
    printButtonDefaults : {
        _constructor: "IButton",
        //title: "Print",
        height: 20,
        click: "this.creator.printClicked()"
    },
    
    showMinimizeButton: false,
    showShadow:false,

    //> @attr printWindow.title (string : "Print Preview" : IRW)
    // Title for the print window
    // @visibility external
    //<
    title: "Print Preview",
    
    //> @attr printWindow.printButtonTitle (string : "Print" : IRW)
    // Title for the print button
    // @visibility external
    //<
    printButtonTitle: "Print",
     
    //> @method printWindow.setPrintButtonTitle ()
    // Setter for title for the print button
    // @param printButtonTitle (String) new title for the print button
    // @visibility external
    //<
    setPrintButtonTitle : function (printButtonTitle) {
        this.printButtonTitle = printButtonTitle;
        if (this.printButton != null) this.printButton.setTitle(printButtonTitle);
    },
    
    initWidget : function () {
        this.printButtonDefaults.title = this.printButtonTitle;    
        this.Super("initWidget", arguments);    
    },
    
    showPrintPreview : function (components, printProperties, callback, separator) {
        if (!isc.isAn.Array(components)) components = [components];
        isc.Canvas.getPrintHTML(components, printProperties, 
                                {target:this, methodName:"_applyPreviewHTML", 
                                    origCallback:callback}, separator);
    },
    _applyPreviewHTML : function (HTML, callback) {
        if (!this.previewPane) {
            this.previewPane = this.createPreviewPane();
            this.addItem(this.previewPane);
        }
        this.previewPane.addProperties({title:this.title});
        // we have to draw the preview pane to set it's HTML
        this.setVisibility("hidden");
        if (!this.isDrawn()) this.draw();
        this.previewPane.setHTML(HTML, {target:this, methodName:"_printPreviewGenerated",
                                         origCallback:callback.origCallback});
    },
    _printPreviewGenerated : function (printPreview, callback) {
        if (!this.isVisible()) this.show();
        this.bringToFront();
        if (callback.origCallback) {
            this.fireCallback(callback.origCallback, 
                ["printPreview", "printWindow"], [printPreview, this]);
        }
    },
    
    printClicked : function () {
        var pc = this.getPrintCanvas();
        if (!pc) return;
        pc.print();
    },
    
    createPreviewPane : function (callback) {
        var previewPane = isc.PrintCanvas.create({
            width: "100%",
            height: "100%"
        });
        return previewPane;
    },
    
    getPrintCanvas : function () {
        return this.previewPane;
    }
});

}
