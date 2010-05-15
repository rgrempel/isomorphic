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

 





//>	@class	Dialog
//
// Dialogs are a specialized version of +link{Window} used for small windows such as
// alerts, prompts, and confirmations.  They can be modal or modeless (via the
// +link{Window.isModal,isModal} property) and will contain various children by default
// ("titlebar", "resizer", etc).
// <P>
// NOTE: If you are building a custom component that will add components to the Window via
// +link{window.addItem(),addItem()}, in most cases it makes sense 
//
//
//  @treeLocation Client Reference/Control
//  @visibility external
//<
isc.ClassFactory.defineClass("Dialog", "Window");

// add class properties
isc.Dialog.addClassProperties({
    //>	@classAttr	Dialog._openModalDialogs		(array : [] : IRWA)
	// 			list of open modal Dialogs so we can keep track as we open them
	//		@group	modal
	//		@see	Dialog.show()
	//<
	_openModalDialogs : [],

    //> @classAttr  Dialog.OK_BUTTON_TITLE  (HTML : "OK" : IRW)
    // Title for the <code>"OK"</code> button.
    // @see type:DialogButtons
    // @group i18nMessages
    // @visibility external
    //<
    OK_BUTTON_TITLE:"OK",
    //> @classAttr  Dialog.APPLY_BUTTON_TITLE  (HTML : "Apply" : IRW)
    // Title for the <code>"Apply"</code> button.
    // @see type:DialogButtons
    // @group i18nMessages
    // @visibility external
    //<
    APPLY_BUTTON_TITLE:"Apply",
    //> @classAttr  Dialog.YES_BUTTON_TITLE  (HTML : "Yes" : IRW)
    // Title for the <code>"Yes"</code> button.
    // @see type:DialogButtons
    // @group i18nMessages
    // @visibility external
    //<    
    YES_BUTTON_TITLE:"Yes",
    //> @classAttr  Dialog.NO_BUTTON_TITLE  (HTML : "No" : IRW)
    // Title for the <code>"No"</code> button.
    // @see type:DialogButtons
    // @group i18nMessages
    // @visibility external
    //<    
    NO_BUTTON_TITLE:"No",
    //> @classAttr  Dialog.CANCEL_BUTTON_TITLE  (HTML : "Cancel" : IRW)
    // Title for the <code>"Cancel"</code> button.
    // @see type:DialogButtons
    // @group i18nMessages
    // @visibility external
    //<    
    CANCEL_BUTTON_TITLE:"Cancel",
    //> @classAttr  Dialog.DONE_BUTTON_TITLE  (HTML : "Done" : IRW)
    // Title for the <code>"Done"</code> button.
    // @see type:DialogButtons
    // @group i18nMessages
    // @visibility external
    //<    
    DONE_BUTTON_TITLE:"Done",
    
    // Default Titles for the prompt windows themselves
    
    //> @classAttr  Dialog.CONFIRM_TITLE    (HTML : "Confirm" : IRW)
    // Default title for the dialog displayed in response to the +link{classMethod:isc.confirm()} method.
    // Note that a custom title can be specified as the <code>title</code> attribute of the 
    // <code>properties</code> parameter passed to that method.
    // @group i18nMessages
    // @visibility external
    //<
    CONFIRM_TITLE:"Confirm",

    //> @classAttr  Dialog.SAY_TITLE    (HTML : "Note" : IRW)
    // Default title for the dialog displayed in response to the +link{classMethod:isc.say()} method.
    // Note that a custom title can be specified as the <code>title</code> attribute of the 
    // <code>properties</code> parameter passed to that method.
    // @group i18nMessages
    // @visibility external
    //<    
    SAY_TITLE:"Note",

    //> @classAttr  Dialog.WARN_TITLE    (HTML : "Note" : IRW)
    // Default title for the dialog displayed in response to the +link{classMethod:isc.warn()} method.
    // Note that a custom title can be specified as the <code>title</code> attribute of the 
    // <code>properties</code> parameter passed to that method.
    // @group i18nMessages
    // @visibility external
    //<        
    WARN_TITLE:"Note",
    
    //> @classAttr  Dialog.ASK_TITLE    (HTML : "Question" : IRW)
    // Default title for the dialog displayed in response to the +link{classMethod:isc.ask()} method.
    // Note that a custom title can be specified as the <code>title</code> attribute of the 
    // <code>properties</code> parameter passed to that method.
    // @group i18nMessages
    // @visibility external
    //<        
    ASK_TITLE:"Question",

    //> @classAttr  Dialog.ASK_FOR_VALUE_TITLE    (HTML : "Please enter a value" : IRW)
    // Default title for the dialog displayed by +link{classMethod:isc.askForValue()}.
    // A custom title can alternatively be specified as the <code>title</code> attribute of the 
    // <code>properties</code> parameter passed to that method.
    // @group i18nMessages
    // @visibility external
    //<        
    ASK_FOR_VALUE_TITLE:"Please enter a value",

    //> @classAttr  LoginDialog.LOGIN_TITLE (HTML : "Please log in" : IRW)
    // Default title for the dialog displayed by +link{classMethod:isc.showLoginDialog()}.
    // A custom title can alternatively be specified as the <code>title</code> attribute of the 
    // <code>properties</code> parameter passed to that method.
    // @group i18nMessages
    // @visibility external
    //<
    
    LOGIN_TITLE:"Please log in",

    //> @classAttr  LoginDialog.USERNAME_TITLE (HTML : "Username" : IRW)
    // Default title for the +link{loginDialog.usernameItem,"usernameItem"} field in the 
    // dialog displayed by +link{classMethod:isc.showLoginDialog()}. 
    // @group i18nMessages
    // @visibility external
    //<        
    
    USERNAME_TITLE:"Username",

    //> @classAttr  LoginDialog.PASSWORD_TITLE (HTML : "Password" : IRW)
    // Default title for the +link{loginDialog.passwordItem,"passwordItem"} field in the
    // dialog displayed by +link{classMethod:isc.showLoginDialog()}.
    // @group i18nMessages
    // @visibility external
    //<        
    
    PASSWORD_TITLE:"Password",

    //> @classAttr  LoginDialog.LOGIN_BUTTON_TITLE (HTML : "Log in" : IRW)
    // Default title for login button in the dialog displayed by 
    // +link{classMethod:isc.showLoginDialog()}.
    // @group i18nMessages
    // @visibility external
    //<        
    
    LOGIN_BUTTON_TITLE:"Log in",

    //> @classAttr  LoginDialog.LOGIN_ERROR_MESSAGE (HTML : "Invalid username or password" : IRW)
    // Default error message displayed on failed login in the dialog shown by 
    // +link{classMethod:isc.showLoginDialog()}.
    // @group i18nMessages
    // @visibility external
    //<        
    
    LOGIN_ERROR_MESSAGE:"Invalid username or password",

	//>	@type   DialogButtons
    // Default buttons that you can use in your Dialogs.
	// <P>
    // On click these call canonical methods that you can override in your Dialog.
    // <P>
    // Refer to these buttons via the syntax <code>isc.Dialog.OK</code> when passing them into
    // +link{dialog.toolbarButtons} or into the <code>properties</code> argument of helper
    // methods such as +link{classMethod:isc.say()}.
    //
    // @value   OK  Button object to fire dialog's "okClick()" method on click.
    //              Title derived from +link{Dialog.OK_BUTTON_TITLE}.
	OK 		: {getTitle:function () {return isc.Dialog.OK_BUTTON_TITLE},
                width:75, click: function () { this.topElement.okClick() } },
    // @value   APPLY Button object to fire dialog's "applyClick()" method on click.
    //              Title derived from +link{Dialog.APPLY_BUTTON_TITLE}.    
	APPLY 	: {getTitle:function () {return isc.Dialog.APPLY_BUTTON_TITLE}, 	
                width:75, click: function () { this.topElement.applyClick() } },
    // @value   YES Button object to fire dialog's "yesClick()" method on click    
    //              Title derived from +link{Dialog.YES_BUTTON_TITLE}.    
	YES 	: {getTitle:function () {return isc.Dialog.YES_BUTTON_TITLE}, 	
                width:75, click: function () { this.topElement.yesClick() } },
    // @value   NO  Button object to fire dialog's "noClick()" method on click.
    //              Title derived from +link{Dialog.NO_BUTTON_TITLE}.
	NO	 	: {getTitle:function () {return isc.Dialog.NO_BUTTON_TITLE}, 		
                width:75, click: function () { this.topElement.noClick() } },
    // @value   CANCEL  Button object to fire dialog's "cancelClick()" method on click.
    //                  Title derived from +link{Dialog.CANCEL_BUTTON_TITLE}.
	CANCEL 	: {getTitle:function () {return isc.Dialog.CANCEL_BUTTON_TITLE}, 	
                width:75, click: function () { this.topElement.cancelClick() } },
    // @value   DONE  Button object to fire dialog's "doneClick()" method on click.
    //                  Title derived from +link{Dialog.DONE_BUTTON_TITLE}.    
    DONE    : {getTitle:function () {return isc.Dialog.DONE_BUTTON_TITLE},
                width:75, click: function () { this.topElement.doneClick() } }
    // @visibility external
    //<

    
    
    
});

