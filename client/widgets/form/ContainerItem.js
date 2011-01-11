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

 



/*	OPEN ISSUES
    * how to handle CanvasItems in containerItems?
	* how to handle values for a containerItem?
	* how to handle "name" for a containerItem?

*/





//>	@class	ContainerItem
//
//	Container formItem to show a filter for a set of datasource fields.
//
//<
isc.ClassFactory.defineClass("ContainerItem", "FormItem");

isc.ContainerItem.addProperties({

	//>	@attr	containerItem.items		(array : null : IRW)
	//		Array of sub-items for this container item.
	//<

	cellSpacing:0,
	cellPadding:2,
	cellBorder:0,

    //>	@attr	containerItem.recalculateItemsOnRedraw		(boolean : false : IR)
	//			If true, we recalculate the list of sub-items every time
	//			this.getInnerHTML is called.  Otherwise we do it automatically only
	//			when this.items is null.
	//<
	recalculateItemsOnRedraw:false,
    
    //>	@attr   containerItem._hasDataElement   (boolean : false : AR)
    //      Container items have no data element of their own.
    //< 
    _hasDataElement:false,
    
    // Set changeOnKeypress to false since keypresses get bubbled and the keypress may occur
    // on a sub item for which we don't want to update
    
    changeOnKeypress:false
    
    //> @attr   containItem.itemCellStyle   (FormItemBaseStyle : null : IRA)
    // If specified this style will be written into each sub-item's cell, overriding the
    // items own "cellStyle" property.
    //<
	
});


// take methods directly from the DynamicForm itself
isc.ContainerItem.addMethods(isc.applyMask(isc.DynamicForm.getPrototype(), [
	 // get all the routines that deal with outputting the table around the elements
	 "getTableStartHTML", "_getTableElementID", "_getTableElement",
     "getCellStartHTML", "_getCellStartHTML", "getCellEndHTML", "_getCellEndHTML",
     "getTitleAlign", "getItemPromptHTML",

	 // get things that deal with nested sets of items
	 "getItem", "fieldIdProperty"
	]
));

isc.ContainerItem.addMethods({

//>	@method	ContainerItem.init()	(A)
//		initialize the containerItem object.
//
//		@param	[all arguments]	(object)	objects with properties to override from default
//<
init : function () {

	this.Super("init", arguments);

	// initialize the list of sub items, defaulting to an empty list
	this.setItems(this.items ? this.items : null);

},

// override destroy to destroy all items too
destroy : function () {
    this.Super("destroy", arguments);
    if (this.items) {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].destroy();
        }
    }
},

//>	@method	containerItem.setItems()	(A)
//
// 	Reset the list of items displayed by this class.
//
//	@param	itemList	(array)		Array of item objects.  If they are not already
//	                                FormItem subclasses, they will be converted.
//<
setItems : function (itemList) {
    var oldItems = this.items ? this.items : null;
    
    // Set this.items to match the itemList passed in if there was one.
	if (itemList) this.items = itemList;
    else itemList = this.items;
	
    if (!this.items) return null;

	//>DEBUG
    this.logDebug("Creating " + this.items.length + " contained items");
	//<DEBUG
    
	// iterate through all the items, creating FormItems from object literals
    var appliedAccessKey = false;
	for (var itemNum = 0; itemNum < itemList.length; itemNum++) {
		var item = itemList[itemNum];
		// remove any empty items from the list
		if (!item) {
			itemList.removeItem(itemNum--);
			continue;
		}
        
        // override '_getElementTabIndex' for each item so the container item controls the
        // tabIndex of it's child-items
        // For now we don't allow child items to control their tab indices separately from 
        // their container items tab index.
        
        isc.addMethods(
            item, 
            {   _getElementTabIndex : function () {
                    return this.parentItem._getElementTabIndex();
                }
            }
        );
         
        // The sub-item is contained in the same containerWidget as this form item
        item.containerWidget = this.containerWidget;

		// set the item.parentItem and eventParent to point back to us
		item.parentItem = this;

        item.eventParent = this;
		item.form = this.form;
        
        // note that the sub items will never have a title cell written out for them
        item.showTitle = false;
        
		// convert from a simple object into a FormItem
        
		if (!isc.isA.FormItem(item)) itemList[itemNum] = item = isc.FormItemFactory.makeItem(item);

        // Also apply the 'accessKey' to the first focusable sub item
        if (this.accessKey != null && !appliedAccessKey && item._canFocus()) {
            item.accessKey = this.accessKey;
            appliedAccessKey = true;
        }
         
		// if the item has a name property, add a reference to the object to us under that name
        // (We don't use the ID, since that is already a global pointer to the sub item)
		if (item.name != null) this[item.name] = item;

	}
    
    if (this.isDrawn()) {
        if (oldItems && oldItems != this.items) {
            this._clearingItems = {};
            for (var i = 0; i < oldItems.length; i++) {
                var oldItem = oldItems[i];
                if (!itemList.contains(oldItems[i])) {
                    this._clearingItems[oldItems[i].getID()] = true;
                }
            }
        }
    }
    
	// redraw this form item (default implementation will redraw the form / containing widget)
    this.redraw();
},

