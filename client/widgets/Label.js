/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2010-03-13 (2010-03-13)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */

 





//>	@class	Label
// Labels display a small amount of +link{label.align,alignable} +link{label.contents,text}
// with optional +link{label.icon,icon} and +link{label.autoFit,autoFit}.
// <P>
// For a general-purpose container for HTML content, use +link{HTMLFlow} or +link{HTMLPane}
// instead.
//
//  @treeLocation Client Reference/Foundation
//  @visibility external
//  @example label
//<

isc.defineClass("Label", "Button").addMethods({
    //>	@attr label.contents		(string : "&nbsp;" : [IRW])
    // @include canvas.contents
    //< 

    //> @attr label.dynamicContents (boolean : false : IRWA)
    //	@include canvas.dynamicContents
    //<

    //>	@attr	label.align		(Alignment : isc.Canvas.LEFT : [IRW])
    //          Horizontal alignment of label text. See Alignment type for details.
    //      @visibility external
    //      @group	positioning
    //<
    align:isc.Canvas.LEFT,

    //>	@attr	label.valign		(VerticalAlignment : isc.Canvas.CENTER : [IRW])
    //          Vertical alignment of label text. See VerticalAlignment type for details.
    //      @visibility external
    //      @group	positioning
    //<
    // defaulted in StatefulCanvas
    
    //>	@attr	label.wrap		(boolean : true : [IRW])
    // If false, the label text will not be wrapped to the next line.
    // @visibility external
    // @group sizing
    //<
	wrap:true,
    
    //> @attr label.autoFit    (boolean : null : [IRW])
    // @include StatefulCanvas.autoFit
    // @visibility external
    //<
    
    // showTitle must be false 
    // If this property gets set to true on the Label class we'd be likely to have infinite
    // recursion of labels being created for labels.
    showTitle:false,

    // Icon handling    
    // ---------------------------------------------------------------------------------------

    //> @attr label.icon
    // @include statefulCanvas.icon
    // @visibility external
    //<
    //> @attr label.iconSize
    // @include statefulCanvas.iconSize
    // @visibility external
    //<
    //> @attr label.iconWidth
    // @include statefulCanvas.iconWidth
    // @visibility external
    //<
    //> @attr label.iconHeight
    // @include statefulCanvas.iconHeight
    // @visibility external
    //<
    //> @attr label.iconOrientation
    // @include statefulCanvas.iconOrientation
    // @visibility external
    //<
    //> @attr label.iconAlign
    // @include statefulCanvas.iconAlign
    // @visibility external
    //<
    //> @attr label.iconSpacing
    // @include statefulCanvas.iconSpacing
    // @visibility external
    //<
    //> @attr label.showDisabledIcon
    // @include statefulCanvas.showDisabledIcon
    // @visibility external
    //<
    //> @attr label.showRollOverIcon
    // @include statefulCanvas.showRollOverIcon
    // @visibility external
    //<
    //> @attr label.showFocusedIcon
    // @include statefulCanvas.showFocusedIcon
    // @visibility external
    //<
    //> @attr label.showDownIcon
    // @include statefulCanvas.showDownIcon
    // @visibility external
    //<
    //> @attr label.showSelectedIcon
    // @include statefulCanvas.showSelectedIcon
    // @visibility external
    //<
    //> @method label.setIconOrientation()
    // @include statefulCanvas.setIconOrientation
    // @visibility external
    //<
    //> @method label.setIcon()
    // @include statefulCanvas.setIcon
    // @visibility external
    //<

	// -------------------------------------------------------------------------
    

    // reversions of Button's changes relative to Canvas
    height:null,
    width:null,
    overflow:"visible",
    canFocus:false,

    // NOTE: Label styling used to be via the "styleName" property.  In initWidget, accept
    // either baseStyle or styleName, then wipe out styleName so styles aren't double applied
    // (handled by StatefulCanvas)
    // NOTE: the Button class configures styleName as null, and sets baseStyle to "button",
    // which we reverse.
    
    styleName:"normal",
    baseStyle:null,

    // reversions of StatefulCanvas
    cursor:"default",
    // suppress state changes
    showRollOver:false, showFocus:false, showDown:false, showDisabled:false,

    // hack to have Button rendering code use getContents() instead of this.title
    useContents:true
});

//>	@method	label.setContents()
// @include canvas.setContents()
//<
    