// add standard instance properties
isc.Dialog.addProperties({	
    //>	@attr	dialog.styleName	(CSSStyleName: "dialogBackground" : IRW)
	//			Style of the Dialog background
	//		@group	appearance
    //      @visibility external
	//<	
	styleName:"dialogBackground",		

	skinImgDir:"images/Dialog/",

	canDragReposition : false,
	canDragResize:false,

	//>	@attr	dialog.autoCenter		(boolean : autoCenter : IRW)
	//			if true, this dialog will automatically be centered on the page when shown
	//			if false, it will show up wherever you (or the user) last put it
	//		@group	appearance, location
	//		@see	dialog.show()
	//<
	autoCenter : true,
										
	// Body Settings
	// ----------------------------------------------------------------------------------------
    //>	@attr	dialog.bodyStyle	(string : "dialogBody" : IA)
	// Style of the Window body
	//		@group	appearance, header
	//		@see	Window.makeBody()
	//<		
    bodyStyle:"dialogBody",

    //>	@attr	dialog.bodyColor		(CSSColor : "#DDDDDD" : IA)
	//			Color of the Window body.
	//			Overrides the background color specified in the style.
	//		@group	appearance, header
	//		@see	Window.makeBody()
    //      @see    Window.flash()
	//<	
    bodyColor:"#DDDDDD",			

    //>	@attr	dialog.hiliteBodyColor		(CSSColor : "#DDDDDD" : IA)
	// Highlight color for the Window body (shown when the body is flashed).
	//		@group	appearance, header
	//		@see	Window.makeBody()
    //      @see    Window.flash()
	//<	
    hiliteBodyColor:"#FFFFFF",
    
    //> @attr dialog.messageStyle (CSSStyle : "normal" : IA)
    // Style to apply to the message text shown in the center of the dialog
    // @visibility external
    //<
    messageStyle:"normal",

    // Header
	// ----------------------------------------------------------------------------------------
    //>	@attr	dialog.headerStyle	(string : "DialogHeader" : IA)
	// Style of the Dialog header
	//		@group	appearance, header
	//		@see	Dialog.makeHeader()
	//<
    headerStyle:"dialogHeader",  

    //>	@attr	dialog.windowHeaderHilite	(string : "WindowHeader" : IA)
	//			Highlight style for the Dialog header
	//		@group	appearance, header
	//		@see	Window.makeHeader()
	//<											
    hiliteHeaderStyle:"dialogHeaderHilite",  

    //>	@attr	dialog.headerLabelTextStyle	(string : "dialogHeaderText" : IA)
	//			Style of the Dialog headerLabel text
	//		@group	appearance, headerLabel
	//		@see	Dialog.makeHeaderLabel()
	//<
    
    headerLabelDefaults : isc.addProperties({},
                                            isc.Window.getInstanceProperty("headerLabelDefaults"),
                                            {styleName:"dialogHeaderText"}),

	// Header Icon
	// ----------------------------------------------------------------------------------------
	//>	@attr	dialog.showHeaderIcon		(boolean : false : IRW)
	//			should we show a headerIcon in the header, 
	//			clicking it dismisses the Dialog
	//		@group	appearance, header
	//		@see	Dialog.makeHeaderIcon()
	//<		
	showHeaderIcon:false,

	// Buttons
	// ----------------------------------------------------------------------------------------
	//>	@attr	Dialog.showMinimizeButton		(boolean : false : IRW)
	// Should we show a minimizeButton in the header, clicking it dismisses the Dialog
	//		@group	appearance, header
	//		@see	Dialog.makeMinimizeButton()
	//<
	showMinimizeButton:false,

    //>	@attr	Dialog.showMaximizeButton		(boolean : false : IRW)
	// Should we show a maximizeButton in the header, clicking it dismisses the Dialog
	//		@group	appearance, header
	//		@see	Dialog.makeMaximizeButton()
	//<								
	showMaximizeButton:false,			
	
	// Footer
	// ----------------------------------------------------------------------------------------
	//>	@attr	Dialog.showFooter		(boolean : false : IRW)
	// Should we show a footer for this Dialog, including resizer, statusBar, etc?
	//		@group	appearance, footer
	//<
	showFooter:false,
	
	// Toolbar
	// ----------------------------------------------------------------------------------------
    //>	@attr	Dialog.showToolbar		(boolean : false : IRW)
	// Whether to show a toolbar of buttons at the bottom of the Dialog.
	//		@group	appearance, toolbar
    // @visibility external
	//<    	
	showToolbar:true,

    //> @attr Dialog.toolbarButtons (Array of Button or Button Properties : null : IR)
    // Array of Buttons to show in the +link{showToolbar,toolbar}, if shown.
    // <P>
    // The set of buttons to use is typically set by calling one of the shortcuts such as
    // +link{classMethod:isc.say()} or +link{classMethod:isc.confirm()}.  A custom set of buttons can be passed to
    // these shortcuts methods via the "properties" argument, or to a directly created Dialog.
    // <P>
    // In both cases, a mixture of +link{type:DialogButtons,built-in buttons}, custom buttons,
    // and other components (such as a +link{LayoutSpacer}) can be passed.  Built-in buttons
    // can be referred to as <code>isc.Dialog.OK</code>, for example:
    // <pre>
    // isc.Dialog.create({
    //    toolbarButtons:[
    //       isc.Dialog.OK, 
    //       isc.Dialog.CANCEL, 
    //       isc.LayoutSpacer.create({width:50}), 
    //       { title:"Not now", click:"doSomething()" }
    //    ]
    // })
    // </pre>
    // Built-in buttons will call standard methods on the Dialog itself, such as
    // +link{dialog.cancelClick()}, as explained in the 
    // +link{type:DialogButtons,list of built-in buttons}.
    //
    // @visibility external
    //<

    // Body Icons
    // ---------------------------------------------------------------------------------------
    askIcon:"[SKIN]ask.png",
    sayIcon:"[SKIN]say.png",
    warnIcon:"[SKIN]warn.png",
    confirmIcon:"[SKIN]confirm.png", // XXX misnamed media

    // media exists, but no global helper, you have to call eg showMessage(message, "error")
    notifyIcon:"[SKIN]notify.png", // XXX misnamed media
    errorIcon:"[SKIN]error.png",
    stopIcon:"[SKIN]stop.png"

});	// END	isc.Dialog.addProperties()

