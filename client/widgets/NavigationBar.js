/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2010-11-04 (2010-11-04)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */


//> @class NavigationButton extends Button
// Specially styled Button subclass used by the +link{NavigationBar} class.
// @visibility external
// @treeLocation Client Reference/Layout/NavigationBar
//<
isc.defineClass("NavigationButton", "Button");

isc.NavigationButton.addProperties({
    height: 30,
    autoFit: true,
   
    //> @attr navigationButton.baseStyle (CSSStyle : "navButton" : IRW)
    // Default baseStyle for navigation buttons. Note that the special +link{backBaseStyle} and
    // +link{forwardBaseStyle} are applied if +link{navigationButton.direction} is set.
    // @visibility external
    //<
    baseStyle: "navButton",

    //> @attr navigationButton.backBaseStyle (CSSStyle : "navBackButton" : IRW)
    // Base style for navigation buttons where +link{direction} is set to <code>"back"</code>
    // @visibility external
    //<
    backBaseStyle: "navBackButton",
    
    //> @attr navigationButton.forwardBaseStyle (CSSStyle : "navForwardButton" : IRW)
    // Base style for navigation buttons where +link{direction} is set to <code>"forward"</code>
    // @visibility external
    //<
    forwardBaseStyle: "navForwardButton",

    //>	@type	NavigationDirection	
	// Navigation direction.
	// @value "back" Back
	// @value "forward" Forward
	// @value "none" none
	//
	// @visibility external
	//<
    
    //> @attr navigationButton.direction (NavigationDirection : "none" : IRW)
    // Navigation direction for this button. If set to <code>"forward"</code> or
    // <code>"back"</code> the special +link{forwardBaseStyle} or +link{backBaseStyle}
    // will be applied.
    //
    // @visibility external
    //<
    direction: "none",

    
    initWidget : function () {
        this.setBaseStyle(this.getBaseStyleName());
    },

    setNavigationDirection : function (direction) {
        this.direction = direction;
        this.setBaseStyle(this.getBaseStyleName());
    },

    getNavigationDirection : function () {
        return this.direction;
    },

    getBaseStyleName : function () {
        if (this.direction == "back") {
            return this.backBaseStyle;
        }
        if (this.direction == "forward") {
            return this.forwardBaseStyle;
        }
        return this.baseStyle;
    }

});
 

//> @class NavigationBar extends HLayout
// Navigation control implemented as a horizontal layout showing back and forward controls 
// and a title.
// @visibility external
// @treeLocation Client Reference/Layout
//<
isc.defineClass("NavigationBar", "HLayout");

