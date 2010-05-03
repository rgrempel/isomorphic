/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2010-05-02 (2010-05-02)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */

 



//>	@class	ButtonItem
// FormItem for adding a Button to a form.
// @visibility external
//<
isc.ClassFactory.defineClass("ButtonItem", "CanvasItem");

isc.ButtonItem.addProperties({
    // Override canFocus -- even though buttons have no data element, they can accept focus.
    canFocus:true,

    // avoid attempting to include this item in the form's values array
    shouldSaveValue:false,

    //>	@attr	buttonItem.height		(number : null : IRW)
	// By default buttonItems are sized to match their content (see +link{ButtonItem.autoFit}).
    // Specifying an explicit size for the button will disable this behavior.
    // @group appearance
    // @visibility external
	//<
	height:null,

    //>	@attr	buttonItem.width    (number : null : IRW)
	// By default buttonItems are sized to match their content (see +link{ButtonItem.autoFit}).
    // Specifying an explicit size for the button will disable this behavior.
	// @group	appearance
    // @see buttonitem.autoFit
	//<
	width:null,
    
    //>	@attr	buttonItem.baseStyle        (CSSStyleName : null : IRW)
	//  Optional <code>baseStyle</code> will be applied to the button.
	//		@group	appearance
    //      @visibility external
	//<
	//baseStyle:null,

    //>	@attr	buttonItem.icon     (SCImgURL : null : IR)
    // Optional icon image to display on the button for this item.  See +link{button.icon}.
    // @visibility external
	//<
    //icon :  null
    
    //>	@attr	buttonItem.titleStyle       (CSSStyleName : null : IRW)
	//  Optional CSS class to apply to the button title.
	//		@group	appearance
    //      @visibility internal
	//<
    
    titleStyle:null,

    //>	@attr	buttonItem.showTitle		(boolean : false : IRW)
	// Buttons do not show a title by default.
	//		@group	appearance
    // @visibility external
	//<
	showTitle:false,

	//>	@attr	buttonItem.startRow		(boolean : true : IRW)
	// These items are in a row by themselves by default
	// @group formLayout
    // @visibility external
	//<
	startRow:true,

	//>	@attr	buttonItem.endRow			(boolean : true : IRW)
	// These items are in a row by themselves by default
	// @group formLayout
    // @visibility external
	//<
	endRow:true,

    //>	@attr	buttonItem.buttonConstructor      (Class : isc.Button : IRA)
	//      Constructor class for the button.
    // @visibility external
	//<
    buttonConstructor : isc.Button,
    
    //> @attr buttonItem.autoFit (boolean : true : IR)
    // Should the button auto fit to its title. Maps to +link{isc.Button.autoFit} attribute.
    // Note that if an explicit width or height is specified for this item, it will be respected,
    // disabling autoFit behavior
    // @visibility external
    //<
    // We could have autoFit override the specified size properties instead of vice versa, but
    // this behavior gives us backwards compatibility (for example Button items sized to "*" will
    // not fill the available row without needing to also change the value of item.autoFit), and
    // it more closely matches the behavior of StatefulCanvas.autoFit, which is disabled once
    // setWidth() / setHeight() is called
    autoFit:true,
    
    //>	@attr	buttonItem.buttonDefaults   (Object : { ... } : IRA)
    //  Class level default properties to apply to our button item.
    //  Modify 'buttonProperties' at the instance level rather than modifying this object.
	//<
    buttonDefaults : {
        click : function () { return this.canvasItem.handleClick(); },
        doubleClick : function () { return this.canvasItem.handleDoubleClick(); },
        getTitle : function () { return this.canvasItem.getTitle(); }
    },

    autoDestroy: true
    
    //>	@attr	buttonItem.buttonProperties   (Object : null : IRA)
    //  Custom Properties to apply to our button item.
    // @visibility external
	//<
    //buttonProperties : null
    
   
    
});

isc.ButtonItem.addMethods({

    //> @method buttonItem.click
    // Called when a ButtonItem is clicked on.
    //
    // @param	form    (DynamicForm) the managing DynamicForm instance
    // @param	item	(FormItem)    the form item itself (also available as "this")
    // @group eventHandling
    // @visibility external
    //<
    // NOTE: actually registered as a StringMethod on FormItem


    // Override getTitleHTML to return the title as text, rather than the HTML title with 
    // <LABEL> tag and underlined accessKey
    getTitleHTML : function () {
        return this.getTitle();     
    },

    //>	@method	buttonItem.setTitle()
    // Set the title.
    // @group	appearance
    // @param	newTitle	(string)	new title
    // @visibility external
    //<
    setTitle : function (title) {
        this.title = title;
        if (this.canvas) this.canvas.setTitle(title);
    },
    
    // Override _createCanvas to set up a Button as this item's canvas, with appropriate 
    // properties.
    _createCanvas : function () {
        var dynamicButtonProperties = {
                canFocus : this._canFocus(),
                disabled : this.isDisabled(),
                
                width:this.width
            };
        if (this.height != null) dynamicButtonProperties.height = this.height;
            
        // Button-specific properties
        if (this.icon) dynamicButtonProperties.icon = this.icon;
        if (this.titleStyle) dynamicButtonProperties.titleStyle = this.titleStyle;
        if (this.baseStyle) dynamicButtonProperties.baseStyle = this.baseStyle;
        if (this.autoFit != null) dynamicButtonProperties.autoFit = this.autoFit;
        
        // Use 'addAutoChild' - this will handle applying the various levels of defaults
        this.canvas = this.createAutoChild("button", dynamicButtonProperties,
                                            this.buttonConstructor);        
        this.Super("_createCanvas", arguments);      

    }, 
    
    // if the button is auto-fitting to its content, avoid applying an explicit size
    // which would disable autoFit
    
    _setCanvasSize : function (width,height,c,d) {
        if (width == null && height == null) return;
        return this.invokeSuper(isc.ButtonItem, "_setCanvasSize", width,height,c,d);
    }
    
    //>EditMode
    ,
    _passthroughProps : {
        width:true, height:true
    },
    propertyChanged : function (propertyName, value) {
        if (this.canvas != null && this._passthroughProps[propertyName]) {
            this.canvas.setProperty(propertyName, value)
        }
    },
    handleClick : function () {
        if (this.editingOn) {
            if (isc.VisualBuilder && isc.VisualBuilder.titleEditEvent == "click") this.editClick();
            return false;
        }
        return this.Super("handleClick", arguments);      
    },
    handleDoubleClick : function () {
        if (this.editingOn) {
            if (isc.VisualBuilder && isc.VisualBuilder.titleEditEvent == "doubleClick") this.editClick();
            return false;
        }
        return this.Super("handleDoubleClick", arguments);      
    } 

    //<EditMode
    
    
});