//!>Deferred

isc.Dialog.addMethods({

//>	@method	Dialog.saveData()	(A)
// Method to save this Dialog's data. Called from <code>okClick()</code>, 
// <code>applyClick()</code>.
// No default implementation - override to perform some action if required.
//      
//		@group	buttons
//      @visibility external
//      @see okClick()
//      @see applyClick()
//<
saveData : function () {},

//> @method Dialog.closeClick()
// @include Window.closeClick()
//<

//>	@method	Dialog.cancelClick()
// Handle a click on the 'cancel' button of this Dialog.
// Default implementation is to return null and hide the Dialog.
// Override to do something else.
//		@group	buttons
//      @visibility external
//      @see type:DialogButtons
//<
cancelClick : function () {
    return this.closeClick();
},
// reroute the close button to call cancelClick
// (This way overrides to cancelClick will get fired - still falls through to closeClick())
_closeButtonClick : function () { return this.cancelClick() },

//>	@method	Dialog.okClick()	()
// Handle a click on the 'ok' button of this Dialog.
// Default implementation is to call <code>saveData()</code>, hide the Dialog, then return
// <code>true</code>.  
// Override to do something else.
//		@group	buttons
//      @visibility external
//      @see type:DialogButtons
//<
okClick : function () {
    this.saveData();
    
	this.clear();
	this.returnValue(true);
},


//>	@method	Dialog.applyClick()
// Handle a click on the 'apply' button of this Dialog.  
// Default implementation is to call <code>saveData()</code>, but NOT close the Dialog.
//		@group	buttons
//      @visibility external
//      @see type:DialogButtons
//<
applyClick: function () {
    this.saveData();
},

//>	@method	Dialog.yesClick()
// Handle a click on the 'yes' button of this Dialog.
// Default implementation is to return <code>true</code>.
// Override to do something else
//		@group	buttons
//      @visibility external
//      @see type:DialogButtons
//<
yesClick : function () {
	this.returnValue(true);
},

//>	@method	Dialog.noClick()
// Handle a click on the 'no' button of this Dialog.
// Default implementation is to return <code>false</code>.
// Override to do something else.
//		@group	buttons
//      @visibility external
//      @see type:DialogButtons
//<
noClick : function () {
	this.returnValue(false);
},

//>	@method	Dialog.doneClick()
// Handle a click on the 'done' button of this Dialog.
// Default implementation is to hide the dialog then return <code>true</code>.
// Override to do something else.
//		@group	buttons
//      @visibility external
//      @see type:DialogButtons
//<
doneClick : function () {
    // refer to comment in okClick
    this.clear();
    this.returnValue(true);
},

// for Autotest APIs
namedLocatorChildren:[
    "okButton", "applyButton", "yesButton", "noButton", "cancelButton", "doneButton"
]
});

isc.Dialog.changeDefaults("toolbarDefaults",
{
   
    makeButton : function (button) {
        var config = button,
            button = this.Super("makeButton", arguments);
            
        switch (config)
        {
        case isc.Dialog.OK:
            this.creator.okButton = button;
            button.locatorParent = this.creator;
            break;
            
        case isc.Dialog.APPLY:
            this.creator.applyButton = button;
            button.locatorParent = this.creator;
            break;
        
        case isc.Dialog.YES:
            this.creator.yesButton = button;
            button.locatorParent = this.creator;
            break;
        
        case isc.Dialog.NO:
            this.creator.noButton = button;
            button.locatorParent = this.creator;
            break;
        
        case isc.Dialog.CANCEL:
            this.creator.cancelButton = button;
            button.locatorParent = this.creator;
            break;
        
        case isc.Dialog.DONE:
            this.creator.doneButton = button;
            button.locatorParent = this.creator;
            break;
        }
        
        return button;
    }
});



//!<Deferred

//
//	Default Dialogs that we create
//


//>	@groupDef Prompting
//	Objects / methods used for displaying prompts and warnings to the user via (possibly modal)
//  isc Dialog objects.
// @treeLocation Client Reference/Control
//<


//>	@classAttr	Dialog.Prompt   (Dialog Properties : dialog instance properties : A)
//
//  The "Prompt" object on the dialog class is a singleton Dialog instance.
//  The Prompt is used to show text to the user in a modal fashion - it will expand to show 
//  all the text that you put into it.
//  By default this Dialog has no end-user controls and is expected to be programmatically
//  dismissed.<br>
//  Common use-case: During server-interactions, the Prompt will be used to display a suitable 
//  wait message, and suppress user input.<br><br>
//
// Notes:<br>
//  Because this is a singleton object, properties set on the Prompt directly will persist each
//  time it is shown.<br>
//  Developers should use the <code>showPrompt()</code> and <code>clearPrompt()</code> methods
//  to show and hide the prompt rather than manipulating the prompt directly.
//
// @group Prompting
// @visibility external
// @see classMethod:isc.showPrompt
// @see classMethod:isc.clearPrompt
//<
isc.Dialog.Prompt = {
	ID:"isc_globalPrompt",
    _generated:true,
	width:400,
    height:90,

    autoDraw:false,
    autoSize:true,
	isModal:true,
	autoCenter:true,
	showHeader:false,
	showFooter:false,
	showToolbar:false,

    dismissOnEscape:false,
    
    bodyStyle:"promptBody", // no border-top, since there is no header
                            // TODO autogenerate border in Window based on header visibility
    
    message:"Loading...",

    blurbDefaults : {width:390, align:isc.Canvas.CENTER, valign:isc.Canvas.CENTER, canSelectText: true},
    
    layoutMargin:0,
    
	//>	@method	Prompt.showMessage()
	//	Show a message in the Dialog
	//
	//	Dialog will redraw and resize to show the entire message
	//	any properties in attributes will get applied and may be visibily changed
	//
	//	@param	newMessage	(string)	message to display
	//	@param	properties (Dialog Properties)	object of name:value pairs to apply to the object
	//									properties are applied before the redraw
	//<
	showMessage : function (newMessage, properties) {
    
		// first add the properties specified
		this.setProperties(properties);
    
        this.message = newMessage;

        // Note: we lazily create children on draw, so verify that the items have been
        // initialized before manipulating the label
        if (!this._isInitialized) this.createChildren();

        // add a label
        this.addAutoChild("blurb", null, isc.Label, this.body);
        // Support custom styling of the blurb        
        if (this.messageStyle != null) this.blurb.setBaseStyle(this.messageStyle); 
        this.blurb.setContents(this.message);
		
		this.show();
	},

	// clear the prompt message -- just clear the prompt
    
	clearMessage : function () {
		this.clear();
	},
    
    // If the prompt gets destroyed, remove the pointer to it.
    
    destroy : function () {
        isc.Dialog.Prompt = this._originalProperties;
        return this.Super("destroy", arguments);
    }
};



