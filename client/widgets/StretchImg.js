/*
 * Isomorphic SmartClient
 * Version 7.0rc2 (2009-05-30)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */

 





//>	@class	StretchImg
//
//  The StretchImg widget class implements a widget type that displays a list of multiple images
//  that make up a single image.
//
//  @treeLocation Client Reference/Foundation
//  @visibility external
//<

// abstract class for Stretchable images
isc.ClassFactory.defineClass("StretchImg", "StatefulCanvas");

// add properties to the class
isc.StretchImg.addProperties({

    //>	@attr	stretchImg.vertical		(boolean : true : [IRW])
    // Indicates whether the list of images is drawn vertically from top to bottom (true),
    // or horizontally from left to right (false).
    //      @visibility external
    //      @group  appearance
    //<
	vertical:true,

    //>	@attr	stretchImg.capSize		(number : 2 : [IRW])
    //          If the default items are used, capSize is the size in pixels of the first and last
    //          images in this stretchImg.
    //      @visibility external
    //      @group  appearance
    //<
	capSize:2,
    
    //>	@attr	stretchImg.src		(SCImgURL : null : [IRW])
    // The base URL for the image. 
    // <P>
    // As with +link{Img.src}, the +link{state} of the component is added to this URL.  Then,
    // the image segment name as specified by +link{stretchImg.items} is added.
    // <P>
    // For example, for a stretchImg in "Over" state with a <code>src</code> of "button.png"
    // and a segment name of "stretch", the resulting URL would be "button_Over_stretch.png".
    // 
    // @see stretchImg.hSrc
    // @see stretchImg.vSrc
    // @group appearance
    // @visibility external
    //<
    
    //>	@attr	stretchImg.hSrc		(SCImgURL : null : [IRW])
    // Base URL for the image if +link{stretchImg.vertical} is false and 
    // +link{attr:stretchImg.src} is unset.
    //
    // @see stretchImg.src
    // @see stretchImg.vSrc
    // @group appearance
    // @visibility external
    //<
    
    //>	@attr	stretchImg.vSrc		(SCImgURL : null : [IRW])
    // Base URL for the image if +link{stretchImg.vertical} is true and 
    // +link{attr:stretchImg.src} is unset.
    //
    // @see stretchImg.src
    // @see stretchImg.vSrc    
    // @group appearance
    // @visibility external
    //<

    // a StretchImg draws within the specified area and should never overflow
    overflow:isc.Canvas.HIDDEN,
	
    //>	@attr	stretchImg.imageType	(ImageStyle : Img.STRETCH : [IRW])
    //          Indicates whether the image should be tiled/cropped, stretched, or centered when the
    //          size of this widget does not match the size of the image. See ImageStyle for
    //          details.
    //      @visibility external
    //      @group  appearance
    //<
	imageType : isc.Img.STRETCH,	

    //>	@attr	stretchImg.items		(Array of Object : see below : [IRW])
    // The list of images to display as an array of objects specifying the image names and
    // sizes.
    // <P>
    // The "name" is appended as a suffix to the +link{src} URL in order to fetch separate
    // media files for each image.
    // <P>
    // The height and width can be set to a number, "*" (remaining space, divided amongst all
    // images that specify "*") or to the name of a property on the StretchImg component, such
    // as +link{capSize}.  
    // <P>
    // Height or width is only used on the axis on which images are stacked.  For example, if
    // +link{vertical} is true, images stack vertically and heights are used to size images on
    // the vertical axis, but all images will have width matching the overall component size.
    // <P>
    // For example, the default setting for <code>items</code>, which is used to produce
    // stretchable buttons and headers with fixed-size endcaps, is as follows:
    // <pre>
    //   items:[
    //        {height:"capSize", name:"start", width:"capSize"},
    //        {height:"*", name:"stretch", width:"*"},
    //        {height:"capSize", name:"end", width:"capSize"}
    //   ]
    // </pre>
    //      @visibility external
    //      @group  appearance
    //<
    // NOTE: can specify "src" for a custom src property, and "state" for a custom state.
	items : [
    	{name:"start", width:"capSize", height:"capSize"},
		{name:"stretch", width:"*", height:"*"},
		{name:"end", width:"capSize", height:"capSize"}
	],

    //>	@attr	stretchImg.autoCalculateSizes		(attrtype : true : IRWA)
	// If true, we calculate the image sizes automatically
	//		@group	drawing
	//<
	autoCalculateSizes:true,			
    //>	@attr	stretchImg.cacheImageSizes		(attrtype : true : IRWA)
	//	If true, we cache image sizes automatically, if not we calculatge it every time we draw
	//		@group	appearance
	//<
	cacheImageSizes:true,

    // do set styling on the widget's handle
    suppressClassName:false,
    
    
    mozOutlineOffset: "0px",
    
    //> @attr stretchImg.showGrip   (boolean : null : IRA)
    // Should we show a "grip" image floating above the center of this widget?
    // @group grip
    // @visibility external
    //<
    
    //> @attr   stretchImg.gripImgSuffix (string : "grip" : IRA)
    // part name for the 'grip' image if +link{stretchImg.showGrip} is true
    // @group grip
    //<
    gripImgSuffix:"grip",
    
    //> @attr   stretchImg.showDownGrip   (boolean : null : IRA)
    // If +link{stretchImg.showGrip} is true, this property determines whether to show the
    // 'Down' state on the grip image when the user mousedown's on this widget. 
    // Has no effect if +link{statefulCanvas.showDown} is false
    // @visibility internal
    // @group grip
    //<

    //> @attr   stretchImg.showRollOverGrip   (boolean : null : IRA)
    // If +link{stretchImg.showGrip} is true, this property determines whether to show the
    // 'Over' state on the grip image when the user rolls over on this widget. 
    // Has no effect if +link{statefulCanvas.showRollOver} is false
    // @visibility internal
    // @group grip
    //<
    
   
    //> @attr stretchImg.showTitle (boolean : false : [IRWA])
    // @include StatefulCanvas.showTitle
    // @visibility external
    //<
    showTitle:false        
    
});