// simple getter for this.items

getItems : function () {
    return this.items;
},

// override getTitleHTML() to avoid writing a <label> tag around the title, and setting an 
// accessKey property on that label.  This is appropriate as we are setting up the accessKey
// directly on the first sub-element in the group (implemented in setItems)
getTitleHTML : function(){
    var elementID, focusableItem;
    var title = this.getTitle();
    
    if (!this.getCanFocus()) {
        return title;
    }
    
    if (this.accessKey != null) {
        title = isc.Canvas.hiliteCharacter(title, this.accessKey);
    }
    
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].getCanFocus() && this.items[i].hasDataElement()) {
            focusableItem = this.items[i];
            break;
        }
    }
    
    if (!focusableItem) {
        return title;
    }
    
    return isc.SB.concat("<LABEL FOR=", focusableItem.getDataElementId(), ">", title, "</LABEL>");
},
  

// Override '_setElementTabIndex()', as the superclass implementation forces a form.redraw()
// for any focusable items without elements, and this may not be necessary.
_setElementTabIndex : function (tabIndex) {
    if (!this.isVisible() || !this.containerWidget.isDrawn()) return;

    this._elementTabIndex = tabIndex;
    
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i]._canFocus()) this.items[i]._setElementTabIndex(tabIndex);
    }
    // If none of the sub items forced this form to markForRedraw(), simply update our icons
    // and we're done - otherwise the form will redraw and write out the correct tabIndices
    // on everything anyway.
    if (!this.form.isDirty()) {
        this._updateIconTabIndices();
    }
},

// Container items are non-editable by default.
// Subclasses that allow editing will override this value as appropriate
isEditable : function () {
    return false;
},

//> @method ContainerItem._canFocus()   (A)
//  Override _canFocus() to return true if any of our sub-elements can accept keyboard focus
//  @return (boolean)   true if this form item can accept keyboard focus
//<
_canFocus : function () {
    if (!this.items) return false;
    for (var i=0; i < this.items.length; i++) {
        if (this.items[i]._canFocus()) return true;
    }
    return false;
},

//> @method ContainerItem.focusInItem()   (A)
//  Override focusInItem to focus in the first sub-item that will accept focus
//<
focusInItem : function () {
    if (!this.isVisible() || !this._canFocus()) return;
    for (var i=0; i < this.items.length; i++) {
        if (this.items[i]._canFocus()) {
            this.items[i].focusInItem();
            break;
        }
    }
},

//> @method ContainerItem.blurItem()   (A)
//  Override blurItem to call 'blurItem' on whichever sub-item is marked as having focus.
//<
blurItem : function () {
    for (var i=0; i < this.items.length; i++) {
        if (this.items[i].hasFocus) {
            this.items[i].blurItem();
            break;
        }
    }
},

// Override _applyHandlersToElement() - we have no 'focusElement', even if _canFocus() is true
// so only apply handlers to icons.
_applyHandlersToElement : function () {
    this._setUpIconEventHandlers();
},