isc.NavigationBar.addProperties({
    width: "100%",
    height: 44,
    styleName:"navToolbar",
    
    //> @attr navigationBar.leftButtonTitle (String : "&nbsp;" : IRW)
    // +link{Button.title,Title} for the +link{leftButton}
    // @visibility external
    //<
    leftButtonTitle:"&nbsp;",
    
    //> @attr navigationBar.leftButtonIcon (SCImgURL : null : IRW)
    // +link{button.icon,Icon} for the +link{leftButton}
    // @visibility external
    //<
    
    //> @attr navigationBar.leftButton (AutoChild : null : IR)
    // The button displayed to the left of the title in this NavigationBar. By default this
    // will be a +link{NavigationButton} with +link{navigationButton.direction,direction} set
    // to <code>"back"</code>.
    //
    // @visibility external
    //<
    leftButtonDefaults: {
        _constructor: "NavigationButton",
        direction: "back",
        layoutAlign: "center"
    },

    //> @attr navigationBar.title (String : null : IRW)
    // The title to display centered in this NavigationBar
    //
    // @visibility external
    //<

    //> @attr navigationBar.titleLabel (AutoChild : null : IR)
    // The AutoChild label used to display the +link{navigationBar.title, title} in this
    // NavigationBar.
    //
    // @visibility external
    //<
    titleLabelDefaults: {
        _constructor: "Label",
        width: "*",
        styleName:"navBarHeader",
        align: "center",
        valign: "center"
    },
    
    //> @attr navigationBar.rightButtonTitle (String : "&nbsp;" : IRW)
    // +link{Button.title,Title} for the +link{rightButton}
    // @visibility external
    //<
    rightButtonTitle:"&nbsp;",
    
    //> @attr navigationBar.rightButtonIcon (SCImgURL : null : IRW)
    // +link{button.icon,Icon} for the +link{rightButton}
    // @visibility external
    //<
    
    //> @attr navigationBar.rightButton (AutoChild : null : IR)
    // The button displayed to the right of the title in this NavigationBar. By default this
    // will be a +link{NavigationButton} with +link{navigationButton.direction,direction} set
    // to <code>"forward"</code>.
    //
    // @visibility external
    //<
    rightButtonDefaults: {
        _constructor: "NavigationButton",
        direction: "forward",
        layoutAlign: "center"
    },
    showRightButton:false,
    
    autoChildren: ["leftButton", "titleLabel", "rightButton"],
    
    //> @attr navigationBar.controls (Array of string or canvas : null : IRW)
    // Controls to show in the navigation bar. The auto children names
    // "leftButton", "titleLabel", "rightButton" may be used to show the standard
    // navigation bar controls, as well as any Canvases (which will be embedded directly
    // in the navigation bar).
    // @visibility internal
    //<
    // When we expose this we'll also need to update SGWT wrapper code to handle it
    controls:["leftButton", "titleLabel", "rightButton"],
    
    //> @method navigationBar.setControls()
    // Setter to update the set of displayed +link{navigationBar.controls} at runtime.
    // @param controls (Array of string or canvas)
    // @visibility internal
    //<
    setControls : function (controls) {
        this.controls = controls;
        var members = [];
        for (var i = 0; i < controls.length; i++) {
            var control = controls[i];
            // translate from autoChild name to live autoChild widget
            if (isc.isA.String(control)) control = this[control];
            members[i] = control;
        }
        this.setMembers(members);
    },
    
    initWidget : function () {
        this.Super("initWidget", arguments);
        
        var leftButtonDefaults = {
            click:function () {
                if (this.creator.navigationClick) this.creator.navigationClick(this.direction);
            }
        };
        if (this.leftButtonTitle != null) leftButtonDefaults.title = this.leftButtonTitle;
        if (this.leftButtonIcon != null) leftButtonDefaults.icon = this.leftButtonIcon;
        
        this.leftButton = this.createAutoChild("leftButton", leftButtonDefaults);
        this.titleLabel = this.createAutoChild("titleLabel", { contents: this.title });
        
        
        var rightButtonDefaults = {
            click:function () {
                if (this.creator.navigationClick) this.creator.navigationClick(this.direction);
            }
        };
        if (this.rightButtonTitle != null) rightButtonDefaults.title = this.rightButtonTitle;
        if (this.rightButtonIcon != null) rightButtonDefaults.icon = this.rightButtonIcon;
        this.rightButton = this.createAutoChild("rightButton", rightButtonDefaults);
        this.setControls(this.controls);
    },
    
    //> @method navigationBar.setTitle()
    // Updates the title for this navigationBar.
    // @param newTitle (String) New title
    // @visibility external
    //<
    setTitle : function (newTitle) {
        this.title = newTitle;
        this.titleLabel.setContents(this.title);
    },
    
    //> @method navigationBar.setLeftButtonTitle()
    // Setter for +link{leftButtonTitle}
    // @param newTitle (String) new title for left button
    // @visibility external
    //<
    setLeftButtonTitle : function (newTitle) {
        this.leftButtonTitle = newTitle;
        if (this.leftButton) this.leftButton.setTitle(newTitle);
    },
    
    //> @method navigationBar.setLeftButtonIcon()
    // Setter for +link{leftButtonIcon}
    // @param newIcon (SCImgURL) new icon for left button
    // @visibility external
    //<
    setLeftButtonIcon : function (newIcon) {
        this.leftButtonIcon = newIcon;
        if (this.leftButton) this.leftButton.setIcon(newIcon);
    },
    
    //> @method navigationBar.setShowLeftButton()
    // Show or hide the +link{leftButton}
    // @param visible (Boolean) if true, the button will be shown, otherwise hidden.
    // @visibility external
    //<
    setShowLeftButton : function (show) {
        if (this.leftButton == null) return;
        var visible = (this.leftButton.visibility != isc.Canvas.HIDDEN);
        if (show == visible) return;
        // Calling setVisibility rather than show/hide so if the button is
        // created but not currently in our members array we don't draw it on 'show'
        this.leftButton.setVisibility(show ? isc.Canvas.INHERIT : isc.Canvas.HIDDEN);
    },

    //> @method navigationBar.setRightButtonTitle()
    // Setter for +link{rightButtonTitle}
    // @param newTitle (String) new title for right button
    // @visibility external
    //<
    setRightButtonTitle : function (newTitle) {
        if (this.rightButton) this.rightButton.setTitle(newTitle);
    },
    //> @method navigationBar.setRightButtonIcon()
    // Setter for +link{rightButtonIcon}
    // @param newIcon (SCImgURL) new icon for right button
    // @visibility external
    //<
    setRightButtonIcon : function (newIcon) {
        this.rightButtonIcon = newIcon;
        if (this.rightButton) this.rightButton.setIcon(newIcon);
    },
    
    //> @method navigationBar.setShowRightButton()
    // Show or hide the +link{rightButton}
    // @param visible (Boolean) if true, the button will be shown, otherwise hidden.
    // @visibility external
    //<
    setShowRightButton : function (show) {
        if (this.rightButton == null) return;
        var visible = (this.rightButton.visibility != isc.Canvas.HIDDEN);
        if (show == visible) return;
        this.rightButton.setVisibility(show ? isc.Canvas.INHERIT : isc.Canvas.HIDDEN);

    }


});

isc.NavigationBar.registerStringMethods({
    //> @method navigationBar.navigationClick()
    // Notification method fired when the user clicks the +link{leftButton} or +link{rightButton}
    // @param direction (NavigationDirection) direction in which the user is attempting to 
    //   navigate
    // @visibility external
    //<
    navigationClick:"direction"
});