// add methods to the class
isc.StretchImg.addMethods({

initWidget : function () {

    // NOTE: our superclass would do this, but we have to set up this URL and set
    // this.showGrip/this.icon before calling Super to get the label constructed which shows
    // the grip
    if (this.src == null) this.src = this.vertical ? this.vSrc : this.hSrc;

    if (this.showGrip) {
        // use the icon functionality of the label to show an image floated over center (this
        // is mutex with using the icon / label functionality, but most such uses don't make
        // much sense)
        this.labelVPad = 0;
        this.labelHPad = 0;
        this.iconSpacing = 0;
        this.align = isc.Canvas.CENTER;
        // get the URL for a piece named "grip".  NOTE: resolve to a fully qualified URL now,
        // in the same imgDir context as the rest of the pieces, as opposed to the labels
        this.icon = this.getImgURL(this.getURL(this.gripImgSuffix));

        // NOTE: grip* sizing is intentionally null by default, so we get the image's natural
        // size, overriding the icon defaults.
        this.iconSize = this.gripSize;
        this.iconWidth = this.vertical ? this.gripBreadth : this.gripLength;
        this.iconHeight = this.vertical ? this.gripLength : this.gripBreadth;
        
        this.showRollOverIcon = this.showRollOverGrip;
        this.showDownIcon  = this.showDownGrip;
    }

    // HACK: call Super the direct way   
    isc.StatefulCanvas._instancePrototype.initWidget.call(this);
    //this.Super(this._$initWidget);
    
    this.redrawOnResize = (this.imageType != isc.Img.STRETCH) 
},

// 'grip' is displayed in our label canvas
shouldShowLabel : function () {
    if (this.showGrip) return true;
    return this.Super("shouldShowLabel", arguments);
},


//>	@method	stretchImg.getURL()	(A)
//		@group	appearance
//			steal the getURL method from Img
//
//		@param	[pieceName]	(string : "") 			name for part of the image
//		@param	[state]		(string : this.state)	state of the image ("up", "off", etc.)
//
//		@return	(SCImgURL)	URL for the image
//<
getURL : isc.Img.getInstanceProperty("getURL"),


//>	@method	stretchImg.getPart()
//		@group	appearance
//			return a logical image "part"
//
//		@param	partName		(string)	name of the image part you're looking for
//
//		@return	(object)	member of this.items array
//<
getPart : function (partName) {
	for (var i = 0, length = this.items.length, it; i < length; i++) {
		it = this.items[i];
		if (it.name == partName) return it;
	}
	return null;
},


//>	@method	stretchImg.getPartNum()
//		@group	appearance
//			return the number of a logical image "part"
//
//		@param	partName		(string)	name of the image part you're looking for
//
//		@return	(number)	index of the part in this.items array
//<
getPartNum : function (partName) {
	for (var i = 0, length = this.items.length, it; i < length; i++) {
		it = this.items[i];
		if (it.name == partName) return i;
	}
	return null;
},


//>	@method	stretchImg.getSize()	(A)
//		@group	appearance
//			return the size of a particular image
//
//		@param	partNum		(number)	number of the image you're looking for
//		@return	(number)	size of the image
//<
getSize : function (partNum) {
	if (!this._imgSizes || this._imgResized) this.resizeImages();
	return this._imgSizes[partNum];
},

// When the label's size changes due to adjustOverflow, we want to update our images to ensure
// they still fit. Do this by calling explicitly calling handleResized() on label adjustOverflow
_labelAdjustOverflow : function (a, b, c, d) {
    if (this.overflow == isc.Canvas.VISIBLE) this._handleResized(null, null, true);
    this.invokeSuper(isc.StretchImg, "_labelAdjustOverflow", a, b, c, d);
},

// Similarly if the overflow moves from visible to hidden we'll need to resize our images
setOverflow : function (newOverflow, a, b, c) {
    var handleResized = false;
    if (this.overflow == isc.Canvas.VISIBLE && 
        ((this.getScrollWidth() > this.getWidth()) || 
            (this.getScrollHeight() > this.getHeight())) )
    {
        handleResized = true;
    }
    this.invokeSuper(isc.StretchImg, "setOverflow", newOverflow, a, b, c);
    if (handleResized) this._handleResized(null, null, true);
},


// Note the forceResize parameter - if passed assume a resize occurred in both directions,
// even if dX and dY are null
_handleResized : function (deltaX, deltaY, forceResize) {

    if (this.redrawOnResize != false || !this.isDrawn()) {
        // set a flag for this._imgSizes to be recalculated next redraw
        this._imgResized = true;
        return;
    }

    // suppress image resize means don't calculate new sizes, or attempt to apply them
    // to the content
    if (this._suppressImageResize) return;
    
    // if we're a stretch image, we can resize the images and not redraw
    
    this.resizeImages();
        
    var items = this.items,
        hasDeltaX = forceResize || (isc.isA.Number(deltaX) && deltaX != 0), 
        hasDeltaY = forceResize || (isc.isA.Number(deltaY) && deltaY != 0), 
        breadthResize = (this.vertical && hasDeltaX) || (!this.vertical && hasDeltaY),
        lengthResize = (this.vertical && hasDeltaY) || (!this.vertical && hasDeltaX);

    for (var i = 0; i < items.length; i++) {
        var image = this.getImage(items[i].name);

        // this can legitimately happen if:
        // - an image got sized to zero, which means we didn't draw it
        // - an image as been added to the items array but we have not redraw yet, eg the
        //   scrollbar corner

        if (image == null) continue;

        if (breadthResize) {
            var size = this.vertical ? this.getWidth() : this.getHeight();
            //this.logWarn("assigning: " + size + " to segment: " + items[i].name + 
            //             ", image: " + this.echoLeaf(image));
            this._assignSize(image.style, 
                             this.vertical ? this._$width : this._$height, 
                             size);
        }
        if (lengthResize) {
            var size = this._imgSizes[i];
            //this.logWarn("assigning: " + size + " to segment: " + items[i].name + 
            //             ", image: " + this.echoLeaf(image));
            this._assignSize(image.style, 
                             this.vertical ? this._$height : this._$width, 
                             size);
        }
    }
},

//>	@method	stretchImg.resizeImages()	(A)
//		@group	appearance
//			resize the various images of this stretchImg
//			the default implementation is to just call Canvas.applyStretchResizePolicy()
//<
resizeImages : function () {

    if (this._suppressImageResize) return;
	var dimension = (this.vertical ? this._$height : this._$width),
        items = this.items,
        sizes = this._imgSizes;

    // re-use a sizes array
    if (sizes == null) sizes = this._imgSizes = [];
    sizes.length = items.length;

    for (var i = 0; i < items.length; i++) {
        sizes[i] = items[i][dimension];
    }

    //this.logWarn("stretchResize with sizes: " + sizes + 
    //             ", total size: " + this.getImgLength());

    
    isc.Canvas.applyStretchResizePolicy(sizes, this.getImgLength(), 1, true, this);

    //this.logWarn("after stretchResize with sizes: " + sizes);
},

//>	@method	stretchImg.getInnerHTML()	(A)
//		@group	drawing
//			return the HTML for this stretch image
//
//		@return	(HTML)	HTML output for this image
//<
_$noBRStart : "<NOBR>",
_$noBREnd : "</NOBR>",
_$BR : "<BR>",
_$styleDisplayBlock : " STYLE='display:block'",
_$tableStart : "<TABLE CELLPADDING=0 CELLSPACING=0 BORDER=0>", _$tableEnd : "</TABLE>",
_$rowStart : "<TR><TD class='",
// _$cellStartTagClose will close rowStart too
_$rowEnd : "</TD></TR>",
_$cellStart : "<TD class='",
_$cellStartTagClose:"'>", _$cellEnd : "</TD>",
getInnerHTML : function () {

	// figure out how big each image is
	var imgs = this.items,
		length = imgs.length,
        vertical = this.vertical;

	// apply the stretch resize policy to the image list
	//  to get actual sizes for things
	if (this._imgResized || !this._imgSizes || 
        (this.autoCalculateSizes && !this.cacheImageSizes)) this.resizeImages();
    delete this._imgResized;

	// get the sizes array
    // The sizes array governs the sizes of the image media along the stretching axis, so
    // the height of the images if this.vertical is true (the width otherwise)
	var sizes = this._imgSizes,
        width = (vertical ? this.getImgBreadth() : this.getImgLength()),
        height = (vertical ? this.getImgLength() : this.getImgBreadth()),
		output = isc.SB.create();

    //>DEBUG
    if (this.logIsDebugEnabled(this._$drawing)) {
        this.logDebug("drawing with imageType: '" + this.imageType + 
                      "' and sizes " + this._imgSizes, "drawing");
    }
    //<DEBUG

    var reverse = !vertical && this.isRTL();

	if (this.imageType == isc.Img.TILE) {
		// if tiling images, ouput them as a table with backgrounds set to the images
		output.append("<TABLE CELLSPACING=0 CELLPADDING=0 BORDER=0 WIDTH=", width, 
                      " HEIGHT=", height, "><TBODY>", (vertical ? "" : "<TR>")
				);
		for (var j = 0; j < length; j++) {
            var i = reverse ? length - j - 1 : j;

			var size = sizes[i];
			if (size > 0) {			
				var item = imgs[i],
				    src = this.getImgURL(this._getItemURL(item));

				if (vertical) {
					output.append( "<TR><TD WIDTH=" , width , " HEIGHT=" , size 
                            , item.name ? 
                                (" NAME=\"" + this.getCanvasName() + item.name + "\"") :
                                null
                            , " BACKGROUND=\"" , src ,
                            "\" class=\"",this.getItemStyleName(item),"\">"
							, isc.Canvas.spacerHTML(1,size)
							, "</TD></TR>"
						);
				} else {
					output.append( "<TD WIDTH=" , size , " HEIGHT=" , height ,
                                      item.name ? 
                                        (" NAME=\"" + this.getCanvasName() + item.name + "\"") :
                                        null,
                                      " BACKGROUND=\"" , src ,
                                      "\" class=\"",this.getItemStyleName(item),"\">"
							, isc.Canvas.spacerHTML(size,1)
							, "</TD>"
						);	
                }
			}
		}
		output.append((vertical ? "" : "</TR>") , "</TABLE>");
		
	} else if (this.imageType == isc.Img.CENTER) {
		// if not tiling and not stretching, output the table with the images as cell contents, not backgrounds
		output.append("<TABLE CELLSPACING=0 CELLPADDING=0 BORDER=0 WIDTH=", width, 
                      " HEIGHT=" , height , "><TBODY>",
                      (vertical ? "" : "<TR VALIGN=center>")
				);
		for (var j = 0; j < length; j++) {
            var i = reverse ? length - j - 1 : j;

			var size = sizes[i];
			if (size > 0) {			
				var item = imgs[i],
                    src = this._getItemURL(item);
				if (vertical) {
					output.append("<TR VALIGN=center><TD WIDTH=" , width , 
                                                       " HEIGHT=" , size , " ALIGN=center",
                                                       " class=\"",this.getItemStyleName(item),
                                                       "\">"
							, this.imgHTML(src, null, null, item.name)
							, "</TD></TR>"
						);
				} else {
					output.append("<TD WIDTH=" , size , " HEIGHT=" , height , " ALIGN=center",
                                    " class=\"",this.getItemStyleName(item),"\">"
							, this.imgHTML(src, null, null, item.name)
							, "</TD>"
						);
                }
			}
		}
		output.append((vertical ? "" : "</TR>") , "</TABLE>");

    } else {    //this.imageType == isc.Img.STRETCH  [default]

		// if stretching, output the images only unless we're in Moz    
        
        var useTable = isc.Browser.isMoz;
        
        if (useTable) output.append(this._$tableStart);
        else if (!vertical) output.append(this._$noBRStart);
        
        var classTemplate = [
            " class=",
            null, 
            " "
        ];
        
		for (var j = 0; j < length; j++) {
            var i = reverse ? length - j - 1 : j;
            var start = (j == 0);
            var end = (j == length - 1);
            
			var size = sizes[i];
			if (size > 0) {
                
                var item = imgs[i],
                    src = this._getItemURL(item),
                    extraStuff;
                    
                var extraStuff;
                if (!useTable) {
                    var styleName = this.getItemStyleName(item);
                    if (styleName) {
                        classTemplate[1] = styleName;
                        extraStuff = classTemplate.join(isc.emptyString);
                    } else {
                        extraStuff = isc.emptyString;
                    }
                }
                
                if (!vertical) {
                   if (useTable) {
                       output.append(start ? this._$rowStart : this._$cellStart);
                       output.append(this.getItemStyleName(item));
                       output.append(this._$cellStartTagClose);
                   }
                    
                    // just write a series of image tags, which will naturally stack
                    // horizontally
					output.append(this.imgHTML(src, size, height, item.name, extraStuff));
                    if (useTable) output.append(end ? this._$rowEnd : this._$cellEnd);
                } else {
                    if (useTable) {
                        output.append(this._$rowStart);
                        output.append(this.getItemStyleName(item));
                        output.append(this._$cellStartTagClose);
                    }
                    
                    
                    output.append(this.imgHTML(src, width, size, item.name,
                                  isc.Browser.isDOM ? (extraStuff + this._$styleDisplayBlock) 
                                                    : extraStuff));

                    if (useTable) output.append(this._$rowEnd);
                    else if (!isc.Browser.isDOM && i < length - 1) output.append(this._$BR);
                }
			}
		}
        if (useTable) output.append(this._$tableEnd)
        else if (!vertical) output.append(this._$noBREnd);

	} 	
	return output.toString();
},


//> @attr StretchImg.itemBaseStyle (CSSStyleName : null : IRW)
// If specified this css class will be applied to the individual item images within this StretchImg.
// May be overridden by specifying item-specific base styles to each object in the
// +link{StretchImg.items,items array}. This base style will have standard stateful suffixes
// appended to indicate the state of this component (as described in 
// +link{StatefulCanvas.baseStyle}).
// @visibility external
//<
getItemStyleName : function (item) {
    var baseStyle = item.baseStyle || this.itemBaseStyle;
    if (!baseStyle) return null;
    
    var state = item.state ? item.state : this.getState(),
        selected = item.selected != null ? item.selected : this.selected,
        focused = this.showFocused && !this.showFocusedAsOver && !this.isDisabled() ? 
                    (item.focused != null ? item.focused : this.focused) : false;

    return baseStyle + this._getStateSuffix(state,
        selected ? isc.StatefulCanvas.SELECTED : null,
        focused ? isc.StatefulCanvas.FOCUSED : null);
},

_$blank : "blank",
_getItemURL : function (item) {
    if (item.src) return item.src;
    // useful if you want the spacing for layout purposes, but no image
    if (item.name == this._$blank) return isc.Canvas._blankImgURL;
    return this.getURL(item.name, 
                       (item.state ? item.state : this.getState()),
                       (item.selected != null ? item.selected : this.selected),
                       (this.showFocused && !this.showFocusedAsOver && !this.isDisabled() ? 
                            (item.focused != null ? item.focused : this.focused) :
                            false)
                      );
},


//>	@method	stretchImg.setState()	([])
// Set the specified image's state to newState and update the displayed image given by
// whichPart, or set the state for all images to newState and update the displayed images
// if whichPart is not provided.
//      @visibility external
//		@group	appearance
//
//		@param	newState	(string)		name for the new state ("off", "down", etc)
//		@param	[whichPart]	(string)		name of the piece to set ("start", "stretch" or "end")
//											if not specified, sets them all
//<
setState : function (newState, whichPart) {
	// if a particular item was not set the state of the entire stretchImg
	if (whichPart == null) {
        // clear the states of all of the individual pieces, so they pick up the new state applied
        // to the widget as a whole.
		var itemChanged = this.items.clearProperty("state"),
            componentChanged = this.state != newState;
        
		this.Super("setState", [newState]);
        // Super implementation won't fire stateChanged if the component level state is unchanged
        // so force it if appropriate
        if (itemChanged && !componentChanged) this.stateChanged();
	} else {
		// just set the state of that particular part
		var it = this.getPart(whichPart);
		if (it) {
			if (it.state == newState) return;
			it.state = newState;
		}
        this.stateChanged();
	}
		
},

stateChanged : function (whichPart) {

	this.Super("stateChanged");
	// if we haven't been drawn already, no need to try to update HTML
	if (!this.isDrawn()) return;
	
	// if we're tiling images, we have to redraw the whole thing... :-(
	if (this.imageType == isc.Img.TILE || this._imgSizes == null) {
		this.markForRedraw("setState (tiled images)");
	} else {
        
        if (isc.Browser.isWin2k && isc.Browser.isIE) {
            this.markForRedraw("Win2k IE image state change");
            return;
        }
		// iterate through all images, resetting their src
        var skip = 0;
		for (var i = 0; i < this.items.length; i++) {
			if (this._imgSizes[i] > 0) {
				var item = this.items[i];
				// if a specific items was not specified or this is the specified item
                
				if ((!whichPart || item.name == whichPart) && item.name != this._$blank) {
					// set the image to the new state image
					this.setImage(item.name, this._getItemURL(item));
                    
                    // fix stateful styling too
                    var handle = this.getImage(item.name);
                    if (handle) {
                        // in moz we apply styles to table cells containing the images (see
                        // 'useTable' logic in getInnerHTML)
                        if (isc.Browser.isMoz) {
                            handle = handle.parentNode;
                        }
                        handle.className = this.getItemStyleName(item);                        
                    }
                    
                 }
			} else {
				skip++;
			}
		}
	}

},

//>	@method	stretchImg.inWhichPart()	(A)
//		@group	event handling
//		Which part of the stretchImg was the last mouse event in?
//
//<
inWhichPart : function () {
	if (this.vertical) {
		var num = this.inWhichPosition(this._imgSizes, this.getOffsetY());
	} else {
		var num = this.inWhichPosition(this._imgSizes, this.getOffsetX(), this.getTextDirection());	
	}
	
	var item = this.items[num];
	return (item ? item.name : null);
}

});