// Notify sub items that they've been drawn/cleared at the appropriate times.
drawn : function () {
    var items = this.items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
        if (items[i].visible != false) items[i].drawn();
    }
    return this.Super("drawn", arguments);
},

redrawn : function () {
    var items = this.items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.visible != false) {
            if (!item.isDrawn()) item.drawn();
            else item.redrawn();
        } else {
            if (item.isDrawn()) item.cleared();
        }
    }
    // If setItems was called - ensure we call 'cleared' on any items that got yanked from
    // our items array (and therefore from the DOM).
    if (this._clearingItems) {
        for (var ID in this._clearingItems) {
            if (window[ID] != null) window[ID].cleared();
        }
        delete this._clearingItems;
    }
    return this.Super("redrawn", arguments);
},

cleared : function () {
    var items = this.items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
        if (items[i].isDrawn()) items[i].cleared();
    }
    if (this._clearingItems) {
        for (var ID in this._clearingItems) {
            if (window[ID] != null) window[ID].cleared();
        }
        delete this._clearingItems;
    }
    return this.Super("cleared", arguments);
},

//>	@method	ContainerItem.makeNamedItem()	(A)
// Make a particular item of the specified name, taking it from this object or from the
// FormItem class.
//
// This implementation caches items so we don't end up creating them over and over for the same
// object.
//<
makeNamedItem : function (itemName, extraProperties) {
	// create the itemCache if it hasn't been made already
	if (!this.itemCache) this.itemCache = {};
	// get the item from the itemCache by name
	var item = this.itemCache[itemName];
	// if it wasn't found
	if (!item) {
		// find the item specification in either this object or as a constant in the FilterItem class
		item = (this[itemName] || this.getClass()[itemName]);
		// if any extra properties were passed in, create a new blank object and add them to the item properties
		if (extraProperties != null) {
			item = isc.addProperties({}, item, extraProperties);
		}
		// now create the item as a real FormItem, and store it in the cache for later
		item = this.itemCache[itemName] = isc.FormItemFactory.makeItem(item);
	}
	// and return the item!
	return item;
},


