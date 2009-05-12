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

 







//>	@class	StretchImgButton
// A StretchImg that behaves like a button, going through up/down/over state transitions in response
// to user events.  Supports an optional title, and will auto-size to accomodate the title text if
// <code>overflow</code> is set to "visible".
// <P>
// Examples of use include fancy buttons, poplist headers, and tabs.
//
// @treeLocation Client Reference/Control
// @visibility external
//<

isc.defineClass("StretchImgButton", "StretchImg").addProperties({

    // Various properties documented on StatefulCanvas that affect all buttons
    // NOTE: This block is included in Button, ImgButton, and StretchImgButton.
    //       If you make changes here, make sure you duplicate it to the other
    //       classes.
    // 
    // End of this block is marked with: END StatefulCanvas @include block
    // =========================================================================

    // Title
    //------
    //> @attr stretchImgButton.title
    // @include statefulCanvas.title
    // @visibility external
    //<    
    //>	@method	stretchImgButton.getTitle()	(A)
    // @include statefulCanvas.getTitle
    // @visibility external
    //<
    //>	@method	stretchImgButton.setTitle()
    // @include statefulCanvas.setTitle
    // @visibility external
    //<
    
    //> @attr   stretchImgButton.wrap   (boolean : null : IRW)
    // Should the title for this button wrap? If unset, default behavior is to allow wrapping
    // if this.vertical is true, otherwise disallow wrapping
    // @visibility external
    //<

    
    // Icon
    //------
    
    // set useEventParts to true so we can have a separate iconClick method
    useEventParts:true,
    
    //> @attr stretchImgButton.icon
    // @include statefulCanvas.icon
    // @visibility external
    //<
    //> @attr stretchImgButton.iconSize
    // @include statefulCanvas.iconSize
    // @visibility external
    //<
    //> @attr stretchImgButton.iconWidth
    // @include statefulCanvas.iconWidth
    // @visibility external
    //<
    //> @attr stretchImgButton.iconHeight
    // @include statefulCanvas.iconHeight
    // @visibility external
    //<
    //> @attr stretchImgButton.iconOrientation
    // @include statefulCanvas.iconOrientation
    // @visibility external
    //<
    //> @attr stretchImgButton.iconAlign
    // @include statefulCanvas.iconAlign
    // @visibility external
    //<
    //> @attr stretchImgButton.iconSpacing
    // @include statefulCanvas.icon
    // @visibility external
    //<
    //> @attr stretchImgButton.showDisabledIcon
    // @include statefulCanvas.showDisabledIcon
    // @visibility external
    //<
    //> @attr stretchImgButton.showRollOverIcon
    // @include statefulCanvas.showRollOverIcon
    // @visibility external
    //<
    //> @attr stretchImgButton.showFocusedIcon
    // @include statefulCanvas.showFocusedIcon
    // @visibility external
    //<
    //> @attr stretchImgButton.showDownIcon
    // @include statefulCanvas.showDownIcon
    // @visibility external
    //<
    //> @attr stretchImgButton.showSelectedIcon
    // @include statefulCanvas.showSelectedIcon
    // @visibility external
    //<
    //> @method stretchImgButton.setIconOrientation()
    // @include statefulCanvas.setIconOrientation
    // @visibility external
    //<
    //> @method stretchImgButton.setIcon()
    // @include statefulCanvas.setIcon
    // @visibility external
    //<

    // AutoFit
    //--------
    //> @attr stretchImgButton.autoFit
    // @include statefulCanvas.autoFit
    // @visibility external
    //<    
    //> @method stretchImgButton.setAutoFit()
    // @include statefulCanvas.setAutoFit
    // @visibility external
    //<

    // baseStyle
    //----------
    //> @attr stretchImgButton.baseStyle (CSSStyleName : "stretchImgButton" : IRW)
    // @include statefulCanvas.baseStyle
    // @visibility external
    //<    
	baseStyle:"stretchImgButton",
    //> @method stretchImgButton.setBaseStyle()
    // @include statefulCanvas.setBaseStyle
    // @visibility external
    //<

    //>	@attr stretchImgButton.titleStyle (CSSStyleName : null : IRW)
    // CSS style applied to the title text only.  Defaults to +link{baseStyle} when unset.
    // <P>
    // With a separate <code>titleStyle</code> and +link{baseStyle} set, you can provide a
    // backgroundColor via <code>baseStyle</code> that will allow translucent .png media to be
    // "tinted" by the underlying background color, so that a single set of media can provide
    // range of color options.  In this usage, the <code>titleStyle</code> should generally not
    // specify a background color as this would block out the media that appears behind the
    // title.   
    // 
    // @visibility external
    //<		

    //>	@method stretchImgButton.setTitleStyle()
    // Sets the +link{titleStyle}, which is applied to the title text.
    // @param style (CSSStyleName) new title style
    // @visibility external
    //<		

    // selection
    //----------
    //> @attr stretchImgButton.selected
    // @include statefulCanvas.selected
    // @visibility external
    //<   
    //> @method stretchImgButton.select()
    // @include statefulCanvas.select
    // @visibility external
    //<
    //> @method stretchImgButton.deselect()
    // @include statefulCanvas.select
    // @visibility external
    //<
    //> @method stretchImgButton.isSelected()
    // @include statefulCanvas.isSelected
    // @visibility external
    //<
    //> @method stretchImgButton.setSelected()
    // @include statefulCanvas.select
    // @visibility external
    //<

    // radioGroup
    //-----------
    //> @attr stretchImgButton.radioGroup
    // @include statefulCanvas.radioGroup
    // @visibility external
    //<     
    //> @method stretchImgButton.addToRadioGroup()
    // @include statefulCanvas.addToRadioGroup
    // @visibility external
    //<
    //> @method stretchImgButton.removeFromRadioGroup()
    // @include statefulCanvas.removeFromRadioGroup
    // @visibility external
    //<
    //> @attr stretchImgButton.actionType
    // @include statefulCanvas.actionType
    // @visibility external
    //<     
    //> @method stretchImgButton.setActionType()
    // @include statefulCanvas.setActionType
    // @visibility external
    //<
    //> @method stretchImgButton.getActionType()
    // @include statefulCanvas.getActionType
    // @visibility external
    //<

    // state
    //------
    //> @attr stretchImgButton.state
    // @include statefulCanvas.state
    // @visibility external
    //<  
    //> @method stretchImgButton.setState()
    // @include statefulCanvas.setState
    // @visibility external
    //<
    //> @method stretchImgButton.setDisabled()
    // @include statefulCanvas.setDisabled
    // @visibility external
    //<
    //> @method stretchImgButton.getState()
    // @include statefulCanvas.getState
    // @visibility external
    //<
    //> @attr stretchImgButton.showDisabled
    // @include statefulCanvas.showDisabled
    // @visibility external
    //<  
    //> @attr stretchImgButton.showDown
    // @include statefulCanvas.showDown
    // @visibility external
    //<  
	showDown:true,						
    //> @attr stretchImgButton.showFocus
    // @include statefulCanvas.showFocus
    // @visibility external
    //<
    //> @attr stretchImgButton.showFocused
    // @include statefulCanvas.showFocused
    // @visibility external
    //<  
	showFocused:true, 
    //> @attr stretchImgButton.showRollOver
    // @include statefulCanvas.showRollOver
    // @visibility external
    //<  
	showRollOver:true,					

    // alignment
    //----------
    //> @attr stretchImgButton.align
    // @include statefulCanvas.align
    // @visibility external
    //<          
    //> @attr stretchImgButton.valign
    // @include statefulCanvas.valign
    // @visibility external
    //<      
    
        
    // Button.action
    //> @method StretchImgButton.action()
    // @include statefulCanvas.action
    // @visibility external
    //<

    // ================= END StatefulCanvas @include block =============== //    


    // Label
    // ---------------------------------------------------------------------------------------
    
    //> @attr StretchImgButton.showTitle (boolean : true : IRW)
    // @include StatefulCanvas.showTitle
    // @visibility external
    //<
    showTitle:true,
        
    //>	@attr	StretchImgButton.labelHPad  (number : null : IRW)
    // The padding for a StretchImgButton's label is determined as follows.
    // <P>
    // If <code>labelHPad</code> is set it will specify the horizontal padding applied to the
    // label. Similarly if <code>labelVPad</code> is set it will specify the vertical padding
    // for the label, regardless of the button's +link{StretchImgButton.vertical,vertical} setting.
    // <P>
    // Otherwise <code>labelLengthPad</code> can be set to specify the label padding along the
    // length axis (ie: horizontal padding if +link{StretchImgButton.vertical} is false,
    // otherwise vertical padding), and 
    // <code>labelBreadthPad</code> can be set to specify the label padding along the other axis.
    // <P>
    // Otherwise the padding on the length axis will match the +link{StretchImgButton.capSize} and
    // will be set to zero on the breadth axis.
    // <P>
    // So by default the label will be sized to match the center image of the StretchImgButton, but
    // these settings allow the label to partially or wholly overlap the caps.
    // @visibility external
    //<
                        
    
    //>	@attr	StretchImgButton.labelVPad  (number : null : IRW)
    // @include StretchImgButton.labelHPad
    // @visibility external
    //<
    
    //>	@attr	StretchImgButton.labelLengthPad  (number : null : IRW)
    // @include StretchImgButton.labelHPad
    // @visibility external
    //<
    
    //>	@attr	StretchImgButton.labelBreadthPad  (number : null : IRW)
    // @include StretchImgButton.labelHPad
    // @visibility external
    //<
    
    //> @attr stretchImgButton.hiliteAccessKey (boolean : true: IRW)
    // @include statefulCanvas.hiliteAccessKey
    // @visibility external
    //<        
    hiliteAccessKey:true,                                        
 
    // States
    // ---------------------------------------------------------------------------------------

    //>	@attr	StretchImgButton.src		(SCImgURL : "button.gif" : IRW)
	// Base URL for the image.  By default, StretchImgButtons consist of three image parts: A
    // start image (displayed at the top or left), a scaleable central image and an end image
    // displayed at the bottom or right.
    // <P>
    // The images displayed in the stretchImgButton are derived from this property in the 
    // following way:
    // <P>
    // <ul>
    // <li> When the button is in its standard state the suffixes "_start", "_end" and 
    //      "_stretch" are applied to the src (before the file extension), so by default 
    //      the images displayed will be "button_start.gif" (sized to be 
    //      <code>this.capSize</code> by the specified width of the stretchImgButton), 
    //      "button_stretch.gif" (stretched to the necessary width) and "button_end.gif" 
    //      (sized the same as the start image).
    // <li> As the button's state changes, the images will have suffixes appended <b>before</b>
    //      the "_start" / "_end" / "_stretch" to represent the button state. Possible states 
    //      are "Down", "Over", "Selected" "Focused" and "Disabled". Note that "Selected" and
    //      "Focused" are compound states which may be applied in addition to "Down" etc.
    // </ul>
    // For example the center piece of a selected stretchImgButton with the mouse hovering
    // over it might have the URL: <code>"button_Selected_Down_stretch.gif"</code>.
    // <P>
    // Media should be present for each possible state of the _start, _end and _stretch images.
    //  
    // @visibility external
	//<
	src:"[SKIN]/button/button.png",
    
    //>	@attr	StretchImgButton.vertical		(boolean : false : IRW)
	// Default is a horizontal button.  Vertical StretchImgButtons are allowed, but title text,
    // if any, will not be automatically rotated.
    //
	// @group appearance
    // @visibility external
	//<
	vertical:false,

    //>	@attr	StretchImgButton.capSize		(number : 12 : IRW)
	// How big are the end pieces by default
	// @group appearance
    // @visibility external
	//<
	capSize:12,
    
    // Override autoFitDirection - we only want the button to resize horizontally since 
    // otherwise the media gets stretched.
    autoFitDirection:"horizontal",

    // ---------------------------------------------------------------------------------------
    // Match the standard button's cursor
    cursor:isc.Button._instancePrototype.cursor,
    
	canFocus:true
});



isc.StretchImgButton.registerStringMethods({
    //> @method stretchImgButton.iconClick()
    // If this button is showing an +link{StretchImgButton.icon, icon}, a separate click
    // handler for the icon may be defined as <code>this.iconClick</code>.
    // Returning false will suppress the standard button click handling code.
    // @group buttonIcon    
    // @visibility external
    //<
    iconClick:""
})