//>	@classMethod isc.showPrompt()
//
//	Method available on the isc object to show a modal prompt to the user.
//  This method will display the message using the Dialog.Prompt singleton object.<br>
//  Note: if this prompt is to be shown to the user during some slow JavaScript logic, we 
//  advise calling this method, then using +link{Class.delayCall()} or +link{Timer.setTimeout}
//  to kick off the slow logic in a separate thread. This ensures that the prompt is showing
//  before the lengthy execution begins.
//  
//
//	@param	message			(string)	message to display
//	@param	[properties]	(Dialog Properties)	additional properties for the Dialog, applied before
//                                       the Dialog is shown
//
// @visibility external
// @see Dialog.Prompt
// @group Prompting
//<
isc.addGlobal("showPrompt", function (message, properties) {
    var prompt = isc.Dialog.Prompt;
	if (!isc.isA.Dialog(prompt)) {
        var props = prompt;
		prompt = isc.Dialog.Prompt = isc.Dialog.create(prompt);
        // If we destroy() the prompt, this allows us to essentially 'reset' ourselves to a
        // state where calling this method again will create a new prompt from the original
        // set of properties.
        
        prompt._originalProperties = props;
	}
	isc.Dialog.Prompt.showMessage(message, properties);
});

//>	@classMethod	isc.clearPrompt()
//
//	Clear the modal prompt being shown to the user.
//
//  @group Prompting
//  @visibility external
//  @see Dialog.Prompt
//<
isc.addGlobal("clearPrompt", function () {
	if (!isc.isA.Dialog(isc.Dialog.Prompt)) return; // prompt has never been shown
	isc.Dialog.Prompt.clearMessage();
});


////////////////////////////////////////////////////////////////////////////////////////////


//>	@classAttr	Dialog.Warn (Dialog Properties : dialog instance properties : A)
//
// A singleton Dialog instance that will show text to the user and provide buttons for their
// response.  The Dialog will expand to show all the text that you put into it.<br>
// This can be used in cases where a developer would alternatively make use of the native
// JavaScript <code>alert()</code> and <code>confirm()</code> methods.  The main differences
// between those methods and using the Warn object are:<br>
// - The Warn object can be customized by modifying which buttons are visible, the style 
//   applied to it, etc.<br>
// - The <code>isc.ask()</code> and <code>isc.warn()</code> methods are asynchronous - rather 
//   than returning a value indicating the user's response, a callback method will be fired
//   when the user interacts with the dialog.<br><br>
//
// Notes:<br>
//  Because this is a singleton object, properties set on the Warn object directly will persist 
//  each time it is shown.<br>
//  Developers should use the <code>warn()</code> or <code>ask()</code> methods to show and
//  hide this object rather than manipulating the Dialog directly.
//  @group  Prompting
//  @visibility external
//  @see classMethod:isc.warn
//  @see classMethod:isc.ask
//<
isc.Dialog.Warn = {
	ID:"isc_globalWarn",
    _generated:true,
	width:400,
	height:60,	

	isModal:true,
	canDragReposition:true,
    keepInParentRect:true,
    
    autoDraw:false,	
    autoSize:true,
	autoCenter:true,
	
	toolbarButtons:[isc.Dialog.OK],
    message:"Your message here!",

    blurbDefaults: {canSelectText: true},
    
    contentLayout:"horizontal",
    autoChildParentMap : isc.addProperties({}, isc.Window.getInstanceProperty("autoChildParentMap"),
    {
        stack : "body",
        iconImg : "body",
        blurb : "stack",
        toolbar : "stack"
    }),

    stackDefaults : {
        height:1
    },
    bodyDefaults: isc.addProperties({}, isc.Window.getInstanceProperty("bodyDefaults"),
    {
        layoutMargin:15,
        membersMargin:10
    }),
    toolbarDefaults : isc.addProperties({}, isc.Dialog.getInstanceProperty("toolbarDefaults"),
    {
        width:20,
        layoutAlign:"center"
    }),
    iconImgDefaults : { width:32, height:32 },

	createChildren : function () {
        // HACK: prevent toolbar from being created, since we want it placed in "stack", which
        // we can't create until Super.createChildren() creates the "body", which is "stack"'s
        // parent.
        this.showToolbar = false;
        this.Super("createChildren");
        this.addAutoChild("iconImg", null, isc.Img);
        this.addAutoChild("stack", null, isc.VStack);
        this.addAutoChild("blurb", {height:10}, isc.Label);
        this.showToolbar = true;
        this.makeToolbar();

        // can't be done via defaults because policy and direction are dynamically determined
        this.body.hPolicy = "fill";
    },

	//>	@method	Warn.showMessage()
	// Show a message in the Dialog
	//
	// Dialog will redraw and resize to show the entire message
	// any properties in attributes will get applied and may be visibily changed
	//
	//	@param	newMessage	(string)	message to display
	//	@param	attributes	(Dialog Properties)	object of name:value pairs to apply to the object
	//									properties are applied before the redraw
	//<
	showMessage : function (newMessage, properties) {

        this.message = newMessage;
		this.setProperties(properties);
		// if no callback was specified, clear the Dialog callback
		if (properties.callback == null) delete this.callback;
        
        // Note: we lazily create children on draw, so verify that the items have been
        // initialized before manipulating the label
        if (!this._isInitialized) this.createChildren();

        // Update the label in the body        
        if (this.messageStyle != null) this.blurb.setBaseStyle(this.messageStyle);
        this.blurb.setContents(this.message);

        if (this.icon) {
            this.iconImg.setSrc(this.getImgURL(this.icon));
            this.iconImg.show();
        } else this.iconImg.hide();

        // do immediate relayout so we don't wait for timers before we draw the new buttons,
        // especially because the destroy is immediate but the new draw is delayed, and in the
        // interim things react to the empty toolbar.
        this.toolbar.layoutChildren();
        // since we're going to try to autoCenter on show(), we go ahead and get all relayout
        // done now
        if (this.blurb.isDirty()) this.blurb.redraw();
        if (this.isDrawn()) {
            this.stack.layoutChildren();
            this.body.layoutChildren();
            this.layoutChildren();
        }

		this.show();

        // focus in the first button so you can hit Enter to do the default thing
        if (this.toolbar) {
            var firstButton = this.toolbar.getMember(0);
            /*
            this.logWarn("focusing on first button: " + firstButton + 
                         ", drawn: " + firstButton.isDrawn() +
                         ", disabled: " + firstButton.isDisabled() +
                         ", visible: " + firstButton.isVisible() +
                         ", canFocus: " + firstButton._canFocus());
            */
            firstButton.focus();
        }
	}
};

//> @classMethod isc.showMessage()
// Show a modal dialog with a message, icon, and response buttons.
//<
isc.addGlobal("showMessage", function (message, messageType, callback, properties) {
    
    if ((isc.isA.String(properties) || isc.isA.Function(properties)) ||
        (properties == null && isc.isAn.Object(callback) && callback.methodName == null && 
         callback.action == null && callback.method == null)) 
    {
        // swap arguments
        var realCallback = properties;
        properties = callback;
        callback = realCallback;
    }

	if (!isc.isA.Dialog(isc.Dialog.Warn)) isc.Dialog.Warn = isc.Dialog.create(isc.Dialog.Warn);
	if (!properties) properties = {};
    
    if (properties.buttons != null) {
        this.logWarn("isc.showMessage() called with 'buttons' attribute specified on the " +
            "properties object. This usage has been deprecated in favor of specifying " +
            "properties.toolbarButtons. Copying the buttons attribute value across to " +
            "toolbarButtons", "deprecated");
        properties.toolbarButtons = properties.buttons;
        delete properties.buttons;
    }
    // messageType is one of
    // "confirm" (confirm dialog)
    // "ask" (ask dialog)
    // "say", "warn" (info / warn dialog)
    if (!properties.toolbarButtons) {
        if (messageType == "confirm") {
	        properties.toolbarButtons = [isc.Dialog.OK, isc.Dialog.CANCEL];
        } else if (messageType == "ask") {
	        properties.toolbarButtons = [isc.Dialog.YES, isc.Dialog.NO];
        } else {
	        properties.toolbarButtons = [isc.Dialog.OK];
        }
    }
    
    
    // Title: If specified in properties, respect it, otherwise show the
    // appropriate default title based on the dialog type
    if (!properties.title) {
        if (messageType == "confirm") properties.title = isc.Dialog.CONFIRM_TITLE;
        else if (messageType == "ask") properties.title = isc.Dialog.ASK_TITLE;
        else if (messageType == "warn") properties.title = isc.Dialog.WARN_TITLE;
        else properties.title = isc.Dialog.SAY_TITLE;
    }

    isc._applyDialogHandlers(properties);

    if (!properties.icon) properties.icon = isc.Dialog.getInstanceProperty(messageType+"Icon");
	if (callback) properties.callback = callback;
    
    isc.Dialog.Warn.showMessage(message, properties);
});

