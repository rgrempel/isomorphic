/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2010-10-22 (2010-10-22)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */


// ** Limitations when working with a databound pickList. **
// We support databinding the pickList by setting optionDataSource (implemented in the
// PickList interface - not available for NativeSelectItems).
// We currently DO NOT support 
//  - 'isSelectOther' behavior 
//  - 'addUnknownValues' behavior
//  - keyboard navigation while the pickList is not visible
// on select items with databound pickLists.



// Class will not work without the ListGrid
if (isc.ListGrid) {




//>	@class	SelectItem
// FormItem that allows picking between several mutually exclusive options via a select list.
// <P>
// Options may be derived from a <code>dataSource</code> or a <code>valueMap</code>.
// <P>
// Note that to select the first option as a default value for the item,
// +link{SelectItem.defaultToFirstOption} may be set.
//
// @implements PickList
// @see PickList.optionDataSource
// @see formItem.valueMap
// @visibility external
// @example selectItem
//<
isc.ClassFactory.defineClass("SelectItem", "FormItem");

// When the developer specifies a form item as type 'select', depending on the form's 
// useNativeSelectItems property, we may give them a SelectItem, or a NativeSelectItem.
// The APIs and defaults for these classes match, but the implementations are completely
// different.
// Define 'select' type property defaults (to be applied to both classes) in a separate
// object to avoid duplication.

isc._SelectItemProperties = {

    // Have native and synthetic selects' text styling match
	textBoxStyle:"selectItemText",
    
    //>	@attr	SelectItem.height		(number : 19 : IRW)
	//  Default height for select items is 19px.
	// @group       appearance
    // @visibility   external
	//<
    height:19,
    width:150,

    // Override the 'dirtyOnKeyDown' property to avoid marking the form item as dirty on every
    // keyDown. We'll handle marking as dirty explicitly when the value should be updated, 
    // without being saved to the form or firing the change handler.
    dirtyOnKeyDown:false,
    // Similarly avoid firing 'updateValue' on every keypress - we will handle when to save the
    // value out.
    changeOnKeypress:false,
    
    // Override redrawOnShowIcon - we can to avoid redrawing the entire form when showing
    // or hiding icons for this item.
    redrawOnShowIcon:false,

    //>	@attr	selectItem.addUnknownValues		(boolean : true : IRWA)
	// If we're setting the value of a select item and the value isn't a legal value in the
    // valueMap, whether we should allow the value (creating a new option for it) or reject it.
    // <P>
    // Exception: If the value is set to <code>null</code> but there is no null entry in the
    // valueMap for this item, setting <code>addUnknownValues</code> to true will not cause
    // a null option to show up at the top of the select item pickList. Whether an empty 
    // option is shown in the pickList is governed by +link{SelectItem.allowEmptyValue}
    // instead.
    //
    // @visibility external
    // @example formDependentSelects
	//<
    
	addUnknownValues:true,
    
    //> @attr SelectItem.defaultValue (boolean : null : IRW)
    // Static default value for this SelectItem. To default to the first option use
    // +link{SelectItem.defaultToFirstOption} instead.
    // @visibility external
    //<
    
    //> @method SelectItem.defaultDynamicValue() (A)
    // Expression evaluated to determine the +link{SelectItem.defaultValue} when no value is
    // provided for this item. To default to the first option use
    // +link{SelectItem.defaultToFirstOption} instead.
    // @visibility external
    //<
    
    //> @attr SelectItem.defaultToFirstOption (boolean : false : IRW) 
    // Select the first option as the default value for this SelectItem. 
    // <P>
    // If options are derived from a dataSource, the first value returned by the server will be
    // used, otherwise the first value in the valueMap.  Note that setting this property to
    // true will trigger a fetch at soon as the form is created, because the form will try to
    // establish a default value at that time.
    // <P>
    // If enabled, this setting overrides +link{SelectItem.defaultValue} and
    // +link{SelectItem.defaultDynamicValue}.
    //
    // @visibility external
    //<
    
    autoSizePickList:true,
    
    //>	@attr	selectItem.multiple		(boolean : false : IRW)
	// If true, multiple values may be selected.
    // <P>
    // The SelectItem will either render as a drop-down allowing multiple selections, or a
    // multi-row list of options similar to a small headerless +link{ListGrid}, based on the
    // +link{multipleAppearance} setting.
    // <P>
    // The logical value of the formItem, as retrieved by +link{formItem.getValue,getValue()}
    // and set via +link{formItem.setValue,setValue()}, is an Array of Strings reflecting the
    // selected values.
    // <P>
    // Note: <code>multiple:true</code> SelectItems do not currently support optionDataSource
    // binding.  You can get around this by calling +link{DataSource.fetchData()} directly and
    // calling +link{list.getValueMap,dsResponse.data.getValueMap()} to obtain a valueMap.
    //
	//  @group	appearance
    //  @visibility external
	//<
    // Note that if multipleAppearance is "grid", this currently uses NativeSelectItem
    
    //> @type MultipleAppearance
    // Appearance for a SelectItem that allows multiple selection
    //
    // @value "picklist" a drop-down picklist that allows multiple choices by
    //              clicking on a checkbox next to each item
    // @value "grid" a grid that displays all items in-place. Multiple selection is 
    //              accomplished by ctrl-click or shift-click.
    // @visibility external
    //<

    //> @attr SelectItem.multipleAppearance   (MultipleAppearance : "picklist" : IR)
    // How should items with +link{SelectItem.multiple} set to 'true' be displayed?
    // @visibility external
    //<
    multipleAppearance: "picklist",

    // ---------------------------
    // SelectOther is a behavior implemented on select items 
    // This is doc'd as a separate form item type, and can be specified by creating a 
    // form item of type 'selectOther' (or setting the 'isSelectOther' flag on a select item)
    // ---------------------------
    
    
    // isSelectOther - flag to specify this as a special 'selectOther' type item.
    // may be set up by the FormItemFactory when the item is created
    //isSelectOther:false,

    //>	@class	SelectOtherItem
    //
    // FormItem that shows a list of options, plus an "Other..." option that allows them to enter
    // another value.
    //
    // @treeLocation Client Reference/Forms/Form Items
    // @visibility external
    //<
    
    //>	@attr	selectOtherItem.separatorTitle		(string : "--------------------" : IRW)
    // Title for the separator between normal items and the <code>Other...</code> item in the drop
    // down list.  Selecting this item will not change the FormItem's value.
    // @group appearance
    // @visibility external
    //<
    separatorTitle:"--------------------",
    
    //>	@attr	selectOtherItem.separatorValue		(string : "----" : IRWA)
    // Value for the separator item between normal items and the <code>Other...</code> value. 
    // If necessary the value may be changed to ensure it doesn't collide with any data values in
    // this item's +link{formItem.valueMap,valueMap}.
    // @group appearance
    // @visibility external
    //<
    separatorValue:"----",

    //>	@attr	selectOtherItem.otherTitle		(string : "Other..." : IRW)
    // Title for the <code>Other...</code> item. When this item is selected, the user will be 
    // shown a prompt allowing them to enter a new value for the item. 
    // @group appearance
    // @group i18nMessages
    // @visibility external
    //<
    otherTitle:"Other...",
    
    //>	@attr	selectOtherItem.otherValue		(string : "***other***" : IRWA)
    // Data value for the <code>Other...</code> item. If necessary this value may be changed to
    // ensure it doesn't collide with any data values in this item's
    // +link{formItem.valueMap,valueMap}.
    // @group appearance
    // @visibility external
    //<
    otherValue:"***other***"

};


// Include the shared select item properties
isc.SelectItem.addProperties(isc._SelectItemProperties);

// The following properties apply only to SelectItems (not NativeSelectItems)
isc.SelectItem.addProperties({
    
    
    //> @attr selectItem.showPickerIcon (boolean : true : [IRW])
    // Should we show a special 'picker' icon for this form item. Picker icons are customizable
    // via +link{SelectItem.pickerIconProperties}. By default they will be rendered inside the 
    // Form Item's "control box" area, and will call +link{SelectItem.showPicker()} when clicked.
    //
    // @visibility external
    //<
    showPickerIcon:true,
    
    // override emptyDisplayValue to show a nonbreaking space so styling works correctly
    emptyDisplayValue:"&nbsp;",
    
    //> @method SelectItem.showPicker()
    // @include FormItem.showPicker()
    // @visibility external
    //<
    
    //> @attr SelectItem.textBoxStyle (FormItemBaseStyle : "selectItemText", [IRA])
    // @include FormItem.textBoxStyle
    // @visibility external
    // @group appearance
    //<
    // This is applied to the visible, selected value in the select item.
    

    //> @attr SelectItem.controlStyle (FormItemBaseStyle : "selectItemControl", [IRA])
    // @include FormItem.controlStyle
    // @group appearance
    // @visibility external
    //<
    controlStyle:"selectItemControl",
    
    //> @attr SelectItem.pickerIconStyle  (FormItemBaseStyle : "selectItemPickerIcon", [IRA])
    // @include FormItem.pickerIconStyle
    // @see SelectItem.controlStyle
    // @visibility external
    // @group appearance
    //<
    pickerIconStyle:"selectItemPickerIcon",
       
        

    // Select items can accept focus
    
    canFocus:true,
    
    //> @attr SelectItem.showFocused    (boolean : true, [IRWA])
    // @include FormItem.showFocused
    // @visibility external
    //<
    showFocused:true,
    
    //> @attr SelectItem.pickerIconWidth (number : null : [IRWA])
    // If +link{selectItem.showPickerIcon} is true for this item, this property governs the
    // size of the picker icon. If unset, the picker icon will be sized as a square to fit in the
    // available height for the icon.
    // @group pickerIcon
    // @visibility external
    //<
        
    //> @attr SelectItem.pickerIconHeight (number : null : [IRWA])
    // If +link{selectItem.showPickerIcon} is true for this item, this property governs the
    // size of the picker icon. If unset, the picker icon will be sized as a square to fit in the
    // available height for the icon.
    // @group pickerIcon
    // @visibility external
    //<
    
    //> @attr SelectItem.pickerIconSrc  (SCImgURL : "[SKIN]/DynamicForm/SelectItem_PickButton_icon.gif" : [IRWA])
    // If +link{selectItem.showPickerIcon} is true for this item, this property governs the
    // src of the picker icon image to be displayed.
    // @group pickerIcon    
    // @visibility external
    //<
    pickerIconSrc:"[SKIN]/DynamicForm/SelectItem_PickButton_icon.gif",
    
    // Override pickerIconDefaults
    // Don't make this pickerIcon independantly focusable - we only want the user to focus
    // once on the form item
    // Marked 'internal' - we don't want this property overridden - very likely to break
    // the selectItem functionality.
    pickerIconDefaults : {
        
        //imgOnly:true
        tabIndex:-1,
        click:function () {}
    },
    
    //> @attr SelectItem.pickerIconProperties (object : {...} :[IRA])
    // If +link{selectItem.showPickerIcon} is true for this item, this block of properties will
    // be applied to the pickerIcon. Allows for advanced customization of this icon.
    // @group pickerIcon
    // @visibility external
    //<

    // Clip the content.
    
    clipValue:true,
    
    // -----------------------
    // Deprecated:

    //> @attr SelectItem.hiliteOnFocus   (boolean : true : [IRWA])
    // Should this SelectItem show a hilite when it receives keyboard focus?
    // @visibility external
    // @deprecated As of SmartClient version 5.5, use +link{SelectItem.showFocused} instead.
    //<
    
    //> @attr    SelectItem.hiliteColor (string : "#316AC5": IRWA)
    // Background color to apply to the select item's selected value when the SelectItem 
    // receives focus, if <code>hiliteOnFocus</code> is true.
    // @visibility external
    // @deprecated As of SmartClient version 5.5, if +link{SelectItem.showFocused} is true,
    //  styling will be updated for this form item on focus. The hiliting effect can therefore
    //  be achieved via +link{SelectItem.textBoxStyle} and +link{SelectItem.controlStyle} 
    //  instead.
    //<
    
    //> @attr    SelectItem.hiliteTextColor (string : "white": IRWA)
    // Text color to apply to the select item's selected value when the SelectItem 
    // receives focus, if <code>hiliteOnFocus</code> is true.
    // @visibility external
    // @deprecated As of SmartClient version 5.5, if +link{SelectItem.showFocused} is true,
    //  styling will be updated for this form item on focus. The hiliting effect can therefore
    //  be achieved via +link{SelectItem.textBoxStyle} and +link{SelectItem.controlStyle} 
    //  instead.
    //<

    //> @attr    SelectItem.pickButtonWidth  (number : null : IRWA)
    // How large should the pick button be rendered?
    // @visibility external
    // @deprecated As of SmartClient version 5.5, pickButtonWidth has been deprecated in 
    //  favor of +link{SelectItem.pickerIconWidth}.
    //<
    
    //> @attr    SelectItem.pickButtonHeight  (number : null : IRWA)
    // How large should the pick button be rendered?
    //
    // @visibility external    
    // @deprecated As of SmartClient version 5.5, pickButtonHeight has been deprecated in 
    //  favor of +link{SelectItem.pickerIconHeight}.
    //<
    
    //> @attr    SelectItem.pickButtonSrc  (string : null : IRWA)
    // Source for image to show for the pick button
    // @visibility external    
    // @deprecated As of SmartClient version 5.5, pickButtonSrc has been deprecated in 
    //  favor of +link{SelectItem.pickerIconSrc}.
    //<    
    
    // ------------
    
    
    
    // Allow customization of the hilite color-scheme applied to the pickList.
    // If specified, overrides styling applied via the selected state of pickListBaseStyle.
    
    //>@attr    SelectItem.pickListHiliteColor (string : null : IRWA)
    // If specified this property determines the backgroundColor to show highlighted items in the 
    // pickList.  By default we don't specify this property, and pick up the styling based on
    // the <code>selected</code> state of the <code>pickListBaseStyle</code>.
    //<
    //pickListHiliteColor:"#316AC5",

    //>@attr    SelectItem.pickListHiliteTextColor (string : null : IRWA)
    // If specified this property determines the text color to show highlighted items in the 
    // pickList.  By default we don't specify this property, and pick up the styling based on
    // the <code>selected</code> state of the <code>pickListBaseStyle</code>.
    //<
    //pickListHiliteTextColor:"white",
    
    
    //> @attr SelectItem.showOver (boolean : true : IRWA)
    // When the user rolls over the select item, should the pickButton display it's 
    // <code>Over</code> state?
    // @visibility external    
    //<
    showOver:true,

    
    // Non-exposed property governing whether the pickList should be shown with a clickMask, 
    // and take focus when shown.
    modalPickList:true,
    
    //>@attr    SelectItem.fireChangeOnSelect   (boolean : true : IRW)
    // whether +link{FormItem.change()} 
    // fires each time the pickList selection changes, or only when the pickList is dismissed. 
    //<
    
    //>@attr    SelectItem.changeOnValueChange (boolean : true : IRW) 
    //  If true the change handler for this item will fire when the item has focus and
    //  modifies the selection for the item.
    //  If false, the change handler will only fire when the user leaves a modified selectItem.
    //<
    
    
        
    changeOnValueChange:true,
    
    //>@attr    SelectItem.changeOnKeyboardNavigation (boolean : true : IRW) 
    //  If this.changeOnValueChange is true, and the user is navigating through values via
    //  keypresses such as up and down arrows, while the pick-list is not visible, should we
    //  fire change?
    //  Has no effect if this.changeOnValueChange is false.
    // @visibility internal
    //<
    
    changeOnKeyboardNavigation:true,

    // Don't allow native text selection of the content of the SelectItem
    
    canSelectText : false,
    
    //> @attr selectItem.allowEmptyValue  (boolean : false : IRW)
    // If set to true, always show an empty option in this item's pickList, allowing the user
    // to clear the value (even if there is no empty entry in the valueMap for the item).
    // <P>
    // The empty value will be displayed with the
    // +link{formItem.emptyDisplayValue,emptyDisplayValue}.
    // <P>
    // With a +link{optionDataSource,databound selectItem}, enabling
    // <code>allowEmptyValue</code> disables data paging - all data matching the
    // +link{pickList.pickListCriteria,current criteria} will be requested.
    // 
    // @visibility external
    //<
    allowEmptyValue : false,
    
    
    //> @attr selectItem.autoFetchData   (boolean : true : [IRA])
    // If this select item retrieves its options from a <code>dataSource</code>, should options
    // be fetched from the server when the item is first drawn, or should this fetch be
    // delayed until the user opens the pickList.
    // <P>
    // The default is true in order to allow the user to select a value via keyboard input
    // while keyboard focus is on the SelectItem but the pickList has not actually been shown.
    //
    // @visibility external
    // @see PickList.optionDataSource
    //<
    autoFetchData:true

    //>@attr SelectItem.showHintInField (boolean : null : IRWA)
    // If showing a hint for this form item, should it be shown within the field?
    // <P>CSS style for the hint is +link{selectItem.textBoxStyle} with the suffix
    // "Hint" appended to it. 
    // @group appearance
    // @see FormItem.hint
    // @visibility external
    //<
});


isc.SelectItem.addMethods({

    // At init time, pick up any deprecated properties applied to this select item.
    init : function () {
        //>!BackCompat 2006.3.9
        if (this.hiliteOnFocus != null) {
            this._warnDeprecated("hiliteOnFocus", "showFocused");
            this.showFocused = this.hiliteOnFocus;
        }
        
        if (this.pickButtonWidth != null) {
            this._warnDeprecated("pickButtonWidth", "pickerIconWidth");
            this.pickerIconWidth = this.pickButtonWidth;
        }
        if (this.pickButtonHeight != null) {
            this._warnDeprecated("pickButtonHeight", "pickerIconHeight");
            this.pickerIconHeight = this.pickButtonHeight;
        }
        
        if (this.pickButtonSrc != null) {
            this._warnDeprecated("pickButtonSrc", "pickerIconSrc");
            this.pickerIconSrc = this.pickButtonSrc;
        }
        //<!BackCompat
        return this.Super("init", arguments);    
    },
    
    

    // Override drawn() - if this is a databound pickList we want to perform a filter before
    // the pickList itself ever gets shown.
    
    drawn : function (a,b,c,d) {
        this.invokeSuper(isc.SelectItem, "drawn", a,b,c,d);
        if (this.autoFetchData && this._getOptionsFromDataSource()) {
            this.fetchData(null, null, true);
        }
    },

        
    
    
    _getIconVMargin : function () {
        return 0;
    },
    
    // Override iconFocus() - if focus goes to the picker icon, shift it to the textbox instead
    
    _iconFocus : function (id, element) {
        var icon = this.getIcon(id);
        if (icon == this.getPickerIcon()) {
            element.blur();
            this.focusInItem();
            return;
        }
        
        return this.Super("_iconFocus", arguments);
    },
    
    // ---------------------------------------------------------------------------------------
    // EVENTS
    // ---------------------------------------------------------------------------------------

    // Update the pick button appearance when the user rolls over the control table
    handleMouseMove : function () {
        if (this.showOver && !this.isDisabled()) {
            if (this._overControlTable()) this._setIconImgState(this.getPickerIcon(), true);
            else this._setIconImgState(this.getPickerIcon(), false);
        }
        return this.Super("handleMouseMove", arguments);
    },
    handleMouseOut : function () {
        if (this.showOver && !this.isDisabled()) {
            this._setIconImgState(this.getPickerIcon(), false);
        }
        return this.Super("handleMouseOut", arguments);
    },
    
    // on iconMouseOut - if the user rolled off the picker icon, but is still over the 
    // control table - don't clear the picker icon hilight
    _iconMouseOut : function (id, a,b,c,d) {
        if (this.getIcon(id) == this.getPickerIcon() && this._overControlTable()) return;
        return this.invokeSuper("SelectItem", "_iconMouseOut", id, a,b,c,d);
    },
    
    // Override click to show the pick list 
	handleClick : function () {
        if (!this.isDisabled()) {
            // Give this item explicit focus before we show the pickList
            // This should only be done if the item is not disabled, otherwise 
            // focusInItem() causes a recursion error.
            
            this.focusInItem();
            this.showPickList();
        }
        // call to Super fires any developer specified click handlers
        return this.Super("handleClick", arguments);
    },
    
    // Override handleKeyPress to allow navigation via typing the first letters of valid
    // options
    handleKeyPress : function (event, eventInfo) {

        var returnVal = this.Super("handleKeyPress", arguments);
        if (returnVal == false) return false;

        var keyName = event.keyName;

        // On Enter keyPress resolve "other..." (or separator) selection to a meaningful value.
        if (keyName == "Enter" && this.isSelectOther) {
            if (this._selectOtherValue != null) this.updateValue();
        // Navigate where appropriate            
        } else if (keyName == "Arrow_Down") {
            if (isc.EH.altKeyDown()) this.showPickList();
            else this.moveToNextValue(1);
            // Don't allow scrolling, etc
            returnVal = false;
            
        } else if (keyName == "Arrow_Up") {
            if (isc.EH.altKeyDown()) this.showPickList();
            else this.moveToNextValue(-1);
            // Don't allow scrolling, etc
            returnVal = false;
            
        } else if (keyName == "Home") {
            this.moveToFirstValue();
            // Don't allow scrolling, etc
            returnVal = false;
        } else if (keyName == "End") {
            this.moveToLastValue();
            // Don't allow scrolling, etc
            returnVal = false;
        } else {
            // If the user hit the first char of one of our options, move to that option
            var charVal = event.characterValue;
            if (charVal != null) {
                this.moveToChar(charVal);
            }
        }
        
        return returnVal;
    },  

    // On Blur, if we were marked as dirty, fire the change handler
    _nativeElementBlur : function (element, itemID) {
        var returnVal = this.Super("_nativeElementBlur", arguments);
        if (this.changeOnBlur || this._itemValueIsDirty() || this._selectOtherValue) {
            
            if (isc.Browser.isMoz && this._selectOtherValue == this.otherValue)
                this.form.__suppressFocusHandler = true;
            this.updateValue();
        }

        return returnVal;
    },    
    
    

    showPickList : function (waitForData, queueFetches) {
        var interfaceShowPickList = isc.PickList.getPrototype().showPickList;
        interfaceShowPickList.apply(this, arguments);
        if (this.pickList) {
            this.pickList.deselectAllRecords();
            // if either a value was passed in or this.defaultToFirstOption: true, select now
            if (this.getValue()) this.selectItemFromValue(this.getValue());
        }
    },
    
    // Override handleEditorExit() - when fired from a blur, if the pickList is visible we
    // don't want to fire the editorExit method, since focus is going to the pickList
    handleEditorExit : function () {
        
        if (this._showingPickList) return;
        return this.Super("handleEditorExit", arguments);
    },
    
    editorEnter : function (form, item, value) {
        // Hide in-field hint if being shown
        this._hideInFieldHint();
    },
    editorExit : function (form, item, value) {
        var undef;
        if (this.showHintInField && 
            (value === undef || value == null || isc.is.emptyString(value)))
        {
            this._showInFieldHint();
        }
    },

    // When the pick list is shown, fire editorEnter - essentially interacting with the picklist
    // is the same as interacting with this item.
    _pickListShown : function () {
        // Note: this will no-op if we've already fired editorEnter()
        this.handleEditorEnter();
        if (this.pickListShown) this.pickListShown();
    },
    
    // override _pickListHidden so that change notifications can be fired when
    // fireChangeOnSelect is false, and the item is in multi mode
    _pickListHidden : function () {
        if (this.fireChangeOnSelect == false) this.updateValue();   
        if (this.pickListHidden) this.pickListHidden();
    },

    // Navigation methods:

    

    // helper to get the locally loaded set of options:
    // Returns set of options if the pickList is not databound
    // For databound picklists, returns the set of all rows, if every row is cached 
    // Otherwise we know we don't have complete client side data so returns null.
    getAllLocalOptions : function () {
       var valsArray;
        if (this._getOptionsFromDataSource()) {
            // if we're databound, allow keyboard navigation iff we've got a full cache
            if (!this.pickList || this.pickList.destroyed) return;
            var rs = this.pickList.data;
            if (!rs || !rs.lengthIsKnown() || !rs.allMatchingRowsCached()) return;
            
            // We're going to have to refilter (on the client) if the criteria have changed
            var criteria = this.getPickListFilterCriteria();
        	if (rs.compareCriteria(criteria, rs.criteria) != 0) {
                if (!rs.allRowsCached() || !rs.useClientFiltering) return;
                this.filterPickList(false, false);    
            }
            valsArray = rs.getAllRows();
        } else {
            valsArray = this.getClientPickListData();
        }
        return valsArray;
    },
    
    // moveToChar() - sets the value of this item to the next valid option that starts with
    // the specified character
     
    moveToChar : function (charVal) {
        var valsArray = this.getAllLocalOptions();
        if (!valsArray || valsArray.length < 2) return;
            
        var character = String.fromCharCode(charVal);
        if (character == null) return;
        // Normalize to a lowercase string for comparison.
        character = character.toLowerCase();
        
        var value = (this.isSelectOther && this._selectOtherValue != null) ? this._selectOtherValue :
                    (this._itemValueIsDirty() ? this._localValue : this.getValue()),
            valueField = this.getValueFieldName(),
            currentIndex = valsArray.findIndex(valueField, value),
            i = (currentIndex == valsArray.length -1 ? 0 : currentIndex + 1);

        while (i != currentIndex) {
            // avoid an infinite loop if the current value is not in the valueMap
            if (currentIndex < 0) currentIndex = 0;
            var testValue = valsArray[i][this.getValueFieldName()],
                displayValue = this.mapValueToDisplay(testValue);

            if (isc.isA.String(displayValue)) {
                var compareChar = displayValue.charAt(0).toLowerCase();
                if (compareChar == character) {
                    var newValue = testValue;
                
                    // use changeToValue() to update the value and fire the change handler                
                    this.changeToValue(
                        newValue, 
                        (this.changeOnValueChange && this.changeOnKeyboardNavigation)
                    );
                    return;
                }
            }
            i += 1;
            if (i >= valsArray.length) i = 0;
        }
    },

    // moveToNextValue() - sets the value of this item to the previous / next valid option in
    // the valueMap
    moveToNextValue : function (step) {
        var valsArray = this.getAllLocalOptions();
        if (!valsArray || valsArray.length < 2) return;

        var value;
        if (this.isSelectOther && this._selectOtherValue != null) value = this._selectOtherValue;
        else value = (this._itemValueIsDirty() ? this._localValue : this.getValue());
        
        var valueField = this.getValueFieldName(),
            currentIndex = valsArray.findIndex(valueField, value);
        
        currentIndex += step;
        // Native selects don't allow wrapping of arrow key navigation (so we won't either)
        if (currentIndex >= valsArray.length || currentIndex < 0) return;

        // use changeToValue() to update the value and fire the change handler                
        var val = valsArray[currentIndex][valueField];
        this.changeToValue(
            val, 
            (this.changeOnValueChange && this.changeOnKeyboardNavigation)
        );
    },
    
    // moveToFirstValue() / moveToLastValue() - sets the value of this item to the first/last
    // values in the valueMap for this item.
    moveToFirstValue : function () {

        if (this.optionDataSource) return;

        var valsArray = this.getClientPickListData(),
            valueField = this.getValueFieldName(),
            val = valsArray[0][valueField];
        this.changeToValue(
            val, 
            (this.changeOnValueChange && this.changeOnKeyboardNavigation)
        );
    },

    moveToLastValue : function () {

        if (this.optionDataSource) return;

        var valsArray = this.getClientPickListData(),
            valueField = this.getValueFieldName(),
            val = valsArray[valsArray.length -1][valueField]
        this.changeToValue(
            val, 
            (this.changeOnValueChange && this.changeOnKeyboardNavigation)
        );
    },

    // ---------------------------------------------------------------------------------------
    // FOCUS AND STYLING
    // ---------------------------------------------------------------------------------------
    
    _canFocus : function () {
        return true;
    },
    
    
    _getIconMouseDownFunction: function () {
        if (!this._iconMouseDownFunction) {
            this._iconMouseDownFunction = 
                new Function ("if(window." + this.getID() + ")window." + this.getID() + 
                               "._showingPickList=true;");
        }
        return this._iconMouseDownFunction;
    },
    
    _applyHandlersToElement : function (a,b,c,d) {
        // Apply the normal handlers
        this.invokeSuper(isc.SelectItem, "_applyHandlersToElement", a,b,c,d);
        if (isc.Browser.isIE) {
            var iconElement = this._getIconImgElement(this.getPickerIcon());
            if (iconElement) {
                iconElement.onmousedown = this._getIconMouseDownFunction();
            }
        }
        
    },
    
    
    // ----------------------------------------------------------------------------------------
    // Values Management
    // ----------------------------------------------------------------------------------------
    
    
    makePickList : function (show) {
        if (!this.filterLocally && this.allowEmptyValue && this._getOptionsFromDataSource()) {
            if (this.pickListProperties == null) 
                this.pickListProperties = {};
            if (this.pickListProperties.dataProperties == null) 
                this.pickListProperties.dataProperties = {};
            // Using basic rather than local means if we do have outstanding filter criteria
            // we'll fetch fewer rows from the server, while still being able to manipulate
            // the cache to insert the empty row at the top.
            this.pickListProperties.dataProperties.fetchMode = "basic";
        }
        var interfaceMakePickList = isc.PickList.getPrototype().makePickList;
        return interfaceMakePickList.apply(this, arguments);
    },
    
    // changeToValue()
    // Helper method to fire the change handler for this item, then update to the value 
    // specified.  Called when the user navigates to a new value.
    
    changeToValue : function (newValue, saveValue) {

        var value = (this._selectOtherValue || this._localValue || this.getValue());

        if (value == newValue) return;
        
        if (this.isSelectOther && 
            (newValue == this.separatorValue || newValue == this.otherValue)) 
        {
            this.setElementValue(this.mapValueToDisplay(newValue));
            // keep a pointer around to tell us which value the user selected.
            
            this._selectOtherValue = newValue;
            return;
        } else {
            delete this._selectOtherValue;
        }
        // Update the displayed HTML and store the new value locally.
        this.setLocalValue(newValue);
        // if we're saving the value out, fire 'updateValue()'
        if (saveValue) this.updateValue();
    },
    
    // setLocalValue:
    // Update the displayed value without saving the value out / firing the change handler.
    setLocalValue : function (value) {
        this._localValue = value;
        
        if (this.isVisible() && this.containerWidget.isDrawn()) {
            
            if (value == null) value = null;
            this.setElementValue(this.mapValueToDisplay(value), value);
        }
        this._markValueAsDirty();
    },
    
    // Override setElementValue to hang onto a copy of the current display value
    
    setElementValue : function (displayValue, dataValue, a,b,c) {
        this._displayValue = displayValue;

        // If showing hint within data field, see if it should be shown now.
        
        if (this.showHintInField && this.getHint()) {
            var undef;
            if (displayValue === undef || displayValue == null || 
                isc.is.emptyString(displayValue))
            {
                // Set field class to our hint style
                if (this.hasDataElement()) {
                    var element = this.getDataElement();
                    element.className = this._getInFieldHintStyle();
                } else {
                    var textBox = this._getTextBoxElement();
                    if (textBox != null)
                        textBox.className = this._getInFieldHintStyle();
                }

                // Show the hint in the field
                // Note that hint is HTML which may not display correctly within the field.
                // To improve the situation, unescape common HTML sequences first.
                var hint = this.getHint();
                if (hint) hint = hint.unescapeHTML();
                displayValue = hint;
                this._showingInFieldHint = true;
            }
        }

        return this.invokeSuper(isc.SelectItem, "setElementValue", displayValue, dataValue, a,b,c);
    },

    // Override updateValue - this method will save out the value previously applied locally.
    updateValue : function () {
        // Handle the case of a selectOther item where the user has selected the separator
        // or the "Other..." options.
        if (this.isSelectOther && this._selectOtherValue != null) {
            var selectOtherValue = this.getSelectOtherValue(this._selectOtherValue);
            delete this._selectOtherValue;
            this.setLocalValue(selectOtherValue);
        }
        // if we're not dirty we don't need to update at all.
        if (!this._itemValueIsDirty()) return;
        
        var newValue = this._localValue;
        this._updateValue(newValue);
    },
    
    // Disable mapDisplayToValue entirely.
    // This method is called from _updateValue which is passed the displayValue in most form items
    // however in SelectItems we always pass the data value directly into this method so it needs
    // no further modification.
    mapDisplayToValue : function (value) {
        return value;
    },
    
    
    //>@attr    SelectOtherItem.selectOtherPrompt   (string : "Other value for <br>${item.getTitle()}?" : IR)
    // Title to show in prompt for "other" value.
    // Note this is a dynamic string. JavaScript content is supported within <code>\${...}</code>
    // tags, with local variables for <code>item</code> (a pointer to this item) and 
    // <code>value</code> a pointer to the currently selected item value.
    // @group i18nMessages
    // @visibility external
    //<
    selectOtherPrompt:"Other value for <br>${item.getTitle()}?",
    
    //> @attr SelectOtherItem.dialogWidth (integer : 250 : IRW)
    // Width for the "other value" prompt dialog.
    // @visibility external
    //<
    dialogWidth:250,
    
    // getSelectOtherValue - only used by isSelectOther items -- if the user selected
    // "Other" or the separator, return the desired value for the cell (uses the prompt if
    // necessary)
    getSelectOtherValue : function (value) {
        if (value == this.separatorValue) return (this._localValue || this.getValue());
        if (value == this.otherValue) {

            // Note the prompt contents should probably be customizable
            var oldValue = this._localValue || this.getValue(),
                oldTitle = (oldValue == null ? "" : this.mapValueToDisplay(oldValue)),
                promptTitle = this.selectOtherPrompt.evalDynamicString(null,
                                                     {item:this, value:oldValue}),
                config = isc.addProperties({width:this.dialogWidth},
                                            // support dialogDefaults / dialogProperties to
                                            // configure the prompt - this mimics the
                                            // auto-child APIs
                                            this.dialogDefaults, this.dialogProperties); 
                                                     
            isc.askForValue(promptTitle, this.getID() + ".getSelectOtherValueCallback(value)",
                            config);
            return true;
        }
    },
    
    getSelectOtherValueCallback : function (value) {
        if (value != null) {
            value = this.mapDisplayToValue(value);
            this.changeToValue(value, this.changeOnValueChange);
        }
    },

    // Override setValue 
    // - must handle 'addUnknownValues' logic
    // - must redraw the selected value text.
    setValue : function (value,b,c,d) {
        // Make sure this value is a valid option from our valueMap if necessary.
        
        value = this._getValidValue(value);
        
        
        var undef,
            localValue = this._localValue;
        if (localValue === undef) localValue = this._value;
        
        // Let the superclass implementation save the value out and mark as not dirty. 
        // Note: at this point the value passed in may be null - if so we're relying on 
        // the superclass implementation to get the defaultValue and set up the 'isDefaultValue'
        // flag on this item.
        // NOTE: we are passing a modified value.  
        this.invokeSuper(isc.SelectItem, "setValue", value,b,c,d);
        value = this.getValue();
        
        // Calling setLocalValue actually sets the displayed element value (may have been
        // changed by the call to Super("setValue"...)
        if (value != localValue) this.setLocalValue(value);
        
        // if the pickList is showing, ensure it's showing the right set of data and has
        // the correct element selected.
        if (this.pickList && this.pickList.isDrawn() && this.pickListVisible()) {
            this.setUpPickList(true);
        }

        // See if the in-field hint needs to be shown
        if (!this.hasFocus && this.showHint && this.showHintInField && this.getHint()) {
            if (value === undef || value == null || isc.is.emptyString(value)) {
                this._showInFieldHint();
            }
        }

        return value;
    },
    
    
    
    saveValue : function (value, a,b,c,d) {
        var oldValue = this._value;
        if (this._dropCacheOnValueChange(oldValue, value)) delete this._clientPickListData;
        return this.invokeSuper(isc.SelectItem, "saveValue", value, a,b,c,d);
    },
    _dropCacheOnValueChange : function (oldValue, newValue) {
        return (this.addUnknownValues && this._clientPickListData &&
                ((oldValue != null && !this._valueInValueMap(oldValue)) ||
                 (newValue != null && !this._valueInValueMap(newValue))    ) );
    },
    
    // Override 'markValueAsNotDirty' to clear out the temp local value.
    // note this means that callers should have already ensured that the displayed value
    // matches the appropriate value. This method is strictly internal, so this is an 
    // acceptable assertion to make
    _markValueAsNotDirty : function (a,b,c,d) {
        this.invokeSuper(isc.SelectItem, "_markValueAsNotDirty", a,b,c,d);
        delete this._localValue;
    },
    
    // override getDefaultValue to pick up the first option if defaultToFirstOption is true
    // getDefaultValue should not be able to return a value that is not included
    // in the valueMap for this select.
    getDefaultValue : function () {
        
        // If an explicitly specified defaultValue exists, respect it.
        var dV =  this.Super("getDefaultValue", arguments);
        if (dV == null && this.defaultToFirstOption) dV = this.getFirstOptionValue();
        
        return this._getValidValue(dV);
    },
    
    // selectItems have a limited set of valid values (represented by the valueMap).
    // this method will take a value, and ensure it is a member of the value map for the item.
    // The value will be returned if valid - otherwise this method returns null.
    _getValidValue : function (value) {
        
        // Disallow values that aren't in the valueMap.
        // If passed a value not in the valueMap:
        // - if our current (or 'previous') value is valid, return it
        // - if not, clear the value
        if (!this._valueIsValid(value)) {

            
            var alreadyChecking = this._checkingValidValue;
            this._checkingValidValue = true;
            var validValue;
            if (alreadyChecking) validValue = value;
            else validValue = this._localValue || this.getValue();

            // If the value passed in is the 'current value', or our previous value isn't
            // valid, clear the value.
            // [a null value is always considered valid by this mechanism].
            if (value == validValue || !this._valueIsValid(validValue)) {
                validValue = null;
            } 
            value = validValue;
        }       
        return value;
    },
      
    _valueIsValid : function (value) {
                
        if (this.addUnknownValues || this.optionDataSource) return true;
        
        // Allow null values regardless of what the valueMap looks like
        
        if (value == null) return true;

        // Disallow values that aren't in the valueMap.
        // In multi-select mode, the value could be an array of choices.
        if (isc.isAn.Array(value)) {
            for (var i = 0; i < value.length; i++) {
                if (!this._valueInValueMap(value[i])) return false;
            }
            return true;
        } else {
            return this._valueInValueMap(value)
        }
    },

    _valueInValueMap : function (value) {
        var valueMap = this.getValueMap(),
            undef;
        if (isc.isAn.Array(valueMap)) {
            return valueMap.contains(value)
        } else if (isc.isAn.Object(valueMap)) {
            return (valueMap[value] !== undef);
        } 
        return false;
    },
    
    // Display vs internal value mapping
    // mapValueToDisplay() allows us to convert internal value to  display value.
    
    mapValueToDisplay : function (internalValue, a, b, c) {          
        if (this.isSelectOther) {
            if (internalValue == this.otherValue) return this.otherTitle;
            if (internalValue == this.separatorValue) return this.separatorTitle;
        }

        return this.invokeSuper(isc.SelectItem, "mapValueToDisplay", internalValue,a, b, c);
	},
    
    
    // getSelectedRecord()
    // For SelectItems there's a _localValue which gets set up before we store our
    // value properly.
    // This is used to allow change to occur on blur rather than just on standard 'change' event.
    //
    // For selectItems use the current _local value rather than the stored item value when
    // picking up the current record from the pickList. Otherwise you get unexpected behaviour if
    // (for example) custom formatters make use of the pick list records -- we'll see the last
    // selected record rather than the newly selected record until the change handler fires and
    // stores the value out.
    getSelectedRecord : function () {
        
        if (this.pickList == null || this.pickList.destroyed) this.makePickList(false);
    
        // We can't just say this.pickList.getSelectedRecord(), since the
        // value may not have been picked from a pickListClick -- instead force a selection
        // that matches our item value then retrieve the selected value.
        var undef,
            value = this._localValue;
        if (value === undef) value = this.getValue();
    
        if (this.selectItemFromValue(value)) {
            return this.pickList.getSelectedRecord();
        }

        // if we didn't find the selectedRecord in the pickList, call 'super'
        // this will pick up this._selectedRecord if present -- that gets set up by
        // the fetchMissingValues code in FormItem.
        
        return this.Super("getSelectedRecord", arguments);
    },

    //> @method selectItem.getSelectedRecords()
    // For a SelectItem with an +link{optionDataSource} and allowing multiple selection
    // (+link{multiple,via multiple:true}), returns the list of currently selected records, or
    // null if none are selected.
    // 
    // @return (Array of Record) the list of selected records, or null if none are selected
    // @visibility external
    //< 
    getSelectedRecords : function () {
        var value = this._localValue;
        this.selectItemFromValue(value);
        var sel = this.pickList.getSelection();
        if (sel.length > 0) return sel;
        else return null;
    },
    
    // Map valueToDisplay needs to pick up
    // the mapping between displayField and valueField, if there is one.
    // We implement this by overriding _mapKey() to check for the value in
    // our pickList's dataSet, in addition to checking against any explicitly specified valueMap
    
    
    _mapKey : function (value, dontReturnKey, a,b,c,d) {
        var displayValue = this.invokeSuper(isc.SelectItem, "_mapKey", value, true ,a,b,c,d);

        // _translateFieldValue part of the pickList interface
        if (displayValue == null && this.getDisplayFieldName() != null) 
            displayValue = this._translateValueFieldValue(value, false);
        if (displayValue == null && !dontReturnKey) displayValue = value;            
        return displayValue;
    },
    
        
    // Override checkForDisplayFieldValue()
    // This is the method that, if we have a displayField specified, kicks off a fetch against
    // our optionDataSource to load the appropriate display value from the server.
    // In PickList based items we use the pickList data (if present) to map data to display 
    // values. 
    // Catch the case where checkForDisplayFieldValue is called when we are in the process of
    // fetching our pickList data from the server.
    // In this case we want to wait for the pickList data to be returned rather than kicking off
    // an additional fetch as our data value will usually be present in that pickList data.
    // When the pickList data returns we re-check this method. If the data is present, we're 
    // done, otherwise we need to kick off another fetch as we didn't find our data value in
    // the pickList data array. This can happen if the pickList data is paged, for instance.
    _checkForDisplayFieldValue : function (newValue, delayed) {
        var inValueMap = (this._mapKey(newValue, true) != null);
        
        if (inValueMap) return; 
        
        if (this._fetchingPickListData) {
            this._checkDisplayFieldValueOnFilterComplete = true;
            return;
        }        
        this.invokeSuper(isc.ComboBoxItem, "_checkForDisplayFieldValue", newValue);
    },
    
    
        
    // INTERACTIONS WITH PICK-LIST ------------------------------------------------------------
    // comes from the interface
    
    // Include useful JSDoc from pickList
     
    //> @attr SelectItem.optionDataSource (DataSource | String : null : IRA)
    // @include PickList.optionDataSource
    //<
    
     //> @attr selectItem.textMatchStyle (TextMatchStyle : "startsWith" : IR)
    // @include PickList.textMatchStyle
    //<
    
    //> @attr SelectItem.pickListFields (Array : null : IRA)
    // @include PickList.pickListFields
    // @example relatedRecords
    //<
    
    //> @method SelectItem.fetchData()
    // @include PickList.fetchData()
    //<

    //> @attr SelectItem.optionFilterContext (DSRequest Properties : null : IRA)
    // @include PickList.optionFilterContext
    //<
 
    //> @attr SelectItem.optionOperationId (string : null : [IR])
    // @include FormItem.optionOperationId
    // @visibility external
    //<
 
    //> @attr SelectItem.displayField (string : null : IRW)
    // @include PickList.displayField
    // @visibility external
    // @example relatedRecords
    //<
    
    //> @attr SelectItem.valueField   (string : null : IRW)
    // @include PickList.valueField
    // @visibility external
    // @example relatedRecords
    //<
    
    //> @method SelectItem.getDisplayFieldName() ([A])
    // @include PickList.getDisplayFieldName
    // @visibility external
    //<
    
    //> @method SelectItem.getValueFieldName() ([A])
    // @include PickList.getValueFieldName
    // @visibility external
    //<
    
    //> @attr SelectItem.filterLocally
    // @include PickList.filterLocally
    // @visibility external
    //<
    
    //> @method SelectItem.dataArrived()
    // @include PickList.dataArrived()
    // @visibility external
    //<
    
    //> @method SelectItem.getSelectedRecord()
    // @include FormItem.getSelectedRecord()
    // @visibility external
    //<
    
    //> @attr SelectItem.pickListCriteria (Criteria : null : IRWA)
    // @include PickList.pickListCriteria
    // @visibility external
    //<
    
    //> @attr SelectItem.showOptionsFromDataSource    (boolean : null : IRWA)
    // @include PickList.showOptionsFromDataSource
    // @visibility external
    //<
    
    //> @attr   SelectItem.pickListProperties   (object : null : IRA)
    // @include PickList.pickListProperties
    // @visibility external
    //<

    //> @attr   SelectItem.sortField   (String or integer : null : IR)
    // @include PickList.sortField
    // @visibility external
    //<

    // Override the method to get pickList data to add unknown values and selectOther
    // properties
    
    getClientPickListData : function () {
        if (this._clientPickListData) return this._clientPickListData;
        
        var records = isc.PickList.optionsFromValueMap(this),
            valueField = this.getValueFieldName();

        // If allowEmptyValue is true, add an empty entry to the top of the list            
        // Note that this is independant of addUnknownValues - we don't treat the null value
        // as an 'unknown' values - it's more like lack of a value.
        
        if (this.allowEmptyValue && (records.find(valueField, null) == null)) {
            var emptyRecord = {};
            // No need for an explicit 'null' value on the value field really
            // emptyRecord[valueField] = null;
            
            records.addAt(emptyRecord, 0);
        }
        // The current selected value must always be present in the records for the VM.
        
        var value = this.getValue();
        // don't add the value if value is an array;  this means the item is in 
        // multiselect mode
                
        if (value != null && !isc.isAn.Array(value) && records.find(valueField, value) == null) {
            var newRecord = {};
            newRecord[valueField] = value;
            records.addAt(newRecord, 0);
        }
        
        if (this.isSelectOther) {
            var separator = {},
                other = {};

            separator[valueField] = this.separatorValue;
            other[valueField] = this.otherValue;
            
            records.addListAt([separator, other], records.length);
        }
        
        this._clientPickListData = records;

        
        return records;
    },
    
    // Use the 'formatPickListValue()' method to display the appropriate title for the
    // special selectOther options.
    formatPickListValue : function (value, fieldName, record) {
        if (this.isSelectOther && (fieldName == this.getValueFieldName())) {
            if (value == this.otherValue) return this.otherTitle;
            if (value == this.separatorValue) return this.separatorTitle;
        }
        
        // apply standard formatter to the value in the single generated field for
        // standard pick lists.
        // This handles formatters applied via simpleType as well as any
        // 'formatValue()' method applied to this item
        if (this.pickList.getField(fieldName)._isGeneratedField) {
            return this._formatDataType(value);
        }
        
        return value;
        
    },
    
    // pickValue : select the picked value.
    
    pickValue : function (value) {        
        // selectOther behavior:
        // If the user selects the separator, treat this as a null selection.
        // If they select the "other" value, pop a prompt to get the value to use.
        
        if (this.isSelectOther) {
            if(this.getSelectOtherValue(value)) return;
        }
        
        // use changeToValue() to update the value and fire the change handler
        this.changeToValue(value, (this.changeOnValueChange && this.fireChangeOnSelect != false));
    },

    //>@method SelectItem.getPickListPosition() (A)
    // Returns the global left and top coordinates for the pickList.
    // Default implementation always draws the pick-list below the Select Item - override for
    // any special implementation.
    // @return (array)  2 element array indicating left and top coordinate for the pick list.
    //<
    getPickListPosition : function () {
        var itemTop = this.getPageTop(),
            top =  itemTop + this.getHeight(),
            left = this.getPageLeft(),
            height = this.getPickListHeight(),
            pageTop = isc.Page.getScrollTop(),
            pageBottom = isc.Page.getHeight() + pageTop;
        
        // If the pickList would extend beyond the end of the page, show it above the select 
        // item
        if (top + height > pageBottom) {
            top = Math.max(pageTop, (itemTop - height));
        }
            
            
        return [left,top];
    },
    
    // override setValue map to update the list and update the displayed value if necessary.
    setValueMap : function () {
        this.Super("setValueMap", arguments);
        if (this._clientPickListData) delete this._clientPickListData;
        if (this.hasPickList()) {
            if (this.pickList.isVisible()) this.pickList.hide();
            // clear the 'formItem' property on the pickList - ensures it will have its data
            // reset when it is next shown.     
            delete this.pickList.formItem;
            
        }
        // if the current value is no longer valid, update it.
        var currentValue = this.getValue(),
            value = this._getValidValue(currentValue);            
        if (currentValue != value) {
            this.setValue(value);
            
        // even if the value is unchanged, it's display value is likely to be different, so
        // do a setElementValue.
        } else {
            this.setElementValue(this.mapValueToDisplay(value));
        }
    },
    
    // Returns true if this item has its picklist already set up
    hasPickList : function () {
        // note the check for this.pickList.formItem pointing back to this select is required
        // for the case where the pickList is reused.
        return (this.pickList && !this.pickList.destroyed && this.pickList.formItem == this);
    },
    
    // Returns true if this item's pickList is showing.
    pickListVisible : function () {
        return (this.hasPickList() && this.pickList.isDrawn() && this.pickList.isVisible());
    },
    
    // If we get yanked out of the DOM, ensure our pickList gets hidden
    cleared : function () {
        if (this.pickListVisible()) this.pickList.hide();
        return this.Super("cleared", arguments);
    },
    
    // Override filterComplete to 
    // - Add an empty entry to the top of the list if this.allowEmptyValue is true
    filterComplete : function () {
        // If we are allowing empty values we always to 'basic' filtering, which means
        // we can directly add the empty entry to the ResultSet's cache
        if (this.allowEmptyValue && this._getOptionsFromDataSource()) {
            var RS = this.pickList.data,
                localCache = RS.isLocal() ? RS.allRows : RS.localData;
            if (localCache && !localCache.find(this.getValueFieldName(), null)) {
                RS.insertCacheData({},0);
            }
        }
        var interfaceFilterComplete = isc.PickList.getPrototype().filterComplete;
        interfaceFilterComplete.apply(this, arguments);
    }
});

// Mix in the PickList interface - handles creating and showing the PickList itself.
isc.ClassFactory.mixInInterface("SelectItem", "PickList");


isc.SelectItem.registerStringMethods({
    dataArrived:"startRow,endRow,data",
    getPickListFilterCriteria:""
});

}