//>	@method	containerItem.getInnerHTML()	(A)
//
// 	Return the HTML needed to draw this item.
//
//		@param	values	(string)	Value of the element (unused).
//		@return			(string)	HTML to draw this item.
//<
getInnerHTML : function (values, includeHint, includeErrors, returnArray) {
    
	if (!values) values = {};
	
	// if the items haven't been set for this element, call setItems to do so now
	//	this lets subclasses defer setting items until draw time
	if (!this.items || this.recalculateItemsOnRedraw || !isc.isA.FormItem(this.items[0])) this.setItems();

	
	if (!this.items) return "No items set for containerItem " + this;

    var clearInactiveContext;
    if (this.isInactiveHTML() && this._currentInactiveContext == null) {
        clearInactiveContext = true;
        this._currentInactiveContext = this.setupInactiveContext(null);
        
        if (this.logIsDebugEnabled("inactiveEditorHTML")) {
            this.logDebug("getInnerHTML(): Item is marked as inactive - set up " +
                "new inactive context ID:" + this._currentInactiveContext,
                "inactiveEditorHTML");
        }
    }        
    
	// form items are only actually responsible for writing out error HTML if error orientation
    // is left or right
    var errorOrientation = this.getErrorOrientation(),
        showErrors,
        errorOnLeft = errorOrientation == isc.Canvas.LEFT,
        errorHTML;
    if (includeErrors && 
        (errorOnLeft || errorOrientation == isc.Canvas.RIGHT)) 
    {
        var errors = this.getErrors();
        if (errors) {
            showErrors = true;
            errorHTML = this.getErrorHTML(errors);
        }
    }
    
	// get a StringBuffer to hold the output
	var output = isc.StringBuffer.newInstance();
 
    // If we need to write out a hidden native data element, do so now.        
    
    if (this._useHiddenDataElement()) {
        output.append(this._getHiddenDataElementHTML());
    }
    
	// start the table
	output.append(this.getTableStartHTML());

    // Check Visibility / Disabled State
	// --------------------------------------------------------------------------------------------

	var items = this.items;
    
	// iterate through the items, marking items as invisible if their .showIf is false
	for (var itemNum = 0; itemNum < items.length; itemNum++) {
		var item = items[itemNum];
		
        // note that the value of this item can't possibly be dirty 
		item._markValueAsNotDirty()
		
		// set the form of the item to the same form we draw in
		item.form = this.form;
        
		// if the item has a showIf property
		//	evaluate that to see whether the item should be visible or not
		//	(note if the visible states of any items changes)
		if (item.showIf) {
			// CALLBACK API:  available variables:  "value"
			// Convert a string callback to a function
			if (!isc.isA.Function(item.showIf)) {
				isc.Func.replaceWithMethod(item, "showIf", "item,value,form");
			}
            
			var value = this.getItemValue(item, values);

			var	visible = (item.showIf(item,value,this.form) != false)
			;
			if (visible != item.visible) {
				item.visible = visible;
			}
		}
	}


    // DynamicForm.getInnerHTML() makes use of applyTableResizePolicy() to determine the desired 
    // sizes for it's component form items.
    // This (among other things) sets up the _size property on the form items to an array containing
    // the desired width and height.
    // Certain form items make use of this _size property in their getInnerHTML() methods. If
    // the property is not set they will default to using item.width and item.height.

    // Draw HTML for Items
	// --------------------------------------------------------------------------------------------

	// for each field in the list
	for (var itemNum = 0, len = this.items.length; itemNum < len; itemNum++) {
		// get a pointer to the item for that field
		var item = this.items[itemNum];
		// if a null item, skip it
		if (!item) continue;
		
		// if the item has been marked as invisble, skip it
		if (!item.visible) continue;
		
        var value = this.getItemValue(item, values);
        
        // if the item should start it row or passes the name boundary
		// 	output the end and start row tag
		if (item._startRow || itemNum == 0) {
			if (itemNum != 0) output.append("</TR>");
			output.append("<TR>");
		}
   
        // If we show the error on the left write the error cell out before the first item in
        // the first row
        // Note: this means if there is no first item we'll fail to write out the error HTML
        // not a known use case for this.
        if (itemNum == 0 && showErrors && errorOnLeft) {
            // rowspan ensures that if we are showing multiple rows, the error text really shows up
            // on the left of all items
            var numRows = 1;
            for (var ii = 1; ii < this.items.length; ii++) {
                if (this.items[ii]._startRow) numRows++;
            }
            output.append("<TD ROWSPAN=",numRows,">",errorHTML,"</TD>");
        }        

		// output the tag start for the item if it has a positive row and colSpan
        
		output.append(this.getCellStartHTML(item));

		// output the innerHTML for the item (including the hint, if there is one)
		output.append(item.getInnerHTML(value, true));

		// append the tag end for the item
		output.append(this.getCellEndHTML(item));

	}
    
    // If we are showing icons (or might be showing icons in the future), draw them into
    // a table cell after any sub-items - this prevents them being wrapped and shown up on the
    // next line of the page.
    // If 'showPickerIcon' is true write out a picker icon before any other icons
    
    
    if (this.showPickerIcon || (this.showIcons && this.icons != null)) {
        var width = this.getTotalIconsWidth();
        // have to explicitly add width of pickerIcon if we're showing it.        
        if (this.showPickerIcon) width += this.getPickerIconWidth();
        
    	// output the tag start for the item if it has a positive row and colSpan
		output.append(
            this._getCellStartHTML(
                (this.form.isRTL() ? isc.Canvas.RIGHT : isc.Canvas.LEFT),    // align
                this.getCellStyle(),    // classname
                1, 1,                   // rowSpan / colSpan
                
                width, // width
                // can leave height, extrastuff unspecified
                null, null, 
                // Avoid double border/margin/padding
                isc.Canvas._$noStyleDoublingCSS,
                // Don't pass in itemID or formID - don't write out a click handler on this cell
                null, null, null,
                // Suppress wrapping of icons (if we have more than one in the cell)
                (this.icons && (this.showPickerIcon || this.icons.length > 1))
            )
        );
        if (this.showPickerIcon) output.append(this.getIconHTML(this.getPickerIcon()));
        output.append(this.getIconsHTML());
		// append the tag end for the item (again suppress wrapping within the cell)
		output.append(this._getCellEndHTML(true));
    }
    
    // use the hint cell to write out right-orientated errors
    if (showErrors && !errorOnLeft) includeHint = true;
     
    if (includeHint) {
        var hint = this.getHint(),
            rightError = !errorOnLeft ? errorHTML : null,
            hintString = (hint && rightError) ? hint+rightError : (hint || rightError);
      
        if (hintString && !isc.isA.emptyString(hintString)) {
            // We inherit our _$hintCellTemplate from the FormItem class
            this._$hintCellTemplate[1] = this._getHintCellID();
            this._$hintCellTemplate[3] = this.getHintStyle();
            this._$hintCellTemplate[5] = hintString;
            output.append(this._$hintCellTemplate);
        }
    }
    
	
	// end the table
	output.append("</TR></TABLE>");
    
    if (clearInactiveContext) delete this._currentInactiveContext;
    
    return output.toString();
},