// shared with askForValue()
isc._applyDialogHandlers = function (properties) {
    
    var defaultHandlers = this._defaultHandlers = 
        this._defaultHandlers || ["okClick", "yesClick", "noClick", 
                                  "cancelClick", "closeClick", "applyClick"];
    for (var i = 0; i < defaultHandlers.length; i++) {
        var handlerName = defaultHandlers[i];
        if (!properties[handlerName]) {
            properties[handlerName] = isc.Dialog.getInstanceProperty(handlerName);
        }
    }
}

//>	@classMethod	isc.warn()
// Show a modal dialog with a message, icon, and "OK" button.
// <P>
// The callback will receive boolean true for an OK button click, or null if the Dialog is
// dismissed via the close button.
//
//	@param	message			(string)	message to display
//  @param  [callback]      (Callback)  Optional Callback to fire when the user 
//                                      dismisses the dialog. This has the single parameter
//                                      'value', indicating the value returned by the Warn
//                                      dialog from 'okClick()' etc.
//	@param	[properties]	(Dialog Properties)	additional properties for the Dialog.
//                                      To set +link{Dialog.toolbarButtons,custom buttons} for
//                                      the Dialog, set properties.toolbarButtons to 
//                                      an array of buttons
//										eg:	{ buttons : [Dialog.OK, Dialog.CANCEL] }
// @group Prompting
// @visibility external
// @see classAttr:Dialog.Warn
// @see classMethod:isc.say()
// @see classMethod:isc.ask()
// @see method:Dialog.okClick()
// @see classAttr:Dialog.WARN_TITLE
//<
isc.addGlobal("warn", function (message, callback, properties) {
    isc.showMessage(message, "warn", callback, properties);
});

//>	@classMethod	isc.say()
// Show a modal dialog with a message, icon, and "OK" button.  Intended for notifications which
// are not really warnings (default icon is less severe).
// <P>
// The callback will receive boolean true for an OK button click, or null if the Dialog is
// dismissed via the close button.
//
//	@param	message			(string)	message to display
//  @param  [callback]      (Callback)  Optional Callback to fire when the user 
//                                      dismisses the dialog. This has the single parameter
//                                      'value', indicating the value returned by the Warn
//                                      dialog from 'okClick()' etc.
//	@param	[properties]	(Dialog Properties)	additional properties for the Dialog.
//                                      To set +link{Dialog.toolbarButtons,custom buttons} for
//                                      the Dialog, set properties.toolbarButtons to an array of
//                                      buttons
//										eg:	{ buttons : [Dialog.OK, Dialog.CANCEL] }
// @group Prompting
// @visibility external
// @see classAttr:Dialog.Warn
// @see classMethod:isc.warn()
// @see classMethod:isc.ask()
// @see method:Dialog.okClick()
// @see classAttr:Dialog.SAY_TITLE
//<
isc.addGlobal("say", function (message, callback, properties) {
    isc.showMessage(message, "say", callback, properties);
});


//>	@classMethod	isc.ask()
// Show a modal dialog with a message, icon, and "Yes" and "No" buttons.
// <P>
// The callback will receive boolean true for an OK button click, boolean false for a No button
// click, or null if the Dialog is dismissed via the close button.
//
//	@param	message			(string)	message to display
//  @param  [callback]      (Callback)  Callback to fire when the 
//                                      user clicks a button to dismiss the dialog.
//                                      This has the single parameter 'value', indicating the 
//                                      value returned by the Warn dialog from 'okClick()' etc.
//	@param	[properties]	(Dialog Properties)	additional properties for the Dialog.
//                                      To set +link{Dialog.toolbarButtons,custom buttons} for
//                                      the Dialog, set properties.toolbarButtons to an array 
//                                      of buttons
//										eg:	{ buttons : [Dialog.OK, Dialog.CANCEL] }
//
// @group Prompting
// @visibility external
// @see Dialog.Warn
// @see classMethod:isc.warn()
// @see method:Dialog.yesClick()
// @see method:Dialog.noClick()
// @see classAttr:Dialog.ASK_TITLE
// @example dialogs
//<
isc.addGlobal("ask", function (message, callback, properties) {
    isc.showMessage(message, "ask", callback, properties);
});

//>	@classMethod	isc.confirm()
// Show a modal dialog with a message, icon, and "OK" and "Cancel" buttons.
// <P>
// The callback will receive boolean true for an OK button click, or null for a Cancel click or
// if the Dialog is dismissed via the close button.
// <P>
// Note: this does not override the native window.confirm() method.
//
//	@param	message			(string)	message to display
//  @param  [callback]      (Callback)  Callback to fire when the 
//                                      user clicks a button to dismiss the dialog.
//                                      This has the single parameter 'value', indicating the 
//                                      value returned by the Warn dialog from 'okClick()' etc.
//	@param	[properties]	(Dialog Properties)	additional properties for the Dialog.
//                                      To set +link{Dialog.toolbarButtons,custom buttons} for
//                                      the Dialog, set properties.toolbarButtons to an array of
//                                      buttons
//										eg:	{ buttons : [Dialog.OK, Dialog.CANCEL] }
//
// @group Prompting
// @visibility external
// @see Dialog.Warn
// @see classMethod:isc.warn()
// @see method:Dialog.okClick()
// @see method:Dialog.cancelClick()
// @see classAttr:Dialog.CONFIRM_TITLE
// @example dialogs
//<
isc.confirm = function (message, callback, properties) {
    isc.showMessage(message, "confirm", callback, properties);
}

//> @classMethod isc.askForValue()
// Show a modal dialog with a text entry box, asking the user to enter a value.
// <P>
// As with other convenience methods that show Dialogs, such as +link{classMethod:isc.warn()},
// the dialog is shown and the function immediately returns.  When the user responds, the
// provided callback is called.
// <P>
// If the user clicks OK, the value typed in is passed to the callback (including the empty
// string ("") if nothing was entered.  If the user clicks cancel, the value passed to the
// callback is null.
// <P>
// A default value for the text field can be passed via <code>properties.defaultValue</code>.
// <P>
// Keyboard focus is automatically placed in the text entry field, and hitting the enter key is
// the equivalent of pressing OK.
//
//	@param	message			(string)	message to display
//  @param  [callback]      (Callback)  Callback to fire when the 
//                                      user clicks a button to dismiss the dialog.
//                                      This has the single parameter 'value', indicating the 
//                                      user entry, or null if cancel was pressed or the window
//                                      closed
//	@param	[properties]	(Dialog Properties)	additional properties for the Dialog.
//                                      To set +link{Dialog.toolbarButtons,custom buttons} for
//                                      the Dialog, set properties.toolbarButtons to an array of
//                                      buttons
//										eg:	{ buttons : [Dialog.OK, Dialog.CANCEL] }
//
// @see method:Dialog.okClick()
// @see method:Dialog.cancelClick()
// @see classAttr:Dialog.ASK_FOR_VALUE_TITLE
// @group Prompting
// @visibility external
//<
isc.askForValue = function (message, callback, properties) {
    properties = properties || isc.emptyObject;

    var askDialog = isc.Dialog.Ask
    if (!askDialog) {
        var askForm = isc.DynamicForm.create({
            numCols:1, 
            padding:3,
            items: [
                { name:"message", type:"blurb" },
                { name:"value", showTitle:false, width:"*" }
            ],  
            // fire okClick on enter
            saveOnEnter:true,
            submit : function () { this.askDialog.okClick(); }
        });
        askDialog = isc.Dialog.Ask = isc.Dialog.create({
            items : [ askForm ],
            askForm: askForm,
            canDragReposition:true,
            isModal:true,
            // accomplishes vertical autoSizing
            bodyProperties : {overflow:"visible"},
            overflow:"visible"
        });
        askForm.askDialog = askDialog;

        // return the form value to the callback on okClick
        askDialog._okClickFunction = function () {
            this.clear();
            this.returnValue(this.askForm.getValue("value"));
        }
    }
    // If we were given explicit left/top coords, auto-center, otherwise respect them
    var explicitPosition = properties.left != null || properties.top != null;
  
    if (properties.buttons != null) {
        this.logWarn("isc.askForValue() called with 'buttons' attribute specified on the " +
            "properties object. This usage has been deprecated in favor of specifying " +
            "properties.toolbarButtons. Copying the buttons attribute value across to " +
            "toolbarButtons", "deprecated");
        properties.toolbarButtons = properties.buttons;
        delete properties.buttons;
    }

    // copy properties and install defaults
    properties = isc.addProperties({
        callback: callback,
        title: properties.title || isc.Dialog.ASK_FOR_VALUE_TITLE,
        autoCenter:!explicitPosition,
        left: (explicitPosition ? properties.left || "10%" : null), 
        top: (explicitPosition ? properties.top || "20%" : null), 
        width: properties.width || "80%", 
        height: properties.height || 20,
        toolbarButtons: properties.toolbarButtons || [ isc.Dialog.OK, isc.Dialog.CANCEL ],
        okClick : properties.okClick || askDialog._okClickFunction
    }, properties);
    
    // have standard handlers added to properties
    isc._applyDialogHandlers(properties);

    askDialog.setProperties(properties);

    askDialog.askForm.setValues({ 
        message : message || "Please enter a value:", 
        value : properties.defaultValue || "" 
    });
    askDialog.show();
    askDialog.askForm.focusInItem("value");
}

//> @classMethod isc.showLoginDialog()
// Handle a complete login interaction with a typical login dialog asking for username and
// password credentials using the +link{LoginDialog} class.
// <P>
// As with other convenience methods that show Dialogs, such as +link{classMethod:isc.warn()},
// the dialog is shown and the function immediately returns.  When the user responds, the
// provided callback function is called.
// <P>
// If the user clicks the "Log in" button, the credentials entered by the user are passed to
// the provided "loginFunc" as an Object with properties "username" and "password" (NOTE: both
// property names are all lowercase), as the variable "credentials".  For example:
// <pre>{ username: "barney", password: "rUbbL3" }</pre>
// <P>
// The "loginFunc" should then attempt to log in by whatever means is necessary.  The second
// parameter to the loginFunc, "dialogCallback", is a function, which must be called <i>whether
// login succeeds or fails</i> with a true/false value indicating whether login succeeded.
// <P>
// If the login dialog is dismissable (settable as properties.dismissable, default false) and
// the user dismisses it, the loginFunc will be fired with null for the credentials.
// <P>
// The following code shows typical usage.  This code assumes you have created a global
// function sendCredentials() that send credentials to some authentication system and fires a
// callback function with the result:
// <pre>
// isc.showLoginDialog(function (credentials, dialogCallback) {
//     if (credentials == null) return; // dismissed
//
//     // send credentials    
//     sendCredentials(credentials, function (loginSucceeded) {
//         // report success or failure
//         dialogCallback(loginSucceeded);
//     })
// })
// </pre>
// The login dialog has several built-in behaviors:
// <ul>
// <li> keyboard focus is automatically placed in the username field
// <li> hitting enter in the username field proceeds to the password field
// <li> hitting enter in the password field submits (fires the provided callback)
// </ul>
// In addition to normal properties supported by Dialog/Window, the following special
// properties can be passed:
// <ul>
// <li><code>username</code>: initial value for the username field
// <li><code>password</code>: initial value for the password field
// <li><code>usernameTitle</code>: title for the username field
// <li><code>passwordTitle</code>: title for the password field
// <li><code>errorMessage</code>: default error message on login failure
// <li><code>loginButtonTitle</code>: title for the login button
// <li><code>dismissable</code>: whether the dialog can be dismissed, default false
// <li><code>errorStyle</code>: CSS style for the error message, if shown
// </ul>
// See below for links to the default values for these properties.
//
//  @param  loginFunc       (Callback)  Function to call to attempt login.  Receives parameters
//                                      "credentials" and "dialogCallback", described above
//	@param	[properties]	(LoginDialog Properties)	additional properties for the Dialog
//
// @see classAttr:LoginDialog.LOGIN_TITLE
// @see classAttr:LoginDialog.USERNAME_TITLE
// @see classAttr:LoginDialog.PASSWORD_TITLE
// @see classAttr:LoginDialog.LOGIN_BUTTON_TITLE
// @see classAttr:LoginDialog.LOGIN_ERROR_MESSAGE
// @group Prompting
// @visibility external
//<

//>	@class	LoginDialog
// Handle a complete login interaction with a typical login dialog asking for username and
// password credentials. Use this
// class to quickly present a traditional username/password authentication mechanism in a
// SmartClient window.
// <p>
// To adapt this class to your requirements, first implement LoginDialog.loginFunc to submit
// the username and password to the authentication mechanism of your choice, calling
// dialogCallback once the authentication process completes.
//
// @see classMethod:isc.showLoginDialog
// @treeLocation Client Reference/Control
// @group Prompting
// @visibility external
//<