// get item value - used by getInnerHTML() to retrieve the value of a sub item of this container.

getItemValue : function (item, values) {
    if (values == null) values = {};

    if (!isc.isA.FormItem(item)) item = this.getItem(item);
    
    if (!item) return null;
    
    // get the value and error for this form element
    var name = item.getFieldName(),
        value = null
    ;
    
    // if the value was specified on the item, use that
    if (item.value != null) value = item.value;

    // if a name was specified in the item, 
    if (value == null && name) {
        // get the value from the form.values
        
        value = values[name];
    }
    if (value == null) {
        // otherwise get the value dynamically from the item default 
        //	(for headers, etc. that don't specify a name because they aren't submitted)
        value = item.getDefaultValue();
        if (value == null && this.form && this.form.values) value = this.form.values[name];
    }
    return value;
},
    

// override _itemValueIsDirty() to check for each sub-item being dirty.
_itemValueIsDirty : function () {
    if (this.items == null) return false;
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i]._itemValueIsDirty()) return true;
    }
    
    return this._valueIsDirty;
},

// override _markValueAsNotDirty to mark the value as not dirty for this, and each item.
_markValueAsNotDirty : function () {
    this._valueIsDirty = false;
    for (var i = 0; i < this.items.length; i++) {
        this.items[i]._markValueAsNotDirty();
    }
    
},

// override updateDisabled to enable / disable all the child items.
updateDisabled : function () {
    this.Super("updateDisabled", arguments);
    if (this.items) {
        for (var i = 0; i< this.items.length; i++) this.items[i].updateDisabled();
    }
},

//>	@method	containerItem.getTextDirection()	(A)
//		Get the text direction of this canvas.
//		@group	appearance
//		@platformNotes	IE win only!
//		@return	(TextDirection)	direction -- Canvas.LTR or Canvas.RTL
//<
getTextDirection : function () {
	return this.form.getTextDirection();
},

// Override getLeft() / getTop() to look at the position table element for the containerItem
getLeft : function () {
    var element = this._getTableElement();
    if (element == null) {
        this.logWarn("getLeft() Unable to determine position for " + 
                      (this.name == null ? "this item " : this.name) + 
                      ". Position cannot be determined before the item is drawn " +
                      "- returning zero");
        return 0;
    }
    return this._getElementLeft(element);
    
},

getTop : function () {
    var element = this._getTableElement();
    if (element == null) {
        // We will not find an element if we are not drawn into the DOM
        this.logWarn("getTop() Unable to determine position for " + 
                      (this.name == null ? "this item " : this.name) + 
                      ". Position cannot be determined before the item is drawn " +
                      "- returning zero");
        return 0;
    }
    return this._getElementTop(element);
    
},

// Ditto with getVisibleWidth() / getVisibleHeight()
getVisibleWidth : function () {
    var element = this._getTableElement();
    if (element == null) return this.Super("getVisibleWidth", arguments);
    
    return element.offsetWidth;
},

getVisibleHeight : function () {
    var element = this._getTableElement();
    if (element == null) return this.Super("getVisibleHeight", arguments);
    
    return element.offsetHeight;    
}


});