isc.ClassFactory.defineClass("LoginDialog", "Window");
isc.LoginDialog.registerStringMethods({
    //> @method loginDialog.register()
    // Called if the user clicks on the +link{loginDialog.registrationItem,registration link}
    // on the login form. Implement this method to allow the user to register for a
    // new account.
    // @param values (Object) Current values of form fields
    // @param form (DynamicForm) Form on which the link was clicked
    // @visibility external
    //<
    register:"values, form",
    
    //> @method loginDialog.lostPassword()
    // Called if the user clicks on the +link{loginDialog.lostPasswordItem,"Lost Password"} link
    // on the login form. Implement this method to allow the user to request the password 
    // be resent or reset.
    // @param values (Object) Current values of form fields
    // @param form (DynamicForm) Form on which the link was clicked
    // @visibility external
    //<
    lostPassword:"values, form"
});
isc.LoginDialog.addClassProperties({
    firstTimeInit: true
});
isc.LoginDialog.addProperties({
    //> @method loginDialog.loginFunc()
    // User-supplied callback function to process login transactions. 
    // <p>If the user clicks the "Log in" button, the credentials entered by the user are passed to
    // loginFunc as an Object with properties "username" and "password" (NOTE: both
    // property names are all lowercase), as the variable "credentials".  For example:
    // <pre>{ username: "barney", password: "rUbbL3" }</pre>
    // <P>
    // This function should then attempt to log in by whatever means is necessary.  The second
    // parameter to the loginFunc, "dialogCallback", is a function, which must be called <i>whether
    // login succeeds or fails</i> with a true/false value indicating whether login succeeded.
    // <P>
    // If the login dialog is dismissable (settable as properties.dismissable, default false) and
    // the user dismisses it, loginFunc will be fired with null for the credentials.
    // <P>
    // The following code shows typical usage.  This code assumes you have created a global
    // function sendCredentials() that send credentials to some authentication system and fires a
    // callback function with the result:
    // <pre>
    // ...
    // loginFunc : function (credentials, dialogCallback) {
    //     if (credentials == null) return; // dismissed
    //
    //     // send credentials    
    //     sendCredentials(credentials, function (loginSucceeded) {
    //         // report success or failure
    //         dialogCallback(loginSucceeded);
    //     })
    // })
    // ...
    // </pre>
    // @param credentials (Object) Login credentials supplied by the user
    // @param dialogCallback (Function) Function that must be called once the login transaction
    // completes
    // @visibility external
    //<

    //> @attr loginDialog.dismissable (Boolean : false : [IR])
    // If true, allow the user to close the LoginDialog by pressing Escape or by pressing
    // a Close button on the upper right corner (only visible when true).
    // <p>If the Dialog is dismissed,
    // +link{LoginDialog.loginFunc} is called with null arguments.
    // <p>Note that this attribute overrides the dismissOnEscape and showCloseButton
    // attributes.
    // @visibility external
    //<
    
    //> @attr   loginDialog.dismissOnEscape  (boolean : null : [IRW])
    // Do not set LoginDialog.dismissOnEscape; it is controlled by the 
    // +link{LoginDialog.dismissable}
    // property.
    // @visibility external
    //<
    
    //>	@attr	loginDialog.showCloseButton		(boolean : true : [IRW])
    // Do not set LoginDialog.showCloseButton; it is controlled by the 
    // +link{LoginDialog.dismissable}
    // property.
    // @visibility external
    //<
    
    dismissable: false,
    
    //> @attr loginDialog.allowBlankPassword (Boolean : false : IR)
    // If true, the login form will allow blank passwords to be submitted. Otherwise
    // the form fails to be validated until the user enters at least one character into
    // the password field.
    // @visibility external
    //<
    allowBlankPassword: false,
    
    //> @attr loginDialog.showLostPasswordLink (Boolean : false : IR)
    // If true, display a +link{LinkItem} (+link{LoginDialog.lostPasswordItem})
    // meant for the user to click if the account's
    // credentials are forgotten. The text of the link is controlled by
    // +link{loginDialog.lostPasswordItemTitle}. If clicked, the link will fire
    // +link{loginDialog.lostPassword()}.
    // @visibility external
    //<
    showLostPasswordLink: false,
    
    //> @attr loginDialog.showRegistrationLink (Boolean : false : IR)
    // If true, display a +link{LinkItem} (+link{LoginDialog.registrationItem})
    // meant for the user to click if the user wishes to register a new account.
    // The text of the link is controlled by
    // +link{loginDialog.registrationItemTitle}. If clicked, the link will fire
    // +link{loginDialog.register()}.
    // @visibility external
    //<
    showRegistrationLink: false,
    
    //> @attr loginDialog.title (String : Dialog.LOGIN_TITLE : IR)
    // Specifies the title of the dialog box. 
    // @visibility external
    //<
    
    //> @attr loginDialog.errorStyle (String : "formCellError" : IR)
    // Specifies the CSS style of the error text shown for a login failure.
    // @visibility external
    //<
    errorStyle: "formCellError",
    
    //> @attr loginDialog.usernameItemTitle (String : Dialog.USERNAME_TITLE : IR)
    // Specifies the title of the "usernameItem" field of the +link{loginForm}.
    // @visibility external
    //<
    
    //> @attr loginDialog.passwordItemTitle (String : Dialog.PASSWORD_TITLE : IR)
    // Specifies the title of the "passwordItem" field of the +link{loginForm}.
    // @visibility external
    //<
    
    //> @attr loginDialog.loginButtonTitle (String : Dialog.LOGIN_BUTTON_TITLE : IR)
    // Specifies the contents of the login submission button of the +link{loginForm}.
    // @visibility external
    //<
    
    //> @attr loginDialog.lostPasswordItemTitle (String : LoginDialog.lostPasswordItemTitle : IR)
    // Specifies the contents of the password request button (if configured) on
    // the +link{loginForm}.
    // @visibility external
    //<
    lostPasswordItemTitle: "Lost Password?",
    
    //> @attr loginDialog.registrationItemTitle (String : LoginDialog.registrationItemTitle : IR)
    // Specifies the contents of the registration link (if configured) on
    // the +link{loginForm}.
    // @visibility external
    //<
    registrationItemTitle: "Register",
    
    //> @attr loginDialog.errorMessage (String : Dialog.LOGIN_ERROR_MESSAGE : IR)
    // Specifies the default error message displayed on the login form when 
    // authentication fails.
    // @visibility external
    //<
    
    autoCenter: true,
    autoSize: true,
    isModal: true,
    showMinimizeButton:false,
    
    //> @attr loginDialog.items (Array of String : ["autoChild:loginForm"] : IR)
    // Specifies the dialog contents. By default, the dialog only contains
    // +link{LoginDialog.loginForm}. If desired, additional widgets may be placed before/after
    // the loginForm. To specify these widgets as +link{group:autoChildren}, use the syntax
    // "autoChild:<i>childName</i>" +link{group:autoChildren,as used for panes/items of 
    // Tabs/SectionStacks}.
    // @visibility external
    //<
    items: [ "autoChild:loginForm" ],
    
    
    //> @attr loginDialog.formFields (Array of FormItem Properties : null : IR)
    // Customizes the fields present in the dialog, or specifies new fields to be
    // present, in the same manner as with +link{DynamicForm.fields}.
    //
    // @see DataBoundComponent.fields
    // @visibility external
    //<
    
    //> @attr loginDialog.loginFailureItem ( AutoChild : null : [IR] )
    // Field item containing login error message (if required) in +link{LoginDialog.loginForm}.
    // @visibility external
    //<

    //> @attr loginDialog.usernameItem ( AutoChild : null : [IR] )
    // Username field item in +link{LoginDialog.loginForm}.
    // @visibility external
    //<
    
    //> @attr loginDialog.lostPasswordItem ( AutoChild : null : [IR] )
    // +link{linkItem} to page requesting forgotten password in +link{LoginDialog.loginForm}.
    // <p>To handle user clicks on this link, implement +link{loginDialog.lostPassword}.
    // <p>To handle a user click as a physical link to another page, set
    // +link{linkItem.defaultValue} via loginDialog.lostPasswordItemProperties:
    // <code>
    // lostPasswordItemProperties: {
    //     defaultValue: "register.html"
    // },
    // </code>
    // @see loginDialog.showLostPasswordLink
    // @see loginDialog.lostPasswordItemTitle
    // @visibility external
    //<
    
    //> @attr loginDialog.registrationItem ( AutoChild : null : [IR] )
    // +link{linkItem} to page requesting new user registration in +link{LoginDialog.loginForm}.
    // <p>To handle user clicks on this link, implement +link{loginDialog.register}.
    // <p>To handle a user click as a physical link to another page, set
    // +link{linkItem.defaultValue} via loginDialog.registrationItemProperties:
    // <code>
    // registrationItemProperties: {
    //     defaultValue: "register.html"
    // },
    // </code>
    // @see loginDialog.showRegistrationLink
    // @see loginDialog.registrationItemTitle
    // @visibility external
    //<
    
    //> @attr loginDialog.passwordItem ( AutoChild : null : [IR] )
    // Password field item in +link{LoginDialog.loginForm}.
    // @see loginDialog.allowBlankPassword
    // @see loginDialog.passwordItemTitle
    // @visibility external
    //<
    
    //> @attr loginDialog.loginButton ( AutoChild : null : [IR] )
    // Login submission button in +link{LoginDialog.loginForm}.
    // @see loginDialog.loginButtonTitle
    // @visibility external
    //<

    //> @attr loginDialog.defaultValues ( Object : null : [IR] )
    // Adds default values to +link{loginDialog.loginForm}.
    // @visibility internal
    //<
    
    //> @attr loginDialog.loginForm ( AutoChild : null : R )
    // Form used to request login credentials from the user. 
    // @see loginDialog.formFields
    // @visibility external
    //<
    
    loginFormConstructor: "DynamicForm",
    loginFormDefaults: {
        numCols: 2,
        padding: 4,
        autoDraw: false,
        saveOnEnter:true,
        
        submit : function () {
            var loginForm = this,
                params = [{
                    username : this.getValue("usernameItem"), 
                    password : this.getValue("passwordItem")
                }];

            params[1] = function (success, errorMessage) {
                if (success) {
                    loginForm.complete(); // report success
                } else {
                    // failed login attempt - indicate failure, remain visible
                    if (errorMessage != null)
                        loginForm.setValue("loginFailureItem", errorMessage)
                    loginForm.showItem("loginFailureItem");
                    loginForm.focusInItem("passwordItem");
                }
            };
        
            this.fireCallback(this.loginDialog.loginFunc, "credentials,dialogCallback", params);
        },
        complete : function (dismissed) {
            this.loginDialog.hide();
            this.setValue("loginFailureItem", this.loginDialog.errorMessage);
            // reset for next time
            this.setValue("usernameItem", "");
            this.setValue("passwordItem", "");    
            this.hideItem("loginFailureItem");
            
            // if this was a dismissal, tell the loginFunc
            if (dismissed) {
                this.fireCallback(this.loginFunc, "credentials,dialogCallback");
            } else {
                // if the server provided a loginRedirect, use it. This will be set
                // if an Authentication login page is visited without having credentials.
                
                var loginRedirect = isc.Cookie.get("loginRedirect");
                if (loginRedirect) window.location.replace(loginRedirect);
            }
        }
    },
    
    formDSDefaults: {
        clientOnly: true,
        useAllDataSourceFields: true
    },
    formDefaultFields: [
        { name: "loginFailureItem", type:"blurb", colSpan: 2, visible:false },
        { name: "usernameItem", required:true, 
            keyPress : function (item, form, keyName) {
                if (keyName == "Enter") {
                    form.focusInItem("passwordItem");
                    return false;
        }}},
        { name: "passwordItem", type: "password", required: true },
        { name: "loginButton", type:"button", type:"submit" },
        { name: "lostPasswordItem", type: "link", target: "javascript", canEdit:false, 
            endRow: true, numCols:2, colSpan:2, showTitle: false, 
            click: "form.loginDialog.lostPassword(form.getValues(), form)"
        },
        { name: "registrationItem", type: "link", target: "javascript", canEdit:false, 
            endRow: true, numCols: 2, colSpan: 2, showTitle: false, 
            click: "form.loginDialog.register(form.getValues(), form)"
        }
    ],
    
    getDynamicDefaults : function (child) {
        switch (child) {
        case "loginForm":
            var ret = {
                loginDialog: this,
                values: {
                    usernameItem: this.username || "",
                    passwordItem: this.password || "",
                    loginFailureItem: this.errorMessage
                },
                fields: this.formFields
            };
            
            // Bind form to datasource containing internally specified FormItem
            // properties. This datasource is updated with properties slurped up
            // from LoginDialog itself, ie usernameItemTitle, etc. 
            // The user manipulates the form items either through
            // <item name>Properties (which ultimately affects the datasource
            // fields) or through formFields (which ultimately affects
            // form.fields itself).
            
            // safe to clone - not manipulated yet
            var updatedFields = isc.clone(this.formDefaultFields);
            
            // Build fields from this.<fieldName>Defaults + this.<fieldName>Properties +
            // this.<fieldName>Title. However, LinkItem fields need special treatment
            // as their titles specifically map to linkTitle if showTitle:false...
            for (var j=0; j<updatedFields.length; j++) {
                var field = updatedFields[j], name = field.name;
                
                isc.addProperties(field, this[name+"Defaults"], this[name+"Properties"]);
                
                if (null != this[name + "Title"]) {
                    field.title = this[name + "Title"];
                    if (field.type == 'link' && !field.showTitle)
                        field.linkTitle = this[name + "Title"];
                }

                // Go through some extra contortions so that eg "showMyField" maps to
                // field of name "myField".
                
                var showField = this["show" + name.substr(0, 1).toUpperCase() +
                    name.substr(1)];
                if (null != showField) field.visible = showField;
                
                // custom logic needed for some fields
                switch (name) {
                case "registrationItem": field.visible = this.showRegistrationLink; break;
                case "lostPasswordItem": field.visible = this.showLostPasswordLink; break;
                case "loginFailureItem": field.cellStyle = this.errorStyle; break;
                case "passwordItem": field.required = !this.allowBlankPassword; break;
                }
                updatedFields[j] = field;
            }
            ret.dataSource = isc.DataSource.create(this.formDSDefaults,{fields:updatedFields});
            
            // Note that LoginDialog.init controls initialization of some field attributes,
            // like errorStyle and values, which are controlled from uniquely named
            // LoginDialog attributes rather than <fieldName>Defaults etc.
            return ret;
        }
        return null;
    },
    cancelClick : function () { this.loginForm.complete(true) },
    init : function () {
        
        if (isc.LoginDialog.firstTimeInit) {
            isc.LoginDialog.firstTimeInit = false;
            isc.LoginDialog.addProperties({
                title: isc.Dialog.LOGIN_TITLE,
                usernameItemTitle: isc.Dialog.USERNAME_TITLE,
                passwordItemTitle: isc.Dialog.PASSWORD_TITLE,
                loginButtonTitle: isc.Dialog.LOGIN_BUTTON_TITLE,
                errorMessage: isc.Dialog.LOGIN_ERROR_MESSAGE
            });
        }
        this.dismissOnEscape = this.showCloseButton = this.dismissable;
        this.Super("init", arguments);
        this.loginForm.focusInItem("usernameItem");
        // handle initial values
        // this functionality was lost in the merge into mainline from 70RC
        if (this.username) this.loginForm.setValue("usernameItem", this.username);
        if (this.password) this.loginForm.setValue("passwordItem", this.password);
    }
});

isc.showLoginDialog = function (loginFunc, properties) {
    return isc.LoginDialog.create(isc.addProperties({}, properties, { autoDraw:true, loginFunc: loginFunc }));
}


// NOTE: unfinished dialog to confirm save when closing / exiting an application, or otherwise
// dropping edits.
// Typical Windows buttons: [*Yes*, No, Cancel]
// Typical Mac buttons: [Don't Save, separator, Cancel, *Save*]
/*
isc.confirmSave = function (message, callback, properties) {
    isc.confirm(message || isc.Dialog.saveChangesMessage, {
                    buttons:[isc.Dialog.OK,
                             {title:"Save", width:75,
                              click:"this.hide();this.topElement.returnValue('save');"},
                             isc.Dialog.CANCEL]
                }
                );
}
*/
